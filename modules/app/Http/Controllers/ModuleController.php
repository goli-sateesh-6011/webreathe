<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redirect;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Http\Controllers\SensorController;

use App\Models\Module;
use App\Models\Sensor;
use App\Models\ModuleData;

use Inertia\Inertia;
use Carbon\Carbon;

class ModuleController extends Controller
{

    protected $module;
    protected $sensors;

    
    /**
     * Get a module informations and recent values.
     *
     * @param  Request $request
     * @param  int $moduleId The module to get
     * @return void Render the module page.
     */
    public function get(Request $request, int $moduleId) 
    {
    $module = Module::find($moduleId);

    if(!$module) {
        abort(404);
    }
        

    $sensorsInfo = $this->getModuleSensorsWithRecentValues($moduleId);

    $entriesCount =  $module->moduleData->count();

    return Inertia::render(
        'Module/Module', 
        [
            'moduleInfos' => [
                'id' => $moduleId, 
                'name' => $module->name, 
                'description' => $module->description, 
                'active' => $module->active
            ],
            'dataCount' => $entriesCount,
            'sensorsInfos' => $sensorsInfo
        ]);
    }
    
    /**
     * Get the latest sensors data for the specified module.
     *
     * @param  Request $request
     * @param  int $moduleId
     * @return JsonResponse All the sensors latest data.
     */
    public function getLatest(Request $request, int $moduleId) 
    {
        $cacheKey = 'module:' . $moduleId . ':sensors';

        $cachedSensors = Cache::get($cacheKey);

        $data = [];
    
        if(!$cachedSensors) {
            $cachedSensors = Sensor::select('id', 'name')->where('module_id', $moduleId)->get();
    
            Cache::put($cacheKey, $cachedSensors, 10);
        }
    
        foreach($cachedSensors as $sensor) {
            $data[$sensor->name] = [
                'name' => $sensor->name,
                'sensor_id' => $sensor->id,
                'data' => SensorController::getLastMinuteValue($sensor->id)
            ];
        }
    
        return response($data);
    }
    
    /**
     * Create a new module.
     *
     * @param  Request $request
     * @return Redirect return to the dashboard.
     */
    public function create(Request $request) 
    {
        $validator = $request->validate([
            'name' => 'required|min:3|max:255',
            'description' => 'max:500',
            'sensors.*.min' => 'numeric',
            'sensors.*.max' => 'numeric'
        ]);


        try {
            $userId = Auth::id();

            $module = new Module();
            $module->name = $request->input('name');
            $module->description = $request->input('description');
            $module->owner_id = $userId;

            $module->save();


            $sensors = array_map(function ($sensor) use ($module) {
                return ([
                    'name' => $sensor['name'],
                    'min_value' => $sensor['min'],
                    'max_value' => $sensor['max'],
                    'unit' => $sensor['unit'],
                    'module_id' => $module->id
                ]);
            }, $request->input('sensors'));

            Sensor::insert($sensors);


            return Redirect::back()->with('success', 'Module registered');
        } catch(\Exception $exception) {
            return Redirect::back()->withErrors($exception->getMessage());
        }
    }
    
    /**
     * Edit the specified module.
     *
     * @param  Request $request
     * @param  int $moduleId
     * @return void Return to the same page.
     */
    public function edit(Request $request, int $moduleId)
    {
        $validator = $request->validate([
            'name' => 'required|min:3|max:255',
            'description' => 'max:500'
        ]);


        $module = Module::find($moduleId);

        $module->name = $request->input('name');
        $module->description = $request->input('description');

        
        $module->save();

        return Redirect::back()->with('success', 'module edited successfully');
    }
    
    /**
     * Delete the module from the database (will cascade)
     *
     * @param  Request $request
     * @param  int $moduleId The module to destroy
     * @return void
     */
    public function destroy(Request $request, int $moduleId)
    {
        $module = Module::find($moduleId);

        $module->delete();

        return Redirect::route('dashboard');
    }
    
    /**
     * Toggle the specified module activity state, allowing it to be simulated or not
     *
     * @param  Request $request
     * @param  int $moduleId The module to toggle
     * @return void
     */
    public function toggle(Request $request, int $moduleId) {
        
        $module = Module::find($moduleId);
    
        // As the state is described through a TINYINT(1), switch the state with a ternary.
        // Make sure to reset the module uptime.
        if($module->active === 0) {
            $module->active = 1;
            $module->active_since = Carbon::now();
        } else {
            $module->active = 0;
            $module->active_since = null;
        }
    
        try {
            $module->save();

            return response('Success', 200);
        } catch (\Exception $e) {
            Log::error($e->getMessage());

            return response('There was an error handling your request.', 500);
        }
    }

    // Helper functions
    
    /**
     * Get the module sensors informations, as well as their recent readings 
     *
     * @param  int $moduleId The targeted module
     * @param  int $maxAgeInMinutes How long ago should the oldest sensor reading be, in minutes. By default it is 10
     * @return void
     */
    private function getModuleSensorsWithRecentValues(int $moduleId, int $maxAgeInMinutes = 10) {
        $sensors = Sensor::select('id', 'name')->where('module_id', $moduleId)->get();

        $data = [];

        foreach($sensors as $sensor) {
            $data[$sensor->name] = [
                'name' => $sensor->name,
                'sensor_id' => $sensor->id,
                'data' => SensorController::getValuesFromXMinutes($sensor->id, $maxAgeInMinutes),
            ];
        }

        return $data;
    }
}

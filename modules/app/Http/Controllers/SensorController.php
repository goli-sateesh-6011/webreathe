<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

use App\Models\Sensor;
use App\Models\ModuleData;

use Inertia\Inertia;
use Carbon\Carbon;

class SensorController extends Controller
{
        
    /**
     * Get a specific sensor data, may not be in real time but will include everything while paginated.
     *
     * @param  int $sensorId The target sensor
     * @param  int $perPage How many items per page, default to 50
     * @return void Return the Sensor detail page
     */
    public function get(int $sensorId, int $perPage = 50)
    {

        $currentPage = request()->query('page', 1);

        $sensor = Sensor::with('module:id,name')
            ->select('id', 'name', 'min_value', 'max_value', 'module_id', 'unit')
            ->find($sensorId);
    
        $query = ModuleData::select('id', 'timestamp', 'sensor_name', 'sensor_value')
            ->where('sensor_id', $sensorId)
            ->orderBy('timestamp', 'desc');
    
           $paginator = $query->paginate($perPage, ['id', 'sensor_name', 'timestamp', 'sensor_value', 'unit'], 'page', $currentPage);
           $results = $paginator->items();
           
    
            return Inertia::render('Sensor/Sensor', [
                'paginator' => $paginator,
                'results' => $results,
                'sensor' => $sensor,
                'entriesTotal' => $paginator->total()
            ]);
    }
    
    /**
     * Remove the sensor from the database, will cascade to the associated data.
     *
     * @param  mixed $sensorId the sensor to delete.
     * @return void
     */
    public function destroy(int $sensorId)
    {
        $sensor = Sensor::find($sensorId);

        $sensorModuleId = $sensor->module_id;

        $sensor->delete();

        return Redirect::route('module.get', ['moduleId' => $sensorModuleId]);
    }

        /**
     * Edit the sensor informations, will cascade to the associated data.
     *
     * @param  mixed $sensorId the sensor to delete.
     * @return void
     */
    public function edit(Request $request, int $sensorId)
    {
        $sensor = Sensor::find($sensorId);

        $populatedSensor = $this->populateSensor($sensor, $request);

        $populatedSensor->save();

        return Redirect::back()->with('success', 'Sensor updated successfully');
    }

        
    /**
     * create
     *
     * @param  Request $request 
     * @param  int $moduleId The module to which this sensor belong.
     * @return void If successfull, return to the current page.
     */
    public function create(Request $request, int $moduleId)
    {
        $user = Auth::user();

        $sensor = new Sensor();

        $populatedSensor = $this->populateSensor($sensor, $request);
        $populatedSensor->module_id = $moduleId;
        $populatedSensor->save();

        return Redirect::back()->with('success', 'Sensor created successfully');
    }

    // Helper functions
    
    /**
     * Get the readings of a sensor from X minutes ago.
     *
     * @param  int $sensorId The sensor to get the readings from.
     * @param  int $maxAgeInMinutes How long ago should the oldest reading be, in minutes. default to 10.
     * @return void
     */
    static function getValuesFromXMinutes(int $sensorId, int $maxAgeInMinutes = 10)
    {
        return ModuleData::select('timestamp', 'sensor_value')
            ->where('sensor_id', $sensorId)
            ->where('timestamp', '>', Carbon::now()->subMinutes($maxAgeInMinutes))
            ->orderByDesc('timestamp')
            ->limit('10')
            ->get();
    }

        
    /**
     * Get the last value of a sensor, or nothing if it is more than a minute old.
     *
     * @param  int $sensorId the sensor to get the reading from.
     * @return void
     */
    static function getLastMinuteValue(int $sensorId)
    {
        return ModuleData::select('timestamp', 'sensor_value')
        ->where('sensor_id', $sensorId)
        ->where('timestamp', '>', Carbon::now()->subMinute())
        ->orderByDesc('timestamp')
        ->first();
    }
    
    /**
     * Make sure a sensor is properly populated before creating or editing it.
     *
     * @param  mixed $sensor The sensor model object.
     * @param  mixed $request Used to get the inputs.
     * 
     * @return mixed The populated sensor model object.
     */
    private function populateSensor($sensor, $request)
    {
        $validator = $request->validate([
            'name' => 'required',
            'min' => 'integer',
            'max' => 'integer',
        ]);

        $sensor->name = $request->input('name');
        $sensor->min_value = $request->input('min');
        $sensor->max_value = $request->input('max');
        $sensor->unit = $request->input('unit');

        return $sensor;
    }
}

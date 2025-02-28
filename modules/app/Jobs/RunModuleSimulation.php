<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use App\Models\ModuleData;
use App\Models\Sensor;
use App\Simulation\ModuleSimulator;
use App\Jobs\UploadModuleData;

class RunModuleSimulation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;


    protected $module;
    protected $updateRate;

    /**
     * Create a new job instance.
     */
    public function __construct($module, $updateRate)
    {
        $this->module = $module;
        $this->updateRate = $updateRate;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $cachedSensors = Cache::get($this->module->id . "-" . "sensors");

        if(!$cachedSensors) {
            $sensorsModel = new Sensor();
            $cachedSensors = $sensorsModel->where('module_id', $this->module->id)->get();

            Cache::put($this->module->id . "-" . "sensors", $cachedSensors, 1);
        }

        $simulator = new ModuleSimulator($cachedSensors);
        $values = $simulator->simulate();

        // Only update and upload new data if the module hasn't failed.
        // Else reset the uptime.
        if(!empty($values)) {

            UploadModuleData::dispatch($this->module->id, $values);
        } else {

        }
    }

    private function updateUptime(): void
    {
        $currentUptime = $this->module->uptime;
        $currentUptime += $this->updateRate;

        $this->module->uptime = $currentUptime;

        $this->module->save();
    }

    private function resetModuleUptime(): void
    {
        $this->module->uptime = null;

        $this->module->save();
    }
}

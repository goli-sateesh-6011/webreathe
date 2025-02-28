<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Module;
use App\Models\Sensor;
use App\Jobs\RunModuleSimulation;
use Illuminate\Support\Facades\Cache;

class SimulateModules extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'simulate:modules {rate=2}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Launch the simulation of every registered module';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $updateRate = $this->argument('rate');

        while(true) {
            $this->simulateModule();

            sleep($updateRate);
        }
    }

    protected function simulateModule()
    {
        $cachedModules = Cache::get('modules_data');

        if(!$cachedModules) {
            $modules = new Module();
            $cachedModules = $modules->where('active', 1)->get();
            
            Cache::put('modules_data', $cachedModules, 10);
        }
        
        $sensorModel = new Sensor();

        foreach($cachedModules as $module) {
            RunModuleSimulation::dispatch($module, $this->argument('rate'));
        }
    }
}

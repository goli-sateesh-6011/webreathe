<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ModuleData;

class UploadModuleData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $moduleId;
    protected $sensorsValue;

    /**
     * Create a new job instance.
     */
    public function __construct(string $moduleId, array $sensorsValue)
    {

        $this->moduleId = $moduleId;
        $this->sensorsValue = $sensorsValue;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $values = [];

        foreach($this->sensorsValue as $sensorId => $sensor) {
            // Make sure we get the current time while including microseconds.
            $now =  \DateTime::createFromFormat('U.u', number_format(microtime(true), 6, '.', ''));

            // MySQL Won't accept a pure timestamp format, so we convert it to a standard Date format.
            $now_microseconds = $now->format('Y-m-d H:i:s.u');

            $values[] = [
                'module_id' => $this->moduleId,
                'timestamp' => $now_microseconds,
                'sensor_id' => $sensorId,
                'sensor_name' => $sensor['name'],
                'sensor_value' => $sensor['value'],
            ];
        }

        ModuleData::insert($values);
        
        echo "Updated modules values \n";
    }
}

<?php

namespace App\Simulation;


use App\Models\Module;

class ModuleSimulator
{


    protected $sensors;

    public function __construct($sensors)
    {
        $this->sensors = $sensors;
    }

    /**
     * Simulate the module running and generating data for all its sensor
     * 
     * @return array $values The generated value, empty if the module failed.
     */
    public function simulate(): array
    {

        $values = [];
        // If the module is failing, there is no data to generate.
        $moduleFailureFlag = $this->checkIfModuleIsFailing(mt_rand(70, 100));

        if($moduleFailureFlag) {
            return $values;
        }
        
        foreach($this->sensors as $sensor) {
            // Add padding to the value generated to simulate alarming values.
            $sensorValue = $this->generateNumericData($sensor->min_value - 10, $sensor->max_value + 10);
            $values[$sensor->id] = ['name' => $sensor->name, 'value' => $sensorValue];
        }

        return $values;
    }

    /**
     * Check if the module must behave as failing.
     * By default it happens 5% of the time.
     * 
     * @param int The chance of the module working, default to 95%
     * 
     * @return boolean A flag that is true if the module is failing.
     */
    private function checkIfModuleIsFailing($successChance = 95): bool
    {
        $randomCheck = mt_rand(0 ,100);

        return $randomCheck >= $successChance && $randomCheck <= 100; 
    }

    /**
     * Generate a value, used to simulate the sensor feedback.
     * 
     * @param int $minValue The minimal Value that should be generated.
     * @param int $maxValue The max value that should be generated.
     * 
     * @return  int The generated value.
     */
    private function generateNumericData(int $minValue = 0, int $maxValue = 1000): int
    {
        return mt_rand($minValue, $maxValue);
    }


}

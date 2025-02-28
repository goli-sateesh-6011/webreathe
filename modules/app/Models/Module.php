<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Sensor;
use App\Models\ModuleData;

class Module extends Model
{
    use HasFactory;

    protected $table = 'modules';



    public function sensors(): HasMany 
    {
        return $this->hasMany(Sensor::class, 'module_id');
    }

    public function moduleData(): HasMany
    {
        return $this->hasMany(ModuleData::class, 'module_id');
    }
}

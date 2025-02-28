<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Module;

class ModuleData extends Model
{
    use HasFactory;

    protected $table = "modules_data";

    protected $fillable = [
        'timestamp',
        'sensor_name',
        'sensor_value',
        'module_uuid'
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'module_id');
    }
}

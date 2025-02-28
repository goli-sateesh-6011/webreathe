<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use App\Models\Module;

class Sensor extends Model
{
    use HasFactory;

    protected $table = 'sensors';

    public function module(): BelongsTo {
        return $this->belongsTo(Module::class, 'module_id');
    }
}

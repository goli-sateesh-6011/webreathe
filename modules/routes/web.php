<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ModuleRegister;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redirect;

use Carbon\Carbon;
use Inertia\Inertia;

use App\Models\Module;
use App\Models\Sensor;
use App\Models\ModuleData;

use App\Http\Controllers\ModuleController;
use App\Http\Controllers\SensorController;

use Illuminate\Pagination\LengthAwarePaginator;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    $user = auth()->user();

    // Get the user modules
    $modules = Module::select('id', 'name', 'description', 'active', 'active_since')->where('owner_id', $user->id)->get();

    // Get the total number of entries for each modules
    if($modules) {
        foreach($modules as $module) {
            $module->dataCount = $module->moduleData()->count();
        }
    }

    return Inertia::render('Dashboard/Dashboard', ['modules' => $modules]);
})->middleware(['auth', 'verified'])->name('dashboard');

// Module creation
Route::middleware('auth')->group(function () {
    Route::post('/module/register/new', [ModuleController::class, 'create'])->name('module.create');
});

// Sensor specific view and manipulation
Route::middleware(['auth', 'isowner.sensor'])->group(function () {
    Route::get('/sensor/{sensorId}', [SensorController::class, 'get'])->name('sensor.get');
    Route::delete('/sensor/{sensorId}', [SensorController::class, 'destroy'])->name('sensor.destroy');
    Route::patch('/sensor/{sensorId}', [SensorController::class, 'edit'])->name('sensor.edit');
});

// Module specific view and manipulation
Route::middleware(['auth', 'isowner.module'])->group(function () {
    Route::get('/module/latest/{moduleId}', [ModuleController::class, 'getLatest'])->name('module.get_latest');
    Route::get('/module/{moduleId}', [ModuleController::class, 'get'])->name('module.get');
    Route::post('/module/{moduleId}/new/sensor', [SensorController::class, 'create'])->name('sensor.create');
    Route::post('/module/toggle/{moduleId}', [ModuleController::class, 'toggle'])->name('module.toggle');
    Route::patch('/module/{moduleId}', [ModuleController::class, 'edit'])->name('module.edit');
    Route::delete('/module/{moduleId}', [ModuleController::class, 'destroy'])->name('module.destroy');
});

// Profile view and manipulation
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

use App\Models\Module;
use App\Models\Sensor;

class AllowOnlySensorOwner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the id to check.
        $sensorId = $request->route('sensorId');

        // Used to avoid refetching the sensor owner every time.
        $cacheKey = 'sensor:' . $sensorId . ':owner';
        $cachedOwner = Cache::get($cacheKey);
        $user = Auth::user();

        // If the sensor owner (through the module) is not yet cached, fetch it (get the module from the sensor then the owner from the module).
        if(!$cachedOwner) {
            $sensor = Sensor::select('module_id')->find($sensorId);

            // If there is no sensor, return 404.
            if(!$sensor) abort(404, 'Sensor not found');

            $module = Module::select('owner_id')->find($sensor->module_id);

            // Else cache the owner for future checks
            $cachedOwner = $module->owner_id;

            Cache::put($cacheKey, $cachedOwner, now()->addDays(7));
        }
        
        // If the current user id is not the owner, return an Unauthorized.
        if($cachedOwner !== $user->id) abort(403, 'Unauthorized');

        return $next($request);
    }
}

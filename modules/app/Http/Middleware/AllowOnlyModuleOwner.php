<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;


use App\Models\Module;


class AllowOnlyModuleOwner
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the id to check.
        $moduleId = $request->route('moduleId');

        // Used to avoid refetching the module owner every time.
        $cacheKey = 'module:' . $moduleId . ':owner';
        $cachedOwner = Cache::get($cacheKey);
        $user = Auth::user();

        // If the module owner is not yet cached, fetch it from the Module model.
        if(!$cachedOwner) {
            $module = Module::select('owner_id')->find($moduleId);
            
            // If there is no module, return 404.
            if(!$module) abort(404, 'Module not found');

            // Else cache the owner for future checks
            $cachedOwner = $module->owner_id;

            Cache::put($cacheKey, $cachedOwner, now()->addDays(7));
        }

        // If the current user id is not the owner, return an Unauthorized.
        if($cachedOwner !== $user->id) abort(403, 'Unauthorized');
        
        return $next($request);
    }
}

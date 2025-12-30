<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDashboardPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()?->hasPermissionTo('dashboard')) {
            return redirect()->route('pengajuans.index')->with('warning', 'Anda tidak memiliki akses ke dashboard');
        }

        return $next($request);
    }
}

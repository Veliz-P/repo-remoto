<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //verificar si el usuario es admin
        if ($request ->user() && $request->user()->rol == 'admin') {
            return $next($request);
        }

        //Si no es admin se retorna un 403 como error
        return response()->json([
            'message' => 'Acceso denegado'
        ], 403);
    }
}

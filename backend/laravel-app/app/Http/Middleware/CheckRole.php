<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $roleId = (string) $user->role_id;

        if (!in_array($roleId, $roles, true)) {
            return response()->json([
                'message' => 'Forbidden. You do not have permission.'
            ], 403);
        }

        return $next($request);
    }
}
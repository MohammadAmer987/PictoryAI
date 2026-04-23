<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\Plan;
use App\Models\Profile;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $userRole = Role::where('name', 'user')->first();
        $freePlan = Plan::where('name', 'free')->first();

        if (!$userRole) {
            return response()->json([
                'message' => 'Default user role is not configured.'
            ], 500);
        }

        if (!$freePlan) {
            return response()->json([
                'message' => 'Default free plan is not configured.'
            ], 500);
        }

        $user = DB::transaction(function () use ($request, $userRole, $freePlan) {
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $userRole->id,
                'is_verified' => false,
            ]);

            Profile::create([
                'user_id' => $user->id,
                'owner_name' => $request->owner_name,
                'store_name' => $request->store_name,
                'business_type' => $request->business_type,
                'business_description' => $request->business_description,
            ]);

            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $freePlan->id,
                'start_date' => now(),
                'status' => 'active',
            ]);

            return $user->load([
                'role',
                'profile',
                'activeSubscription.plan',
            ]);
        });

        return response()->json([
            'message' => 'User registered successfully.',
            'data' => $user,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::with([
            'role',
            'profile',
            'activeSubscription.plan',
        ])->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid email or password.'
            ], 401);
        }

        $user->update([
            'last_login_at' => now(),
            'failed_login_attempts' => 0,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'data' => [
                'token' => $token,
                'user' => $user,
            ],
        ], 200);
    }
    public function me(): JsonResponse
{
    $user = auth()->user()->load([
        'role',
        'profile',
        'activeSubscription.plan',
    ]);

    return response()->json([
        'message' => 'Authenticated user retrieved successfully.',
        'data' => [
            'user' => $user,
        ],
    ], 200);
}

public function logout(): JsonResponse
{
    auth()->user()->currentAccessToken()->delete();
    return response()->json([
        'message' => 'Logged out successfully.',
    ], 200);
}
}
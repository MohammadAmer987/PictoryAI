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
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        if (!Schema::hasTable('roles')) {
            return response()->json([
                'message' => 'The roles table is missing. Run the database migrations first.'
            ], 500);
        }

        if (!Schema::hasTable('plans')) {
            return response()->json([
                'message' => 'The plans table is missing. Run the database migrations first.'
            ], 500);
        }

        $userRole = Role::firstOrCreate(['name' => 'user']);
        $freePlan = Plan::firstOrCreate(
            ['name' => 'free'],
            [
                'price' => 0,
                'max_generations' => 5,
                'watermark' => true,
            ]
        );

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


    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function updateName(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'owner_name' => ['required', 'string', 'max:255'],
        ]);

        $user = $request->user();

        if (!$user->profile) {
            return response()->json([
                'message' => 'Profile not found.',
            ], 404);
        }

        $user->profile->update([
            'owner_name' => $validated['owner_name'],
        ]);

        $user->load([
            'role',
            'profile',
            'activeSubscription.plan',
        ]);

        return response()->json([
            'message' => 'Name updated successfully.',
            'data' => [
                'user' => $user,
            ],
        ], 200);
    }
    public function updateStoreName(Request $request): JsonResponse
{
    $validated = $request->validate([
        'store_name' => ['required', 'string', 'max:255'],
    ]);

    $user = $request->user();

    if (!$user->profile) {
        return response()->json([
            'message' => 'Profile not found.',
        ], 404);
    }

    $user->profile->update([
        'store_name' => $validated['store_name'],
    ]);

    $user->load([
        'role',
        'profile',
        'activeSubscription.plan',
    ]);

    return response()->json([
        'message' => 'Store name updated successfully.',
        'data' => [
            'user' => $user,
        ],
    ], 200);
}
public function updateEmail(Request $request): JsonResponse
{
    $user = $request->user();

    $validated = $request->validate([
        'email' => [
            'required',
            'string',
            'email',
            'max:255',
            Rule::unique('users', 'email')->ignore($user->id),
        ],
    ]);

    $user->update([
        'email' => $validated['email'],
        'email_verified_at' => null,
        'is_verified' => false,
    ]);

    $user->load([
        'role',
        'profile',
        'activeSubscription.plan',
    ]);

    return response()->json([
        'message' => 'Email updated successfully.',
        'data' => [
            'user' => $user,
        ],
    ], 200);
}
public function updatePassword(Request $request): JsonResponse
{
    $user = $request->user();

    $validated = $request->validate([
        'current_password' => ['required', 'string'],
        'password' => ['required', 'string', 'min:8', 'confirmed'],
    ]);

    if (!Hash::check($validated['current_password'], $user->password)) {
        return response()->json([
            'message' => 'Current password is incorrect.',
        ], 422);
    }

    $user->update([
        'password' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'message' => 'Password updated successfully.',
    ], 200);
}
public function updateLogo(Request $request)
{
    $request->validate([
        'logo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    ]);

    $user = $request->user();
    $profile = $user->profile;

    if (!$profile) {
        return response()->json([
            'message' => 'Profile not found.',
        ], 404);
    }

    if ($profile->logo_url) {
        $oldPath = str_replace('/storage/', '', $profile->logo_url);

        if (Storage::disk('public')->exists($oldPath)) {
            Storage::disk('public')->delete($oldPath);
        }
    }

    $path = $request->file('logo')->store('profile-logos', 'public');

    $profile->update([
        'logo_url' => '/storage/' . $path,
    ]);

    return response()->json([
        'message' => 'Logo updated successfully.',
        'data' => [
            'user' => $user->load(['profile', 'role', 'activeSubscription.plan']),
        ],
    ]);
}
}

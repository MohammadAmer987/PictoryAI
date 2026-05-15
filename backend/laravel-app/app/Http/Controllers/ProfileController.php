<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class ProfileController extends Controller
{
    #[OA\Patch(
        path: '/profile/name',
        summary: 'Update owner name',
        description: 'Updates the owner name of the user\'s profile',
        tags: ['Profile'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'owner_name', type: 'string', example: 'John Doe'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Name updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Name updated successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Profile not found'
            ),
        ]
    )]
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

    #[OA\Patch(
        path: '/profile/store-name',
        summary: 'Update store name',
        description: 'Updates the store name of the user\'s profile',
        tags: ['Profile'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'store_name', type: 'string', example: 'My Store'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Store name updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Store name updated successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Profile not found'
            ),
        ]
    )]
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

    #[OA\Patch(
        path: '/profile/email',
        summary: 'Update user email',
        description: 'Updates the email address of the authenticated user',
        tags: ['Profile'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'newemail@example.com'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Email updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Email updated successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                            ]
                        ),
                    ]
                )
            ),
        ]
    )]
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

    #[OA\Patch(
        path: '/profile/password',
        summary: 'Update user password',
        description: 'Updates the password of the authenticated user',
        tags: ['Profile'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'current_password', type: 'string', example: 'current_password'),
                    new OA\Property(property: 'password', type: 'string', example: 'new_password'),
                    new OA\Property(property: 'password_confirmation', type: 'string', example: 'new_password'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Password updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Password updated successfully.'),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Current password is incorrect'
            ),
        ]
    )]
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

    #[OA\Post(
        path: '/profile/logo',
        summary: 'Update profile logo',
        description: 'Uploads and updates the profile logo image',
        tags: ['Profile'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: 'multipart/form-data',
                schema: new OA\Schema(
                    properties: [
                        new OA\Property(
                            property: 'logo',
                            type: 'string',
                            format: 'binary',
                            description: 'Logo image file'
                        ),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Logo updated successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Logo updated successfully.'),
                        new OA\Property(
                            property: 'data',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'user', ref: '#/components/schemas/User'),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 404,
                description: 'Profile not found'
            ),
        ]
    )]
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

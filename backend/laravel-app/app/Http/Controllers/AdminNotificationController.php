<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationEmail;
use OpenApi\Attributes as OA;

class AdminNotificationController extends Controller
{
    #[OA\Post(
        path: '/admin/notifications/send',
        summary: 'Send notification to users',
        description: 'Sends an email notification to all users or to specific selected users. Admin only.',
        tags: ['Admin - Notifications'],
        security: [['sanctumBearerAuth' => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'type', type: 'string', enum: ['all', 'specific'], description: 'Notification type'),
                    new OA\Property(property: 'user_ids', type: 'array', items: new OA\Items(type: 'integer'), description: 'Required when type is specific'),
                    new OA\Property(property: 'title', type: 'string', maxLength: 255, example: 'Important Update'),
                    new OA\Property(property: 'message', type: 'string', example: 'We have an important update for you'),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Notification sent successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(property: 'message', type: 'string', example: 'Email notification sent to 10 user(s)'),
                        new OA\Property(property: 'count', type: 'integer', example: 10),
                    ]
                )
            ),
            new OA\Response(
                response: 400,
                description: 'No users found for this notification'
            ),
            new OA\Response(
                response: 500,
                description: 'Error sending notification'
            ),
        ]
    )]
    public function send(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:all,specific',
            'user_ids' => 'nullable|array', // For specific users
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        try {
            $users = $this->getTargetUsers($validated);

            if ($users->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No users found for this notification',
                ], 400);
            }

            $notificationCount = 0;

            foreach ($users as $user) {
                $notification = Notification::create([
                    'user_id' => $user->id,
                    'title' => $validated['title'],
                    'message' => $validated['message'],
                    'type' => 'email',
                    'status' => 'pending',
                    'meta' => [],
                ]);

                $this->sendEmailNotification($user, $notification, $validated);
                $notificationCount++;
            }

            return response()->json([
                'success' => true,
                'message' => "Email notification sent to {$notificationCount} user(s)",
                'count' => $notificationCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error sending notification: ' . $e->getMessage(),
            ], 500);
        }
    }

    #[OA\Get(
        path: '/admin/notifications/history',
        summary: 'Get notification history',
        description: 'Retrieves paginated list of all sent notifications with recipient details. Admin only.',
        tags: ['Admin - Notifications'],
        security: [['sanctumBearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'page',
                in: 'query',
                schema: new OA\Schema(type: 'integer'),
                description: 'Page number for pagination'
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Notification history retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer'),
                                    new OA\Property(property: 'user_id', type: 'integer'),
                                    new OA\Property(property: 'title', type: 'string'),
                                    new OA\Property(property: 'message', type: 'string'),
                                    new OA\Property(property: 'type', type: 'string'),
                                    new OA\Property(property: 'status', type: 'string'),
                                    new OA\Property(property: 'created_at', type: 'string', format: 'date-time'),
                                ]
                            )
                        ),
                        new OA\Property(
                            property: 'pagination',
                            type: 'object',
                            properties: [
                                new OA\Property(property: 'total', type: 'integer'),
                                new OA\Property(property: 'per_page', type: 'integer'),
                                new OA\Property(property: 'current_page', type: 'integer'),
                                new OA\Property(property: 'last_page', type: 'integer'),
                            ]
                        ),
                    ]
                )
            ),
        ]
    )]
    public function getHistory(Request $request)
    {
        $page = $request->query('page', 1);
        
        $notifications = Notification::with('user:id,email')
            ->orderBy('created_at', 'desc')
            ->paginate(20, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $notifications->items(),
            'pagination' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    #[OA\Get(
        path: '/admin/notifications/users',
        summary: 'Get users for notification targeting',
        description: 'Retrieves a list of users that can be targeted for notifications with optional search. Admin only.',
        tags: ['Admin - Notifications'],
        security: [['sanctumBearerAuth' => []]],
        parameters: [
            new OA\Parameter(
                name: 'search',
                in: 'query',
                schema: new OA\Schema(type: 'string'),
                description: 'Search by email or owner name'
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: 'Users retrieved successfully',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean', example: true),
                        new OA\Property(
                            property: 'data',
                            type: 'array',
                            items: new OA\Items(
                                properties: [
                                    new OA\Property(property: 'id', type: 'integer'),
                                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                                    new OA\Property(property: 'name', type: 'string'),
                                ]
                            )
                        ),
                    ]
                )
            ),
        ]
    )]
    public function getUsers(Request $request)
    {
        $search = $request->query('search', '');
        
        $query = User::where('role_id', 2); // Only regular users, not admins
        
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhereHas('profile', function($q) use ($search) {
                      $q->where('owner_name', 'like', "%{$search}%");
                  });
            });
        }
        
        $users = $query->select('id', 'email')
            ->with('profile:user_id,owner_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->profile?->owner_name ?? $user->email,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Helper: Get target users based on type
     */
    private function getTargetUsers($validated)
    {
        if ($validated['type'] === 'all') {
            return User::where('role_id', 2)->get(); // All regular users, not admins
        } elseif ($validated['type'] === 'specific') {
            return User::whereIn('id', $validated['user_ids'] ?? [])->get();
        }

        return collect();
    }

    /**
     * Helper: Send email notification
     */
    private function sendEmailNotification($user, $notification, $validated)
    {
        try {
            Mail::to($user->email)->send(new NotificationEmail(
                title: $validated['title'],
                body: $validated['message'],
                link: null,
                userName: $user->profile?->owner_name ?? $user->email,
            ));

            $notification->update(['status' => 'sent', 'sent_at' => now()]);
        } catch (\Exception $e) {
            $notification->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\NotificationEmail;

class AdminNotificationController extends Controller
{
    /**
     * Send email notification to all users or specific users
     */
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

    /**
     * Get notification history (admin view)
     * Shows all sent notifications with recipient details
     */
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

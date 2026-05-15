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
     * Send notification to all users or specific users
     */
    public function send(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:all,specific',
            'user_ids' => 'nullable|array', // For specific users
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'link' => 'nullable|string|url',
            'send_email' => 'boolean|default:true',
            'send_in_app' => 'boolean|default:true',
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
                    'type' => $this->getNotificationType($validated),
                    'status' => 'pending',
                    'meta' => [
                        'link' => $validated['link'] ?? null,
                    ],
                ]);

                if ($validated['send_email']) {
                    $this->sendEmailNotification($user, $notification, $validated);
                } else {
                    $notification->update(['status' => 'sent', 'sent_at' => now()]);
                }

                $notificationCount++;
            }

            return response()->json([
                'success' => true,
                'message' => "Notification sent to {$notificationCount} user(s)",
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
     * Get all sent notifications (admin view)
     */
    public function getHistory()
    {
        $notifications = Notification::with('user:id,email')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($notifications);
    }

    /**
     * Get notification stats
     */
    public function getStats()
    {
        $stats = [
            'total_sent' => Notification::where('status', 'sent')->count(),
            'total_pending' => Notification::where('status', 'pending')->count(),
            'total_failed' => Notification::where('status', 'failed')->count(),
            'total_read' => Notification::whereNotNull('read_at')->count(),
        ];

        return response()->json($stats);
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
     * Helper: Get notification type string
     */
    private function getNotificationType($validated)
    {
        $sendEmail = $validated['send_email'] ?? false;
        $sendInApp = $validated['send_in_app'] ?? false;

        if ($sendEmail && $sendInApp) {
            return 'both';
        } elseif ($sendEmail) {
            return 'email';
        }

        return 'in_app';
    }

    /**
     * Helper: Send email notification
     */
    private function sendEmailNotification($user, $notification, $validated)
    {
        try {
            Mail::to($user->email)->send(new NotificationEmail(
                title: $validated['title'],
                message: $validated['message'],
                link: $validated['link'] ?? null,
                userName: $user->profile?->owner_name ?? $user->email,
            ));

            $notification->update(['status' => 'sent', 'sent_at' => now()]);
        } catch (\Exception $e) {
            $notification->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
        }
    }
}

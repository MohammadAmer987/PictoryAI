<?php

namespace App\Services;

use App\Models\User;
use App\Models\UsageCounter;
use Illuminate\Validation\ValidationException;

class UsageLimitService
{
    public function assertCanGenerate(User $user, string $type = 'image'): void
    {
        $subscription = $user->activeSubscription()->with('plan')->first();

        if (!$subscription || !$subscription->plan) {
            throw ValidationException::withMessages([
                'plan' => ['No active subscription found.'],
            ]);
        }

        $limit = match ($type) {
    'image' => $subscription->plan->max_generations_image,
    'caption' => $subscription->plan->max_generations_caption,
    default => throw ValidationException::withMessages([
        'type' => ['Unsupported generation type.'],
    ]),
};

        if ($limit === null) {
            return; // unlimited
        }

        $usage = UsageCounter::firstOrCreate(
            [
                'user_id' => $user->id,
                'type' => $type,
                'year' => now()->year,
                'month' => now()->month,
            ],
            [
                'used' => 0,
            ]
        );

        if ($usage->used >= $limit) {
            throw ValidationException::withMessages([
                'usage' => ['Generation limit reached for your current plan.'],
            ]);
        }
    }

    public function increment(User $user, string $type = 'image'): void
    {
        $usage = UsageCounter::firstOrCreate(
            [
                'user_id' => $user->id,
                'type' => $type,
                'year' => now()->year,
                'month' => now()->month,
            ],
            [
                'used' => 0,
            ]
        );

        $usage->increment('used');
    }
}

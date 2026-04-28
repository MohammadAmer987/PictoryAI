<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use App\Models\Profile;
use App\Models\Subscription;
use App\Models\Role;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'email',
        'password',
        'role_id',
        'is_verified',
        'email_verified_at',
        'last_login_at',
        'failed_login_attempts',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_verified' => 'boolean',
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
    public function activeSubscription()
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'active')
            ->latestOfMany();
    }
    public function usageCounters()
{
    return $this->hasMany(UsageCounter::class);
}


    public function captionGenerations()
    {
        return $this->hasMany(CaptionGeneration::class);
    }


    public function enhanceImageRequests()
    {
        return $this->hasMany(\App\Models\EnhanceImageRequest::class, 'user_id');
    }

    public function themedImageRequests()
    {
        return $this->hasMany(\App\Models\ThemedImageRequest::class, 'user_id');
    }


}


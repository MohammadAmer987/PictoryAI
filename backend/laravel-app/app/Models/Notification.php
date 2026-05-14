<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'status',
        'meta',
        'sent_at',
        'read_at',
        'error_message',
    ];

    protected $casts = [
        'meta' => 'array',
        'sent_at' => 'datetime',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }

    public function markAsSent()
    {
        $this->update(['status' => 'sent', 'sent_at' => now()]);
    }

    public function markAsFailed($errorMessage)
    {
        $this->update(['status' => 'failed', 'error_message' => $errorMessage]);
    }
}

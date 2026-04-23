<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsageCounter extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'year',
        'month',
        'used',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
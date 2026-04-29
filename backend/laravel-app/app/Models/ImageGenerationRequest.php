<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageGenerationRequest extends Model
{
    protected $fillable = [
        'user_id',
        'project_name',
        'content',
        'color',
        'image_type',
        'prompt_used',
    ];

    public function responses()
    {
        return $this->hasMany(\App\Models\ImageGenerationResponse::class, 'request_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
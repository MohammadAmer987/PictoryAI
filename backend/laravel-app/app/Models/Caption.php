<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caption extends Model
{
    protected $fillable = [
        'caption_generation_id',
        'type',
        'icon',
        'content',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function generation()
    {
        return $this->belongsTo(CaptionGeneration::class, 'caption_generation_id');
    }
}

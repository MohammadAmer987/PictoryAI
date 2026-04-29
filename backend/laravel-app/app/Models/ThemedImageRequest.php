<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemedImageRequest extends Model
{
    protected $fillable = [
        'user_id',
        'source_image',

        'theme',
        'optional_text',
        'image_size',

    ];

    public function responses()
    {
        return $this->hasMany(\App\Models\ThemedImageResponse::class, 'request_id');
    }
}

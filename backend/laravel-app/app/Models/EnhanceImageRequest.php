<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnhanceImageRequest extends Model
{
    protected $fillable = [
        'user_id',
        'source_image',

        'product_name',
        'target_audience',
        'product_description',

        'background_type',
        'background_color',
        'background_blur',

        'light_type',
        'style_type',

        'text_on_image',
        'text_position',
        'text_color',
        'text_size',

        'camera_angle',
        'image_ratio',

        'extra_prompt',
    ];

    public function responses()
    {
        return $this->hasMany(\App\Models\EnhanceImageResponse::class, 'request_id');
    }
}

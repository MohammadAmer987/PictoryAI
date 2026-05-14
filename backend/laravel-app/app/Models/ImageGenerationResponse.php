<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageGenerationResponse extends Model
{
    protected $fillable = [
        'request_id',
        'image_path',
        'result_order',
    ];

    public function request()
    {
        return $this->belongsTo(ImageGenerationRequest::class, 'request_id');
    }
}
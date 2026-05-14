<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemedImageResponse extends Model
{
    protected $fillable = [
        'request_id',
        'image_path',
    ];

    public function request()
    {
        return $this->belongsTo(ThemedImageRequest::class, 'request_id');
    }
}

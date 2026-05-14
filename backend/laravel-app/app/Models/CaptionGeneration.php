<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaptionGeneration extends Model
{
    protected $fillable = [
        'user_id',
        'product_name',
        'target_audience',
        'tone',
        'language',
        'description',
        'image_path',
        'raw_text',
    ];

    public function captions()
    {
        return $this->hasMany(Caption::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


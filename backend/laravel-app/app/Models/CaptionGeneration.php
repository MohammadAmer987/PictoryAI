<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaptionGeneration extends Model
{
    protected $fillable = [
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
}

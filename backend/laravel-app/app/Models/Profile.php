<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'owner_name',
        'store_name',
        'business_type',
        'business_description',
        'logo_url',
        'logo_original_name',
        'logo_mime_type',
        'logo_size',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('image_generation_responses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_id')
                ->constrained('image_generation_requests')
                ->cascadeOnDelete();
            $table->string('image_path');
            $table->integer('result_order')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('image_generation_responses');
    }
};
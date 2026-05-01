<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enhance_image_responses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('request_id')
                ->constrained('enhance_image_requests')
                ->cascadeOnDelete();

            $table->string('image_path');

            $table->integer('result_order')->default(1);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enhance_image_responses');
    }
};

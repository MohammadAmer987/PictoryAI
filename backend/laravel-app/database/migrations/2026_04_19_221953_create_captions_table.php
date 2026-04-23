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
        Schema::create('captions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('caption_generation_id')
                ->constrained('caption_generations')
                ->onDelete('cascade');

            $table->string('type');
            $table->string('icon')->nullable();
            $table->text('content');
            $table->json('tags')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('captions');
    }
};

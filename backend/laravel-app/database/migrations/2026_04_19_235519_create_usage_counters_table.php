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
        Schema::create('usage_counters', function (Blueprint $table) {
    $table->id();

    $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

    $table->string('type'); // image, caption, theme, custom

    $table->unsignedInteger('year');
    $table->unsignedInteger('month');

    $table->unsignedInteger('used')->default(0);

    $table->timestamps();

    $table->unique(['user_id', 'type', 'year', 'month']);
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usage_counters');
    }
};

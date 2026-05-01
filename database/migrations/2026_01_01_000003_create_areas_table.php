<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('areas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('areas')->nullOnDelete();
            $table->enum('level', ['city', 'district', 'village']);
            $table->string('name', 100);
            $table->boolean('is_covered')->default(true);
            $table->timestamps();

            $table->index(['parent_id', 'level']);
            $table->index('is_covered');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('areas');
    }
};

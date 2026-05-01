<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('label', 50); // Rumah, Kantor, Custom
            $table->string('recipient_name', 100);
            $table->string('recipient_phone', 20);
            $table->text('full_address'); // Alamat utama dari geocoding
            $table->string('address_note', 255)->nullable(); // Patokan / detail tambahan
            $table->string('postal_code', 10)->nullable();   // Kode pos
            $table->foreignId('area_id')->nullable()->constrained();
            $table->decimal('lat', 10, 7);
            $table->decimal('lng', 10, 7);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};

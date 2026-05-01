<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('category', 50)->default('tukang_harian')->after('service_type');
            $table->boolean('is_new')->default(false)->after('category');

            $table->index('category');
        });

        // Backfill: existing 17 Jagoan → category='tukang_harian'
        DB::table('services')->update(['category' => 'tukang_harian']);
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropIndex(['category']);
            $table->dropColumn(['category', 'is_new']);
        });
    }
};

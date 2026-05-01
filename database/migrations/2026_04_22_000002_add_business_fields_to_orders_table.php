<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Business intake fields
            $table->string('business_name', 100)->nullable()->after('building_type');
            $table->string('branch_count', 50)->nullable()->after('business_name');
        });

        // building_type was enum('apartment','ruko','rumah') — too strict.
        // Bisnis form needs values like 'Kantor', 'Mall', 'Hotel', etc.
        // Alter to VARCHAR(50). Existing values masih valid sebagai string.
        DB::statement("ALTER TABLE orders MODIFY building_type VARCHAR(50) NULL");
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['business_name', 'branch_count']);
        });

        DB::statement("ALTER TABLE orders MODIFY building_type ENUM('apartment','ruko','rumah') NULL");
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah survey_latitude & survey_longitude ke orders untuk borongan flow.
     *
     * Borongan pakai survey_address (text bebas, bukan FK ke addresses table).
     * Koordinat ini dibutuhkan untuk radius search tukang ke titik survey.
     * Daily_tukang flow tetap pakai addresses.lat/lng via address_id.
     *
     * Decimal(10, 7) cukup untuk presisi ~1cm — sama dengan addresses table.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('survey_latitude', 10, 7)->nullable()->after('survey_address_detail');
            $table->decimal('survey_longitude', 10, 7)->nullable()->after('survey_latitude');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['survey_latitude', 'survey_longitude']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Main orders table
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_code', 30)->unique();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();

            $table->enum('order_type', [
                'daily_tukang',
                'daily_with_material',
                'borongan_home',
                'borongan_business',
            ]);

            $table->foreignId('address_id')->nullable()->constrained();
            $table->text('problem_description')->nullable(); // "Deskripsikan masalah"

            $table->enum('status', [
                'draft',
                'pending_payment',
                'paid',
                'searching_tukang',
                'assigned',
                'in_progress',
                'completed',
                'cancelled',
                'refunded',
            ])->default('draft');

            // Pricing
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('material_cost', 12, 2)->default(0);
            $table->decimal('extra_fee_parking', 10, 2)->default(0);
            $table->decimal('extra_fee_others', 10, 2)->default(0);
            $table->foreignId('voucher_id')->nullable();
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('platform_fee', 12, 2)->default(0);

            // Terms & conditions
            $table->timestamp('terms_accepted_at')->nullable();

            // Lifecycle timestamps
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->enum('cancelled_by', ['customer', 'tukang', 'system', 'admin'])->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('order_code');
            $table->index(['customer_id', 'status']);
            $table->index('created_at');
        });

        // Order items (each = 1 service + quantity + date range + session)
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->constrained();
            $table->integer('quantity')->default(1); // Jumlah tukang untuk service ini
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days')->default(1);
            $table->enum('session', ['morning', 'afternoon', 'full_day']);
            $table->decimal('price_per_session', 10, 2); // Snapshot harga saat booking
            $table->decimal('subtotal', 12, 2); // price × quantity × total_days
            $table->boolean('include_material')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('order_id');
        });

        // Order assignments (tracking tukang per item)
        Schema::create('order_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tukang_id')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('status', ['broadcasting', 'offered', 'accepted', 'rejected', 'cancelled'])
                ->default('broadcasting');
            $table->timestamp('offered_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->integer('assignment_round')->default(1);
            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index(['tukang_id', 'status']);
        });

        // Status logs
        Schema::create('order_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('from_status', 30)->nullable();
            $table->string('to_status', 30);
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('order_id');
        });

        // Materials per order_item (bukan per order!)
        Schema::create('order_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_item_id')->constrained()->cascadeOnDelete();
            $table->string('item_name', 100);
            $table->integer('quantity');
            $table->string('unit', 20)->default('pcs');
            $table->decimal('price_per_unit', 10, 2);
            $table->decimal('subtotal', 12, 2);
            $table->string('receipt_photo')->nullable();
            $table->enum('status', ['pending_approval', 'approved', 'rejected'])->default('pending_approval');
            $table->timestamps();
        });

        // Photos (before/after/issue)
        Schema::create('order_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['before', 'after', 'issue']);
            $table->string('photo_url');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('caption')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_photos');
        Schema::dropIfExists('order_materials');
        Schema::dropIfExists('order_status_logs');
        Schema::dropIfExists('order_assignments');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};

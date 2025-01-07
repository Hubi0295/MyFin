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
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->enum('type', ['Stock', 'Bond', 'Futures', 'Precious Metals', 'Real Estate', 'Cryptocurrency','Other']);
            $table->enum('action', ['Buy', 'Sell']);
            $table->decimal('amount', 10, 2);
            $table->date('date_of_operation')->unique();
            $table->decimal('value', 10, 2);
            $table->foreignId('user_id')->constrained(table: 'users')->onDelete('cascade');
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
};

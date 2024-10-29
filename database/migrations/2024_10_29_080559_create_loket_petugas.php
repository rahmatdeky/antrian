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
        Schema::create('loket_petugas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_loket');
            $table->date('tanggal');
            $table->string('nip');
            $table->unsignedBigInteger('id_user');
            $table->timestamp('waktu_checkin')->nullable();
            $table->timestamp('waktu_checkout')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loket_petugas');
    }
};

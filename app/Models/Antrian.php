<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Antrian extends Model
{
    protected $table = 'antrian';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'nomor_antrian', 'id_status', 'waktu_ambil', 'waktu_panggil', 'waktu_selesai', 'id_layanan', 'nip', 'id_loket', 'tanggal'];
}
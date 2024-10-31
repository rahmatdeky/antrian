<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    protected $table = 'layanan';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'nama_layanan', 'kode_antrian'];

    public function jenis_layanan()
    {
        return $this->belongsTo(JenisLayanan::class, 'id_layanan', 'id');
    }
}

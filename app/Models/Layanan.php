<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    use HasFactory;
    protected $table = 'layanan';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'nama_layanan', 'kode_antrian'];

    public function jenis_layanan()
    {
        return $this->hasMany(JenisLayanan::class, 'id_layanan', 'id');
    }

    public function loket()
    {
        return $this->hasMany(Loket::class, 'id_layanan', 'id');
    }
}

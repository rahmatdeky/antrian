<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bidang extends Model
{
    protected $table = 'bidang';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'bidang', 'kode_bidang'];

    public function pegawai()
    {
        return $this->hasMany(Pegawai::class, 'id_bidang', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loket extends Model
{
    use HasFactory;
    protected $table = 'loket';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'nama_loket', 'id_layanan'];

    public function layanan()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan', 'id');
    }

    public function loketPetugas()
    {
        return $this->hasMany(LoketPetugas::class, 'id_loket', 'id');
    }
}

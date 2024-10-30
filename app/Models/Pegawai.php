<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    protected $table = 'pegawai';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'id_user', 'nip', 'nama', 'no_telp', 'email', 'golongan', 'jabatan', 'id_bidang'];

    public function bidang()
    {
        return $this->belongsTo(Bidang::class, 'id_bidang', 'id');
    }

    public function user()
    {
        return $this->belongsTo(Users::class, 'id_user', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoketPetugas extends Model
{
    protected $table = 'loket_petugas';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'id_loket', 'tanggal', 'nip', 'id_user', 'waktu_checkin', 'waktu_checkout'];

    public function loket()
    {
        return $this->belongsTo(Loket::class, 'id_loket', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id');
    }
}

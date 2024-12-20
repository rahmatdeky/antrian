<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    protected $table = 'users';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'username', 'password', 'remember_token'];

    public function pegawai()
    {
        return $this->hasOne(Pegawai::class, 'id_user', 'id');
    }

    public function role()
    {
        return $this->hasMany(Role::class, 'id_user', 'id');
    }
}

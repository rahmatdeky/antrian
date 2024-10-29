<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $table = 'role';
    protected $primaryKey = 'id';
    public $incrementing = false;
    public $timestamps = false;
    protected $fillable = ['id', 'role', 'nip', 'id_user', 'created_at', 'updated_at'];

    public function users()
    {
        return $this->belongsTo(Users::class, 'id_user');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Access extends Model
{
    use HasFactory;

    protected $table = 'role';
    // Kolom yang dapat diisi (mass assignable)
    protected $fillable = [
        'id_user',
        'role',
    ];

    // Definisikan hubungan yang berlawanan dengan User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
}

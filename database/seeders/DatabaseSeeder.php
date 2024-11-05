<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Bidang;
use App\Models\RefRole;
use App\Models\Pegawai;
use App\Models\Status;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(200)->create();

        User::factory()->create([
            'username' => 'test',
            'password' => Hash::make('password'),
        ]);

        $bidangUmum = Bidang::create([
            'bidang' => 'Umum',
            'kode_bidang' => 1,
        ]);

        $bidangKi = Bidang::create([
            'bidang' => 'Kepatuhan Internal',
            'kode_bidang' => 2,
        ]);

        $refRoleAdmin = RefRole::create([
            'role' => 'Admin',
        ]);

        $refRoleLoket = RefRole::create([
            'role' => 'Petugas Loket',
        ]);

        Role::create([
            'role' => 'Admin',
            'nip' => '123456789',
            'id_user' => 1
        ]);

        Pegawai::create([
            'id_user' => 1,
            'nip' => '123456789',
            'nama' => 'Admin',
            'no_telp' => '08123456789',
            'email' => 'TQ5ZQ@example.com',
            'golongan' => 'Admin',
            'jabatan' => 'Admin',
            'id_bidang' => 1
        ]);

        Status::create([
            [
                'id' => 1,
                'status' => 'Waiting'
            ],
            [
                'id' => 2,
                'status' => 'Active'
            ],
            [
                'id' => 3,
                'status' => 'Done'
            ]
        ]);
    }
}

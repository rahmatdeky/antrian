<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Pegawai;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pegawai>
 */
class PegawaiFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_user' => \App\Models\User::factory(), // Menggunakan factory User untuk id_user
            'nip' => $this->faker->unique()->numerify('##########'), // NIP yang unik
            'nama' => $this->faker->name, // Nama pegawai
            'no_telp' => $this->faker->phoneNumber, // Nomor telepon
            'email' => $this->faker->unique()->safeEmail, // Email yang unik
            'golongan' => $this->faker->randomElement(['I/a', 'I/b', 'II/a', 'II/b', 'III/a', 'III/b', 'IV/a', 'IV/b']), // Golongan
            'jabatan' => $this->faker->jobTitle, // Jabatan pegawai
            'id_bidang' => $this->faker->numberBetween(1, 5), // Pastikan ID bidang sesuai dengan yang ada di database
        ];
    }
}

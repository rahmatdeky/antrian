<?php

namespace Database\Factories;
use App\Models\Layanan;
use App\Models\Loket;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Loket>
 */
class LoketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_loket' => 'Loket ' . $this->faker->unique()->numberBetween(1, 50), // Nama loket unik
            'id_layanan' => Layanan::factory(), // Membuat Layanan terkait otomatis
        ];
    }
}

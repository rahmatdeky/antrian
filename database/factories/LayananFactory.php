<?php

namespace Database\Factories;
use App\Models\Layanan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Layanan>
 */
class LayananFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_layanan' => $this->faker->words(2, true), // Nama layanan acak
            'kode_antrian' => strtoupper($this->faker->unique()->lexify('???')), //
        ];
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Antrian;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Antrian>
 */
class AntrianFactory extends Factory
{
    protected $model = Antrian::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nomor_antrian' => $this->faker->unique()->numberBetween(1, 100),
            'id_status' => $this->faker->numberBetween(1, 3),
            'waktu_ambil' => $this->faker->dateTime,
            'waktu_panggil' => $this->faker->dateTime,
            'waktu_selesai' => $this->faker->dateTime,
            'id_layanan' => $this->faker->numberBetween(1, 5),
            'nip' => $this->faker->unique()->numerify('#####'),
            'id_loket' => $this->faker->numberBetween(1, 10),
            'tanggal' => $this->faker->date,
        ];
    }
}

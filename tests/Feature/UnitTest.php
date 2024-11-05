<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Antrian;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UnitTest extends TestCase
{
    use DatabaseTransactions;

    /**
     * Test Login.
     *
     * @return void
     */
    public function test_login_success()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'rahmat.deky',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
        ->assertJsonStructure(['token']);
    }

    public function test_login_failed()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);

        $response = $this->postJson('/api/login', [
            'username' => 'rahmat.deky',
            'password' => 'Password',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test data dashboard dengan autentikasi.
     *
     * @return void
     */

    public function testDashboard()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($user);

        Antrian::factory()->count(5)->create();

        $response = $this->getJson('api/dashboard/total');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'data' => 5  // karena kita membuat 5 data antrian
                 ]);
    }

    /**
     * Test data dashboard dengan autentikasi.
     *
     * @return void
     */

    public function testDashboardToday()
    {
        // Setel waktu ke Asia/Jakarta
        date_default_timezone_set('Asia/Jakarta');
        $today = \Carbon\Carbon::today()->format('Y-m-d');
    
        // Buat pengguna dan autentikasi
        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($user);
    
        // Buat data antrian untuk hari ini
        Antrian::factory()->create([
            'tanggal' => $today,
            'id_status' => 1,
            'id_layanan' => 1,
        ]);
        Antrian::factory()->create([
            'tanggal' => $today,
            'id_status' => 3,
            'id_layanan' => 1,
        ]);
        Antrian::factory()->count(3)->create([
            'tanggal' => $today,
            'id_status' => 3,
            'id_layanan' => 2,
        ]);
    
        // Buat data antrian untuk tanggal lain (tidak akan dihitung)
        Antrian::factory()->create([
            'tanggal' => \Carbon\Carbon::yesterday()->format('Y-m-d'),
            'id_status' => 1,
            'id_layanan' => 1,
        ]);
    
        // Hitung jumlah total dan total done untuk validasi
        $expectedTotalAntrian = 5; // Jumlah data antrian dengan tanggal hari ini
        $expectedTotalDone = 4; // Jumlah data antrian dengan status 3 dan tanggal hari ini
    
        // Hitung jumlah data per layanan untuk validasi
        $expectedPerLayanan = [
            [
                'id_layanan' => 1,
                'total' => 2,
                'total_status_1' => 1,
                'total_status_3' => 1,
            ],
            [
                'id_layanan' => 2,
                'total' => 3,
                'total_status_1' => 0,
                'total_status_3' => 3,
            ]
        ];
    
        // Panggil endpoint
        $response = $this->getJson('/api/dashboard/today');
    
        // Periksa status respons dan struktur data JSON
        $response->assertStatus(200)
                ->assertJson([
                    'status' => 'success',
                    'data' => [
                        'totalAntrian' => $expectedTotalAntrian,
                        'totalDone' => $expectedTotalDone,
                        'perLayanan' => $expectedPerLayanan,
                    ],
                ]);
    }

    public function testAddUserSuccess()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($user);
        // Data request yang valid
        $requestData = [
            'nip' => '987654321',
            'nama' => 'John Doe',
            'golongan' => 'IV/a',
            'jabatan' => 'Manager',
            'bidang' => 1, // Pastikan bidang dengan ID ini ada di database
            'nomor_telepon' => '81234567890',
            'email' => 'johndoe@example.com',
            'username' => 'johndoe',
            'password' => 'Password123!',
        ];

        // Panggil endpoint
        $response = $this->postJson('/api/user/add', $requestData);

        // Periksa status dan respons
        $response->assertStatus(200)
                ->assertJson([
                    'status' => 'success',
                    'message' => 'User dan Pegawai berhasil ditambahkan',
                ]);

        // Pastikan data disimpan dalam database
        $this->assertDatabaseHas('users', [
            'username' => 'johndoe',
        ]);
        $this->assertDatabaseHas('pegawai', [
            'nip' => '987654321',
            'nama' => 'JOHN DOE',
        ]);
    }

    public function testAddUserDuplicateUsername()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($user);
        // Buat user dengan username yang sama

        // Data request dengan username yang sama
        $requestData = [
            'nip' => '987654321',
            'nama' => 'Jane Doe',
            'golongan' => 'IV/a',
            'jabatan' => 'Assistant Manager',
            'bidang' => 1,
            'nomor_telepon' => '81234567891',
            'email' => 'janedoe@example.com',
            'username' => 'rahmat.deky',
            'password' => 'Password123!',
        ];

        // Panggil endpoint
        $response = $this->postJson('/api/user/add', $requestData);

        // Periksa respons untuk error duplicate username
        $response->assertStatus(422)
                ->assertJson([
                    'status' => 'error',
                    'message' => 'Username sudah terdaftar',
                ]);
    }

    public function testAddUserDuplicateNIP()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($user);
        // Buat pegawai dengan NIP yang sama

        // Data request dengan NIP yang sama
        $requestData = [
            'nip' => '123456789',
            'nama' => 'John Smith',
            'golongan' => 'III/b',
            'jabatan' => 'Staff',
            'bidang' => 1,
            'nomor_telepon' => '81234567892',
            'email' => 'johnsmith@example.com',
            'username' => 'johnsmith',
            'password' => 'Password123!',
        ];

        // Panggil endpoint
        $response = $this->postJson('/api/user/add', $requestData);

        // Periksa respons untuk error duplicate NIP
        $response->assertStatus(422)
                ->assertJson([
                    'status' => 'error',
                    'message' => 'NIP sudah terdaftar',
                ]);
    }

    public function testAddUserValidationFailure()
    {

        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        Sanctum::actingAs($user);
        // Data request yang tidak valid (tidak menyertakan username dan password)
        $requestData = [
            'nip' => '123456789',
            'nama' => 'Invalid User',
            'golongan' => 'III/b',
            'jabatan' => 'Staff',
            'bidang' => 1,
            'nomor_telepon' => '81234567893',
            'email' => 'invalid@example.com',
            // 'username' tidak diisi
            // 'password' tidak diisi
        ];

        // Panggil endpoint
        $response = $this->postJson('/api/user/add', $requestData);

        // Periksa respons untuk validasi gagal
        $response->assertStatus(422)
                ->assertJson([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                ])
                ->assertJsonStructure([
                    'errors' => [
                        'username',
                        'password',
                    ],
                ]);
    }

     

    /**
     * Test logout dengan autentikasi.
     *
     * @return void
     */
    public function testLogout()
    {
        // Buat pengguna dan login untuk mendapatkan token
        $user = User::factory()->create([
            'username' => 'rahmat.deky',
            'password' => bcrypt('password')
        ]);
        $token = $user->createToken('main')->plainTextToken;

        // Kirim permintaan logout dengan token
        $response = $this->postJson('/api/logout', [], [
            'Authorization' => "Bearer $token"
        ]);

        $response->assertStatus(204);;
    }


}

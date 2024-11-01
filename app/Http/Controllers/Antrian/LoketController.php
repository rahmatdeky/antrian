<?php

namespace App\Http\Controllers\Antrian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loket;
use App\Models\LoketPetugas;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class LoketController extends Controller
{
    public function addLoket(Request $request)
    {
        try {
            $add = Loket::create([
                'nama_loket' => $request->nama_loket,
                'id_layanan' => $request->id_layanan
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Loket berhasil ditambahkan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan Loket',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getLoket()
    {
        $loket = Loket::with('layanan')->get();

        return response()->json([
            'status' => 'success',
            'data' => $loket
        ]);
    }

    public function deleteLoket($id)
    {
        try {
            $delete = Loket::where('id', $id)->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Loket berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus Loket',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function editLoket(Request $request)
    {
        try {
            $edit = Loket::where('id', $request->id)
            ->update([
                'nama_loket' => $request->nama_loket,
                'id_layanan' => $request->id_layanan
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Loket berhasil diedit',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengedit Loket',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function dataPilihLoket()
    {
        $today = Carbon::today();
        $user = Auth::user();
        $dataLoket = Loket::with(['loketPetugas' => function($query) use ($today) {
            $query->where('tanggal', $today);
        }, 'loketPetugas.user.pegawai'])->get();

        $result = $dataLoket->map(function ($loket) use ($user) {
            $selectedByUser = $loket->loketPetugas->where('id_user', $user->id)->isNotEmpty();
            return [
                'id' => $loket->id,
                'nama_loket' => $loket->nama_loket,
                'loket_petugas' => $loket->loketPetugas->isEmpty() ? null : $loket->loketPetugas->map(function($petugas) {
                    return [
                        'id' => $petugas->id,
                        'nip' => $petugas->nip,
                        'waktu_checkin' => $petugas->waktu_checkin,
                        'nama' => $petugas->user->pegawai->nama
                    ];
                }),
                'selected_by_user' => $selectedByUser
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $result
        ]);
    }


    public function pilihLoket($id)
    {
        // Set timezone ke zona waktu yang diinginkan
        date_default_timezone_set('Asia/Jakarta');

        // Mendapatkan data user yang sedang login
        $user = Auth::user()->load('pegawai');

        // Memeriksa apakah user dan pegawai terkait ada
        if (!$user || !$user->pegawai) {
            return response()->json([
                'status' => 'error',
                'message' => 'Data user atau pegawai tidak ditemukan.'
            ], 404);
        }

        // Mendapatkan tanggal hari ini dan waktu check-in
        $tanggal = Carbon::today();
        $waktuCheckin = Carbon::now();

        // Validasi agar user hanya bisa memilih loket satu kali per hari
        $existingUserEntry = LoketPetugas::where('id_user', $user->id)
            ->where('tanggal', $tanggal)
            ->exists();

        if ($existingUserEntry) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah memilih loket hari ini.'
            ], 400);
        }

        // Validasi agar loket hanya bisa dipilih oleh satu user per hari
        $existingLoketEntry = LoketPetugas::where('id_loket', $id)
            ->where('tanggal', $tanggal)
            ->exists();

        if ($existingLoketEntry) {
            return response()->json([
                'status' => 'error',
                'message' => 'Loket ini sudah dipilih oleh petugas lain hari ini.'
            ], 400);
        }

        // Simpan data ke tabel loket_petugas
        LoketPetugas::create([
            'id_loket' => $id,
            'tanggal' => $tanggal,
            'nip' => $user->pegawai->nip,
            'id_user' => $user->id,
            'waktu_checkin' => $waktuCheckin
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Loket berhasil dipilih dan data disimpan.'
        ]);
}


}

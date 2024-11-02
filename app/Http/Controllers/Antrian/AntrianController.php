<?php

namespace App\Http\Controllers\Antrian;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AntrianController extends Controller
{
    public function ambilAntrian($id)
    {
        date_default_timezone_set('Asia/Jakarta');
        $today = Carbon::today();

        $lastAntrian = Antrian::where('id_layanan', $id)
        ->where('tanggal', $today)
        ->orderBy('nomor_antrian', 'desc')
        ->first();

        $newNomorAntrian = $lastAntrian ? $lastAntrian->nomor_antrian + 1 : 1;

        $antrian = Antrian::create([
            'nomor_antrian' => $newNomorAntrian,
            'id_status' => 1,
            'waktu_ambil' => Carbon::now(),
            'id_layanan' => $id,
            'tanggal' => $today
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Nomor antrian berhasil diambil',
            'data' => $antrian
        ]);
    }
}

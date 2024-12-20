<?php

namespace App\Http\Controllers\Antrian;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Layanan;
use App\Models\Loket;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Dompdf\Dompdf;
use Illuminate\Support\Facades\Auth;
use App\Events\panggilAntrianEvent;
use App\Events\panggilAntrianPetugasEvent;


class AntrianController extends Controller
{
    public function ambilAntrian($id)
    {
        date_default_timezone_set('Asia/Jakarta');
        $today = Carbon::now()->format('Y-m-d');

        $lastAntrian = Antrian::where('id_layanan', $id)
        ->whereDate('tanggal', $today)
        ->orderBy('waktu_ambil', 'desc')
        ->first();

        
        $kodeLayanan = Layanan::select('kode_antrian', 'nama_layanan')->where('id', $id)->first();
        
        $newNomorAntrian = $lastAntrian ? $lastAntrian->nomor_antrian + 1 : 1;
        
        $formattedNomorAntrian = $kodeLayanan->kode_antrian . ' ' . sprintf('%03d', $newNomorAntrian);
        
        $antrian = Antrian::create([
            'nomor_antrian' => $newNomorAntrian,
            'id_status' => 1,
            'waktu_ambil' => Carbon::now(),
            'id_layanan' => $id,
            'tanggal' => $today
        ]);
        
        $antrianData = [
            'nomor_antrian' => $formattedNomorAntrian,
            'tanggal' => $antrian->tanggal,
            'waktu_ambil' => $antrian->waktu_ambil,
            'layanan' => $kodeLayanan->nama_layanan
        ];
        
        $dompdf = new Dompdf();
        $html = view('pdf.antrian', $antrianData)->render();
        $dompdf->loadHtml($html);
        
        $dompdf->setPaper('A6', 'portrait');
        
        $dompdf->render();
        $message = [
            'nomor_antrian' => $formattedNomorAntrian,
            'loket' => $kodeLayanan->nama_layanan
        ];
        event(new panggilAntrianPetugasEvent($message));
        
        return response($dompdf->output(), 200)
        ->header('Content-Type', 'application/pdf')
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        // return response()->json($antrian);
    }

    public function getAntrianByLayanan($id)
    {
        date_default_timezone_set('Asia/Jakarta');

        $tanggal = Carbon::today();

        try {
            
            $antrian = Antrian::where('id_layanan', $id)
            ->whereDate('tanggal', $tanggal)
            ->orderBy('waktu_ambil', 'asc')
            ->with('loket')
            ->get();
    
            $kodeLayanan = Layanan::select('kode_antrian', 'nama_layanan')->where('id', $id)->first();

            foreach ($antrian as $key => $value) {
                $antrian[$key]->nomor_antrian = $kodeLayanan->kode_antrian . ' ' . sprintf('%03d', $value->nomor_antrian);
            }
    
            return response()->json([
                'status' => 'success',
                'data' => $antrian
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mendapatkan antrian',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function panggilAntrian($id, $loket)
    {
        date_default_timezone_set('Asia/Jakarta');
        $today = Carbon::today();

        $user = Auth::user()->load('pegawai');

        $antrianAktif = Antrian::where('id_loket', $loket)
        ->where('id_status', 2) // Pastikan id_status ini menandakan status "aktif"
        ->whereDate('tanggal', $today)
        ->exists();

        if ($antrianAktif) {
            return response()->json([
                'status' => 'error',
                'message' => 'Loket ini masih memiliki antrian aktif',
            ], 400);
        }

        $telahPanggil = Antrian::where('id', $id)
            ->whereNotNull('waktu_panggil')
            ->exists();

        if ($telahPanggil) {
            return response()->json([
                'status' => 'error',
                'message' => 'Antrian sudah dipanggil',
            ], 400);
        }

        try {
            $panggil = Antrian::where('id', $id)->update([
                'id_loket' => $loket,
                'id_status' => 2,
                'waktu_panggil' => Carbon::now(),
                'nip' => $user->pegawai->nip
            ]);

            $antrianLengkap = Antrian::with(['pegawai', 'loket'])
            ->where('id', $id)
            ->first();
            $kodeLayanan = $antrianLengkap->loket->layanan->kode_antrian ?? ''; // Dapatkan kode_antrian dari layanan
            $formattedNomorAntrian = $kodeLayanan . ' ' . sprintf('%03d', $antrianLengkap->nomor_antrian);

            $message = [
                'nomor_antrian' => $formattedNomorAntrian,
                'loket' => $antrianLengkap->loket->nama_loket
            ];

            event(new panggilAntrianEvent($message));
            
            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil memilih antrian',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memilih antrian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function panggilUlangAntrian($id, $loket)
    {
        date_default_timezone_set('Asia/Jakarta');

        $checkLoket = Antrian::where('id', $id)
        ->where('id_loket', $loket)
        ->exists();
         
        if (!$checkLoket) {
            return response()->json([
                'status' => 'error',
                'message' => 'Antrian ini bukan berada di loket ini',
            ], 404);
        }
        $panggilUlang = Antrian::where('id', $id)->update([
            'waktu_panggil' => Carbon::now()
        ]);

        $antrianLengkap = Antrian::with(['pegawai', 'loket'])
        ->where('id', $id)
        ->first();
        $kodeLayanan = $antrianLengkap->loket->layanan->kode_antrian ?? ''; // Dapatkan kode_antrian dari layanan
        $formattedNomorAntrian = $kodeLayanan . ' ' . sprintf('%03d', $antrianLengkap->nomor_antrian);

        $message = [
            'nomor_antrian' => $formattedNomorAntrian,
            'loket' => $antrianLengkap->loket->nama_loket
        ];

        event(new panggilAntrianEvent($message));

        return response()->json([
            'status' => 'success',
        'message' => 'Berhasil memanggil ulang antrian',
        ]);
    }

    public function selesaiAntrian($id, $loket)
    {
        date_default_timezone_set('Asia/Jakarta');

        $checkLoket = Antrian::where('id', $id)
        ->where('id_loket', $loket)
        ->exists();
         
        if (!$checkLoket) {
            return response()->json([
                'status' => 'error',
                'message' => 'Antrian ini bukan berada di loket ini',
            ], 404);
        }

        try {
            $selesai = Antrian::where('id', $id)->update([
                'id_status' => 3,
                'waktu_selesai' => Carbon::now()
            ]);
            $message = [
                'nomor_antrian'
            ];
    
            event(new panggilAntrianPetugasEvent($message));
            return response()->json([
                'status' => 'success',
                'message' => 'Berhasil menyelesaikan antrian',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyelesaikan antrian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAntrianGuest()
    {
        // Set timezone ke Asia/Jakarta
        date_default_timezone_set('Asia/Jakarta');
        $today = Carbon::today();

        // Ambil antrian yang memiliki id_status 2, tanggal hari ini, dan panggilan terakhir untuk setiap id_loket
        $antrian = Antrian::with(['pegawai', 'loket'])
            ->where('id_status', 2)
            ->whereDate('tanggal', $today)
            ->orderBy('waktu_panggil', 'desc')
            ->get()
            ->unique('id_loket'); // Mengambil antrian terakhir pada setiap id_loket

        foreach ($antrian as $key => $value) {
            $kodeLayanan = $value->loket->layanan->kode_antrian ?? ''; // Dapatkan kode_antrian dari layanan
            $antrian[$key]->nomor_antrian = $kodeLayanan . ' ' . sprintf('%03d', $value->nomor_antrian);
        }

        return response()->json([
            'status' => 'success',
            'data' => $antrian
        ]);
    }

    public function getRiwayatAntrian(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $idLayanan = $request->input('id_layanan');
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        $query = Antrian::query();

        if ($startDate && $endDate) {
            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        if ($idLayanan) {
            $query->where('id_layanan', $idLayanan);
        }

        $total = $query->count();

        $data = $query->with(['loket', 'pegawai'])
                    ->orderBy('tanggal', 'desc')
                    ->offset(($page - 1) * $pageSize)
                    ->limit($pageSize)
                    ->get();
        
        foreach ($data as $key => $value) {
            $kodeLayanan = $value->layanan->kode_antrian ?? ''; // Dapatkan kode_antrian dari layanan
            $data[$key]->nomor_antrian = $kodeLayanan . ' ' . sprintf('%03d', $value->nomor_antrian);
        }

        return response()->json([
            'data' => $data,
            'total' => $total,
            'page' => $page,
            'pageSize' => $pageSize,
        ]);
    }

    public function dashboardTotal()
    {
        try {
            $totalAntrian = Antrian::count();

            return response()->json([
                'status' => 'success',
                'data' => $totalAntrian
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mendapatkan antrian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function dashboardToday()
    {
        date_default_timezone_set('Asia/Jakarta');
        $today = Carbon::today();

        try {
            $totalAntrian = Antrian::whereDate('tanggal', $today)->count();
            $totalDone = Antrian::where('id_status', 3)->whereDate('tanggal', $today)->count();
            
            $perLayanan = Antrian::with('layanan')
            ->whereDate('tanggal', $today)
            ->selectRaw('id_layanan, 
                        count(*) as total,
                        SUM(CASE WHEN id_status = 1 THEN 1 ELSE 0 END) as total_status_1,
                        SUM(CASE WHEN id_status = 3 THEN 1 ELSE 0 END) as total_status_3')
            ->groupBy('id_layanan')
            ->get();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'totalAntrian' => $totalAntrian,
                    'totalDone' => $totalDone,
                    'perLayanan' => $perLayanan
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mendapatkan antrian',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

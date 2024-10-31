<?php

namespace App\Http\Controllers\Antrian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Layanan;
use App\Models\JenisLayanan;
use App\Models\Loket;

class LayananController extends Controller
{
    public function addLayanan(Request $request)
    {
        try {
            $add = Layanan::create([
                'nama_layanan' => $request->layanan,
                'kode_antrian' => $request->kode_antrian
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Layanan berhasil ditambahkan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan Layanan',
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    public function getLayanan()
    {
        try {
            $layanan = Layanan::get();
            return response()->json([
                'status' => 'success',
                'data' => $layanan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data Layanan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function editLayanan(Request $request)
    {
        try {
            $edit = Layanan::where('id', $request->id)
            ->update([
                'nama_layanan' => $request->nama_layanan,
                'kode_antrian' => $request->kode_antrian
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Layanan berhasil diedit',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengedit Layanan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function addJenisLayanan(Request $request)
    {
        try {
            $add = JenisLayanan::create([
                'nama_jenis_layanan' => $request->nama_jenis_layanan,
                'id_layanan' => $request->id_layanan
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Jenis Layanan berhasil ditambahkan',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan Jenis Layanan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getJenisLayanan($id)
    {
        try {
            $layanan = JenisLayanan::where('id_layanan', $id)->get();
            return response()->json([
                'status' => 'success',
                'data' => $layanan
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data Jenis Layanan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteLayanan($id)
    {
        $loket = Loket::select('nama_loket')->where('id_layanan', $id)->get();
        if ($loket->isNotEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak dapat menghapus layanan, karena masih terkait dengan beberapa loket. hapus loket terlebih dahulu',
                'data' => $loket
            ], 400);
        }

        try {
            $layanan = Layanan::where('id', $id)->delete();
            $jenisLayanan = JenisLayanan::where('id_layanan', $id)->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Layanan dan Jenis Layanan berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus Layanan dan Jenis Layanan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

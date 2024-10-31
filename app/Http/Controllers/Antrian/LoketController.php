<?php

namespace App\Http\Controllers\Antrian;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Loket;

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
}

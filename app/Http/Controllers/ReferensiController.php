<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bidang;

class ReferensiController extends Controller
{
    public function bidang()
    {
        $bidang = Bidang::select('bidang', 'id', 'kode_bidang')->get();

        return response()->json($bidang);
    }
}

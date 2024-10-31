<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ReferensiController;
use App\Http\Controllers\Antrian\LayananController;
use App\Http\Controllers\Antrian\LoketController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function() {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Setting Users
    Route::get('/user', [AuthController::class, 'currentUser']);
    Route::get('/user/get', [AuthController::class, 'getUser']);
    Route::get('/user/detail/{id}', [AuthController::class, 'detailUser']);
    Route::post('/user/add', [AuthController::class, 'addUser']);
    Route::post('/user/add/role', [AuthController::class, 'addRole']);
    Route::delete('/user/delete/role/{id}', [AuthController::class, 'deleteRole']);
    Route::post('/user/edit', [AuthController::class, 'editUser']);
    Route::post('/user/ganti/password', [AuthController::class, 'gantiPassword']);

    // Setting Layanan
    Route::get('/layanan', [LayananController::class, 'getLayanan']);
    Route::post('/layanan/add', [LayananController::class, 'addLayanan']);
    Route::put('/layanan/edit', [LayananController::class, 'editLayanan']);
    Route::post('/layanan/jenis/add', [LayananController::class, 'addJenisLayanan']);
    Route::get('/layanan/jenis/{id}', [LayananController::class, 'getJenisLayanan']);
    Route::delete('/layanan/delete/{id}', [LayananController::class, 'deleteLayanan']);

    // Setting Loket
    Route::get('/loket', [LoketController::class, 'getLoket']);
    Route::post('/loket/add', [LoketController::class, 'addLoket']);
    Route::delete('/loket/delete/{id}', [LoketController::class, 'deleteLoket']);
    Route::put('/loket/edit', [LoketController::class, 'editLoket']);

    // Referensi
    Route::get('/referensi/bidang', [ReferensiController::class, 'bidang']);
    Route::get('/referensi/role', [ReferensiController::class, 'refRole']);
});

// Auth
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
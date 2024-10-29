<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

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
});

// Auth
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
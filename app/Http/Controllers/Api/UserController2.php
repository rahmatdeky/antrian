<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Users;

class UserController2 extends Controller
{
    public function index(Request $request)
    {
        $user = Users::query()->orderBy('id', 'desc')->paginate(10);
        return response()->json($user);
    }
}

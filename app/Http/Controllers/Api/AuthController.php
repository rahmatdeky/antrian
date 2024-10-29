<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\Users;
use App\Models\Role;
use Hash;
use Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        if (!Auth::attempt($credentials)) {
            return response([
                'type' => 'error',
                'message' => 'Salah username atau password'
            ]);
        }
        /** @var User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        $message = 'Login Berhasil';
        $type = 'success';
        return response(compact('user', 'token', 'message', 'type'));        
    }
    
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();
        /** @var User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }
    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }

    public function currentUser(Request $request)
    {
        $user = $request->user()->load('accesses');
        return response()->json($user);
    }

    public function getUser(Request $request)
    {
        $query = Users::with(['pegawai' => function ($q) {
            $q->select('nip', 'nama', 'id_user');
        }])
        ->select('id');

        if ($search = $request->query('search')) {
            $query->Wherehas('pegawai', function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                ->orWhere('nip', 'like', "%{$search}%");
            });
        }

        $users = $query->get();

        return response()->json([
            'data' => $users
        ]);
    }

    public function detailUser($id)
    {
        $user = Users::with(['pegawai' => function ($q) {
            $q->select('id', 'nip', 'nama', 'no_telp', 'pangkat', 'golongan', 'jabatan', 'bidang', 'id_user');
        }])
        ->select('id', 'username', 'email')
        ->where('id', $id)
        ->first();

        $role = Role::where('id_user', $id)->get();

        return response()->json([
            'user' => $user,
            'role' => $role
        ]);
    }

}

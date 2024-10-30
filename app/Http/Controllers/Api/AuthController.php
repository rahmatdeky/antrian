<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\Users;
use App\Models\Role;
use App\Models\Pegawai;
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
            $q->select('id', 'nip', 'nama', 'no_telp', 'golongan', 'jabatan', 'id_bidang', 'id_user', 'email')
            ->with('bidang');
        }])
        ->select('id', 'username')
        ->where('id', $id)
        ->first();

        $role = Role::where('id_user', $id)->get();

        return response()->json([
            'user' => $user,
            'role' => $role
        ]);
    }

    public function addUser(Request $request)
    {
        DB::beginTransaction();

        $username = Users::select('username')->where('username', $request->username)->first();
        
        if ($username) {
            return response()->json([
                'status' => 'error',
                'message' => 'Username sudah terdaftar',
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'nip' => 'required|string|max:18',
            'nama' => 'required|string|max:255',
            'golongan' => 'required|string|max:255',
            'jabatan' => 'required|string|max:255',
            'bidang' => 'required|exists:bidang,id', // Pastikan id bidang valid
            'nomor_telepon' => 'nullable|string|max:15', // Tidak wajib diisi
            'email' => 'nullable|email|max:255', // Tidak wajib diisi
            'username' => 'required|string|max:255|unique:users,username',
            'password' => [
                'required',
                'string',
                'min:8', // Minimum 8 karakter
                'regex:/[a-z]/', // Harus ada huruf kecil
                'regex:/[A-Z]/', // Harus ada huruf besar
                'regex:/[0-9]/', // Harus ada angka
                'regex:/[\W]/', // Harus ada karakter spesial
            ],
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $nomorTelepon = '+62' . ltrim($request->nomor_telepon, '0');
            // insert ke tabel user
            $user = Users::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'remember_token' => Str::random(25)
            ]);
            
            $userId = Users::select('id')->where('username', $request->username)->first();

            $nip = Pegawai::select('nip')->where('nip', $request->nip)->first();

            if ($nip) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'NIP sudah terdaftar',
                ], 422);
            }

            $pegawai = Pegawai::create([
                'id_user' => $userId->id,
                'nip' => $request->nip,
                'nama' => strtoupper($request->nama),
                'no_telp' => $nomorTelepon,
                'email' => $request->email,
                'golongan' => $request->golongan,
                'jabatan' => $request->jabatan,
                'id_bidang' => $request->bidang
            ]);
            // insert ke tabel pegawai

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'User dan Pegawai berhasil ditambahkan',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menambahkan User dan Pegawai',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}

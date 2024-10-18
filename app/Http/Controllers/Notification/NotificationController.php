<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\NotificationEvent;

class NotificationController extends Controller
{
    public function store(Request $request)
    {
        event(new NotificationEvent([
            'nama' => $request->nama,
            'nomor' => $request->nomor
        ]));
        return response()->json('Notification Sent');
    }
}

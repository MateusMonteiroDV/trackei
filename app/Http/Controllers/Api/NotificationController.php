<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()->paginate(20);

        return response()->json($notifications);
    }

    public function unread(Request $request)
    {
        $notifications = $request->user()->unreadNotifications;

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, string $id)
    {
        $this->notificationService->markAsRead($request->user(), $id);

        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $this->notificationService->markAllAsRead($request->user());

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function destroy(Request $request, string $id)
    {
        $notification = $request->user()->notifications()->find($id);

        if ($notification) {
            $notification->delete();
        }

        return response()->json(['message' => 'Notification deleted']);
    }
}

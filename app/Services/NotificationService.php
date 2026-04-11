<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PackageStatusChanged;

class NotificationService
{
    public function notifyUser(User $user, string $title, string $message, array $data = []): void
    {
        // For now, using the database channel by default
        $user->notify(new PackageStatusChanged($title, $message, $data));
    }

    public function markAsRead(User $user, string $notificationId): void
    {
        $notification = $user->unreadNotifications()->find($notificationId);

        if ($notification) {
            $notification->markAsRead();
        }
    }

    public function markAllAsRead(User $user): void
    {
        $user->unreadNotifications->markAsRead();
    }
}

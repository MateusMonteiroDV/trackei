
// Type definitions for notification and event payloads

export interface PackageInfo {
    tracking_code: string;
    status: string;
}

export interface PackageStatusUpdatedEvent {
    package: PackageInfo;
}

export interface DriverAssignedEvent {
    package: PackageInfo;
}

export interface NotificationPayload {
    message: string;
    // Add other properties if known
}

export interface AuthUser {
    id: number;
    role: 'admin' | 'user' | string; // Assuming role can be 'admin', 'user', or other strings
    business_id: number | null;
}

export interface AuthProps {
    user: AuthUser | null;
}

import { useEffect, useRef } from 'react';
import api from '@/lib/axios';

export function useDriverLocation(isActive: boolean = false) {
    const watchId = useRef<number | null>(null);
    const lastUpdate = useRef<number>(0);
    const UPDATE_INTERVAL = 30000; // 30 seconds

    useEffect(() => {
        if (!isActive || !navigator.geolocation) {
            return;
        }

        const sendLocation = async (position: GeolocationPosition) => {
            const now = Date.now();
            if (now - lastUpdate.current < UPDATE_INTERVAL) {
                return;
            }

            try {
                await api.post('/api/driver/location', {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                lastUpdate.current = now;
                console.log('Location updated:', position.coords.latitude, position.coords.longitude);
            } catch (error) {
                console.error('Error updating location:', error);
            }
        };

        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                sendLocation(position);
            },
            (error) => {
                console.error('Geolocation error:', error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 5000,
            }
        );

        return () => {
            if (watchId.current !== null) {
                navigator.geolocation.clearWatch(watchId.current);
            }
        };
    }, [isActive]);
}

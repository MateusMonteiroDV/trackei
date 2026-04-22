import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

// If you need to set default icons, do it here, but ensure it doesn't cause issues
// import L from 'leaflet';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// delete (L.Icon.Default.prototype as any)._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconUrl: markerIcon.src,
//     iconRetinaUrl: markerIcon2x.src,
//     shadowUrl: markerShadow.src,
// });

interface MapProps {
    center: [number, number];
    zoom?: number;
    markers?: Array<{
        position: [number, number];
        label: string;
        id: string | number;
    }>;
    className?: string;
}

export default function Map({
    center,
    zoom = 13,
    markers = [],
    className,
}: MapProps) {
    // Removed isMounted state and useEffect

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            className={className}
            style={{ height: '100%', minHeight: '300px', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                    <Popup>{marker.label}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

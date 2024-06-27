import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  location: string;
  lat: number;
  lon: number;
}

export default function Map({ location, lat, lon }: MapProps) {
  return (
    <MapContainer center={[lat, lon]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lon]}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
}
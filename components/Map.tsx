import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { MapContainerProps } from 'react-leaflet';

interface MapProps extends MapContainerProps {
  location: string;
  lat: number;
  lon: number;
}

export default function Map({ location, lat, lon, ...props }: MapProps) {
  const center: LatLngExpression = [lat, lon];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '15px' }} {...props}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  );
}

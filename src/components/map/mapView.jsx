import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


export default function MapView({ vehicle, onClose }) {
  const [routes, setRoutes] = useState([]);
  
  useEffect(() => {
    setRoutes([
      { lat: -23.550520, lng: -46.633308 },
      { lat: -23.551520, lng: -46.634308 },
      { lat: -23.552520, lng: -46.635308 },
      { lat: -23.553520, lng: -46.636308 },
    ]);
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="h-full flex flex-col">
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Rota do Veículo</h2>
            <p className="text-sm">{vehicle.plate} - {vehicle.model}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Fechar
          </button>
        </div>
        
        <div className="flex-1">
          <MapContainer
            center={routes.length > 0 ? [routes[0].lat, routes[0].lng] : [-23.550520, -46.633308]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap'
            />
            
            {routes.length > 0 && (
              <>
                <Polyline positions={routes.map(r => [r.lat, r.lng])} color="blue" weight={4} />
                <Marker position={[routes[0].lat, routes[0].lng]}>
                  <Popup>Início</Popup>
                </Marker>
                <Marker position={[routes[routes.length - 1].lat, routes[routes.length - 1].lng]}>
                  <Popup>Fim</Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import './GISDashboard.css';

const MosquitoMap = () => {
  const lahorePosition = [31.5204, 74.3587];
  const initialZoom = 10;
  const tileUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

  return (
    <div className="map-container">
      <MapContainer center={lahorePosition} zoom={initialZoom} className="leaflet-container">
        <TileLayer attribution={attribution} url={tileUrl} />
      </MapContainer>
    </div>
  );
};

export default MosquitoMap;

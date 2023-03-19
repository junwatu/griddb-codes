import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

mapboxgl.accessToken = 'pk.eyJ1IjoicHJhLXBhbmd1cmFrYW4iLCJhIjoiY2xmZzg3Y3hzMTN6bTN6bnpvZTd1eW1ybiJ9.PZNGQeIDzyn7xndFUu7Udg';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1.5);

  useEffect(() => {
    if (map.current) return; 
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // flat map
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <div className="App">
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App

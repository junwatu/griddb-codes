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
  const [socket, setSocket] = useState(null);
  const [worldPopulation, setWorldPopulation] = useState(0);

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

  useEffect(() => {
    // Replace 'wss://example.com' with your WebSocket server URL
    const ws = new WebSocket('ws://localhost:3000');
    setSocket(ws);

    ws.addEventListener('open', (event) => {
      console.log('WebSocket connected:', event);
    });

    ws.addEventListener('message', (event) => {
      //console.log('WebSocket message: OK');
      const worldPopulationData = JSON.parse(event.data);
      setWorldPopulation(worldPopulationData[0].population);
    });

    ws.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });

    ws.addEventListener('close', (event) => {
      console.log('WebSocket disconnected:', event);
    });

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        World Population: {worldPopulation}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default App

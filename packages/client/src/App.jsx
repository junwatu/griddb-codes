import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicHJhLXBhbmd1cmFrYW4iLCJhIjoiY2xmZzg3Y3hzMTN6bTN6bnpvZTd1eW1ybiJ9.PZNGQeIDzyn7xndFUu7Udg'; 
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [zoom, setZoom] = useState(1.5);
  const [socket, setSocket] = useState(null);
  const [worldPopulation, setWorldPopulation] = useState(0);

  const updateLabels = (countries) => {
    countries.forEach((item, index) => {
      const source = map.current.getSource(`label-source-${index}`);
      if (source) {
        source.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: item.coordinates,
          },
          properties: {
            label: `${item.country}: ${item.population}`,
          },
        });
      } else {
        map.current.addSource(`label-source-${index}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: item.coordinates,
            },
            properties: {
              label: `${item.country}: ${item.population}`,
            },
          },
        });

        map.current.addLayer({
          id: `label-layer-${index}`,
          type: 'symbol',
          source: `label-source-${index}`,
          layout: {
            'text-field': ['get', 'label'],
            'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto',
          },
          paint: {
            'text-color': '#000',
            'text-halo-color': '#fff',
            'text-halo-width': 2,
          },
        });
      }
    });
  };
  
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
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
      console.log(event.data)  
     
      const data = JSON.parse(event.data);
      setWorldPopulation(data[0].population);
     
      if (data[0].country) {
          console.log("country",data)
          updateLabels(data);
      }
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

import http from "node:http";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";
import { EventEmitter } from 'events';
import path from "node:path";
import { fileURLToPath } from 'url';

import {
  fetchCountryPopulationData,
  fetchWorldPopulationData,
} from "./libs/worldPopulationData.js";
import * as GridDB from "./libs/griddb.cjs";

const port = process.env.PORT || 3000;
const worldDataUpdateTime = 5000;
const countriesDataUpdateTime = 30000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const { timeseriesDb } = await GridDB.initGridDbTS()

EventEmitter.defaultMaxListeners = 20; // Increase the global limit to 20 listeners

app.use(express.static(path.join(__dirname, 'public')));

// create an HTTP server
const server = http.createServer(app);
// create  WebSocker server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

const updateClientsWithCountryPopulationData = async (clients) => {
  try {
    const countryPopulationData = await fetchCountryPopulationData();

    const data = {
      type: "countryPopulationData",
      countries: countryPopulationData,
    };

    // DEBUG
    console.log(data);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(data));
        } catch (error) {
          console.error("Error sending data to client:", error);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const updateClientsWithWorldPopulationData = async (clients) => {
  try {
    const worldPopulation = await fetchWorldPopulationData();

    const data = {
      type: "worldPopulationData",
      worldPopulation,
    };
    // DEBUG
    console.log(data);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(data));
        } catch (error) {
          console.error("Error sending data to client:", error);
        }
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// Fetch data initially and send to clients
updateClientsWithWorldPopulationData(wss.clients);

/**
 * In general, if you need more control over the timing and execution of your function,
 * setTimeout with recursion is a better choice. However, if you have a simple,
 * lightweight function that needs to run at a fixed interval,
 * setInterval can be more convenient.
 */
function updateClientsWithWorldPopulationDataPeriodically(clients) {
  updateClientsWithWorldPopulationData(clients);
  setTimeout(
    () => updateClientsWithWorldPopulationDataPeriodically(clients),
    worldDataUpdateTime
  );
}

// Call the function to start the periodic updates
updateClientsWithWorldPopulationDataPeriodically(wss.clients);

updateClientsWithCountryPopulationData(wss.clients);
setInterval(
  () => updateClientsWithCountryPopulationData(wss.clients),
  countriesDataUpdateTime
);

// Manual request
app.get("/api/countries", async (req, res) => {
  try {
    const data = await fetchCountryPopulationData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/world", async (req, res) => {
  try {
    const data = await fetchWorldPopulationData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

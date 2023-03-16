import http from "node:http";
import express from "express";
import { WebSocket, WebSocketServer } from "ws";

import {
  fetchCountryPopulationData,
  fetchWorldPopulationData,
} from "./libs/worldPopulationData.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));

// create an HTTP server
const server = http.createServer(app);
// create  WebSocker server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("Client connected");

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

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
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
    console.log(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// Fetch data initially and send to clients
//updateClientsWithCountryPopulationData(wss.clients);
updateClientsWithWorldPopulationData(wss.clients);

// Fetch country population data every 7 seconds and send to clients
//setInterval(() => updateClientsWithCountryPopulationData(wss.clients), 7000);

// Fetch world population data every 3 seconds and send to clients
setInterval(() => updateClientsWithWorldPopulationData(wss.clients), 3000);

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

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

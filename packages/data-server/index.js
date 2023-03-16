import express from "express";
import {
  fetchCountryPopulationData,
  fetchWorldPopulationData,
} from "./libs/worldPopulationData.js";

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

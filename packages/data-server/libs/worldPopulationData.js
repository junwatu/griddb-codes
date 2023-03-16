import puppeteer from "puppeteer";

const retrieveDataInterval = 3;
const worldPopDataSource = "https://www.worldometers.info/world-population/";
const worldPopDataByCountrySource =
  "https://www.worldometers.info/world-population/population-by-country/";

/**
 * fetch world population data
 */
const fetchWorldPopulationData = async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the target website
  await page.goto(worldPopDataSource);

  const extractData = async () => {
    // Extract data from the page
    const data = await page.evaluate(() => {
      const populationElement = document.querySelector(".rts-counter");
      const population = populationElement.textContent.replace(/[\n\s]+/g, "");
      return { population };
    });

    return data;
    // Log the extracted data
    //console.log(data);
    // Set a x-second interval before extracting the data again
    //setTimeout(extractData, retrieveDataInterval * 1000);
  };
  // Start extracting data
  const popData = await extractData();
  await browser.close();
  return popData;
};

/**
 * fetch world population data by country
 */
const fetchCountryPopulationData = async () => {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the target website
  await page.goto(worldPopDataByCountrySource);

  // Extract data from the page
  const data = await page.evaluate(() => {
    const tableRows = document.querySelectorAll("#example2 tbody tr");
    const countryPopulationData = [];

    tableRows.forEach((row) => {
      const countryElement = row.querySelector("td:nth-child(2) a");
      const country = countryElement.textContent.trim();

      const populationElement = row.querySelector("td:nth-child(3)");
      const population = populationElement.textContent.trim();

      countryPopulationData.push({ country, population });
    });

    return countryPopulationData;
  });

  // Close the browser
  await browser.close();

  return data;
};

export { fetchCountryPopulationData, fetchWorldPopulationData };

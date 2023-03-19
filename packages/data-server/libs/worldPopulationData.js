import puppeteer from "puppeteer";

const worldPopDataSource = "https://www.worldometers.info/world-population/";
const worldPopDataByCountrySource =
  "https://www.worldometers.info/world-population/population-by-country/";


/**
 * fetch world population data
 */
const fetchWorldPopulationData = async () => {
  let browser
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(worldPopDataSource, { timeout: 60000 });

    const extractData = async () => {
      // Extract data from the page
      const data = await page.evaluate(() => {
        const populationElement = document.querySelector(".rts-counter");
        const population = populationElement.textContent.replace(/[\n\s]+/g, "");
        return { population };
      });

      return data;
    };

    const popData = await extractData();
    return popData;
  } catch (error) {
    console.error('Error fetching world population data:', error);
    throw new Error(error)
  } finally {
    await browser.close();
  }
};

/**
 * fetch world population data by country
 */
const fetchCountryPopulationData = async () => {
  let browser
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(worldPopDataByCountrySource, { timeout: 60000 });

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

    return data;

  } catch (error) {
    console.error('Error fetching country population data:', error);
    throw new Error(error)
  } finally {
    await browser.close();
  }
};

export { fetchCountryPopulationData, fetchWorldPopulationData };

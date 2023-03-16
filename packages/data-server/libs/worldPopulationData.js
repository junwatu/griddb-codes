import puppeteer from "puppeteer";

const retrieveDataInterval = 3;
const worldPopDataSource = "https://www.worldometers.info/world-population/";

const fetchData = async () => {
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
    // Log the extracted data
    console.log(data);
    // Set a x-second interval before extracting the data again
    setTimeout(extractData, retrieveDataInterval * 1000);
  };
  // Start extracting data
  extractData();
};

export { fetchData as fetchWorldPopulationData };

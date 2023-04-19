const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function start() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: false,
    userDataDir: "./tmp"
  });
  
  const page = await browser.newPage();
  
  const csvWriter = createCsvWriter({
    path: 'apna.csv',
    header: [
      { id: 'title', title: 'Title' },
    ]
  });

  for (let pageNum = 1; pageNum <= 500; pageNum++) { // Loop through the first 500 pages
    await page.goto(`https://apna.co/jobs?page=${pageNum}`);
    await page.screenshot({ path: `apna-${pageNum}.png` });

    const dataHandles = await page.$$('.styles__JobDetails-sc-1eqgvmq-1');
    const data = [];

    for (const datahandle of dataHandles) {
      try {
        const title = await page.evaluate(el => el.innerText, datahandle);
        data.push({ title: title });
      } catch (error) { }
    }

    await csvWriter.writeRecords(data);
    console.log(`Page ${pageNum} data saved to CSV`);
  }

  await browser.close();
}

start();
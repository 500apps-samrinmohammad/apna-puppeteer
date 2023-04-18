
const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
async function start() {
const browser = await puppeteer.launch({
headless: true,
defaultViewport: false,
userDataDir: "./tmp"
});
const page = await browser.newPage();
await page.goto('https://apna.co/jobs');
await page.screenshot({ path: 'apna.png' });
const dataHandles = await page.$$('.styles__JobDetails-sc-1eqgvmq-1');
const data = [];
for (const datahandle of dataHandles) {
try {
const title = await page.evaluate(el => el.innerText, datahandle);
data.push({ title: title });
} catch (error) { }
}
const csvWriter = createCsvWriter({
path: 'apna.csv',
header: [
{ id: 'title', title: 'Title' },
]
});
await csvWriter.writeRecords(data);
console.log('CSV file written successfully');
await browser.close();
}
start();lklk
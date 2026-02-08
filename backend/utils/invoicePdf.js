const puppeteer = require("puppeteer");
const invoiceTemplate = require("./invoiceTemplate");

module.exports = async (invoice) => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setContent(invoiceTemplate(invoice), {
    waitUntil: "networkidle0"
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true
  });

  await browser.close();
  return pdf;
};
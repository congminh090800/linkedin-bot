const puppeteer = require("puppeteer");
let page;

async function getPage() {
  if (!page) {
    let browser = await puppeteer.launch({
      args: ["--no-sandbox"],
      userDataDir: "C:/Users/lenovi/AppData/Local/Google/Chrome/User Data",
    });
    page = await browser.newPage();
  }
  return page;
}

async function getShortLink({ userName }) {
  const page = await getPage();
  await page.goto(`https://www.google.com/search?q=linkedin ${userName}`);
  const value = await page.$$eval("#search a", (items) => {
    let result;
    for (let i = 0; i < items.length; i++) {
      let link = items[i].getAttribute("href");
      if (link && link.includes("linkedin.com/company")) {
        result = link;
        break;
      }
    }
    return result;
  });
  if (!value) {
    throw new Error("Can not get username");
  }
  return value;
}

module.exports = {
  getShortLink,
};

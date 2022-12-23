const GoogleSheetService = require("./google-sheet-service");
const { getShortLink } = require("./puppeteer-bot");
const sleep = require("sleep-promise");

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const sheetService = new GoogleSheetService(
    "1sY-R73qvUiHHnpirqKygdaCfLd4rOYy4LwULXcof1-c",
    "Trang tính1"
  );
  let targetData = [];
  const linkedinNames = await sheetService.read({ range: "C:C" });
  const shortLinkColumn = await sheetService.read({ range: "O:O" });
  if (shortLinkColumn.values && shortLinkColumn.values.length > 0) {
    targetData = shortLinkColumn.values;
  }
  if (!linkedinNames.values || linkedinNames.values.length === 0) {
    throw new Error("No links found");
  }
  for (let i = 1; i < linkedinNames.values.length; i++) {
    if (
      targetData[i] &&
      targetData[i][0] &&
      targetData[i][0].includes("linkedin.com/company")
    ) {
      continue;
    }
    const userName = linkedinNames.values[i][0]
      ? linkedinNames.values[i][0].trim()
      : null;
    if (userName) {
      try {
        const shortLink = await getShortLink({ userName });
        await sheetService.update({
          range: `O${i + 1}`,
          values: [[shortLink]],
          valueInputOption: "RAW",
        });
        await sleep(getRndInteger(2000, 7000));
        console.log(`Inserted row ${i + 1}`);
      } catch (err) {
        console.log(err);
        console.log(`Insert failed row ${i + 1}`);
      }
    }
  }
}

main();

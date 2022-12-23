const { google } = require("googleapis");

class GoogleSheetService {
  constructor(spreadsheetId, sheetTitle) {
    this.spreadsheetId = spreadsheetId;
    this.sheetTitle = sheetTitle;

    this.auth = new google.auth.GoogleAuth({
      scopes: "https://www.googleapis.com/auth/spreadsheets",
      keyFilename: "./credentials.json",
    });
    this.sheetManager = null;
  }

  async getSheetManager() {
    if (this.sheetManager) {
      return this.sheetManager;
    }

    const client = await this.auth.getClient();
    this.sheetManager = google.sheets({
      version: "v4",
      auth: client,
    });

    return this.sheetManager;
  }

  // follow A1 notation
  async read({ range }) {
    const sheetManager = await this.getSheetManager();
    const result = await sheetManager.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetTitle}!${range}`,
    });
    return result.data;
  }

  async update({ range, values, valueInputOption = "RAW" }) {
    const sheetManager = await this.getSheetManager();
    const result = await sheetManager.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetTitle}!${range}`,
      valueInputOption,
      resource: {
        values,
      },
    });

    return result;
  }
}

module.exports = GoogleSheetService;

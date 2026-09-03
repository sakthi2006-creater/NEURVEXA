const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "neurvexa-data.json");

function readDb() {
  if (!fs.existsSync(dbPath)) return { registrations: [] };
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDb, writeDb };

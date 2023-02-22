import { scrapers } from "./scrapers";
import { DB } from "./db";

async function main() {
  const db = new DB();
  console.log("Connecting to DB...");
  await db.connect();
  console.log("Connected!");
  await scrapers.reduce(async (memo, scraper) => {
    await memo;
    return new scraper(db).scrape();
  }, Promise.resolve());
  db.client.close();
}

main();

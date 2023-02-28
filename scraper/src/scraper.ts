import { Bottle } from "./types";
import { DB } from "./db";
import { parentPort } from "node:worker_threads";

export class Scraper {
  _data: Bottle[] = [];
  _url = "";
  _website = "";
  _productLinkBase = "";
  _totalPages = 0;
  _productsPerPage = 20;
  _queryParams: URLSearchParams = new URLSearchParams();
  _db: DB;
  _scrapeId = 0;
  _pageKey = "page";

  constructor() {
    this._db = new DB();
  }

  _buildUrl(page: number): string {
    const url = new URL(this._url);
    const queryParams = new URLSearchParams(this._queryParams);
    queryParams.set(this._pageKey, String(page));
    url.search = queryParams.toString();
    return url.toString();
  }

  _buildLink(handle: string): string {
    return `${this._productLinkBase}${handle}`;
  }

  async _fetchUrl(page: number): Promise<string> {
    const response = await fetch(this._buildUrl(page));
    const text = await response.text();
    return text;
  }

  _convertTextToJson(response: string): any {
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error(`Failed to parse json for ${this._website}`);
      return {};
    }
  }

  _parseResponse(response: any): void {
    // Store products in this._data here
  }

  async _getTotal(): Promise<number> {
    // Return the total number of products
    return Promise.resolve(0);
  }

  async _scrapeAllPages() {
    const totalProducts = await this._getTotal();
    this._totalPages = Math.ceil(totalProducts / this._productsPerPage);
    let currentPage = 1;
    while (currentPage <= this._totalPages) {
      parentPort?.postMessage({
        current: currentPage,
        scraper: this._website,
        total: this._totalPages,
      });
      this._parseResponse(
        this._convertTextToJson(await this._fetchUrl(currentPage))
      );
      currentPage += 1;
    }
  }

  _storeData() {
    if (!this._data.length) {
      return;
    }
    const bulkOp = this._db.client
      .db("bottles")
      .collection("bottles")
      .initializeUnorderedBulkOp();
    this._data.forEach((d) => {
      bulkOp
        .find({
          title: d.title,
          website: d.website,
        })
        .upsert()
        .updateOne({
          $set: d,
          $setOnInsert: {
            fresh: true,
          },
        });
    });
    return bulkOp.execute();
  }

  _deletePreviousScrape() {
    return this._db.client
      .db("bottles")
      .collection("bottles")
      .deleteMany({
        website: this._website,
        scrapeId: {
          $ne: this._scrapeId,
        },
      });
  }

  _setFreshness() {
    return this._db.client
      .db("bottles")
      .collection("bottles")
      .updateMany(
        {
          website: this._website,
        },
        {
          $set: {
            fresh: false,
          },
        }
      );
  }

  async _setScrapeId() {
    this._scrapeId =
      ((
        await this._db.client
          .db("bottles")
          .collection("bottles")
          .findOne({ website: this._website }, { projection: { scrapeId: 1 } })
      )?.scrapeId ?? -1) + 1;
  }

  public async scrape(): Promise<void> {
    await this._db.connect();
    await this._setScrapeId();
    await this._setFreshness();
    await this._scrapeAllPages();
    await this._storeData();
    await this._deletePreviousScrape();
    this._db.client.close();
  }
}

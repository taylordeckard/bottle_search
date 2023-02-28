import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Sharedpour extends Scraper {
  _url = "https://www.searchanise.com/getresults";
  _website = "sharedpour";
  _productLinkBase = "https://sharedpour.com";
  _productsPerPage = 20;
  _queryParams: URLSearchParams = new URLSearchParams({
    page: String(1),
    api_key: "9c7i3r1Z7w",
    sortBy: "created",
    sortOrder: "desc",
    startIndex: "0",
    maxResults: "20",
    items: "true",
    pages: "true",
    categories: "true",
    suggestions: "true",
    queryCorrection: "true",
    suggestionsMaxResults: "3",
    pageStartIndex: "0",
    pagesMaxResults: "20",
    categoryStartIndex: "0",
    categoriesMaxResults: "20",
    facets: "true",
    facetsShowUnavailableOptions: "false",
    recentlyViewedProducts: "7557644451995",
    ResultsTitleStrings: "2",
    ResultsDescriptionStrings: "0",
    collection: "whiskey-1",
    timeZoneName: "America/New_York",
    output: "jsonp",
    callback: "jQuery36005970420426540526_1677297039954",
    _: String(Date.now()),
    "restrictBy[snize_facet5]": "In Stock",
  });

  _convertTextToJson(response: string): any {
    const selection = response.match(
      /jQuery36005970420426540526_1677297039954\((.*)\)/
    )?.[1];
    if (selection) {
      try {
        return JSON.parse(selection);
      } catch (e) {
        console.error(`Failed to parse json for ${this._website}`);
        return {};
      }
    }
  }

  private _formatPrice(priceStr: string) {
    let price = Number(priceStr);
    if (isNaN(price)) {
      console.log(`WARNING: ${priceStr} is not a number`);
      price = -1;
    }
    return price;
  }

  _parseResponse(response: any): void {
    if (response) {
      response.items.forEach((product: any) => {
        this._data.push({
          link: this._buildLink(product.link),
          price: this._formatPrice(product.price),
          scrapeId: this._scrapeId,
          title: product.title,
          website: this._website,
        });
      });
    }
  }

  async _getTotal(): Promise<number> {
    const response = this._convertTextToJson(await this._fetchUrl(1));
    return response.totalItems;
  }
}

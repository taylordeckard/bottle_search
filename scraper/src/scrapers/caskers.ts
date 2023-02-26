import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Caskers extends Scraper {
  _url = "https://www.caskers.com/spirits/whiskey/bourbon/"
  _website = "caskers";
  _productLinkBase = "";
  _productsPerPage = 20;
  _queryParams: URLSearchParams = new URLSearchParams({
    p: String(1),
  });
  _pageKey = 'p';

  private _formatPrice(price: string): number {
    const numString = price.replace(/[\\n\$a-zA-Z,]/g, "").trim();
    let num = Number(numString);
    if (isNaN(num)) {
      console.log(`WARNING: ${numString} is NaN`);
      num = 0;
    }
    return Number(num);
  }

  _convertTextToJson(response: string): any {
    const $ = cheerio.load(response);
    return $(".item.product.product-item")
      .filter((idx, elem) => !$(elem).html()?.includes("Out of stock"))
      .map((idx, elem) => ({
        handle: $(elem).find(".product-item-link-block").attr("href"),
        price: this._formatPrice($(elem).find(".product-item-link-block").attr("data-price") ?? ""),
        title: $(elem).find(".product-item-link-block").attr("title"),
      }))
      .toArray();
  }

  _parseResponse(response: any): void {
    if (response) {
      response.forEach((product: any) => {
        this._data.push({
          link: this._buildLink(product.handle),
          price: product.price,
          scrapeId: this._scrapeId,
          title: product.title,
          website: this._website,
        });
      });
    }
  }

  async _getTotal(): Promise<number> {
    const response = await this._fetchUrl(1);
    const $ = cheerio.load(response);
    const totalProducts$ = $(".toolbar-products strong.toolbar-number");
    const totalProducts = Number($(totalProducts$[0]).text()) ?? 0;
    return totalProducts;
  }
}

import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Cleverwine extends Scraper {
  _url = "https://www.cleverwineonline.com/spirits/Bourbon";
  _website = "cleverwine";
  _productLinkBase = "https://www.cleverwineonline.com";
  _productsPerPage = 25;
  _queryParams: URLSearchParams = new URLSearchParams({
    page: String(1),
  });

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
    return $(".product-list > div")
      .map((idx, elem) => ({
        handle: $(elem).find(".srmid .rebl15").attr("href"),
        price: this._formatPrice($(elem).find(".rd14:not(.cspr)").text() ?? ""),
        title: $(elem).find(".srmid .rebl15").text(),
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
    const totalPages$ = $(".sorting > ul > li:first-child").first();
    const totalPages = totalPages$.text().replace(/Page \d+ of (\d+)/, "$1");
    const totalProducts = Number(totalPages) * this._productsPerPage ?? 0;
    return totalProducts;
  }
}

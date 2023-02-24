import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Sipwhiskey extends Scraper {
  _url = "https://sipwhiskey.com/collections/bourbon";
  _website = "sipwhiskey";
  _productLinkBase = "https://sipwhiskey.com/";
  _productsPerPage = 16;
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
    return $(".product-block")
      .filter((idx, elem) => !$(elem).html()?.includes("soldout"))
      .map((idx, elem) => ({
        handle: $(elem).find(".product-link").attr("href"),
        price: this._formatPrice($(elem).find(".price .theme-money").text()),
        title: $(elem).find(".product-info .title").text(),
      }))
      .toArray();
  }

  _parseResponse(response: any): void {
    if (response) {
      response.forEach((product: any) => {
        this._data.push({
          title: product.title,
          website: this._website,
          price: product.price,
          link: this._buildLink(product.handle),
        });
      });
    }
  }

  async _getTotal(): Promise<number> {
    const response = await this._fetchUrl(1);
    const $ = cheerio.load(response);
    const paginator = $(".pagination__number");
    const totalPages = Number($(paginator[paginator.length - 1]).text());
    return totalPages * this._productsPerPage;
  }
}

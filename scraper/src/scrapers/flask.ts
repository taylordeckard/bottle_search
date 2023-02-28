import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Flask extends Scraper {
  _url = "https://flaskfinewines.com/collections/bourbon";
  _website = "flask";
  _productLinkBase = "https://flaskfinewines.com/";
  _productsPerPage = 24;
  _queryParams: URLSearchParams = new URLSearchParams({
    page: String(1),
    sort_by: 'manual',
    'filter.v.availability': '1', 
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
    return $(".product-item")
      .map((idx, elem) => ({
        handle: $(elem).find(".product-item__title").attr("href"),
        price: this._formatPrice(
          $(elem).find(".price:first-child").remove('.visually-hidden').text(),
        ),
        title: $(elem).find(".product-item__primary-image")
          .attr("alt")?.replace(/ - Flask Fine Wine & Whisky$/, ''),
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
    const paginator = $(".collection__showing-count").text();
    const totalItems = Number(paginator
      .match(/Showing 1 - 24 of (\d+) products/)?.[1]);
    return totalItems;
  }
}

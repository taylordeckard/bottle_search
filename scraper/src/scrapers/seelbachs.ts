import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Seelbachs extends Scraper {
  _url = "https://seelbachs.com/collections/frontpage/whiskey";
  _website = "seelbachs";
  _productLinkBase = "https://seelbachs.com";
  _productsPerPage = 32;
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
    return $(".grid__item")
      .filter(
        (idx, elem) => !$(elem).html()?.includes("product-price__sold-out")
      )
      .filter(
        (idx, elem) => $(elem).find(".grid-view-item__title").text() !== ""
      )
      .map((idx, elem) => ({
        handle: $(elem).find(".grid-view-item__link").attr("href"),
        price: this._formatPrice(
          $(elem).find("span.product-price__price").text()
        ),
        title: $(elem).find(".grid-view-item__title").text(),
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
    const countLabel = $(".filters-toolbar__product-count").text();
    const countStr = countLabel.match(/(\d*) products/)?.[1];
    const count = Number(countStr);
    return isNaN(count) ? 0 : count;
  }
}

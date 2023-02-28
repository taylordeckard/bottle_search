import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Saratogawine extends Scraper {
  _url = "https://www.saratogawine.com/search/Bourbon/Spirit";
  _website = "saratogawine";
  _productLinkBase = "https://www.saratogawine.com";
  _productsPerPage = 20;
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
    return $(".product-item")
      .map((idx, elem) => ({
        handle: $(elem).attr("href"),
        price: this._formatPrice(
          $(elem).find(".price-line.bottle span.price").text()
        ),
        title: $(elem).find(".product-name").text(),
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
    const paginator = $(".pages-links a");
    const totalPages = Number($(paginator[paginator.length - 1]).text());
    return totalPages * this._productsPerPage;
  }
}

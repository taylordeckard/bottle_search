import { Scraper } from "../scraper";
import * as cheerio from "cheerio";

export class Caskcartel extends Scraper {
  _url = "https://caskcartel.com/collections/cask-cartel/whiskey_bourbon";
  _website = "caskcartel";
  _productLinkBase = "https://caskcartel.com";
  _productsPerPage = 48;
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
    return $(".main_box")
      .filter((idx, elem) => !$(elem).html()?.includes("sold-out"))
      .map((idx, elem) => ({
        handle: $(elem).find("h5 a").attr("href"),
        price: this._formatPrice(
          $(elem).find(".price .money:first-child").text()
        ),
        title: $(elem).find("h5 a").text(),
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
    const paginator = $(".page_c ul li");
    const totalPages = Number($(paginator[paginator.length - 1]).text());
    return totalPages * this._productsPerPage;
  }
}

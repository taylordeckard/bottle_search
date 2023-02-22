import { Scraper } from "../scraper";

export class Kegnbottle extends Scraper {
  _url = "https://services.mybcapps.com/bc-sf-filter/filter";
  _website = "kegnbottle";
  _productLinkBase = "https://kegnbottle.com/products/";
  _productsPerPage = 21;
  _queryParams: URLSearchParams = new URLSearchParams({
    t: Date.now().toString(),
    _: "pf",
    shop: "kegnbottle.myshopify.com",
    page: String(1),
    limit: String(this._productsPerPage),
    sort: "best-selling",
    display: "grid",
    collection_scope: "98195013761",
    product_available: "true",
    variant_available: "true",
    build_filter_tree: "true",
    check_cache: "false",
    locale: "en",
    sid: "02efb58d-ae20-4712-9c3f-29314d4dd624",
    callback: "BoostPFSFilterCallback",
    event_type: "filter",
    "pf_t_style[]": "style_Bourbon",
  });

  _convertTextToJson(response: string): any {
    const selection = response.match(/BoostPFSFilterCallback\((.*)\)/)?.[1];
    if (selection) {
      try {
        return JSON.parse(selection);
      } catch (e) {
        console.error(`Failed to parse json for ${this._website}`);
        return {};
      }
    }
  }

  _parseResponse(response: any): void {
    if (response) {
      response.products.forEach((product: any) => {
        this._data.push({
          title: product.title,
          website: this._website,
          price: product.price_min,
          link: this._buildLink(product.handle),
        });
      });
    }
  }

  async _getTotal(): Promise<number> {
    const response = this._convertTextToJson(await this._fetchUrl(1));
    return response.total_product;
  }
}

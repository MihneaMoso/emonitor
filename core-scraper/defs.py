from rich import print as rprint
from curl_cffi import requests
from config_offers import params_offers, cookies_offers, headers_offers
from config_search import params_search, cookies_search, headers_search
from config_html import cookies_html, headers_html, params_html
from config_altex import cookies_altex, headers_altex
from selectolax.parser import HTMLParser


# we'll use this later when we create a search function for emonitor
def emag_get_search_data(query: str):
    params_search["filters[query]"] = query
    response = requests.get(
        "https://sapi.emag.ro/recommendations/by-zone-by-filters",
        params=params_search,
        cookies=cookies_search,
        headers=headers_search,
        impersonate="chrome",
    )
    return response.json()


# return price information
def emag_get_offer_data(product_str: str) -> dict:

    product_sku = product_str.split("/")[2]
    # only do this if the product_str has the '/pd/' in it
    if "/pd/" in product_str:
        response = requests.get(
            f"https://sapi.emag.ro/products/{product_sku}/fastest-cheapest-offers",
            cookies=cookies_offers,
            headers=headers_offers,
            params=params_offers,
            impersonate="chrome",
        )
        r = response.json()
        # id will be the code situated between the second and third forwardslash in the product str
        current_cheapest_price = r["data"]["cheapest"]["price"]["current"]
        recommeded_cheapest_sales_price = r["data"]["cheapest"]["price"][
            "recommended_retail_price"
        ]["amount"]
        current_fastest_delivery_price = r["data"]["fastest"]["price"]["current"]
        # current_fastest_delivery_discount = r['data']['fastest']['price']['discount']['absolute']
        discount_cheapest = r["data"]["cheapest"]["price"]["discount"]["absolute"]
        currency = r["data"]["cheapest"]["price"]["currency"]["name"]["default"]
        return {
            "id": product_sku,
            "current_cheapest_price": current_cheapest_price,
            "recommeded_cheapest_sales_price": recommeded_cheapest_sales_price,
            "current_fastest_delivery_price": current_fastest_delivery_price,
            "discount_cheapest": discount_cheapest,
            "currency": currency,
        }
    elif "/fd/" in product_str:
        response = requests.get(
            f"https://emag.ro/{product_str}",
            cookies=cookies_html,
            headers=headers_html,
            params=params_html,
            impersonate="chrome",
        )
        tree = HTMLParser(response.text)
        title = tree.css_first("h1.page-title").text()
        image = tree.css_first('img[alt="Product image"]').attrs["src"]
        big_price: int = tree.css_first("p.product-new-price").text()
        small_price: int = tree.css_first("p.product-new-price sup.mf-decimal").text()
        currency: str = tree.css_first("p.product-new-price span").text()
        total_price = big_price + small_price / 100
        return {
            'id': product_sku,
            "current_cheapest_price": total_price,
            "recommeded_cheapest_sales_price": None,
            "current_fastest_delivery_price": None,
            "discount_cheapest": 0,
            "currency": currency,
            "title": title,
            "image": image,
        }


def emag_get_title_and_image(product_str: str) -> dict:
    response = requests.get(
        f"https://emag.ro/{product_str}",
        cookies=cookies_html,
        headers=headers_html,
        params=params_html,
        impersonate="chrome",
    )
    tree = HTMLParser(response.text)
    title = tree.css_first("h1.page-title").text()
    # rprint(title)
    image = tree.css_first('img.bg-onaccent[data-test="main-product-gallery"]').attrs[
        "src"
    ]
    # rprint (image)

    return {
        "title": title,
        "image": image,
    }


def altex_get_product_data(product_str: str) -> dict:
    product_sku = product_str.split("/")[2]
    response = requests.get(
        f"https://fenrir.altex.ro/catalog/product/store_availability/{product_sku}",
        cookies=cookies_altex,
        headers=headers_altex,
        impersonate="chrome",
    )
    r = response.json()
    return {
        "id": product_sku,
        "current_cheapest_price": r["product"]["price"],
        "recommeded_cheapest_sales_price": r["product"]["regular_price"],
        "current_fastest_delivery_price": None,
        "discount_cheapest": r['product']['regular_price'] - r['product']['price'] if r['product']['discount_type'] == "fixed" else None,
        "currency": None,
        "title": r["product"]["name"],
        "image": "https://lcdn.altex.ro/" + r["product"]["small_image"],
    }


# rprint(requests.get('https://sapi.emag.ro/products/D40VN2MBM/fastest-cheapest-offers', params=params_offers, impersonate="chrome").json()

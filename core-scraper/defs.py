from rich import print as rprint
from curl_cffi import requests as cureq
from config_offers import params_offers, cookies_offers, headers_offers
from config_search import params_search, cookies_search, headers_search
from config_html import cookies_html, headers_html, params_html
from config_altex import cookies_altex, headers_altex
import html
from requests.cookies import cookiejar_from_dict
import requests
from typing import Union, Dict
from selectolax.parser import HTMLParser

FLARESOLVER_URL_DEV = "http://localhost:8191/v1"
FLARESOLVERR_URL_PROD = "https://flaresolverr-emonitor.onrender.com/v1"

def get_coookies(url: str) -> list[Dict]:
    headers = {"Content-Type": "application/json"}
    data = {
        "cmd": "request.get",
        "url": url,
        "maxTimeout": 60000,
        "returnOnlyCookies": True,
    }
    flare_url = FLARESOLVERR_URL_PROD
    response = requests.post(flare_url, json=data, headers=headers)
    rprint(response.json()['solution'])
    return response.json()['solution']['cookies']


def load_cookies(session: requests.Session, cookies_list: list[Dict]):
    cookie = {}
    for elem in cookies_list:
        cookie[elem["name"]] = elem["value"]
    session.cookies = cookiejar_from_dict(cookie)


def emag_get_fd_data(product_str: str, product_sku: str) -> dict:
    session = requests.Session()
    product_url = f"https://emag.ro/{product_str}"
    cookies = get_coookies(product_url)
    load_cookies(session, cookies)
    response = session.get(
        product_url,
        # cookies=cookies_html,
        headers=headers_html,
        params=params_html,
        # impersonate="chrome",
    )
    session.close()
    tree = HTMLParser(response.text)
    rprint(response.text)
    title = tree.css_first("h1.page-title").text().strip()
    image = tree.css_first('img[alt="Product image"]').attrs["src"]
    big_price: Union[int, str] = html.unescape(
        tree.css_first("p.product-new-price").text()
    )
    small_price: int = int(
        tree.css_first("p.product-new-price sup").text().replace(",", "")
    )
    currency: str = tree.css_first("p.product-new-price span").text()
    total_price: float = 0.0
    if " " in big_price:
        total_price = big_price.split(" ")[0].replace(".", "").replace(",", ".")
        total_price = float(total_price)
        currency = big_price.split(" ")[1]
    else:
        total_price = int(big_price) + small_price / 100
    return {
        "id": product_sku,
        "price": total_price,
        "prp": None,
        "fdp": None,
        "discount": 0,
        "currency": currency,
        "title": title,
        "imageUrl": image,
    }


# we'll use this later when we create a search function for emonitor
def emag_get_search_data(query: str):
    params_search["filters[query]"] = query
    response = cureq.get(
        "https://sapi.emag.ro/recommendations/by-zone-by-filters",
        params=params_search,
        cookies=cookies_search,
        headers=headers_search,
        impersonate="chrome",
    )
    return response.json()


# return price information
def emag_get_offer_data(product_str: str) -> dict:
    product_sku = ""
    try:
        product_sku = product_str.split("/")[2]
    except IndexError:
        print("Invalid product string")
    # only do this if the product_str has the '/pd/' in it
    if "/pd/" in product_str:
        try:
            # session = requests.Session()
            product_url = (
                f"https://sapi.emag.ro/products/{product_sku}/fastest-cheapest-offers"
            )
            # cookies = get_coookies(product_url)
            # load_cookies(session, cookies)
            response = cureq.get(
                product_url,
                cookies=cookies_offers,
                headers=headers_offers,
                params=params_offers,
                impersonate="chrome",
            )
            r = response.json()
            # session.close()
            rprint(r)
            # id will be the code situated between the second and third forwardslash in the product str (sku)
            current_cheapest_price = r["data"]["cheapest"]["price"]["current"]
            recommeded_cheapest_sales_price = r["data"]["cheapest"]["price"][
                "recommended_retail_price"
            ]["amount"]
            if recommeded_cheapest_sales_price == 0:
                recommeded_cheapest_sales_price = r["data"]["cheapest"]["price"][
                    "lowest_price_30_days"
                ]["amount"]
            current_fastest_delivery_price = r["data"]["fastest"]["price"]["current"]
            discount_cheapest = r["data"]["cheapest"]["price"]["discount"]["absolute"]
            currency = r["data"]["cheapest"]["price"]["currency"]["name"]["default"]
            title, image = emag_get_title_and_image(product_str)
            return {
                "id": product_sku,
                "price": current_cheapest_price,
                "prp": recommeded_cheapest_sales_price,
                "fdp": current_fastest_delivery_price,
                "discount": discount_cheapest,
                "currency": currency,
                "title": title,
                "imageUrl": image,
            }
        except Exception:
            return emag_get_fd_data(product_str, product_sku)
    elif "/fd/" in product_str:
        return emag_get_fd_data(product_str, product_sku)


def emag_get_title_and_image(product_str: str) -> dict[str, str]:
    session = requests.Session()
    product_url = f"https://emag.ro/{product_str}"
    cookies = get_coookies(product_url)
    load_cookies(session, cookies)
    response = session.get(
        product_url,
        # cookies=cookies_html,
        headers=headers_html,
        params=params_html,
        # impersonate="chrome",
    )
    tree = HTMLParser(response.text)
    title: str = tree.css_first("h1.page-title").text().strip()
    # rprint(title)
    image: str = tree.css_first(
        'img.bg-onaccent[data-test="main-product-gallery"]'
    ).attrs["src"]
    # rprint(image)

    return [title, image]


def altex_get_product_data(product_str: str) -> dict:
    product_sku = product_str.split("/")[2]
    # print(product_sku)
    response = cureq.get(
        f"https://fenrir.altex.ro/catalog/product/store_availability/{product_sku}/",
        # cookies=cookies_altex,
        headers=headers_altex,
        impersonate="chrome",
    )
    # print(response)
    r = response.json()
    return {
        "id": product_sku,
        "price": r["product"]["price"],
        "prp": r["product"]["regular_price"],
        "fdp": None,
        "discount": (
            r["product"]["regular_price"] - r["product"]["price"]
            if r["product"]["discount_type"] == "fixed"
            else None
        ),
        "currency": None,
        "title": r["product"]["name"],
        "imageUrl": "https://lcdn.altex.ro/" + r["product"]["small_image"],
    }


# rprint(
#     altex_get_product_data(
#         "trotineta-electrica-myria-urban-electric-vehicle-my7047-10-inch-negru/cpd/TROMY7047/"
#     )
# )
# rprint(requests.get('https://sapi.emag.ro/products/D40VN2MBM/fastest-cheapest-offers', params=params_offers, impersonate="chrome").json()
# rprint(
#     emag_get_offer_data(
#         "telefon-mobil-apple-iphone-se-3-64gb-5g-starlight-mmxg3rm-a/pd/DBPRWJMBM/"
#     )
# )
# rprint(
#     emag_get_offer_data(
#         "trotineta-electrica-xiaomi-mi-electric-scooter-pro-2-putere-motor-300-w-autonomie-max-45-km-viteza-maxima-25-km-h-negru-fbc4025gl/pd/D94003MBM/"
#     )
# )

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Union
from defs import (
    # emag_get_search_data,
    emag_get_offer_data,
    altex_get_product_data,
    # emag_get_title_and_image,
)


class Product(BaseModel):
    id: str
    price: Union[float, None]
    prp: Union[float, None]
    fdp: Union[float, None]
    discount: Union[float, None]
    currency: str
    title: str
    imageUrl: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # For development only. In production, specify your app's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/product/emag/{product_str:path}", response_model=Product)
def get_product_data(product_str: str):
    return emag_get_offer_data(product_str)


@app.get("/product/altex/{product_str:path}", response_model=Product)
def get_product_data(product_str: str):
    return altex_get_product_data(product_str)

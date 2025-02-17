from fastapi import FastAPI
from typing import Union
from defs import emag_get_search_data, emag_get_offer_data

PORT = 8000
app = FastAPI(PORT)


@app.get("/")
def read_root():
    return {"Hello": "World"}

import logging
from os import getenv
import os
from bmuapi.api.auth import auth
from bmuapi.api import api
from dotenv import load_dotenv
from flask import Flask, abort
from bmuapi.database.database import init_db

load_dotenv('.env')

logging.basicConfig(level=logging.DEBUG)
# init db stuff
init_db()

app = Flask(__name__)

api.register_blueprint(auth)
app.register_blueprint(api)


@app.route('/')
def app_home():
    abort(400)
import logging
from bmuapi.api.auth import auth
from bmuapi.api import api
from dotenv import load_dotenv
from flask import Flask, abort

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

api.register_blueprint(auth)
app.register_blueprint(api)


@app.route('/')
def app_home():
    abort(400)

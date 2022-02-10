from flask import Flask, abort
from bmuapi.api import api
from bmuapi.api.auth import auth
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

api.register_blueprint(auth)
app.register_blueprint(api)


@app.route('/')
def app_home():
    abort(400)

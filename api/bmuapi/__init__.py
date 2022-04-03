import logging
from bmuapi.api.money.move import move
from bmuapi.api.money.account import account
from bmuapi.api.money import money
from bmuapi.api.auth import auth
from bmuapi.api.user import user
from bmuapi.api import api
from dotenv import load_dotenv
from flask import Flask, abort
from bmuapi.database.database import init_db

load_dotenv('.env')

logging.basicConfig(level=logging.DEBUG)
# init db stuff
init_db()

app = Flask(__name__)

money.register_blueprint(account)
money.register_blueprint(move)
api.register_blueprint(auth)
api.register_blueprint(user)
api.register_blueprint(money)
app.register_blueprint(api)


@app.route('/')
def app_home():
    abort(400)

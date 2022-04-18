import logging
from bmuapi.api.money.move import move
from bmuapi.api.money.account import account
from bmuapi.api.money.bills import bills
from bmuapi.api.money import money
from bmuapi.api.auth import auth
from bmuapi.api.user import user
from bmuapi.api import api
from dotenv import load_dotenv
from flask import Flask, abort
from flask_apscheduler import APScheduler
from bmuapi.database.database import init_db


class Config:
    SCHEDULER_API_ENABLED = False  # if true, then people can control jobs... why


load_dotenv('.env')

logging.basicConfig(level=logging.DEBUG)
# init db stuff
init_db()

app = Flask(__name__)
app.config.from_object(Config())

money.register_blueprint(account)
money.register_blueprint(move)
money.register_blueprint(bills)
api.register_blueprint(auth)
api.register_blueprint(user)
api.register_blueprint(money)
app.register_blueprint(api)

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@app.route('/')
def app_home():
    abort(400)

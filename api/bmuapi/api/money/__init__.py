from flask import Blueprint, abort

money = Blueprint('money', __name__, url_prefix='/money')


@money.route('/')
def money_home():
    abort(400)

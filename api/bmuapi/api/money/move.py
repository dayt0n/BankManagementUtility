from flask import Blueprint, abort

move = Blueprint('move', __name__, url_prefix='/move')


@move.route('/')
def move_home():
    abort(400)

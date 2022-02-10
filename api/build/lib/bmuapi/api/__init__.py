from flask import Blueprint, abort

api = Blueprint('api', __name__, url_prefix='/api')


@api.route('/')
def api_home():
    abort(400)

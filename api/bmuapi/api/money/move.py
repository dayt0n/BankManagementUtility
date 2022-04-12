from flask import Blueprint, abort, request

from bmuapi.utils import requires_auth

move = Blueprint('move', __name__, url_prefix='/move')


@move.route('/')
def move_home():
    abort(400)


@move.route('/transfer', methods=["POST"])
@requires_auth
def transfer(token):
    data = dict(request.get_json())
    if not all(k in data for k in ('from', 'to', 'amount')):
        abort(500)
    # do user checks here
    # then call transfer_op

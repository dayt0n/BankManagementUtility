from flask import Blueprint, abort, request

from bmuapi.utils import requires_auth
from bmuapi.database.ops import transfer_op
from bmuapi.api.api_utils import success, error

move = Blueprint('move', __name__, url_prefix='/move')


@move.route('/')
def move_home():
    abort(400)


@move.route('/transfer', methods=["POST"])
@requires_auth
def transfer(token):
    data = dict(request.get_json())
    if not all(k in data for k in ('from', 'amount')):
        abort(500)
    fromID = int(data['from'])
    amount = int(data['amount'])
    if amount <= 0: # hashtag security
        return error(f"Invalid transfer amount: {amount}")
    if 'to' in data:
        toID = int(data['to'])
    if 'comment' in data:
        comment = data['comment']
    
    # TODO: CHECK HERE IF USER OWNS FROM ACCOUNT
    transfer_op(amount,)
    # do user checks here
    # then call transfer_op

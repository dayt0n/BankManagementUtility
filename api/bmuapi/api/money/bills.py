from flask import Blueprint, abort, request

from bmuapi.utils import requires_auth
from bmuapi.database.ops import transfer_op
from bmuapi.api.api_utils import success, error
from bmuapi.utils import teller_or_account_owner_only

bills = Blueprint('bills', __name__, url_prefix='/bills')


@bills.route('/')
def move_home():
    abort(400)


@bills.route('/pay/<accountNum>', methods=["POST"])
@teller_or_account_owner_only
def pay(token, accountNum):
    data = dict(request.get_json())
    if not all(k in data for k in ('amount', 'payee')):
        abort(500)
    amount = float(data['amount'])
    payee = data['payee']
    ret = transfer_op(amount, fromAccount=int(accountNum),
                      comment=payee)
    if isinstance(ret, float) and ret == amount:
        return success(f"Payed ${amount} from {accountNum} to {payee}.")
    return error(ret)

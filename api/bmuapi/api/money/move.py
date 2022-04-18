from flask import Blueprint, abort, request

from bmuapi.utils import requires_auth
from bmuapi.database.ops import transfer_op
from bmuapi.api.api_utils import success, error
from bmuapi.utils import get_account_owner, teller_only

move = Blueprint('move', __name__, url_prefix='/move')


@move.route('/')
def move_home():
    abort(400)


@move.route('/transfer', methods=["POST"])
@requires_auth
def transfer(token):
    data = dict(request.get_json())
    if not all(k in data for k in ('from', 'amount', 'to')):
        abort(500)
    fromID = int(data['from'])
    amount = float(data['amount'])
    toID = int(data['to'])
    comment = None
    if 'comment' in data:
        comment = data['comment']
    fromOwner = get_account_owner(fromID)
    if fromOwner.role != 'customer':
        return error(f"Account type of {fromOwner.role} cannot use accounts.")
    if token['role'] == 'customer' and fromOwner.username != token['user']:
        return error(f"User does not own the account {fromID}")
    toOwner = get_account_owner(toID)
    if toOwner.role != 'customer':
        return error(f"Account type of {toOwner.role} cannot use accounts.")
    ret = transfer_op(amount, fromAccount=fromID,
                      toAccount=toID, comment=comment)
    if isinstance(ret, float) and ret == amount:
        return success(f"Transferred ${amount} from {fromID}.")
    return error(ret)


@move.route('/deposit/<accountNum>', methods=["POST"])
@teller_only
def deposit(token, accountNum):
    data = dict(request.get_json())
    if 'amount' not in data:
        return error("No amount specified.")
    amount = float(data['amount'])
    owner = get_account_owner(accountNum)
    if owner.role != 'customer':
        return error(f"Account type of {owner.role} cannot use accounts.")
    ret = transfer_op(amount, toAccount=int(accountNum),
                      comment="Teller Deposit")
    if isinstance(ret, float) and ret == amount:
        return success(f"Deposited ${amount} to {accountNum}.")
    return error(ret)


@move.route('/withdraw/<accountNum>', methods=["POST"])
@teller_only
def withdraw(token, accountNum):
    data = dict(request.get_json())
    if 'amount' not in data:
        return error("No amount specified.")
    amount = float(data['amount'])
    owner = get_account_owner(accountNum)
    if owner.role != 'customer':
        return error(f"Account type of {owner.role} cannot use accounts.")
    ret = transfer_op(amount, fromAccount=int(accountNum),
                      comment="Teller Withdraw")
    if isinstance(ret, float) and ret == amount:
        return success(f"Withdrew ${amount} from {accountNum}.")
    return error(ret)

from flask import Blueprint, abort, request
from api.bmuapi.utils import admin_or_teller_only

account = Blueprint('account', __name__, url_prefix='/account')


@account.route('/')
def api_home():
    abort(400)


@account.route('/create', methods=["POST"])
@admin_or_teller_only
def create(token):
    data = dict(request.get_json())

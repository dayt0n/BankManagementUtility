import functools
import logging
from flask import Blueprint, abort, jsonify, request
from bmuapi.jwt_auth.token import encode_user_auth_token, decode_user_auth_token, is_token_expired

from bmuapi.database.database import db

auth = Blueprint('auth', __name__, url_prefix='/auth')


def requires_auth(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        at = request.headers.get('x-access-token')
        if at and (token := decode_user_auth_token(at)):
            logging.debug(token)
            if not is_token_expired(token):
                return func(*args, **kwargs)
        abort(403)
    return wrapper


@auth.route('/')
def auth_home():
    abort(400)


@auth.route('/login', methods=['POST'])
def login():
    data = dict(request.get_json())
    if 'username' not in data or 'password' not in data:
        abort(500)
    username = data['username']
    password = data['password']
    # do database verification here with username, password

    verifyFailed = False  # just a placeholder

    # if verification failed, do not give auth token
    if verifyFailed:
        return jsonify({"status": "failed"})
    # otherwise, give auth token
    t = encode_user_auth_token(username, 'teller')
    return jsonify({"status": "success", "auth": t})


# registration can be a two-step process.
# this first part can be the initial information processing.
# once this function finishes, it can send an email to the user to confirm that it is valid.
@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if ('username' not in data or
        'password' not in data or
        'firstName' not in data or
        'lastName' not in data or
            'email' not in data):
        abort(500)

    # do database entry things here

    # try to send verification email here

    return jsonify({"status": "success"})


@auth.route('/check', methods=['POST'])
@requires_auth
def check_auth():
    return jsonify({'status': 'success'})

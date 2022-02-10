import logging
from flask import Blueprint, abort, jsonify, request
from bmuapi.jwt_auth.token import encode_user_auth_token, decode_user_auth_token

auth = Blueprint('auth', __name__, url_prefix='/auth')


@auth.route('/')
def auth_home():
    abort(400)


@auth.route('/login', methods=['POST'])
def login():
    if 'username' not in request.form or 'password' not in request.form:
        abort(500)
    username = request.form['username']
    password = request.form['password']
    # do database verification here
    verifyFailed = False  # just a placeholder

    # if verification failed, do not give auth token
    if verifyFailed:
        return jsonify({"status": "failed"})
    # otherwise, give auth token
    t = encode_user_auth_token(username, 'teller')
    return jsonify({"status": "success", "auth": t})

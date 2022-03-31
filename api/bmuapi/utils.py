import functools
from flask import request, abort
import logging
from bmuapi.jwt_auth.token import decode_user_auth_token, is_token_expired
import re

emailDomainRegex = re.compile(r"^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$")


def requires_auth(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        at = request.cookies.get('session')
        if at and (token := decode_user_auth_token(at)):
            if not is_token_expired(token):
                return func(*args, **kwargs, token=token)
        abort(403)
    return wrapper


def admin_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(token, *args, **kwargs):
        if token['role'] == "administrator":
            return func(*args, **kwargs, token=token)
        abort(403)
    return wrapper


def admin_or_current_user_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(username, token, *args, **kwargs):
        if token['role'] != 'administrator' and username != token['user']:
            return func(*args, **kwargs, token=token)
        abort(403)
    return wrapper

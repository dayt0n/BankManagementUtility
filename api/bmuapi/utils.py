import functools
from random import randint
from flask import request, abort
import logging
from bmuapi.jwt_auth.token import decode_user_auth_token, is_token_expired
from bmuapi.database.database import SessionManager
from bmuapi.api.api_utils import error
import re

from bmuapi.database.tables import User, UserAccount

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


def teller_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(token, *args, **kwargs):
        if token['role'] in ("teller", "administrator"):
            return func(*args, **kwargs, token=token)
        abort(403)
    return wrapper


def admin_or_teller_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(token, *args, **kwargs):
        if token['role'] in ("teller", "administrator"):
            return func(*args, **kwargs, token=token)
        abort(403)
    return wrapper


def teller_or_current_user_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(username, token, *args, **kwargs):
        if token['role'] in ("teller", "administrator") or username == token['user']:
            return func(*args, **kwargs, username=username, token=token)
        abort(403)
    return wrapper


def get_account_owner(accountNum, session=None):
    with SessionManager(commit=False) as sess:
        if session:
            sess = session
        acct = sess.query(UserAccount).filter(
            UserAccount.accountNum == accountNum).first()
        if not acct:
            return None
        user = sess.query(User).filter(User.id == acct.userID).first()
        if not user:
            return None
        return user


def teller_or_account_owner_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(accountNum, token, *args, **kwargs):
        owner = get_account_owner(accountNum)
        if token['role'] in ("teller", "administrator") or owner.username == token['user']:
            if owner.role != 'customer':
                error(
                    f"Account {accountNum} should not belong to a non-customer. Please contact an admin.")
            return func(*args, **kwargs, accountNum=accountNum, token=token)
        abort(403)
    return wrapper


def admin_or_current_user_only(func):
    @functools.wraps(func)
    @requires_auth
    def wrapper(username, token, *args, **kwargs):
        if token['role'] == 'administrator' or username == token['user']:
            return func(*args, **kwargs, username=username, token=token)
        abort(403)
    return wrapper


def random_int_of_size(size):
    return randint(10**(size-1), (10**size)-1)

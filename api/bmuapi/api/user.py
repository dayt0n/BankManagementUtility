from flask import Blueprint, abort, request
from bmuapi.utils import requires_auth, admin_or_current_user_only, admin_only
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import User
from bmuapi.api.api_utils import success, error

user = Blueprint('user', __name__, url_prefix='/user')


@user.route('/')
def auth_home():
    abort(400)


@user.route('/info/<username>')
@admin_or_current_user_only
def info(username, token):
    with SessionManager(commit=False) as sess:
        usr = sess.query(User).filter(
            User.username == username).first()
        if not usr:
            return error(f"User '{username}' not found.")
        usrDict = usr._asdict()
        # return everything except the password hash, no reason anyone ever needs to know that
        del usrDict['password']
        return success(usrDict)


@user.route('/delete/<username>')
@admin_only
def delete(username, token):
    with SessionManager() as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User '{username}' not found.")
        sess.delete(usr)
    return success(f"deleted '{username}'")

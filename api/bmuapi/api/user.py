from flask import Blueprint, abort, request
from bmuapi.utils import admin_or_current_user_only, admin_or_teller_only, admin_only, emailDomainRegex
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import User
from bmuapi.api.api_utils import success, error
import re
from passlib.hash import sha512_crypt
import phonenumbers


user = Blueprint('user', __name__, url_prefix='/user')


@user.route('/')
def user_home():
    abort(400)


@user.route('/info/<username>', methods=["GET"])
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


@user.route('/list', methods=["GET"])
@admin_or_teller_only
def list(token):
    with SessionManager(commit=False) as sess:
        users = [usr for usr in sess.query(User.username).all()]
    return success(users)


@user.route('/delete/<username>', methods=["GET"])
@admin_only
def delete(username, token):
    with SessionManager() as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User '{username}' not found.")
        sess.delete(usr)
    return success(f"deleted '{username}'")


@user.route('/edit/<username>', methods=["POST"])
@admin_or_current_user_only
def edit(username, token):
    data = dict(request.get_json())
    with SessionManager() as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if 'email' in data:
            email = data['email'].strip()
            emailValidCheck = re.fullmatch(emailDomainRegex, email)
            if not emailValidCheck:
                return error("Incorrect email format")
            usr.email = email
        if 'password' in data:  # TODO: what if user provides empty password?
            usr.password = sha512_crypt.hash(data['password'].strip())
        if 'phone' in data:
            try:
                phoneParsed = phonenumbers.parse(data['phone'], 'US')
            except phonenumbers.phonenumberutil.NumberParseException:
                return error("Invalid phone number")
            if not phonenumbers.is_valid_number(phoneParsed):
                return error("Invalid phone number")
            phone = phonenumbers.format_number(phoneParsed, 0)
            usr.phone = phone
        if 'address' in data:
            usr.address = data['address'].strip()
        if 'username' in data:
            usr.username = data['username'].strip()
    return success(f"Updated account details for {username}")

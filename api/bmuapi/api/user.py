import logging
from flask import Blueprint, abort, request
from bmuapi.utils import admin_or_current_user_only, admin_or_teller_only, admin_only, emailDomainRegex, teller_or_current_user_only
from bmuapi.database.database import SessionManager, get_money_account
from bmuapi.database.tables import User, UserAccount, CheckingSavings, CreditCard, Mortgage
from bmuapi.api.api_utils import success, error
import re
from passlib.hash import sha512_crypt
import phonenumbers


user = Blueprint('user', __name__, url_prefix='/user')


@user.route('/')
def user_home():
    abort(400)


@user.route('/info/<username>', methods=["GET"])
@teller_or_current_user_only
def info(username, token):
    with SessionManager(commit=False) as sess:
        usr = sess.query(User).filter(
            User.username == username).first()
        if not usr:
            return error(f"User '{username}' not found.")
        usrDict = usr._asdict()
        # return everything except the password hash and ssn, no reason anyone ever needs to know that
        del usrDict['password']
        del usrDict['ssn']
        return success(usrDict)


@user.route('/list', methods=["GET"])
@admin_or_teller_only
def list(token):
    # TODO: sort alphabetically, but separate by role
    with SessionManager(commit=False) as sess:
        if token["role"] == "administrator":
            tellers = [usr._asdict() for usr in sess.query(
                User.username, User.role, User.name).filter(User.role == "teller").order_by(User.name).all()]
            users = [usr._asdict() for usr in sess.query(
                User.username, User.role, User.name).filter(User.role == "customer").order_by(User.name).all()]
            users = tellers + users
        else:
            users = [usr._asdict() for usr in sess.query(
                User.username, User.role, User.name).filter(User.role == "customer").order_by(User.name).all()]
        logging.debug(users)
    return success(users)


@ user.route('/delete/<username>', methods=["GET"])
@ admin_only
def delete(username, token):
    # TODO: individual account checks for balance == 0
    with SessionManager() as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User '{username}' not found.")
        if usr.role == "administrator":
            return error(f"Admin cannot delete another admin.")
        sess.delete(usr)
    return success(f"deleted '{username}'")


@ user.route('/edit/<username>', methods=["POST"])
@ admin_or_current_user_only
def edit(username, token):
    data = dict(request.get_json())
    # TODO: if teller or admin, name can be changed (firstName, lastName)
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


@ user.route('/accounts/<username>', methods=["GET"])
@ teller_or_current_user_only
def accounts(username, token):
    with SessionManager(commit=False) as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User {username} not found")
        usrId = usr.id
        accounts = sess.query(UserAccount).filter(
            UserAccount.userID == usrId).all()
        if not accounts:
            return error(f"User {username} has no accounts")
        realAccounts = []
        for account in accounts:
            # find linked accounts in other tables
            actualAccount = get_money_account(account)
            if not actualAccount:
                return error("Error looking up account. Please contact an administrator.")
            dictAccount = actualAccount._asdict()
            dictAccount['accountNum'] = account.accountNum
            if 'accountType' not in dictAccount:
                dictAccount['accountType'] = account.accountType
            realAccounts.append(dictAccount)
        return success(realAccounts)


@ user.route('/changeRole/<username>/<role>')
@ admin_only
def change_role(username, role, token):
    if role not in ("customer", "teller", "administrator"):
        return error(f"Bad role: '{role}'.")
    with SessionManager() as sess:
        # not sure there is a good way to stop admins from de-admining other admins
        # but maybe that would be necessary if a customer somehow mistakenly becomes an admin
        # I will just leave it like this for now
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User {username} not found")
        oldRole = usr.role
        usr.role = role
    return success(f"Changed {username}'s role from {oldRole} to {role}")

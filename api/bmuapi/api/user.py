import logging
from operator import and_
import arrow
from flask import Blueprint, abort, request
from bmuapi.utils import admin_or_current_user_only, teller_only, admin_or_teller_only, admin_only, emailDomainRegex, teller_or_current_user_only
from bmuapi.database.database import SessionManager, get_money_account
from bmuapi.database.tables import User, UserAccount, CheckingSavings, CreditCard, Mortgage, UserInterest
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
        if token['role'] == 'teller' and usr.role != 'customer':
            return error(f"Teller should not access information about account of type {usr.role}.")
        usrDict = usr._asdict()
        # return everything except the password hash and ssn, no reason anyone ever needs to know that
        del usrDict['password']
        del usrDict['ssn']
        return success(usrDict)


@user.route('/list', methods=["GET"])
@admin_or_teller_only
def list(token):
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
    return success(users)


@user.route('/delete/<username>', methods=["GET"])
@admin_only
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


@user.route('/edit/<username>', methods=["POST"])
@teller_or_current_user_only
def edit(username, token):
    data = dict(request.get_json())
    with SessionManager() as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if token['role'] == 'teller' and usr.role != 'customer':
            return error(f"Teller does not have permission to edit account of type {usr.role}.")
        if 'email' in data:
            email = data['email'].strip()
            emailValidCheck = re.fullmatch(emailDomainRegex, email)
            if not emailValidCheck:
                return error("Incorrect email format")
            usr.email = email
        if 'password' in data:
            if data['password'].strip() == "":
                return error("Cannot set empty password.")
            # allow admin to reset password without knowing old
            if token['role'] == 'customer':
                if 'oldPassword' not in data:
                    return error("Please provide the old password to change the password for this account.")
                if not sha512_crypt.verify(data['oldPassword'].strip(), usr.password):
                    return error("Old password is not correct.")
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
        if token['role'] != 'customer':  # allow admin/teller to change name
            if 'firstName' in data and 'lastName' in data:
                usr.name = data['firstName'].strip() + " " + \
                    data['lastName'].strip()
            elif 'firstName' in data:
                usr.name = data['firstName'].strip() + " " + \
                    usr.name.rsplit(' ', 1)[1]
            elif 'lastName' in data:
                usr.name = usr.name.rsplit(' ', 1)[0] + " " + data['lastName']
    return success(f"Updated account details for {username}")


@user.route('/accounts/<username>', methods=["GET"])
@teller_or_current_user_only
def accounts(username, token):
    with SessionManager(commit=False) as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User {username} not found")
        if token['role'] == 'teller' and usr.role != 'customer':
            return error(f"Account of type {usr.role} should not have any accounts.")
        usrId = usr.id
        accounts = sess.query(UserAccount).filter(
            UserAccount.userID == usrId).all()
        if not accounts:
            return error(f"User {username} has no accounts")
        realAccounts = []
        for account in accounts:
            # find linked accounts in other tables
            actualAccount = get_money_account(account, session=sess)
            if not actualAccount:
                return error("Error looking up account. Please contact an administrator.")
            dictAccount = actualAccount._asdict()
            dictAccount['accountNum'] = account.accountNum
            if 'accountType' not in dictAccount:
                dictAccount['accountType'] = account.accountType
            realAccounts.append(dictAccount)
        return success(realAccounts)


@user.route('/changeRole/<username>/<role>')
@admin_only
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


@user.route('/interest/<username>', defaults={"year": None}, methods=["GET"])
@user.route('/interest/<username>/<year>', methods=["GET"])
@teller_only
def interest(username, year, token):
    with SessionManager() as sess:
        usr = sess.query(User).filter(User.username == username).first()
        if not usr:
            return error(f"User {username} not found")
        if year:
            userInterest = sess.query(UserInterest).filter(
                and_(UserInterest.userID == usr.id, UserInterest.year == int(year))).first()
        else:
            userInterest = sess.query(UserInterest).filter(
                UserInterest.userID == usr.id).order_by(UserInterest.year.desc()).all()
        if not userInterest:
            return error(f"User {username} does not have any interest recorded for the year {year}")
        if year:
            ret = userInterest._asdict()
            del ret['id']
            del ret['userID']
        else:
            ret = []
            for interest in userInterest:
                userInterestDict = interest._asdict()
                del userInterestDict['id']
                del userInterestDict['userID']
                ret.append(userInterestDict)
        return success(ret)

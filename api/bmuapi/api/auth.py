import logging
from flask import Blueprint, abort, request
from bmuapi.jwt_auth.token import encode_user_auth_token
from bmuapi.utils import requires_auth, emailDomainRegex
from bmuapi.database.database import SessionManager
from bmuapi.database.tables import User
from passlib.hash import sha512_crypt
from bmuapi.api.api_utils import error, success
import re
import phonenumbers
from sqlalchemy import or_


auth = Blueprint('auth', __name__, url_prefix='/auth')


@auth.route('/')
def auth_home():
    abort(400)


@auth.route('/login', methods=['POST'])
def login():
    data = dict(request.get_json())
    if not all(k in data for k in ('username', 'password')):
        abort(500)
    username = data['username']
    password = data['password']
    # do database verification here with username, password
    with SessionManager(commit=False) as sess:
        usr = sess.query(User).filter(User.username == username).first()
    if usr:
        if sha512_crypt.verify(password, usr.password):
            t = encode_user_auth_token(username, usr.role)
            return success({"token": t})
    return error("Incorrect login")


# registration can be a two-step process.
# this first part can be the initial information processing.
# once this function finishes, it can send an email to the user to confirm that it is valid.
@auth.route('/register', methods=['POST'])
def register():
    data = dict(request.get_json())
    reqKeys = ("username", "password", "firstName",
               "lastName", "email", "address", "phone")
    if not all(k in data for k in reqKeys):
        abort(500)
    username = data['username'].strip()
    password = data['password'].strip()
    email = data['email'].strip()
    name = data['firstName'].strip() + " " + data['lastName'].strip()
    address = data['address']
    phone = data['phone']
    try:
        phoneParsed = phonenumbers.parse(phone, 'US')
    except phonenumbers.phonenumberutil.NumberParseException:
        return error("Invalid phone number")
    if not phonenumbers.is_valid_number(phoneParsed):
        return error("Invalid phone number")
    phone = phonenumbers.format_number(phoneParsed, 0)
    # check for valid email
    emailValidCheck = re.fullmatch(emailDomainRegex, email)
    if not emailValidCheck:
        return error("Email is not valid")
    hashedPW = sha512_crypt.hash(password)  # hash password for storage
    with SessionManager() as sess:
        existingUsr = sess.query(User).filter(
            or_(User.email == email, User.username == username)).count()
        if existingUsr and existingUsr > 0:  # make sure user doesn't already exist
            return error(f"User with email '{email}' or username '{username}' already exists.")
        # add user to db
        sess.add(User(username=username, name=name,
                 email=email, password=hashedPW, role='customer', phone=phone, address=address))
    # TODO: try to send verification email here
    return success()


@auth.route('/check', methods=['POST', 'GET'])
@requires_auth
def check_auth(token):
    return success({'user': token['user']})

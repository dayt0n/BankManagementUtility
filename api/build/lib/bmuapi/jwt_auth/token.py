import logging
import os
from arrow import get, utcnow
import jwt


def jwt_secret(): return os.getenv('API_SECRET_KEY')


def encode_user_auth_token(username, role):
    t = {
        'user': username,
        'role': role,
        'expiration': utcnow().shift(hours=+4).isoformat()
    }
    return jwt.encode(
        t,
        jwt_secret(),
        algorithm='HS256'
    )


def decode_user_auth_token(tok):
    try:
        return jwt.decode(tok, jwt_secret(), algorithms=['HS256'])
    except:
        return None


def is_token_expired(tok):
    if not isinstance(tok, dict):
        try:
            tok = jwt.decode(tok, jwt_secret(), algorithms=['HS256'])
        except:
            return True

    if get(tok['expiration']) <= utcnow():
        return True
    return False

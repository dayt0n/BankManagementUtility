import logging
import os
import jwt


def jwt_secret(): return os.getenv('API_SECRET_KEY')


def encode_user_auth_token(username, role):
    t = {
        'user': username,
        'role': role,
    }
    return jwt.encode(
        t,
        jwt_secret(),
        algorithm='HS256'
    )


def decode_user_auth_token(tok):
    return jwt.decode(tok, jwt_secret(), algorithms=['HS256'])

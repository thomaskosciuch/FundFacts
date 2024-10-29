from json import dumps
from typing import Optional
import functools

from flask import request, session
import jwt

from config.auth_tools import decode_jwt


def login_required(view) -> None:
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        bearer: Optional[str] = request.headers.get('Authorization', None)
        if bearer is None:
            raise AssertionError('no bearer token')
        token = bearer.split(" ")[1]
        try:
            decoded_token = decode_jwt(token)
            payload = decoded_token.get('payload')
            user_info = {
                "user_id": payload.get("sub"),
                "username": payload.get("name"),
                "email": payload.get("preferred_username"),
                "roles": payload.get("roles", [])
            }
            session['user_info'] = user_info
            print(dumps(session['user_info'], indent=2))
            return view(**kwargs)
        except jwt.ExpiredSignatureError:
            raise jwt.ExpiredSignatureError
        except jwt.InvalidTokenError as e:
            raise e
    return wrapped_view

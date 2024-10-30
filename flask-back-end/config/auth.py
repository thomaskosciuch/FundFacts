import functools

from flask import request, session
import jwt

from config.auth_tools import decode_jwt
from config.is_active_user import is_user_active


def login_required(view) -> None:
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if request.method == "OPTIONS":
            return '', 200

        auth_header = request.headers.get('Authorization')
        print(f"Received Authorization Header: {auth_header}")
        print()

        if auth_header is None:
            print("No Authorization header found.")
            return {"error": "Authorization header is missing."}, 401

        try:
            token = auth_header.split(" ")[1]  # This assumes a "Bearer" token
        except IndexError:
            print("Invalid Authorization header format.")
            return {"error": "Invalid Authorization header format."}, 401

        try:
            decoded_token = decode_jwt(token)
            payload = decoded_token.get('payload')
            email = payload.get("preferred_username")

            user_info = {
                "user_id": payload.get("sub"),
                "username": payload.get("name"),
                "email": email,
                "roles": payload.get("roles", []),
                "authorized": is_user_active(email)
            }

            session['user_info'] = user_info
            return view(**kwargs)
        except jwt.ExpiredSignatureError:
            return {"error": "Token has expired."}, 403
        except jwt.InvalidTokenError as e:
            print(f"Invalid token error: {e}")
            return {"error": "Invalid token."}, 403

    return wrapped_view

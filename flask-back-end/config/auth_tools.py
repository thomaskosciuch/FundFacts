from base64 import urlsafe_b64decode
from json import loads
from typing import Any, Dict


def base64_url_decode(input_str: str) -> bytes:
    padding = '=' * (4 - len(input_str) % 4)
    return urlsafe_b64decode(input_str + padding)


def decode_jwt(token: str) -> Dict[str, Any]:
    header_enc, payload_enc, signature_enc = token.split(".")

    header = loads(base64_url_decode(header_enc).decode("utf-8"))
    payload = loads(base64_url_decode(payload_enc).decode("utf-8"))

    return {
        "header": header,
        "payload": payload,
        "signature": signature_enc
    }

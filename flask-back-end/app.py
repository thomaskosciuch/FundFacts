from resources.upload_excel import upload_excel
from json import dumps
from config.auth import login_required
from flask import Flask, request, session, jsonify
from flask_cors import CORS


import logging
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
CORS(app, resources={r"/authorization": {
    "allow_headers": ["Authorization"],
    "expose_headers": ["Authorization"],
}}, supports_credentials=True)

app.secret_key = 'slimaki_w_nowej_zenlandji'


@app.route('/authorization/', methods=["GET", "OPTIONS"])
@login_required
def authorization():
    if request.method == 'OPTIONS':
        response = jsonify()
        return response

    is_authorized = session.get('user_info', {}).get('is_authorized', False)

    if is_authorized:
        status_code = 200
    else:
        status_code = 403  # Use 403 Forbidden for unauthorized access

    print("User Info:", dumps(session.get('user_info', {}), indent=2))
    return jsonify(session.get('user_info', {})), status_code


@app.route('/upload/', methods=["POST", "OPTIONS"])
def upload():
    return upload_excel()


if __name__ == '__main__':
    app.run(debug=True, port=5000)

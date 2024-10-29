from flask import Flask, session, jsonify
from flask_cors import CORS

from config.auth import login_required

app = Flask(__name__)
app.secret_key = 'slimaki_w_nowej_zenlandji'
CORS(app)


@app.route('/authorization')
@login_required
def index():
    return jsonify(session['user_info']), 200


if __name__ == '__main__':
    app.run(debug=True)

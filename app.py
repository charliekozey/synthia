from flask import Flask, make_response, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from models import User, Patch, Favorite, Oscillator
from database import db

app = Flask(__name__)
CORS(app, resources={
    r"/oscillators/*": {"origins": "http://127.0.0.1:5500"},
    r"/patches/*": {"origins": "http://127.0.0.1:5500"}
})

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/synthia-db'

migrate = Migrate(app, db)

db.init_app(app)

@app.route('/')
def hello():
    return "Hello, World!"


@app.get('/users')
def index_users():
    users = User.query.all()
    user_dicts = [user.to_dict() for user in users]
    
    # for user in user_dicts:
    #     for patch in user['patches']:
    #         print(patch)
            # user['patches'] = [patch.to_dict() for patch in user['patches']]

    # return ""
    return make_response(jsonify(user_dicts), 200)


@app.get('/patches')
def index_patches():
    patches = Patch.query.all()
    patch_dicts = [patch.to_dict() for patch in patches]

    return make_response(jsonify(patch_dicts), 200)


@app.patch('/oscillators/<id>')
def update_oscillator(id):
    params = request.get_json()
    oscillator = Oscillator.query.get(id)
    data = request.json

    if oscillator is None:
        return jsonify({"message": "Patch not found"}), 404
    if 'gain' in data:
        oscillator.gain = data['gain']

    db.session.commit()

    return jsonify({"message": f"Oscillator {oscillator.number} of {oscillator.patch.name} updated to {data['gain']}"}), 200

if __name__ == '__main__':
    app.run(port=4000, debug=True)
from flask import Flask, make_response, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from models import User, Patch, Oscillator
from database import db

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/new-synthia'

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


@app.get('/users/<id>')
def show_user(id):
    user = User.query.get(id)
    user_dict = user.to_dict()

    return make_response(jsonify(user_dict), 200)


@app.get('/patches')
def index_patches():
    patches = Patch.query.all()
    patch_dicts = [patch.to_dict() for patch in patches]

    return make_response(jsonify(patch_dicts), 200)


@app.patch('/patches/<id>')
def update_patch(id):
    patch = Patch.query.get(id)

    if patch is None:
        return jsonify({"message": "Patch not found"}), 404

    data = request.get_json()

    def update_oscillator(osc):
        oscillator = Oscillator.query.get(osc['id'])
        oscillator.type = osc['osc_type']
        oscillator.gain = osc['gain']
        oscillator.attack = osc['attack']
        oscillator.decay = osc['decay']
        oscillator.sustain = osc['sustain']
        oscillator.release = osc['release']

        db.session.add(oscillator)
        db.session.commit()

        print("\n")
        print("\n")
        print("\n")
        print("\n")
        print("\n")
        print("\n")
        print("THIS IS THE OSC", oscillator)
        print("\n")
        print("\n")
        print("\n")
        print("\n")
        print("\n")
        print("\n")

    if 'name' in data:
        patch.name = data['name']
    if 'oscillators' in data:
        for osc in data['oscillators']:
            update_oscillator(osc)
            # db.session.commit()

    # patch.update(data)
    db.session.commit()
    return jsonify({"message": f"patch updated successfully"}), 200


if __name__ == '__main__':
    app.run(port=4000, debug=True)
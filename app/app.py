from flask import Flask, make_response, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_restful import Resource, Api
from models import User, Patch, Oscillator
from database import db
from pprint import pprint
from os import environ
# from seed import seed_data

app = Flask(__name__)
CORS(app, origins=[environ.get('CLIENT_URL')], supports_credentials=True)

app.secret_key = b'\xfc\xceRXDr\t]3\xed\x0f\x8e\xadg\xcb<'
app.config['SQLALCHEMY_DATABASE_URI'] = environ.get('DB_URL')
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True

db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)


class IndexResource(Resource):
    def get(self):
        return {'message': 'Hello, this is the base URL!'}

class Login(Resource):
    def post(self):
        name = request.get_json()['name']
        user = User.query.filter(User.name == name).first()
        
        session['user_id'] = user.id
        print("USER ID:", session['user_id'])

        # if user is None:
        #     user = User(name=request.json['name'])
        #     db.session.add(user)
        #     db.session.commit()
            
        return user.to_dict(), 201

class Signup(Resource):
    def post(self):
        name = request.get_json()['name']
        password = request.get_json()['password']
        user = User(name = name, password = password)
        db.session.add(user)
        db.session.commit()
        
        session['user_id'] = user.id
        print("SIGNUP USER ID:", session['user_id'])
            
        return user.to_dict(), 201

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {'message': 'Logged out'}, 200

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        
        print(user_id)
        if user_id:
            print("found a user")
            user = User.query.filter(User.id == user_id).first()
            payload = jsonify(user.to_dict())
            return make_response(payload, 200)
        else:
            return {'message': '401: Not Authorized'}, 401

class IndexPatch(Resource):
    def get(self):
        patches = Patch.query.order_by(Patch.id).all()
        patch_dicts = [patch.to_dict() for patch in patches]
        payload = jsonify(patch_dicts)
        return make_response(payload, 200)

    def post(self):
        data = request.get_json()

        patch = Patch()
        patch_oscillators = []

        for osc in data['oscillators']:
            new_osc = Oscillator(
                osc_type = osc['osc_type'],
                gain = osc['gain'],
                attack = osc['attack'],
                decay = osc['decay'],
                sustain = osc['sustain'],
                release = osc['release'],
                number = osc['number'],
            )
            print(osc)
            patch_oscillators.append(new_osc)

        patch.name = data['name']
        patch.oscillators = patch_oscillators
        patch.user = data['creator']
        patch.creator_id = data['creator_id']

        db.session.add(patch)
        db.session.commit()

        return make_response(jsonify(patch.to_dict()), 200)

class ShowPatch(Resource):
    def patch(self, id):
        patch = Patch.query.get(id)

        if patch is None:
            return make_response(jsonify({"message": "Patch not found"}), 404)

        data = request.get_json()   

        if 'name' in data:
            patch.name = data['name']
        
        if 'oscillators' in data:
            for patchOsc in patch.oscillators:
                for dataOsc in data['oscillators']:
                    if patchOsc.number == dataOsc['number']:
                        patchOsc.osc_type = dataOsc['osc_type']
                        patchOsc.gain = dataOsc['gain']
                        patchOsc.attack = dataOsc['attack']
                        patchOsc.decay = dataOsc['decay']
                        patchOsc.sustain = dataOsc['sustain']
                        patchOsc.release = dataOsc['release']
                    
        db.session.add(patch)
        db.session.commit()

        return make_response(jsonify(patch.to_dict()), 200)

@app.get('/users')
def index_users():
    users = User.query.order_by(User.id).all()
    user_dicts = [user.to_dict() for user in users]
    
    return make_response(jsonify(user_dicts), 200)

@app.get('/users/<int:id>')
def show_user(id):
    user = User.query.get(id)

    return make_response(jsonify(user.to_dict()), 200)

@app.get('/oscillators')
def index_oscillators():
    oscillators = Oscillator.query.order_by(Oscillator.id).all()
    osc_dicts = [osc.to_dict() for osc in oscillators]

    return make_response(jsonify(osc_dicts), 200)

@app.route('/')
def index():
    return 'Hello, this is the base URL!'

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckSession, '/check_session')
api.add_resource(IndexPatch, '/patches')
api.add_resource(ShowPatch, '/patches/<int:id>')
api.add_resource(IndexResource, '/')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
#         seed_data()
    app.run(host="0.0.0.0", port=5000, debug=True)
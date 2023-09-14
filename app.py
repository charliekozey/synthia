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

@app.get('/oscillators')
def index_oscillators():
    oscillators = Oscillator.query.all()
    osc_dicts = [osc.to_dict() for osc in oscillators]
    
    # for user in user_dicts:
    #     for patch in user['patches']:
    #         print(patch)
            # user['patches'] = [patch.to_dict() for patch in user['patches']]

    # return ""
    return make_response(jsonify(osc_dicts), 200)


@app.get('/patches')
def index_patches():
    patches = Patch.query.all()
    patch_dicts = [patch.to_dict() for patch in patches]

    return make_response(jsonify(patch_dicts), 200)

@app.patch('/patches/<int:id>')
def update_patch(id):
    patch = Patch.query.get(id)

    if patch is None:
        return jsonify({"message": "Patch not found"}), 404

    data = request.get_json()

    ####### OLD VERSION ################################
    # def update_oscillator(osc):
    #     try:
    #         oscillator = Oscillator.query.get(osc['id'])
    #         if oscillator:
    #             oscillator.type = osc['osc_type']
    #             oscillator.gain = osc['gain']
    #             oscillator.attack = osc['attack']
    #             oscillator.decay = osc['decay']
    #             oscillator.sustain = osc['sustain']
    #             oscillator.release = osc['release']
    #             db.session.add(oscillator)
    
    #             print(osc['osc_type'])
    #             print(osc['gain'])
    #             print(osc['attack'])
    #             print(osc['decay'])
    #             print(osc['sustain'])
    #             print(osc['release'])
    #         else:
    #             print(f"Oscillator with ID {osc['id']} not found.")
    #     except Exception as e:
    #         print(f"Error updating oscillator: {str(e)}")

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

    return jsonify({"message": f"Patch updated successfully"}), 200


if __name__ == '__main__':
    app.run(port=4000, debug=True)
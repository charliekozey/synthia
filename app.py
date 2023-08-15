from flask import Flask, make_response, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models import User, Patch, Favorite, Oscillator
from database import db

app = Flask(__name__)
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
    
    for user in user_dicts:
        for patch in user['patches']:
            print(patch)
            # user['patches'] = [patch.to_dict() for patch in user['patches']]

    return ""
    # return make_response(jsonify(user_dicts), 200)

# @app.get('/patches')

if __name__ == '__main__':
    app.run(port=4000, debug=True)
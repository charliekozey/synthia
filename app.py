from flask import Flask
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

if __name__ == '__main__':
    app.run(port=5432, debug=True)
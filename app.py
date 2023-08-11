from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://charliekozey-flatiron:password@localhost/synthia-db'  # Replace with your PostgreSQL connection details
db = SQLAlchemy(app)

# Import models
from models import User, Patch, Favorite, Oscillator

@app.route('/')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(debug=True)

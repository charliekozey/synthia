from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin

db = SQLAlchemy(metadata=metadata)

from app import db

# Association table for many-to-many relationship between User and Patch
favorite_patch_association = db.Table(
    'favorite_patch_association',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('patch_id', db.Integer, db.ForeignKey('patch.id'), primary_key=True)
)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    patches = db.relationship('Patch', back_populates='user', lazy=True)
    favorite_patches = db.relationship('Patch', secondary=favorite_patch_association, back_populates='favorited_by', lazy=True)

class Patch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='patches')
    favorited_by = db.relationship('User', secondary=favorite_patch_association, back_populates='favorite_patches', lazy=True)
    oscillators = db.relationship('Oscillator', back_populates='patch', lazy=True)

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    patch_id = db.Column(db.Integer, db.ForeignKey('patch.id'), nullable=False)

class Oscillator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    patch_id = db.Column(db.Integer, db.ForeignKey('patch.id'), nullable=False)
    patch = db.relationship('Patch', back_populates='oscillators')

if __name__ == '__main__':
    db.create_all()
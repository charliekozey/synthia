from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from database import db

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    serialize_rules = ('-favorites.user',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(50), nullable=True)
    patches = db.relationship('Patch', back_populates='creator', lazy=True)
    favorites = db.relationship('Favorite', back_populates='user', cascade='all, delete-orphan')

class Patch(db.Model, SerializerMixin):
    __tablename__ = "patches"

    serialize_rules = ('-oscillators.patch', '-favorites.patch', '-creator.patches')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    creator = db.relationship('User', back_populates='patches')
    oscillators = db.relationship('Oscillator', back_populates='patch', lazy=True)
    favorites = db.relationship('Favorite', back_populates='patch', cascade='all, delete-orphan')

class Oscillator(db.Model, SerializerMixin):
    __tablename__ = "oscillators"

    serialize_rules = ('-patch',)

    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer, nullable=False)
    osc_type = db.Column(db.String(20), nullable=False)
    gain = db.Column(db.Numeric(precision=3, scale=2), nullable=False)
    attack = db.Column(db.Numeric(precision=3, scale=2), nullable=False)
    decay = db.Column(db.Numeric(precision=3, scale=2), nullable=False)
    sustain = db.Column(db.Numeric(precision=3, scale=2), nullable=False)
    release = db.Column(db.Numeric(precision=3, scale=2), nullable=False)
    patch_id = db.Column(db.Integer, db.ForeignKey('patches.id'), nullable=False)
    patch = db.relationship('Patch', back_populates='oscillators', cascade='delete')

class Favorite(db.Model, SerializerMixin):
    __tablename__ = "favorites"

    serialize_only = ('user_id', 'patch_id')

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patch_id = db.Column(db.Integer, db.ForeignKey('patches.id'), nullable=False)
    user = db.relationship('User', back_populates='favorites')
    patch = db.relationship('Patch', back_populates='favorites')    

if __name__ == '__main__':
    db.create_all()
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from database import db

# favorite_patch_association = db.Table(
#     'favorite_patch_association',
#     db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
#     db.Column('patch_id', db.Integer, db.ForeignKey('patches.id'), primary_key=True)
# )

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    patches = db.relationship('Patch', back_populates='user', lazy=True)
    # favorite_patches = db.relationship('Patch', secondary=favorite_patch_association, back_populates='favorited_by', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "patches": self.patches
        }

class Patch(db.Model):
    __tablename__ = "patches"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user = db.relationship('User', back_populates='patches')
    # favorited_by = db.relationship('User', secondary=favorite_patch_association, back_populates='favorite_patches', lazy=True)
    # oscillators = db.relationship('Oscillator', back_populates='patch', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
        }

class Favorite(db.Model):
    __tablename__ = "favorites"
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # patch_id = db.Column(db.Integer, db.ForeignKey('patches.id'), nullable=False)

class Oscillator(db.Model):
    __tablename__ = "oscillators"
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    # patch_id = db.Column(db.Integer, db.ForeignKey('patches.id'), nullable=False)
    # patch = db.relationship('Patch', back_populates='oscillators', cascade='delete')

if __name__ == '__main__':
    db.create_all()
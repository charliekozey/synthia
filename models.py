from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from database import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    patches = db.relationship('Patch', back_populates='creator', lazy=True)
    favorites = db.relationship('Favorite', back_populates='user', cascade='all, delete-orphan')

    def to_dict(self, include_patches=True, include_fav=True):
        user_dict = {
            "id": self.id,
            "name": self.name,
        }

        if include_patches:
            user_dict["patches"] = [patch.to_dict() for patch in self.patches]

        if include_fav:
            user_dict["favorite_patches"] = [patch.to_dict() for patch in self.favorites]

        return user_dict

class Patch(db.Model):
    __tablename__ = "patches"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    creator = db.relationship('User', back_populates='patches')
    oscillators = db.relationship('Oscillator', back_populates='patch', lazy=True)
    favorites = db.relationship('Favorite', back_populates='patch', cascade='all, delete-orphan')

    def to_dict(self, include_creator=True, include_fav=True):

        patch_dict =  {
            "id": self.id,
            "name": self.name,
            "oscillators": [osc.to_dict() for osc in self.oscillators],
        }

        if include_creator:
            patch_dict["creator"] = self.creator.to_dict(include_patches=False)

        if include_fav:
            patch_dict["favorited_by"] = [user.to_dict(include_fav=False) for user in self.favorites]

        return patch_dict

class Oscillator(db.Model):
    __tablename__ = "oscillators"

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

    def to_dict(self):
        return {
            "id": self.id,
            "number": self.number,
            "osc_type": self.osc_type,
            "gain": self.gain,
            "attack": self.attack,
            "decay": self.decay,
            "sustain": self.sustain,
            "release": self.release,
        }

class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patch_id = db.Column(db.Integer, db.ForeignKey('patches.id'), nullable=False)
    user = db.relationship('User', back_populates='favorites')
    patch = db.relationship('Patch', back_populates='favorites')    

    def to_dict(self, include_fav=True):
        return {
            "user_name": self.user.name,
            "id": self.user.id,
            "patch_name": self.patch.name,
            "patch_id": self.patch.id,
            "user_id": self.user.id
        }

if __name__ == '__main__':
    db.create_all()
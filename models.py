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
    patches = db.relationship('Patch', back_populates='creator', lazy=True)
    favorite_patches = db.relationship('Patch', secondary="favorites", back_populates='favorited_by', lazy=True)

    def to_dict(self, include_patches=True):
        user_dict = {
            "id": self.id,
            "name": self.name,
            "favorite_patches": [patch.to_dict() for patch in self.favorite_patches]
        }

        if include_patches:
            user_dict["patches"] = [patch.to_dict() for patch in self.patches]

        return user_dict

class Patch(db.Model):
    __tablename__ = "patches"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    creator = db.relationship('User', back_populates='patches')
    oscillators = db.relationship('Oscillator', back_populates='patch', lazy=True)
    favorited_by = db.relationship('User', secondary="favorites", back_populates='favorite_patches', lazy=True)

    def to_dict(self, include_creator=True, include_fav=True):

        patch_dict =  {
            "id": self.id,
            "name": self.name,
            "oscillators": [osc.to_dict() for osc in self.oscillators],
        }

        if include_creator:
            patch_dict["creator"] = self.creator.to_dict(include_patches=False)

        if include_fav:
            patch_dict["favorited_by"] = [user.to_dict(include_fav=False) for user in self.favorited_by]

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

if __name__ == '__main__':
    db.create_all()
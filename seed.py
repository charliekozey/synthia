from models import User, Patch, Favorite, Oscillator
from decimal import Decimal
from database import db
from faker import Faker
from random import choice, random

def seed_data():
# if __name__ == '__main__':
# with app.app_context():
    print("🗑 Clearing db... ")
    Oscillator.query.delete()
    Favorite.query.delete()
    Patch.query.delete()
    User.query.delete()

    fake = Faker()

    print("🌱 Seeding Users...")
    users = []
    for i in range(10):
        user = User(name=fake.user_name())
        users.append(user)
    db.session.add_all(users)
    db.session.commit()

    print("🌱 Seeding Patches...")
    patches = []
    osc_types = ["sine", "triangle", "square", "sawtooth"]
    for i in range(20):
        user = choice(users)
        patch = Patch(name=fake.color_name(), creator_id=user.id, oscillators=[])
        oscillator1 = Oscillator(
                number=1, 
                osc_type=choice(osc_types), 
                gain=round(random(), 2), 
                attack=round(random(), 2), 
                decay=round(random(), 2), 
                sustain=round(random(), 2), 
                release=round(random(), 2)
        )
        oscillator2 = Oscillator(
                number=2, 
                osc_type=choice(osc_types), 
                gain=round(random(), 2), 
                attack=round(random(), 2), 
                decay=round(random(), 2), 
                sustain=round(random(), 2), 
                release=round(random(), 2)
        )
        oscillator3 = Oscillator(
                number=3, 
                osc_type=choice(osc_types), 
                gain=round(random(), 2), 
                attack=round(random(), 2), 
                decay=round(random(), 2), 
                sustain=round(random(), 2), 
                release=round(random(), 2)
        )

        patch.oscillators.append(oscillator1)
        patch.oscillators.append(oscillator2)
        patch.oscillators.append(oscillator3)
        
        patches.append(patch)

    db.session.add_all(patches)
    db.session.commit()

    print("🌱 Seeding Favorites...")
    for i in range(50):
        favs = []
        fav = Favorite(patch_id=choice(patches).id, user_id=choice(users).id) 
        favs.append(fav)
        db.session.add_all(favs)
        db.session.commit()

    # print("🌱 Seeding Oscillators...")


    print("Done seeding!")

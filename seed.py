from models import User, Patch, Favorite, Oscillator
from app import app
from database import db
from faker import Faker
from random import choice

if __name__ == '__main__':
    with app.app_context():
        print("🗑 Clearing db... ")
        Patch.query.delete()
        User.query.delete()
        # Favorite.query.delete()
        # Oscillator.query.delete()

        fake = Faker()

        print("🌱 Seeding Users...")
        users = [User(name = "Naomi"), User(name="Jojo"), User(name="Katie")]

        db.session.add_all(users)
        db.session.commit()

        print("🌱 Seeding Patches...")
        patches = []
        for i in range(20):
            user = choice(users)
            patch = Patch(name=fake.color_name(), user_id=user.id)
            patches.append(patch)
        
        # print("🌱 Seeding Favorites...")
        # print("🌱 Seeding Oscillators...")

        db.session.add_all(patches)
        db.session.commit()

        print("Done seeding!")

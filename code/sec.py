# Import the Flask-Security datastore interface for SQLAlchemy integration
from flask_security import SQLAlchemyUserDatastore
# Import database models and configuration
from models import db, User, Role


# Creates a user datastore instance to manage users and roles using SQLAlchemy
datastore = SQLAlchemyUserDatastore(db, User, Role)


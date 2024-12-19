# Core imports for database and user authentication
from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

# Initialize SQLAlchemy instance
db = SQLAlchemy()

# Association Models
class RolesUsers(db.Model):
    """
    Junction table for many-to-many relationship between Users and Roles
    Enables role-based access control (RBAC)
    """
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

# Base User Model with authentication capabilities
class User(db.Model, UserMixin):
    """
    Core user model incorporating Flask-Security features
    Serves as the parent model for both Customer and Professional
    """
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    
    # Relationship with Role model through association table
    roles = db.relationship(
        'Role', 
        secondary='roles_users',
        backref=db.backref('users', lazy='dynamic')
    )

    # Method to check user type
    def get_user_type(self):
        """Returns the type of user (customer or professional)"""
        return 'customer' if hasattr(self, 'customer') else 'professional'

# User Type Models
class Customer(db.Model):
    """
    Customer profile model
    Extends User model functionality for service requesters
    """
    id = db.Column(db.Integer(), primary_key=True)
    full_name = db.Column(db.String(255))
    address = db.Column(db.String(255))
    pincode = db.Column(db.Integer())
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    
    # Add relationship to associated service requests
    service_requests = db.relationship('ServiceRequest', backref='customer_profile')

class Professional(db.Model):
    """
    Service Professional profile model
    Extends User model functionality for service providers
    """
    id = db.Column(db.Integer(), primary_key=True)
    full_name = db.Column(db.String(255))
    service = db.Column(db.String(255))
    experience = db.Column(db.String(255))
    address = db.Column(db.String(255))
    pincode = db.Column(db.Integer())
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    active = db.Column(db.Boolean())
    
    # Add relationship to assigned service requests
    assigned_services = db.relationship('ServiceRequest', backref='professional_profile')

# Role Management
class Role(db.Model, RoleMixin):
    """
    Role model for implementing RBAC
    Defines different access levels and permissions
    """
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __repr__(self):
        return f'<Role {self.name}>'

# Service Related Models
class Service(db.Model):
    """
    Service catalog model
    Defines available services and their details
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    price = db.Column(db.Integer(), nullable=False)
    time_required = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=False)

    # Add relationship to service requests
    requests = db.relationship('ServiceRequest', backref='service_details')

    def to_dict(self):
        """Converts service object to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'price': self.price,
            'description': self.description
        }

class ServiceRequest(db.Model):
    """
    Service request model
    Tracks service bookings and their lifecycle
    """
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'))
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'))
    professional_id = db.Column(db.Integer, db.ForeignKey('professional.id'))
    date_of_request = db.Column(db.String())
    date_of_completion = db.Column(db.String())
    rating = db.Column(db.Integer())
    remarks = db.Column(db.String())
    service_status = db.Column(db.String())

    @property
    def status_display(self):
        """Returns human-readable service status"""
        status_map = {
            'pending': 'Pending Assignment',
            'assigned': 'Professional Assigned',
            'completed': 'Service Completed',
            'cancelled': 'Service Cancelled'
        }
        return status_map.get(self.service_status, self.service_status)
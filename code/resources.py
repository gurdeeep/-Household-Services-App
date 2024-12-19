from flask_restful import Resource, Api, reqparse, marshal, fields
from flask_security import auth_required, roles_required, current_user
from models import Service, Customer, User, Professional, ServiceRequest, db
from werkzeug.security import generate_password_hash
from sec import datastore
from datetime import datetime
from instances import cache
from typing import Dict, List, Union, Optional

# Initialize Flask-RESTful API with prefix
api = Api(prefix='/api')

# Request parsers for different endpoints
class RequestParsers:
    @staticmethod
    def create_service_parser() -> reqparse.RequestParser:
        """Parser for service creation and updates"""
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('price', type=int, required=True)
        parser.add_argument('time_required', type=str, required=True)
        parser.add_argument('description', type=str, required=True)
        return parser

    @staticmethod
    def create_customer_parser() -> reqparse.RequestParser:
        """Parser for customer registration"""
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('full_name', type=str, required=True)
        parser.add_argument('address', type=str, required=True)
        parser.add_argument('pincode', type=int, required=True)
        return parser

    @staticmethod
    def create_professional_parser() -> reqparse.RequestParser:
        """Parser for professional registration"""
        parser = reqparse.RequestParser()
        parser.add_argument('email', type=str, required=True)
        parser.add_argument('password', type=str, required=True)
        parser.add_argument('full_name', type=str, required=True)
        parser.add_argument('service', type=str, required=True)
        parser.add_argument('experience', type=str, required=True)
        parser.add_argument('address', type=str, required=True)
        parser.add_argument('pincode', type=int, required=True)
        return parser

# Response field definitions for marshalling
class ResponseFields:
    service_fields = {
        "id": fields.Integer,
        "name": fields.String,
        "price": fields.Integer,
        "time_required": fields.String,
        "description": fields.String
    }

    customer_fields = {
        "id": fields.Integer,
        "full_name": fields.String,
        "address": fields.String,
        "pincode": fields.Integer,
        "user_id": fields.Integer
    }

    professional_fields = {
        "id": fields.Integer,
        "full_name": fields.String,
        "experience": fields.String,
        "service": fields.String,
        "active": fields.Boolean
    }

    service_request_fields = {
        "id": fields.Integer,
        "service_id": fields.Integer,
        "customer_id": fields.Integer,
        "professional_id": fields.Integer,
        "date_of_request": fields.String,
        "date_of_completion": fields.String,
        "rating": fields.Integer,
        "remarks": fields.String,
        "service_status": fields.String
    }

# Service management endpoints
class Services(Resource):
    """Endpoint for listing and creating services"""
    def __init__(self):
        self.parser = RequestParsers.create_service_parser()

    @auth_required("token")
    @cache.cached(timeout=50)
    def get(self) -> Dict:
        """Retrieve all services (cached for 50 seconds)"""
        services = Service.query.all()
        return marshal(services, ResponseFields.service_fields)

    @auth_required("token")
    @roles_required("admin")
    def post(self) -> Dict:
        """Create a new service (admin only)"""
        service_data = self.parser.parse_args()
        new_service = Service(**service_data)
        db.session.add(new_service)
        db.session.commit()
        return {"message": "Service Created"}

class UpdateService(Resource):
    """Endpoint for updating specific services"""
    def __init__(self):
        self.parser = RequestParsers.create_service_parser()

    @auth_required('token')
    @roles_required('admin')
    def get(self, id: int) -> Dict:
        """Retrieve specific service details"""
        service = Service.query.get(id)
        return marshal(service, ResponseFields.service_fields)

    def post(self, id: int) -> Dict:
        """Update specific service details"""
        service = Service.query.get(id)
        update_data = self.parser.parse_args()
        for key, value in update_data.items():
            setattr(service, key, value)
        db.session.commit()
        return {"message": "Service Updated"}

# User management endpoints
class Customers(Resource):
    """Endpoint for customer management"""
    def __init__(self):
        self.parser = RequestParsers.create_customer_parser()

    @auth_required('token')
    @roles_required('admin')
    def get(self) -> Dict:
        """List all customers (admin only)"""
        customers = Customer.query.all()
        if not customers:
            return {"message": "No User Found"}, 404
        return marshal(customers, ResponseFields.customer_fields)

    def post(self) -> Dict:
        """Register a new customer"""
        customer_data = self.parser.parse_args()
        
        # Create user account
        user = datastore.create_user(
            email=customer_data.email,
            password=generate_password_hash(customer_data.password),
            roles=['customer']
        )
        
        # Create customer profile
        customer = Customer(
            full_name=customer_data.full_name,
            address=customer_data.address,
            pincode=customer_data.pincode,
            user_id = User.query.filter_by(email=customer_data.email).all()[0].id
        )
        db.session.add(customer)
        db.session.commit()
        return {"message": "Customer Added"}

class Professionals(Resource):
    """Endpoint for professional service provider management"""
    def __init__(self):
        self.parser = RequestParsers.create_professional_parser()

    @auth_required('token')
    @roles_required('admin')
    def get(self) -> Dict:
        """List all professionals (admin only)"""
        professionals = Professional.query.all()
        if not professionals:
            return {"message": "No User Found"}, 404
        return marshal(professionals, ResponseFields.professional_fields)

    def post(self) -> Dict:
        """Register a new professional"""
        prof_data = self.parser.parse_args()
        
        # Create user account (inactive by default)
        user = datastore.create_user(
            email=prof_data.email,
            password=generate_password_hash(prof_data.password),
            roles=['professional'],
            active=False
        )
        # print(user.id)
        # print(user)
        
        # Create professional profile
        professional = Professional(
            full_name=prof_data.full_name,
            service=prof_data.service,
            experience=prof_data.experience,
            address=prof_data.address,
            pincode=prof_data.pincode,
            user_id = User.query.filter_by(email=prof_data.email).all()[0].id,
            active=False
        )
        db.session.add(professional)
        db.session.commit()
        return {"message": "Professional Added"}

# Service request management
class ServiceRequests(Resource):
    """Endpoint for managing service requests"""
    def get(self) -> Dict:
        """List all service requests and available services"""
        requests = ServiceRequest.query.all()
        services = Service.query.all()
        
        if not requests:
            return {"message": "No User Found"}, 404
            
        return {
            'service_requests': marshal(requests, ResponseFields.service_request_fields),
            'services': marshal(services, ResponseFields.service_fields)
        }

    def post(self) -> Dict:
        """Create a new service request"""
        parser = reqparse.RequestParser()
        parser.add_argument('service_id', type=int)
        parser.add_argument('customer_id', type=int)
        data = parser.parse_args()
        
        customer = Customer.query.filter_by(user_id=data.customer_id).first()
        service_request = ServiceRequest(
            service_id=data.service_id,
            customer_id=customer.id,
            date_of_request=datetime.now().strftime("%d/%m/%y"),
            service_status='requested'
        )
        db.session.add(service_request)
        db.session.commit()
        return {"message": "Service Request Added"}

class AcceptServiceRequest(Resource):
    """Endpoint for accepting or rejecting service requests"""
    def get(self, id: int) -> Dict:
        """Reject a service request"""
        request = ServiceRequest.query.get(id)
        request.professional_id = None
        request.service_status = 'requested'
        db.session.commit()
        return {"message": "Service Request Rejected"}

    def post(self, id: int) -> Dict:
        """Accept a service request"""
        parser = reqparse.RequestParser()
        parser.add_argument('professional_id', type=int)
        data = parser.parse_args()
        
        request = ServiceRequest.query.get(id)
        print(request)
        print(data.professional_id)
        request.professional_id = data.professional_id
        request.service_status = 'assigned'
        db.session.commit()
        return {"message": "Service Request Accepted"}


class ServiceRequestByCustomer(Resource):
    """Endpoint for retrieving customer-specific service requests"""
    def post(self) -> Dict:
        """Get all service requests for a specific customer"""
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        data = parser.parse_args()
        
        customer = Customer.query.filter_by(user_id=data.user_id).first()
        requests = ServiceRequest.query.filter_by(customer_id=customer.id).all()
        services = Service.query.all()
        
        return {
            'service_requests': marshal(requests, ResponseFields.service_request_fields),
            'services': marshal(services, ResponseFields.service_fields)
        }

class CloseServiceRequest(Resource):
    """Endpoint for closing service requests with ratings and remarks"""
    def post(self, id: int) -> Dict:
        """Close a service request with rating and remarks"""
        parser = reqparse.RequestParser()
        parser.add_argument('rating', type=int, required=True)
        parser.add_argument('remarks', type=str)
        data = parser.parse_args()
        
        request = ServiceRequest.query.get(id)
        request.rating = data.rating
        request.remarks = data.remarks
        request.date_of_completion = datetime.now().strftime("%d/%m/%y")
        request.service_status = 'closed'
        db.session.commit()
        return {"message": "Service Request Closed"}

# Register all resources with the API
api.add_resource(Services, '/services')
api.add_resource(Customers, '/customers')
api.add_resource(Professionals, '/professionals')
api.add_resource(UpdateService, '/update/service/<int:id>')
api.add_resource(ServiceRequests, '/request/service')
api.add_resource(AcceptServiceRequest, '/accept/service-request/<int:id>')
api.add_resource(ServiceRequestByCustomer, '/service-request/customer')
api.add_resource(CloseServiceRequest, '/close/service-request/<int:id>')
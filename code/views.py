# from flask import current_app as app, jsonify, request, render_template, send_file
# from flask_security import auth_required, roles_required
# from werkzeug.security import check_password_hash
# from flask_restful import marshal, fields
# import flask_excel as excel
# from celery.result import AsyncResult
# from models import User, Professional, Service, Customer, ServiceRequest, db
# from sec import datastore
# import os,io,csv
# from flask import make_response

# @app.get('/')
# def home():
#     return render_template("index.html")

# @app.get('/admin')
# @auth_required("token")
# @roles_required("admin")
# def admin():
#     return "Welcome Admin"

# @app.get('/activate/professional/<int:pro_id>')
# @auth_required("token")
# @roles_required("admin")
# def activate_professional(pro_id):
#     professional = Professional.query.get(pro_id)
#     user_professional = User.query.get(professional.user_id)
#     # print(f"Professional: {professional}")
#     # print(f"User Professional: {user_professional}")
#     if not user_professional or "professional" not in user_professional.roles:
#         return jsonify({"message": "Professional Not Found"}), 404
    
#     user_professional.active = True
#     professional.active = True
#     db.session.commit()
#     return jsonify({"message": "User Activated"})

# @app.post('/user-login')
# def user_login():
#     data = request.get_json()
#     email = data.get('email')
#     if not email:
#         return jsonify({"message": "Email Not Provided"}), 400
    
#     user = datastore.find_user(email=email)
#     if not user:
#         return jsonify({"message": "User Not Found"}), 404
    
#     if check_password_hash(user.password, data.get("password")):
#         return jsonify({"id": user.id, "token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "active": user.active})
#     else:
#         return jsonify({"message" :"Wrong Password"}), 400

# @app.get('/delete/service/<int:id>')
# @auth_required('token')
# @roles_required('admin')
# def del_service(id):
#     service = Service.query.get(id)
#     db.session.delete(service)
#     db.session.commit()
#     return jsonify({"message": "Service Deleted"})

# @app.get('/delete/professional/<int:id>')
# @auth_required('token')
# @roles_required('admin')
# def del_professional(id):
#     professional = Professional.query.get(id)
#     user_id = professional.user_id
#     db.session.delete(professional)
#     professional = User.query.get(user_id)
#     db.session.delete(professional)
#     db.session.commit()
#     return jsonify({"message": "Professional Deleted"})

# @app.get('/delete/customer/<int:id>')
# @auth_required('token')
# @roles_required('admin')
# def del_customer(id):
#     customer = Customer.query.get(id)
#     user_id = customer.user_id
#     db.session.delete(customer)
#     customer = User.query.get(user_id)
#     db.session.delete(customer)
#     db.session.commit()
#     return jsonify({"message": "Customer Deleted"})

# @app.get('/service-details/<int:id>')
# def service_details(id):
#     service_request = ServiceRequest.query.get(id)
#     service = Service.query.get(service_request.service_id)
#     professional = Professional.query.get(service_request.professional_id)
#     print(service_request.service_status)
#     if(service_request.service_status in ['requested','assigned']):
#         return jsonify({"name": service.name, "description": service.description, "professional": professional.full_name})
#     if(service_request.service_status=='closed'):
#         return jsonify({"name": service.name, "description": service.description, "professional": professional.full_name, "rating": service_request.rating, "remarks": service_request.remarks})

# # @app.get('/download-csv')
# # def download_csv():
# #     task = create_service_request_csv.delay()
# #     return jsonify({"task-id": task.id})

# # @app.get('/get-csv/<task_id>')
# # def get_csv(task_id):
# #     res = AsyncResult(task_id)
# #     if res.ready():
# #         filename = res.result
# #         return send_file(filename, as_attachment=True)
# #     else:
# #         return jsonify({"message": "Task Pending"}), 404

# # @app.get('/get-csv/<task_id>')
# # def get_csv(task_id):
# #     res = AsyncResult(task_id)
# #     if res.ready():
# #         if res.successful():
# #             filename = res.result
# #             if os.path.exists(filename):
# #                 return send_file(filename, as_attachment=True)
# #             else:
# #                 return jsonify({"message": "File not found"}), 404
# #         else:
# #             return jsonify({"message": "Task Failed"}), 500
# #     else:
# #         return jsonify({"message": "Task Pending"}), 202

# @app.route('/export-closed-requests', methods=['GET'])
# def export_closed_requests():
#     # Query closed service requests from the database
#     closed_requests = ServiceRequest.query.filter_by(service_status="closed").all()

#     # Check if there are any closed requests
#     if not closed_requests:
#         return {"message": "No closed service requests found."}, 404

#     # Prepare the CSV data
#     csv_output = io.StringIO()
#     writer = csv.writer(csv_output)
#     writer.writerow(["Service ID", "Customer ID", "Professional ID", "Date of Request","Date of Completion", "Rating", "Remarks"])

#     for request in closed_requests:
#         writer.writerow([
#             request.service_id,
#             request.customer_id,
#             request.professional_id,
#             request.date_of_request,
#             request.date_of_completion,
#             request.rating or "N/A",
#             request.remarks or "N/A"
#         ])

#     csv_output.seek(0)

#     # Create a response with the CSV file
#     response = make_response(csv_output.getvalue())
#     response.headers['Content-Disposition'] = 'attachment; filename=closed_requests.csv'
#     response.headers['Content-Type'] = 'text/csv'

#     return response
    
# @app.get('/test')
# def test():
#     service_requests = ServiceRequest.query.with_entities(ServiceRequest.service_id).all()
#     service_ids = []
#     for service_request in service_requests:
#         service_ids.append(service_request.service_id)
#     most_frequnt = max(set(service_ids), key=service_ids.count)
#     return jsonify({"message": "OK"})

# @app.get('/api/search/services')
# def search_services():
#     query = request.args.get('q', '')
#     services = Service.query.filter(Service.name.ilike(f'%{query}%')).all()
#     return jsonify({'services': [service.to_dict() for service in services]})
from flask import current_app as app, jsonify, request, render_template, send_file, make_response
from flask_security import auth_required, roles_required
from werkzeug.security import check_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from models import User, Professional, Service, Customer, ServiceRequest, db
from sec import datastore
import os, io, csv

# Basic Routes
@app.get('/')
def home():
    """Renders the main application homepage"""
    return render_template("index.html")

@app.get('/test')
def test():
    """Analytics endpoint to find most requested service"""
    service_requests = ServiceRequest.query.with_entities(ServiceRequest.service_id).all()
    service_ids = [request.service_id for request in service_requests]
    most_frequent = max(set(service_ids), key=service_ids.count)
    return jsonify({"message": "OK"})

# Authentication Routes
@app.post('/user-login')
def user_login():
    """Authenticates users and returns JWT token"""
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"message": "Email Not Provided"}), 400
    
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message": "User Not Found"}), 404
    
    if check_password_hash(user.password, data.get("password")):
        return jsonify({
            "id": user.id,
            "token": user.get_auth_token(),
            "email": user.email,
            "role": user.roles[0].name,
            "active": user.active
        })
    return jsonify({"message": "Wrong Password"}), 400

# Admin Routes
@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    """Protected admin dashboard endpoint"""
    return "Welcome Admin"

@app.get('/activate/professional/<int:pro_id>')
@auth_required("token")
@roles_required("admin")
def activate_professional(pro_id):
    """Activates a professional's account"""
    professional = Professional.query.get(pro_id)
    user_professional = User.query.get(professional.user_id)
    
    if not user_professional or "professional" not in user_professional.roles:
        return jsonify({"message": "Professional Not Found"}), 404
    
    user_professional.active = professional.active = True
    db.session.commit()
    return jsonify({"message": "User Activated"})

# Deletion Routes - Protected Admin Functions
@app.get('/delete/service/<int:id>')
@auth_required('token')
@roles_required('admin')
def del_service(id):
    """Removes a service from the system"""
    service = Service.query.get(id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service Deleted"})

@app.get('/delete/professional/<int:id>')
@auth_required('token')
@roles_required('admin')
def del_professional(id):
    """Removes a professional and their user account"""
    professional = Professional.query.get(id)
    user_id = professional.user_id
    
    db.session.delete(professional)
    db.session.delete(User.query.get(user_id))
    db.session.commit()
    return jsonify({"message": "Professional Deleted"})

@app.get('/delete/customer/<int:id>')
@auth_required('token')
@roles_required('admin')
def del_customer(id):
    """Removes a customer and their user account"""
    customer = Customer.query.get(id)
    user_id = customer.user_id
    
    db.session.delete(customer)
    db.session.delete(User.query.get(user_id))
    db.session.commit()
    return jsonify({"message": "Customer Deleted"})

# Service Management Routes
@app.get('/service-details/<int:id>')
def service_details(id):
    """Retrieves detailed information about a service request"""
    service_request = ServiceRequest.query.get(id)
    service = Service.query.get(service_request.service_id)
    professional = Professional.query.get(service_request.professional_id)
    
    response = {
        "name": service.name,
        "description": service.description,
        "professional": professional.full_name
    }
    
    if service_request.service_status == 'closed':
        response.update({
            "rating": service_request.rating,
            "remarks": service_request.remarks
        })
    
    return jsonify(response)

@app.get('/api/search/services')
def search_services():
    """Searches services based on name using partial matching"""
    query = request.args.get('q', '')
    services = Service.query.filter(Service.name.ilike(f'%{query}%')).all()
    return jsonify({'services': [service.to_dict() for service in services]})

@app.route('/export-closed-requests', methods=['GET'])
def export_closed_requests():
    """Exports closed service requests to CSV"""
    closed_requests = ServiceRequest.query.filter_by(service_status="closed").all()
    
    if not closed_requests:
        return {"message": "No closed service requests found."}, 404
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Service ID", "Customer ID", "Professional ID",
        "Date of Request", "Date of Completion", "Rating", "Remarks"
    ])
    
    for request in closed_requests:
        writer.writerow([
            request.service_id, request.customer_id,
            request.professional_id, request.date_of_request,
            request.date_of_completion,
            request.rating or "N/A",
            request.remarks or "N/A"
        ])
    
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers.update({
        'Content-Disposition': 'attachment; filename=closed_requests.csv',
        'Content-Type': 'text/csv'
    })
    return response
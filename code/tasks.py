from worker import celery
from celery import shared_task
from jinja2 import Template
from mail_service import send_email
from datetime import datetime, timedelta
import csv
from models import *
import traceback


# @celery.task()
# def daily_reminder():
#     """
#     Sends daily reminders to professionals via email, reminding them of pending service requests.
#     """
#     try:
#         # Fetch all professionals
#         professionals = Professional.query.all()
#         print(professionals)

#         for professional in professionals:
#             # Check for pending service requests
#             pending_requests = ServiceRequest.query.filter_by(
#                 professional_id=professional.id,
#                 service_status='pending'
#             ).all()

#             if not pending_requests:
#                 print(f"No pending requests found for professional {professional.full_name} (ID: {professional.id})")
#                 continue

#             print(f"Found {len(pending_requests)} pending requests for professional {professional.full_name} (ID: {professional.id})")

#             # Prepare email content
#             with open('./templates/daily_reminder.html', 'r') as file:
#                 template = Template(file.read())

#             # Render template with professional and pending requests data
#             email_content = template.render(
#                 professional_name=professional.full_name,
#                 pending_requests=[
#                     {
#                         "customer": request.customer_profile.full_name if request.customer_profile else "Unknown",
#                         "service": request.service_details.name if request.service_details else "Unknown",
#                         "date_of_request": request.date_of_request or "Unknown",
#                     }
#                     for request in pending_requests
#                 ]
#             )

#             # Fetch the user's email
#             user = User.query.filter_by(id=professional.user_id).first()

#             # Send email
#             send_email(
#                 to_address=user.email,
#                 subject="Daily Reminder: Pending Service Requests",
#                 message=email_content,
#                 content="html"
#             )
#         return "Daily reminders sent successfully"

#     except Exception as e:
#         print(f"Error in daily_reminder task: {str(e)}")
#         print(traceback.format_exc())
#         return "Error in sending daily reminders"


# @celery.task()
# def monthly_reminder():
#     """
#     Sends a monthly activity report to customers via email, summarizing their service details.
#     """
#     try:
#         # Fetch all customers
#         customers = Customer.query.all()

#         for customer in customers:
#             # Fetch service requests for this customer
#             service_requests = ServiceRequest.query.filter_by(customer_id=customer.id).all()

#             # Summarize service details
#             total_requests = len(service_requests)
#             closed_requests = sum(1 for req in service_requests if req.service_status == 'completed')
#             pending_requests = sum(1 for req in service_requests if req.service_status == 'pending')

#             # Prepare email content
#             with open('./templates/monthly_report_consumer.html', 'r') as file:
#                 template = Template(file.read())

#             # Render template with service data
#             email_content = template.render(
#                 customer_name=customer.full_name,
#                 total_requests=total_requests,
#                 closed_requests=closed_requests,
#                 pending_requests=pending_requests,
#                 service_requests=[
#                     {
#                         "service": req.service_details.name if req.service_details else "Unknown",
#                         "professional": req.professional_profile.full_name if req.professional_profile else "Unknown",
#                         "date_of_request": req.date_of_request or "Unknown",
#                         "status": req.status_display
#                     }
#                     for req in service_requests
#                 ]
#             )

#             # Fetch the user's email
#             user = User.query.filter_by(id=customer.user_id).first()

#             # Send email
#             send_email(
#                 to_address=user.email,
#                 subject="Monthly Activity Report",
#                 message=email_content,
#                 content="html"
#             )

#         return "Monthly reports sent successfully"

#     except Exception as e:
#         print(f"Error in monthly_reminder task: {str(e)}")
#         print(traceback.format_exc())
#         return "Error in sending monthly reports"


@shared_task(ignore_result=True)
def monthly_reminder():
    # Calculate the first and last date of the previous month
    today = datetime.today()
    first_day_of_month = datetime(today.year, today.month, 1)
    first_day_of_last_month = first_day_of_month - timedelta(days=1)
    last_day_of_last_month = first_day_of_last_month.replace(day=1) - timedelta(days=1)

    # Query data
    services = Service.query.all()
    service_requests = ServiceRequest.query.filter(
        ServiceRequest.date_of_request >= first_day_of_last_month,
        ServiceRequest.date_of_request <= last_day_of_last_month
    ).all()
    
    # Aggregate data
    total_requests = len(service_requests)
    closed_requests = len([req for req in service_requests if req.service_status == 'completed'])
    pending_requests = len([req for req in service_requests if req.service_status == 'pending'])
    canceled_requests = len([req for req in service_requests if req.service_status == 'cancelled'])

    # Generate report for each service
    service_stats = []
    for service in services:
        requests = [req for req in service_requests if req.service_id == service.id]
        service_stats.append({
            'name': service.name,
            'total_requests': len(requests),
            'closed_requests': len([req for req in requests if req.service_status == 'completed']),
            'pending_requests': len([req for req in requests if req.service_status == 'pending']),
            'canceled_requests': len([req for req in requests if req.service_status == 'cancelled']),
        })
    
    # Load the external HTML template
    with open('report.html', 'r') as file:
        html_template = file.read()
    template = Template(html_template)
    
    # Render the template with the data
    rendered_report = template.render(
        month=last_day_of_last_month.strftime('%B %Y'),
        total_requests=total_requests,
        closed_requests=closed_requests,
        pending_requests=pending_requests,
        canceled_requests=canceled_requests,
        service_stats=service_stats
    )

    # Send the rendered report via email
    send_email(
        to="gurdeeprathee2002@gmail.com",  # Replace with the recipient's email
        subject="Monthly Service Report",
        body=rendered_report
    )

    return "Monthly Service Report Sent"



## WEBHOOK TASK ##

from json import dumps
from httplib2 import Http

@shared_task(ignore_result=False)
def daily_reminder():
    """
    Task to notify professionals with pending service requests via Google Chat.
    """
    try:
        # Query professionals with pending service requests
        professionals_with_pending_requests = db.session.query(Professional).join(ServiceRequest).filter(
            ServiceRequest.service_status == 'pending',
            ServiceRequest.professional_id == Professional.id
        ).all()

        if not professionals_with_pending_requests:
            return "No professionals with pending requests."

        for professional in professionals_with_pending_requests:
            # Count pending requests for the professional
            pending_count = db.session.query(ServiceRequest).filter(
                ServiceRequest.professional_id == professional.id,
                ServiceRequest.service_status == 'pending'
            ).count()

            # Send notification
            if pending_count > 0:
                send_notification(professional.full_name, pending_count)

        return "Notifications sent to professionals with pending requests."
    except Exception as e:
        print(f"Error in notify_pending_requests task: {e}")
        return f"Error in notify_pending_requests task: {e}"


def send_notification(professional_name, pending_count):
    """
    Sends a notification to a Google Chat space.
    """
    try:
        url = (
            "https://chat.googleapis.com/v1/spaces/AAAANMU0jwk/messages"
            "?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=cUPnm_cJmQ3x_Jk1MVSGrqVQj0SqSc9khr8Np4yxwjg"
        )
        app_message = {
            "text": f"Hello {professional_name},\n\nYou have {pending_count} pending service request(s). "
                    f"Please visit the platform to take appropriate action. Thank you!"
        }
        message_headers = {"Content-Type": "application/json; charset=UTF-8"}
        http_obj = Http()

        response, content = http_obj.request(
            uri=url,
            method="POST",
            headers=message_headers,
            body=dumps(app_message),
        )

        # Log the response
        if response.status == 200:
            print(f"Notification sent to {professional_name}.")
            return f"Notification sent to {professional_name}."
        else:
            print(f"Failed to send notification to {professional_name}. Response: {content}")
            return f"Failed to send notification to {professional_name}. Response: {content}"
    except Exception as e:
        print(f"Error in send_notification task: {e}")
        return f"Error in send_notification task: {e}"
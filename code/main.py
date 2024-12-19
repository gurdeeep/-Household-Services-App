from flask import Flask
from flask_security import Security
from models import db
from config import DevelopmentConfig
from resources import api
from sec import datastore
import flask_excel as excel
from instances import cache
from worker import celery, ContextTask
from flask_mail import Mail
from mailconfig import MAIL_SERVER, MAIL_PORT, MAIL_USE_TLS, MAIL_USE_SSL, MAIL_USERNAME, MAIL_PASSWORD
from tasks import monthly_reminder, daily_reminder

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    
    # Initialize extensions
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    cache.init_app(app)
    app.security = Security(app, datastore)


    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
    app.config['MAIL_USE_SSL'] = MAIL_USE_SSL
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
    
    mail=Mail(app)
    mail.init_app(app)
    with app.app_context():
        mail.connect()

    # Configure Celery Task
    celery.conf.update(
     broker_url='redis://localhost:6379/1',
     result_backend='redis://localhost:6379/2'
 )
    celery.Task = ContextTask

    with app.app_context():
        import views

    return app


# Create Flask app
app = create_app()

# Ensure Celery is configured only once
celery.conf.update(
    broker_url='redis://localhost:6379/1',
    result_backend='redis://localhost:6379/0',
)

# Configure periodic tasks


@celery.on_after_configure.connect
def celery_job(sender, **kwargs):
    sender.add_periodic_task(10.0,monthly_reminder.s())
    sender.add_periodic_task(10.0,daily_reminder.s())
    
if __name__ == '__main__':
    app.run(debug=True)

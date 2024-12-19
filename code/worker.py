from celery import Celery
from flask import current_app as app

celery = Celery('application jobs')

class ContextTask(celery.Task):
    def _call_(self, *args, **kwargs):
        with app.app_context():
            return super()._call_(*args, **kwargs)
celery.Task = ContextTask
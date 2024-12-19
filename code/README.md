# Household_Services_Application_v2
The ServiceHub project successfully provides a robust platform for connecting customers and service professionals. Its secure, dynamic, and efficient architecture ensures a seamless experience for all stakeholders. The use of cutting-edge technologies like Flask, Vue.js, Redis, and Celery makes it scalable and ready for deployment in real-world scenarios.

# Steps to run the Application
# Step 1:- Create Virtual environement
python -m venv env

# Step 2:- Activate Virtual environemnt
env\Scripts\activate

# Step 3:- install requirements.txt
pip install -r requirements.txt

# Step 4:- open new terminal and run redis in ubuntu
sudo service redis-server start
redis-cli

# Step 5:- open new terminal and activate virtual environment and run celery worker
celery -A main.celery worker --loglevel=info 

# Step 6:- open new terminal and activate virtual environment and run celery beat
celery -A main.celery beat --max-interval 1 -l info 

# Step 7: now go to that terminal in which you pip installed requirements.txt and upload the initial data and run the main.py
python upload_initial_data.py   
python main.py



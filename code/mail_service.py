from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

SERVER_SMTP_HOST = 'localhost'
SERVER_SMTP_PORT = 1025
SENDER_ADDRESS = 'gurdeeep@gmail.com'
SENDER_PASSWORD = ''  # Leave empty for no authentication

def send_email(to_address, subject, message, content="html"):
    try:
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = SENDER_ADDRESS
        msg['To'] = to_address
        msg['Subject'] = subject

        # Attach the message body
        msg.attach(MIMEText(message, content))

        # Send email
        with smtplib.SMTP(host=SERVER_SMTP_HOST, port=SERVER_SMTP_PORT) as server:
            if SENDER_PASSWORD:  # Authenticate if password is provided
                server.login(SENDER_ADDRESS, SENDER_PASSWORD)
            server.send_message(msg)

        print(f"Email sent successfully to {to_address}")
        return True

    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
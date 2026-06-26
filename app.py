import os
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request

load_dotenv()

app = Flask(__name__)

# Constants
BUSINESS_NAME = "Dazzling Kids Learning Academy"
BUSINESS_PHONE = "88384 78500"
BUSINESS_LOCATION = "Tiruvottiyur, Chennai"
BUSINESS_REG = "TN/9525"


def _smtp_settings():
    return {
        "server": os.getenv("SMTP_SERVER", "smtp.gmail.com"),
        "port": int(os.getenv("SMTP_PORT", "587")),
        "username": os.getenv("MAIL_USERNAME", "dk.academy022026@gmail.com"),
        "password": os.getenv("MAIL_PASSWORD", "wgmwvacpnikwuhij"),
        "admin_email": os.getenv("ADMIN_EMAIL", "dk.academy022026@gmail.com"),
    }


def _send_email(subject, to_email, html_body, text_body):
    settings = _smtp_settings()

    if not settings["username"] or not settings["password"]:
        raise RuntimeError("Mail credentials are not configured.")

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{BUSINESS_NAME} <{settings['username']}>"
    message["To"] = to_email
    message.attach(MIMEText(text_body, "plain", "utf-8"))
    message.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP(settings["server"], settings["port"]) as server:
        server.starttls()
        server.login(settings["username"], settings["password"])
        server.sendmail(settings["username"], to_email, message.as_string())


def send_admin_notification(name, email, mobile, message):
    settings = _smtp_settings()
    subject = f"{BUSINESS_NAME} | New Inquiry from {name}"

    text_body = (
        f"New inquiry received on the website.\n\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Mobile: {mobile}\n"
        f"Message:\n{message}\n"
    )

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; color: #1E1B4B;">
      <h2 style="color: #7C3AED; margin-bottom: 0.5rem;">{BUSINESS_NAME}</h2>
      <p style="color: #6B7280; margin-top: 0;">New website inquiry</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 1.5rem;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Name</td><td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">{name}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">{email}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #E5E7EB; font-weight: bold;">Mobile</td><td style="padding: 10px; border-bottom: 1px solid #E5E7EB;">{mobile}</td></tr>
        <tr><td style="padding: 10px; font-weight: bold; vertical-align: top;">Message</td><td style="padding: 10px; white-space: pre-wrap;">{message}</td></tr>
      </table>
    </div>
    """

    _send_email(subject, settings["admin_email"], html_body, text_body)


def send_thank_you_email(name, email):
    subject = f"Thank You for Contacting {BUSINESS_NAME}"

    text_body = (
        f"Dear {name},\n\n"
        f"Thank you for reaching out to {BUSINESS_NAME}.\n\n"
        f"We have received your message and our admissions team will contact you within 24 hours.\n\n"
        f"For immediate assistance, call us at {BUSINESS_PHONE}.\n\n"
        f"Warm regards,\n"
        f"{BUSINESS_NAME}\n"
        f"{BUSINESS_LOCATION}\n"
        f"Registered No. {BUSINESS_REG}\n"
    )

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FAF9F6; padding: 32px; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #7C3AED; font-weight: 700;">{BUSINESS_NAME}</p>
        <h2 style="margin: 8px 0 0; color: #1E1B4B;">Thank You, {name}!</h2>
      </div>
      <div style="background: #FFFFFF; border-radius: 14px; padding: 24px; border: 1px solid #E5E7EB;">
        <p style="color: #4B5563; line-height: 1.7; margin-top: 0;">
          Thank you for contacting <strong>{BUSINESS_NAME}</strong>. We have received your inquiry and our team will get back to you within 24 hours.
        </p>
        <p style="color: #4B5563; line-height: 1.7;">
          For urgent help, please call us at <strong>{BUSINESS_PHONE}</strong>.
        </p>
        <p style="color: #6B7280; font-style: italic; margin-bottom: 0;">
          We look forward to welcoming your child to a joyful learning journey.
        </p>
      </div>
      <p style="text-align: center; color: #9CA3AF; font-size: 12px; margin-top: 24px;">
        {BUSINESS_NAME} · {BUSINESS_LOCATION} · Regd. {BUSINESS_REG}
      </p>
    </div>
    """

    _send_email(subject, email, html_body, text_body)


def send_inquiry_emails(name, email, mobile, message):
    send_admin_notification(name, email, mobile, message)
    send_thank_you_email(name, email)


def is_valid_email(email):
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


def is_valid_mobile(mobile):
    return bool(re.match(r"^\d{10}$", mobile.replace(" ", "").replace("-", "")))


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/inquiry", methods=["POST"])
def submit_inquiry():
    data = request.get_json(silent=True) or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    mobile = (data.get("mobile") or "").strip()
    message = (data.get("message") or "").strip()
    honeypot = (data.get("_honey") or "").strip()

    if honeypot:
        return jsonify({"success": True, "message": "Thank you for contacting us."})

    errors = []
    if not name:
        errors.append("Name is required.")
    if not email or not is_valid_email(email):
        errors.append("A valid email address is required.")
    if not mobile or not is_valid_mobile(mobile):
        errors.append("A valid 10-digit mobile number is required.")
    if not message:
        errors.append("Message is required.")

    if errors:
        return jsonify({"success": False, "message": " ".join(errors)}), 400

    try:
        send_inquiry_emails(name, email, mobile, message)
    except Exception:
        return jsonify({
            "success": False,
            "message": "Unable to send your message right now. Please call us at 88384 78500."
        }), 500

    return jsonify({
        "success": True,
        "message": "Your message has been sent successfully. A thank-you email is on its way to you."
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.getenv("PORT", "5000")))

import os
from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory
from flask_babel import Babel, _
from flask_mail import Mail, Message
from dotenv import load_dotenv

# --------------------------------------------------
# LOAD ENV
# --------------------------------------------------

load_dotenv()

# --------------------------------------------------
# APP
# --------------------------------------------------

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-me")

# --------------------------------------------------
# LANGUAGE SELECTOR
# --------------------------------------------------

def get_locale():
    return session.get("lang", "en")

# --------------------------------------------------
# BABEL CONFIG
# --------------------------------------------------

app.config["BABEL_DEFAULT_LOCALE"] = "en"
app.config["BABEL_SUPPORTED_LOCALES"] = ["en", "pl"]
app.config["BABEL_TRANSLATION_DIRECTORIES"] = "translations"

babel = Babel(app, locale_selector=get_locale)

# --------------------------------------------------
# MAIL CONFIG
# --------------------------------------------------

mail_username = os.getenv("MAIL_USERNAME")
mail_password = os.getenv("MAIL_PASSWORD")

if not mail_username or not mail_password:
    raise RuntimeError("Brakuje MAIL_USERNAME lub MAIL_PASSWORD w pliku .env")

app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_USERNAME"] = mail_username
app.config["MAIL_PASSWORD"] = mail_password
app.config["MAIL_DEFAULT_SENDER"] = mail_username

mail = Mail(app)

# --------------------------------------------------
# CHANGE LANGUAGE
# --------------------------------------------------

@app.route("/set-lang/<lang>", methods=["POST"])
def set_language(lang):
    if lang in ["en", "pl"]:
        session["lang"] = lang
    return redirect(request.referrer or url_for("home"))

# --------------------------------------------------
# FAVICON
# --------------------------------------------------

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static", "img"),
        "favicon.svg",
        mimetype="image/svg+xml"
    )

# --------------------------------------------------
# HOME
# --------------------------------------------------

@app.route("/")
def home():
    return render_template("index.html")

# --------------------------------------------------
# ROBOT / SITEMAP
# --------------------------------------------------

@app.route("/robots.txt")
def robots():
    return send_from_directory("static", "robots.txt")

@app.route("/sitemap.xml")
def sitemap():
    return send_from_directory("static", "sitemap.xml")

# --------------------------------------------------
# CONTACT FORM
# --------------------------------------------------

@app.route("/contact", methods=["POST"])
def contact():
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip()
    project = (request.form.get("project") or "").strip()
    message = (request.form.get("message") or "").strip()

    if not name or not email or not message:
        flash(_("Please fill in your name, email, and message."), "error")
        return redirect(url_for("home") + "#contact")

    try:
        msg = Message(
            subject=f"New website inquiry from {name}",
            recipients=[app.config["MAIL_USERNAME"]],
            reply_to=email,
        )

        msg.body = f"""
New contact form submission

Name: {name}
Email: {email}
Project: {project}

Message:
{message}
"""

        mail.send(msg)

        flash(_("Thanks! Your inquiry has been sent successfully."), "success")

    except Exception as e:
        print("MAIL ERROR:", e)
        flash(_("Email could not be sent right now. Please try again later."), "error")

    return redirect(url_for("home") + "#contact")

# --------------------------------------------------
# RUN
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)
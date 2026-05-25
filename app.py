import os
from datetime import date
from urllib.parse import urlparse
from flask import Flask, render_template, request, redirect, url_for, flash, session, send_from_directory, Response
from flask_babel import Babel, _
from flask_mail import Mail, Message
from dotenv import load_dotenv
from whitenoise import WhiteNoise

# --------------------------------------------------
# LOAD ENV
# --------------------------------------------------

load_dotenv()

# --------------------------------------------------
# APP
# --------------------------------------------------

app = Flask(__name__)
app.wsgi_app = WhiteNoise(app.wsgi_app, root="static")
app.secret_key = os.getenv("SECRET_KEY", "dev-secret-key-change-me")

SITE_URL = os.getenv("SITE_URL", "https://ankiel-studio.com").rstrip("/")
SUPPORTED_LANGUAGES = ["en", "pl"]
DEFAULT_LANGUAGE = "en"

SEO_PAGES = {
    "premium-web-design": {
        "title": "Premium Web Design Studio | Ankiel Studio",
        "description": "Premium interactive websites for ambitious brands, startups, founders, and service businesses that need a memorable digital presence.",
        "kicker": "Premium Web Design",
        "headline": "Premium websites that feel custom, cinematic, and built to sell.",
        "intro": "Ankiel Studio designs and builds modern websites with strong visual hierarchy, smooth motion, responsive UX, and a clean Flask/Jinja frontend ready for deployment.",
        "service_name": "Premium Web Design",
        "points": [
            "Cinematic homepage and section flow",
            "Responsive UX for desktop, tablet, and mobile",
            "Conversion-focused copy structure and CTA placement",
            "Lightweight static frontend compatible with Render deployment",
        ],
        "faq": [
            ("How long does a premium website take?", "Most focused websites can be planned, designed, built, and refined in a few weeks depending on scope and feedback speed."),
            ("Do you work with international clients?", "Yes. Ankiel Studio works remote-first with brands in Europe, the United States, and other markets."),
        ],
    },
    "landing-pages": {
        "title": "Landing Page Design and Development | Ankiel Studio",
        "description": "High-conversion landing pages with premium design, clear story flow, responsive frontend, and focused calls to action.",
        "kicker": "Landing Pages",
        "headline": "Landing pages with clear narrative, motion, and conversion focus.",
        "intro": "For campaigns, services, launches, and offers that need one sharp page with strong visual direction and a direct path to inquiry.",
        "service_name": "Landing Page Design",
        "points": [
            "Focused offer structure and CTA flow",
            "Animated proof points and scroll reveal sections",
            "Fast responsive build with clean SEO foundations",
            "Contact-ready sections for qualified inquiries",
        ],
        "faq": [
            ("What is included in a landing page?", "A landing page usually includes a hero, offer structure, benefits, trust signals, process, pricing or CTA blocks, and contact flow."),
            ("Can the page be used for ads?", "Yes. The layout can be shaped around paid traffic, service promotion, and conversion tracking needs."),
        ],
    },
    "flask-web-development": {
        "title": "Flask Web Development for Business Websites | Ankiel Studio",
        "description": "Flask and Jinja websites, dashboards, landing pages, and lightweight business tools built with clean frontend and deployment-ready structure.",
        "kicker": "Flask Development",
        "headline": "Clean Flask websites and tools with premium frontend polish.",
        "intro": "For brands and businesses that need more than a static template: contact forms, dashboards, reporting views, internal tools, and deployment-friendly Python architecture.",
        "service_name": "Flask Web Development",
        "points": [
            "Flask routes and Jinja templates",
            "Static CSS and JavaScript without React migration",
            "Contact forms, dashboards, and business workflows",
            "Render-friendly deployment structure",
        ],
        "faq": [
            ("Can you improve an existing Flask project?", "Yes. Existing Flask/Jinja projects can be redesigned, cleaned up, optimized, and extended without rewriting them in another stack."),
            ("Is Flask good for business websites?", "Yes. Flask is a strong choice for lightweight websites, custom forms, dashboards, and business tools with Python backend logic."),
        ],
    },
    "dashboard-development": {
        "title": "Dashboard Development and Data Tools | Ankiel Studio",
        "description": "Custom dashboards, reporting interfaces, and data-aware business tools built with Flask, clean UI, and practical workflows.",
        "kicker": "Dashboards and Data Tools",
        "headline": "Dashboards that turn business data into clear decisions.",
        "intro": "Ankiel Studio builds custom web-based dashboards, reporting views, and internal tools for businesses that need clearer data, faster workflows, and better visibility.",
        "service_name": "Dashboard Development",
        "points": [
            "Custom reporting interfaces",
            "Data-focused layouts and KPI cards",
            "Internal tools for business workflows",
            "Responsive UI built around real use cases",
        ],
        "faq": [
            ("What kind of dashboards can you build?", "Examples include KPI dashboards, reporting views, operational tools, lead trackers, and internal business panels."),
            ("Can dashboards be connected to real data?", "Yes. The implementation can be planned around files, databases, APIs, or other data sources depending on project scope."),
        ],
    },
    "work/masarnia-jastew": {
        "title": "Masarnia Jastew Website Case Study | Ankiel Studio",
        "description": "A live client website project for Masarnia Jastew focused on credibility, mobile clarity, product presentation, and contact flow.",
        "kicker": "Case Study",
        "headline": "A modern website for a traditional butcher brand.",
        "intro": "Masarnia Jastew needed a clean business website that could present a traditional local brand with more trust, clarity, and mobile-friendly structure.",
        "service_name": "Masarnia Jastew Website",
        "points": [
            "Business website design and frontend development",
            "Responsive layout and contact flow",
            "Clear presentation for a traditional food brand",
            "Live project with public website link",
        ],
        "external_url": "https://masarniajastew.pl/",
        "faq": [
            ("What was the project goal?", "The goal was to create a modern website that builds trust and makes the business easier to understand and contact online."),
            ("What was included?", "The project included website design, frontend development, responsive layout, contact form flow, and basic SEO structure."),
        ],
    },
}

PL_SEO_PAGES = {
    "premium-web-design": {
        "title": "Premium Web Design Studio | Ankiel Studio",
        "description": "Premium interaktywne strony internetowe dla ambitnych marek, startupów, founderów i firm usługowych, które potrzebują zapamiętywalnej obecności online.",
        "kicker": "Premium Web Design",
        "headline": "Strony premium, które wyglądają customowo, cinematic i sprzedają.",
        "intro": "Ankiel Studio projektuje i tworzy nowoczesne strony z mocną hierarchią wizualną, płynnym ruchem, responsywnym UX i czystym frontendem Flask/Jinja gotowym do wdrożenia.",
        "service_name": "Premium Web Design",
        "points": [
            "Cinematic strona główna i płynny układ sekcji",
            "Responsywny UX dla desktopu, tabletu i mobile",
            "Struktura treści i CTA nastawiona na konwersję",
            "Lekki frontend statyczny kompatybilny z deploymentem na Render",
        ],
        "faq": [
            ("Ile trwa stworzenie strony premium?", "Większość skoncentrowanych stron można zaplanować, zaprojektować, zbudować i dopracować w kilka tygodni, zależnie od zakresu i tempa feedbacku."),
            ("Czy pracujesz z klientami międzynarodowymi?", "Tak. Ankiel Studio pracuje remote-first z markami w Europie, Stanach Zjednoczonych i na innych rynkach."),
        ],
    },
    "landing-pages": {
        "title": "Landing Page Design i Development | Ankiel Studio",
        "description": "Landing page'e nastawione na konwersję, z premium designem, jasną narracją, responsywnym frontendem i mocnymi CTA.",
        "kicker": "Landing Pages",
        "headline": "Landing page'e z czytelną narracją, ruchem i naciskiem na konwersję.",
        "intro": "Dla kampanii, usług, launchy i ofert, które potrzebują jednej wyrazistej strony z mocnym kierunkiem wizualnym i prostą ścieżką do kontaktu.",
        "service_name": "Landing Page Design",
        "points": [
            "Struktura oferty i CTA skupiona na celu",
            "Animowane proof pointy i sekcje reveal przy scrollu",
            "Szybki responsywny build z dobrymi podstawami SEO",
            "Sekcje kontaktowe gotowe na jakościowe zapytania",
        ],
        "faq": [
            ("Co zawiera landing page?", "Landing page zwykle zawiera hero, strukturę oferty, benefity, sygnały zaufania, proces, pricing lub bloki CTA oraz kontakt."),
            ("Czy strona nadaje się pod reklamy?", "Tak. Układ może być zaplanowany pod płatny ruch, promocję usługi i potrzeby śledzenia konwersji."),
        ],
    },
    "flask-web-development": {
        "title": "Flask Web Development dla stron biznesowych | Ankiel Studio",
        "description": "Strony Flask i Jinja, dashboardy, landing page'e oraz lekkie narzędzia biznesowe z czystym frontendem i strukturą gotową do wdrożenia.",
        "kicker": "Flask Development",
        "headline": "Czyste strony i narzędzia Flask z premium frontend polish.",
        "intro": "Dla marek i firm, które potrzebują czegoś więcej niż statyczny szablon: formularzy, dashboardów, raportów, narzędzi wewnętrznych i deployment-friendly architektury Python.",
        "service_name": "Flask Web Development",
        "points": [
            "Routing Flask i template'y Jinja",
            "Statyczny CSS i JavaScript bez migracji do Reacta",
            "Formularze kontaktowe, dashboardy i workflow biznesowe",
            "Struktura wdrożeniowa przyjazna dla Render",
        ],
        "faq": [
            ("Czy możesz poprawić istniejący projekt Flask?", "Tak. Istniejące projekty Flask/Jinja można przeprojektować, uporządkować, zoptymalizować i rozbudować bez przepisywania na inny stack."),
            ("Czy Flask nadaje się do stron biznesowych?", "Tak. Flask dobrze sprawdza się przy lekkich stronach, formularzach custom, dashboardach i narzędziach biznesowych z logiką Python."),
        ],
    },
    "dashboard-development": {
        "title": "Dashboard Development i narzędzia danych | Ankiel Studio",
        "description": "Dedykowane dashboardy, interfejsy raportowe i narzędzia biznesowe oparte na danych, budowane we Flask z czystym UI.",
        "kicker": "Dashboardy i narzędzia danych",
        "headline": "Dashboardy, które zamieniają dane biznesowe w czytelne decyzje.",
        "intro": "Ankiel Studio buduje webowe dashboardy, widoki raportowe i narzędzia wewnętrzne dla firm, które potrzebują lepszej widoczności danych i szybszych procesów.",
        "service_name": "Dashboard Development",
        "points": [
            "Dedykowane interfejsy raportowe",
            "Układy danych i KPI cards",
            "Narzędzia wewnętrzne dla workflow biznesowego",
            "Responsywny UI budowany pod realne użycie",
        ],
        "faq": [
            ("Jakie dashboardy możesz zbudować?", "Przykłady to dashboardy KPI, widoki raportowe, narzędzia operacyjne, trackery leadów i wewnętrzne panele biznesowe."),
            ("Czy dashboard może być połączony z realnymi danymi?", "Tak. Implementację można zaplanować wokół plików, baz danych, API lub innych źródeł danych zależnie od zakresu."),
        ],
    },
    "work/masarnia-jastew": {
        "title": "Case Study strony Masarnia Jastew | Ankiel Studio",
        "description": "Realizacja strony dla Masarni Jastew skupiona na wiarygodności, czytelności mobile, prezentacji produktów i kontakcie.",
        "kicker": "Case Study",
        "headline": "Nowoczesna strona dla tradycyjnej marki masarskiej.",
        "intro": "Masarnia Jastew potrzebowała czytelnej strony firmowej, która pokaże tradycyjną lokalną markę w bardziej wiarygodny, przejrzysty i mobilny sposób.",
        "service_name": "Strona Masarnia Jastew",
        "points": [
            "Projekt strony firmowej i frontend development",
            "Responsywny układ i prosty kontakt",
            "Czytelna prezentacja tradycyjnej marki spożywczej",
            "Realizacja live z publicznym linkiem do strony",
        ],
        "external_url": "https://masarniajastew.pl/",
        "faq": [
            ("Jaki był cel projektu?", "Celem było stworzenie nowoczesnej strony, która buduje zaufanie i ułatwia zrozumienie oraz kontakt z firmą online."),
            ("Co obejmowała realizacja?", "Projekt obejmował design strony, wdrożenie frontendu, responsywny układ, flow kontaktowy i podstawową strukturę SEO."),
        ],
    },
}

# --------------------------------------------------
# LANGUAGE SELECTOR
# --------------------------------------------------

def get_locale():
    lang = request.view_args.get("lang") if request.view_args else None
    if lang in SUPPORTED_LANGUAGES:
        return lang
    return session.get("lang", DEFAULT_LANGUAGE)

# --------------------------------------------------
# BABEL CONFIG
# --------------------------------------------------

app.config["BABEL_DEFAULT_LOCALE"] = "en"
app.config["BABEL_SUPPORTED_LOCALES"] = SUPPORTED_LANGUAGES
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
    if lang in SUPPORTED_LANGUAGES:
        session["lang"] = lang
        referrer = request.referrer or ""
        parsed = urlparse(referrer)
        parts = [part for part in parsed.path.split("/") if part]
        if parts and parts[0] in SUPPORTED_LANGUAGES:
            slug = "/".join(parts[1:])
            if slug and slug in SEO_PAGES:
                return redirect(url_for("localized_seo_page", lang=lang, slug=slug))
            return redirect(url_for("localized_home", lang=lang))
        return redirect(url_for("localized_home", lang=lang))
    return redirect(request.referrer or url_for("localized_home", lang=DEFAULT_LANGUAGE))


@app.context_processor
def inject_seo_helpers():
    current_lang = get_locale()
    return {
        "site_url": SITE_URL,
        "current_lang": current_lang,
        "supported_languages": SUPPORTED_LANGUAGES,
    }


def absolute_url(path):
    if not path.startswith("/"):
        path = f"/{path}"
    return f"{SITE_URL}{path}"


def localized_url(lang, slug=""):
    path = f"/{lang}/"
    if slug:
        path = f"{path}{slug.strip('/')}"
    return absolute_url(path)


def page_alternates(slug=""):
    return {lang: localized_url(lang, slug) for lang in SUPPORTED_LANGUAGES}


def build_home_seo(lang):
    return {
        "title": _("Premium Interactive Websites | Ankiel Studio"),
        "description": _("Premium interactive websites, landing pages, dashboards, and digital tools for ambitious brands in Europe and the United States."),
        "canonical_url": localized_url(lang),
        "alternate_urls": page_alternates(),
        "og_type": "website",
    }


def build_page_seo(lang, slug, page):
    return {
        "title": page["title"],
        "description": page["description"],
        "canonical_url": localized_url(lang, slug),
        "alternate_urls": page_alternates(slug),
        "og_type": "article" if slug.startswith("work/") else "website",
    }


def localized_page_data(lang, slug):
    page = SEO_PAGES[slug].copy()
    if lang == "pl":
        page.update(PL_SEO_PAGES.get(slug, {}))
    return page

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
    return redirect(url_for("localized_home", lang=DEFAULT_LANGUAGE), code=302)


@app.route("/premium-web-design")
def premium_web_design_redirect():
    return redirect(url_for("localized_seo_page", lang=DEFAULT_LANGUAGE, slug="premium-web-design"), code=301)


@app.route("/landing-pages")
def landing_pages_redirect():
    return redirect(url_for("localized_seo_page", lang=DEFAULT_LANGUAGE, slug="landing-pages"), code=301)


@app.route("/flask-web-development")
def flask_web_development_redirect():
    return redirect(url_for("localized_seo_page", lang=DEFAULT_LANGUAGE, slug="flask-web-development"), code=301)


@app.route("/dashboard-development")
def dashboard_development_redirect():
    return redirect(url_for("localized_seo_page", lang=DEFAULT_LANGUAGE, slug="dashboard-development"), code=301)


@app.route("/work/masarnia-jastew")
def masarnia_jastew_redirect():
    return redirect(url_for("localized_seo_page", lang=DEFAULT_LANGUAGE, slug="work/masarnia-jastew"), code=301)


@app.route("/<lang>/")
def localized_home(lang):
    if lang not in SUPPORTED_LANGUAGES:
        return redirect(url_for("localized_home", lang=DEFAULT_LANGUAGE), code=302)
    session["lang"] = lang
    return render_template("index.html", seo=build_home_seo(lang))


@app.route("/<lang>/<path:slug>")
def localized_seo_page(lang, slug):
    if lang not in SUPPORTED_LANGUAGES:
        return redirect(url_for("localized_home", lang=DEFAULT_LANGUAGE), code=302)
    slug = slug.strip("/")
    if slug not in SEO_PAGES:
        return redirect(url_for("localized_home", lang=lang), code=302)
    page = localized_page_data(lang, slug)
    session["lang"] = lang
    return render_template("seo_page.html", page=page, slug=slug, seo=build_page_seo(lang, slug, page))


@app.route("/<path:slug>")
def default_language_page(slug):
    slug = slug.strip("/")
    if slug in SEO_PAGES:
        return redirect(url_for("localized_seo_page", lang=DEFAULT_LANGUAGE, slug=slug), code=301)
    return redirect(url_for("localized_home", lang=DEFAULT_LANGUAGE), code=302)

# --------------------------------------------------
# ROBOT / SITEMAP
# --------------------------------------------------

@app.route("/robots.txt")
def robots():
    content = f"User-agent: *\nAllow: /\n\nSitemap: {SITE_URL}/sitemap.xml\n"
    return Response(content, mimetype="text/plain")

@app.route("/sitemap.xml")
def sitemap():
    today = date.today().isoformat()
    urls = []

    for lang in SUPPORTED_LANGUAGES:
        urls.append((localized_url(lang), "1.0", "daily"))
        for slug in SEO_PAGES:
            priority = "0.9" if not slug.startswith("work/") else "0.8"
            urls.append((localized_url(lang, slug), priority, "weekly"))

    body = "\n".join(
        f"""  <url>
    <loc>{loc}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>"""
        for loc, priority, changefreq in urls
    )
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{body}
</urlset>
"""
    return Response(xml, mimetype="application/xml")

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
        return redirect(url_for("localized_home", lang=get_locale()) + "#contact")

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

    return redirect(url_for("localized_home", lang=get_locale()) + "#contact")

# --------------------------------------------------
# RUN
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True)

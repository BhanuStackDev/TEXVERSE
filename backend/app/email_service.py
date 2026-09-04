"""
TEXVERSE Email Service

Purpose:
- Verification emails
- Password reset emails
- Multilingual email registry
- RTL language support
- SMTP provider abstraction through environment variables
- Multipart plain-text + HTML emails
- Production-friendly email headers
- Easy future migration to Resend / SendGrid / SES / custom SMTP

IMPORTANT:
SMTP credentials must NEVER be hard-coded in this file.
Configure them through backend/.env.
"""

import smtplib
import uuid
from datetime import datetime, timezone
from email.message import EmailMessage
from email.utils import formatdate, make_msgid
from html import escape

from app.config import settings


# ============================================================
# SUPPORTED LANGUAGES
# ============================================================

SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "rtl": False},
    "hi": {"name": "Hindi", "rtl": False},
    "bn": {"name": "Bengali", "rtl": False},
    "te": {"name": "Telugu", "rtl": False},
    "mr": {"name": "Marathi", "rtl": False},
    "ta": {"name": "Tamil", "rtl": False},
    "gu": {"name": "Gujarati", "rtl": False},
    "kn": {"name": "Kannada", "rtl": False},
    "ml": {"name": "Malayalam", "rtl": False},
    "pa": {"name": "Punjabi", "rtl": False},
    "ur": {"name": "Urdu", "rtl": True},
    "or": {"name": "Odia", "rtl": False},
    "as": {"name": "Assamese", "rtl": False},
    "sa": {"name": "Sanskrit", "rtl": False},
    "ne": {"name": "Nepali", "rtl": False},
    "kok": {"name": "Konkani", "rtl": False},
    "mai": {"name": "Maithili", "rtl": False},
    "ks": {"name": "Kashmiri", "rtl": True},
    "sd": {"name": "Sindhi", "rtl": True},
    "doi": {"name": "Dogri", "rtl": False},
    "mni": {"name": "Manipuri", "rtl": False},
    "brx": {"name": "Bodo", "rtl": False},
    "sat": {"name": "Santali", "rtl": False},

    # Global languages
    "es": {"name": "Spanish", "rtl": False},
    "fr": {"name": "French", "rtl": False},
    "de": {"name": "German", "rtl": False},
    "ar": {"name": "Arabic", "rtl": True},
    "zh": {"name": "Chinese", "rtl": False},
    "ja": {"name": "Japanese", "rtl": False},
    "ko": {"name": "Korean", "rtl": False},
    "pt": {"name": "Portuguese", "rtl": False},
    "it": {"name": "Italian", "rtl": False},
    "ru": {"name": "Russian", "rtl": False},
    "tr": {"name": "Turkish", "rtl": False},
}


# ============================================================
# EMAIL TRANSLATIONS
# ============================================================

EMAIL_TRANSLATIONS = {
    "en": {
        "verification_subject": "Verify your TEXVERSE account",
        "verification_title": "Verify your email",
        "verification_intro": "Welcome to TEXVERSE.",
        "verification_body": (
            "Please verify your email address to activate your account."
        ),
        "verification_button": "Verify Email",
        "verification_expiry": (
            "This verification link expires in 60 minutes."
        ),
        "reset_subject": "Reset your TEXVERSE password",
        "reset_title": "Reset your password",
        "reset_intro": (
            "We received a request to reset your TEXVERSE password."
        ),
        "reset_button": "Reset Password",
        "reset_expiry": (
            "This password reset link expires in 30 minutes."
        ),
        "security_note": (
            "If you did not request this, you can safely ignore this email."
        ),
        "footer": "TEXVERSE — AI-powered textile commerce",
    },

    "hi": {
        "verification_subject": (
            "अपने TEXVERSE खाते का ईमेल सत्यापित करें"
        ),
        "verification_title": "अपना ईमेल सत्यापित करें",
        "verification_intro": "TEXVERSE में आपका स्वागत है।",
        "verification_body": (
            "अपना खाता सक्रिय करने के लिए कृपया अपना ईमेल पता सत्यापित करें।"
        ),
        "verification_button": "ईमेल सत्यापित करें",
        "verification_expiry": (
            "यह सत्यापन लिंक 60 मिनट में समाप्त हो जाएगा।"
        ),
        "reset_subject": "अपना TEXVERSE पासवर्ड रीसेट करें",
        "reset_title": "पासवर्ड रीसेट करें",
        "reset_intro": (
            "हमें आपका TEXVERSE पासवर्ड रीसेट करने का अनुरोध मिला है।"
        ),
        "reset_button": "पासवर्ड रीसेट करें",
        "reset_expiry": (
            "यह पासवर्ड रीसेट लिंक 30 मिनट में समाप्त हो जाएगा।"
        ),
        "security_note": (
            "यदि आपने यह अनुरोध नहीं किया है, तो इस ईमेल को अनदेखा कर सकते हैं।"
        ),
        "footer": "TEXVERSE — AI-powered textile commerce",
    },

    "es": {
        "verification_subject": "Verifica tu cuenta de TEXVERSE",
        "verification_title": "Verifica tu correo electrónico",
        "verification_intro": "Bienvenido a TEXVERSE.",
        "verification_body": (
            "Verifica tu dirección de correo electrónico para activar tu cuenta."
        ),
        "verification_button": "Verificar correo",
        "verification_expiry": (
            "Este enlace de verificación caduca en 60 minutos."
        ),
        "reset_subject": "Restablece tu contraseña de TEXVERSE",
        "reset_title": "Restablece tu contraseña",
        "reset_intro": (
            "Recibimos una solicitud para restablecer tu contraseña de TEXVERSE."
        ),
        "reset_button": "Restablecer contraseña",
        "reset_expiry": (
            "Este enlace de restablecimiento caduca en 30 minutos."
        ),
        "security_note": (
            "Si no realizaste esta solicitud, puedes ignorar este correo."
        ),
        "footer": "TEXVERSE — AI-powered textile commerce",
    },

    "fr": {
        "verification_subject": "Vérifiez votre compte TEXVERSE",
        "verification_title": "Vérifiez votre adresse e-mail",
        "verification_intro": "Bienvenue sur TEXVERSE.",
        "verification_body": (
            "Veuillez vérifier votre adresse e-mail pour activer votre compte."
        ),
        "verification_button": "Vérifier l'e-mail",
        "verification_expiry": (
            "Ce lien de vérification expire dans 60 minutes."
        ),
        "reset_subject": "Réinitialisez votre mot de passe TEXVERSE",
        "reset_title": "Réinitialiser votre mot de passe",
        "reset_intro": (
            "Nous avons reçu une demande de réinitialisation de votre mot de passe TEXVERSE."
        ),
        "reset_button": "Réinitialiser le mot de passe",
        "reset_expiry": (
            "Ce lien expire dans 30 minutes."
        ),
        "security_note": (
            "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail."
        ),
        "footer": "TEXVERSE — AI-powered textile commerce",
    },
}


# ============================================================
# LANGUAGE HELPERS
# ============================================================

def normalize_language(language: str | None) -> str:
    """
    Normalize language codes.

    Examples:
        en       -> en
        en-IN    -> en
        hi-IN    -> hi
        EN-us    -> en
        unknown  -> en
    """

    if not language:
        return "en"

    language = language.strip().lower()

    if language in SUPPORTED_LANGUAGES:
        return language

    base = language.split("-")[0]

    if base in SUPPORTED_LANGUAGES:
        return base

    return "en"


def get_translation(language: str | None):
    """
    Return translated email strings.

    Languages without complete email translations currently
    fall back safely to English.

    Adding a new language later only requires adding its
    translation dictionary here.
    """

    language = normalize_language(language)

    return EMAIL_TRANSLATIONS.get(
        language,
        EMAIL_TRANSLATIONS["en"],
    )


def is_rtl_language(language: str | None) -> bool:
    """
    Return True for RTL languages.
    """

    language = normalize_language(language)

    return SUPPORTED_LANGUAGES.get(
        language,
        {},
    ).get("rtl", False)


# ============================================================
# HTML EMAIL TEMPLATE
# ============================================================

def _email_html(
    title: str,
    intro: str,
    body: str,
    button_text: str,
    button_url: str,
    expiry: str,
    security_note: str,
    footer: str,
    rtl: bool = False,
):
    """
    Build a clean responsive HTML email.

    Notes:
    - Inline CSS for Gmail compatibility.
    - RTL support for Arabic / Urdu / Kashmiri / Sindhi.
    - No external images or external CSS.
    - Safe escaping of dynamic values.
    """

    direction = "rtl" if rtl else "ltr"
    alignment = "right" if rtl else "left"

    safe_button_url = escape(
        button_url,
        quote=True,
    )

    return f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <meta
        name="x-apple-disable-message-reformatting"
    >
    <title>TEXVERSE</title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#f1f5f9;
        font-family:Arial,Helvetica,sans-serif;
        direction:{direction};
    "
>

    <div
        style="
            width:100%;
            padding:40px 16px;
            box-sizing:border-box;
            background:#f1f5f9;
        "
    >

        <div
            style="
                max-width:620px;
                margin:0 auto;
                background:#ffffff;
                border:1px solid #e2e8f0;
                border-radius:16px;
                overflow:hidden;
            "
        >

            <!-- Header -->
            <div
                style="
                    padding:28px 24px;
                    background:#0f172a;
                    color:#ffffff;
                    text-align:center;
                "
            >
                <div
                    style="
                        font-size:28px;
                        line-height:1.2;
                        font-weight:800;
                        letter-spacing:1px;
                    "
                >
                    TEXVERSE
                </div>

                <div
                    style="
                        margin-top:7px;
                        font-size:13px;
                        line-height:1.5;
                        color:#cbd5e1;
                    "
                >
                    AI-powered textile commerce
                </div>
            </div>

            <!-- Main content -->
            <div
                style="
                    padding:34px 32px;
                    color:#334155;
                    text-align:{alignment};
                "
            >

                <h1
                    style="
                        margin:0 0 18px;
                        font-size:27px;
                        line-height:1.3;
                        color:#0f172a;
                    "
                >
                    {escape(title)}
                </h1>

                <p
                    style="
                        margin:0 0 12px;
                        font-size:16px;
                        line-height:1.7;
                        color:#334155;
                    "
                >
                    {escape(intro)}
                </p>

                <p
                    style="
                        margin:0 0 28px;
                        font-size:15px;
                        line-height:1.7;
                        color:#64748b;
                    "
                >
                    {escape(body)}
                </p>

                <!-- CTA -->
                <div
                    style="
                        text-align:center;
                        margin:30px 0;
                    "
                >
                    <a
                        href="{safe_button_url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                            display:inline-block;
                            background:#06b6d4;
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 26px;
                            border-radius:10px;
                            font-size:15px;
                            font-weight:700;
                        "
                    >
                        {escape(button_text)}
                    </a>
                </div>

                <p
                    style="
                        margin:0 0 14px;
                        font-size:13px;
                        line-height:1.6;
                        color:#64748b;
                    "
                >
                    {escape(expiry)}
                </p>

                <p
                    style="
                        margin:0;
                        font-size:13px;
                        line-height:1.6;
                        color:#64748b;
                    "
                >
                    {escape(security_note)}
                </p>

            </div>

            <!-- Footer -->
            <div
                style="
                    padding:20px 24px;
                    border-top:1px solid #e2e8f0;
                    background:#f8fafc;
                    color:#64748b;
                    text-align:center;
                    font-size:12px;
                    line-height:1.5;
                "
            >
                {escape(footer)}
            </div>

        </div>

        <div
            style="
                max-width:620px;
                margin:14px auto 0;
                text-align:center;
                color:#94a3b8;
                font-size:11px;
                line-height:1.5;
            "
        >
            This is an automated message from TEXVERSE.
            Please do not reply unless instructed.
        </div>

    </div>

</body>
</html>
"""


# ============================================================
# SMTP SENDER
# ============================================================

def send_email(
    to_email: str,
    subject: str,
    text_body: str,
    html_body: str | None = None,
    reply_to: str | None = None,
):
    """
    Send an email through the configured SMTP provider.

    SMTP provider is completely environment-driven.

    Current example:
        Gmail SMTP

    Future examples:
        Resend SMTP
        SendGrid SMTP
        Amazon SES SMTP
        Mailgun SMTP
        Custom company SMTP

    No SMTP provider credentials are hard-coded.
    """

    config = settings()

    smtp_host = config["SMTP_HOST"]
    smtp_port = config["SMTP_PORT"]
    smtp_user = config["SMTP_USER"]
    smtp_password = config["SMTP_PASSWORD"]

    email_from = (
        config["EMAIL_FROM"]
        or smtp_user
    )

    if not smtp_host:
        raise RuntimeError(
            "SMTP_HOST is not configured."
        )

    if not smtp_port:
        raise RuntimeError(
            "SMTP_PORT is not configured."
        )

    if not smtp_user:
        raise RuntimeError(
            "SMTP_USER is not configured."
        )

    if not smtp_password:
        raise RuntimeError(
            "SMTP_PASSWORD is not configured."
        )

    if not to_email:
        raise RuntimeError(
            "Recipient email address is required."
        )

    message = EmailMessage()

    # --------------------------------------------------------
    # Standard email headers
    # --------------------------------------------------------

    message["Subject"] = subject
    message["From"] = email_from
    message["To"] = to_email

    if reply_to:
        message["Reply-To"] = reply_to

    message["Date"] = formatdate(
        localtime=True,
    )

    message["Message-ID"] = make_msgid(
        domain=(
            email_from.split("@", 1)[1]
            if "@" in email_from
            else None
        )
    )

    # Helpful internal identifier.
    message["X-TEXVERSE-Mail"] = str(
        uuid.uuid4()
    )

    # --------------------------------------------------------
    # Plain-text version
    # --------------------------------------------------------

    message.set_content(
        text_body,
        charset="utf-8",
    )

    # --------------------------------------------------------
    # HTML version
    # --------------------------------------------------------

    if html_body:
        message.add_alternative(
            html_body,
            subtype="html",
            charset="utf-8",
        )

    # --------------------------------------------------------
    # SMTP connection
    # --------------------------------------------------------

    with smtplib.SMTP(
        smtp_host,
        smtp_port,
        timeout=30,
    ) as server:

        server.ehlo()

        server.starttls()

        server.ehlo()

        server.login(
            smtp_user,
            smtp_password,
        )

        server.send_message(
            message,
        )


# ============================================================
# VERIFICATION EMAIL
# ============================================================

def send_verification_email(
    to_email: str,
    language: str,
    verification_url: str,
):
    """
    Send account verification email.
    """

    language = normalize_language(
        language
    )

    translation = get_translation(
        language
    )

    subject = translation[
        "verification_subject"
    ]

    text_body = (
        f"{translation['verification_title']}\n\n"
        f"{translation['verification_intro']}\n\n"
        f"{translation['verification_body']}\n\n"
        f"Verify your email:\n"
        f"{verification_url}\n\n"
        f"{translation['verification_expiry']}\n\n"
        f"{translation['security_note']}\n\n"
        f"{translation['footer']}"
    )

    html_body = _email_html(
        title=translation[
            "verification_title"
        ],
        intro=translation[
            "verification_intro"
        ],
        body=translation[
            "verification_body"
        ],
        button_text=translation[
            "verification_button"
        ],
        button_url=verification_url,
        expiry=translation[
            "verification_expiry"
        ],
        security_note=translation[
            "security_note"
        ],
        footer=translation[
            "footer"
        ],
        rtl=is_rtl_language(
            language
        ),
    )

    send_email(
        to_email=to_email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
        reply_to=None,
    )


# ============================================================
# PASSWORD RESET EMAIL
# ============================================================

def send_password_reset_email(
    to_email: str,
    language: str,
    reset_url: str,
):
    """
    Send password reset email.
    """

    language = normalize_language(
        language
    )

    translation = get_translation(
        language
    )

    subject = translation[
        "reset_subject"
    ]

    text_body = (
        f"{translation['reset_title']}\n\n"
        f"{translation['reset_intro']}\n\n"
        f"Reset your password:\n"
        f"{reset_url}\n\n"
        f"{translation['reset_expiry']}\n\n"
        f"{translation['security_note']}\n\n"
        f"{translation['footer']}"
    )

    html_body = _email_html(
        title=translation[
            "reset_title"
        ],
        intro=translation[
            "reset_intro"
        ],
        body=translation[
            "reset_intro"
        ],
        button_text=translation[
            "reset_button"
        ],
        button_url=reset_url,
        expiry=translation[
            "reset_expiry"
        ],
        security_note=translation[
            "security_note"
        ],
        footer=translation[
            "footer"
        ],
        rtl=is_rtl_language(
            language
        ),
    )

    send_email(
        to_email=to_email,
        subject=subject,
        text_body=text_body,
        html_body=html_body,
        reply_to=None,
    )


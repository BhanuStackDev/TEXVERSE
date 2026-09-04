from functools import lru_cache
import os

from dotenv import load_dotenv


load_dotenv()


@lru_cache
def settings():
    return {
        "DATABASE_URL": os.getenv(
            "DATABASE_URL",
            "sqlite:///./texverse.db",
        ),

        "SECRET_KEY": os.getenv(
            "SECRET_KEY",
            "dev-only-change-me",
        ),

        "ALGORITHM": "HS256",

        "ACCESS_TOKEN_EXPIRE_MINUTES": int(
            os.getenv(
                "ACCESS_TOKEN_EXPIRE_MINUTES",
                "60",
            )
        ),

        "RAZORPAY_KEY_ID": os.getenv(
            "RAZORPAY_KEY_ID",
            "",
        ),

        "RAZORPAY_KEY_SECRET": os.getenv(
            "RAZORPAY_KEY_SECRET",
            "",
        ),

        "FRONTEND_ORIGINS": [
            x.strip()
            for x in os.getenv(
                "FRONTEND_ORIGINS",
                "http://localhost:5173",
            ).split(",")
            if x.strip()
        ],

        # -------------------------------------------------
        # SMTP / EMAIL
        # -------------------------------------------------

        "SMTP_HOST": os.getenv(
            "SMTP_HOST",
            "smtp.gmail.com",
        ),

        "SMTP_PORT": int(
            os.getenv(
                "SMTP_PORT",
                "587",
            )
        ),

        "SMTP_USER": os.getenv(
            "SMTP_USER",
            "",
        ),

        "SMTP_PASSWORD": os.getenv(
            "SMTP_PASSWORD",
            "",
        ),

        "EMAIL_FROM": os.getenv(
            "EMAIL_FROM",
            "",
        ),

        # -------------------------------------------------
        # FRONTEND
        # -------------------------------------------------

        "FRONTEND_URL": os.getenv(
            "FRONTEND_URL",
            "http://localhost:5173",
        ),
    }
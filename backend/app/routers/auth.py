from datetime import datetime, timedelta, timezone
import secrets

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    User,
    EmailVerificationToken,
    PasswordResetToken,
)

from app.schemas import (
    UserRegister,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyEmailRequest,
    SUPPORTED_LANGUAGE_CODES,
)

from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

from app.config import settings

from app.email_service import (
    send_verification_email,
    send_password_reset_email,
    normalize_language,
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# HELPERS
# ============================================================

def create_raw_token():
    return secrets.token_urlsafe(48)


def expires_in(minutes):
    return datetime.now(timezone.utc) + timedelta(
        minutes=minutes
    )


def normalize_email(email):
    return email.strip().lower()


def user_response(user):
    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "role": user.role,
        "company_name": user.company_name,
        "email_verified": bool(
            user.email_verified
        ),
        "language": (
            user.language
            or "en"
        ),
    }


def create_session_token(user):
    return create_access_token(
        {
            "sub": user.email,
            "role": user.role,
        }
    )


def get_frontend_url():
    return settings()["FRONTEND_URL"].rstrip("/")


# ============================================================
# REGISTER
# ============================================================

@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    role = user.role.lower().strip()

    allowed_roles = {
        "buyer",
        "supplier",
        "shipping",
    }

    if role not in allowed_roles:
        raise HTTPException(
            400,
            "Role must be buyer, supplier or shipping",
        )

    email = normalize_email(user.email)

    existing = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing:
        raise HTTPException(
            409,
            "Email already registered",
        )

    language = normalize_language(
        user.language
    )

    if language not in SUPPORTED_LANGUAGE_CODES:
        language = "en"

    obj = User(
        full_name=user.full_name.strip(),
        email=email,
        password=hash_password(user.password),
        role=role,
        company_name=(
            user.company_name.strip()
            if user.company_name
            else None
        ),
        phone=user.phone,
        city=user.city,
        state=user.state,
        country=user.country,
        language=language,
        email_verified=False,
    )

    db.add(obj)
    db.commit()
    db.refresh(obj)

    raw_token = create_raw_token()

    verification = EmailVerificationToken(
        user_id=obj.id,
        token=raw_token,
        expires_at=expires_in(60),
        used=False,
    )

    db.add(verification)
    db.commit()

    verification_url = (
        f"{get_frontend_url()}"
        f"/verify-email?token={raw_token}"
    )

    # --------------------------------------------------------
    # SEND REAL EMAIL
    # --------------------------------------------------------

    try:
        send_verification_email(
            to_email=obj.email,
            language=obj.language,
            verification_url=verification_url,
        )

    except Exception as exc:
        # Do not leave a newly-created account with a
        # verification token that the user never received.
        db.delete(verification)
        db.delete(obj)
        db.commit()

        print(
            f"[TEXVERSE] Verification email failed: {exc}"
        )

        raise HTTPException(
            503,
            "Account could not be created because the verification email could not be sent. Please try again later.",
        )

    return {
        "message": (
            "Account created successfully. "
            "Please check your email to verify your account."
        ),
        "email_verification_required": True,
        "user": user_response(obj),
    }


# ============================================================
# VERIFY EMAIL
# ============================================================

@router.post("/verify-email")
def verify_email(
    data: VerifyEmailRequest,
    db: Session = Depends(get_db),
):
    verification = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.token
            == data.token,
            EmailVerificationToken.used == False,
        )
        .first()
    )

    if not verification:
        raise HTTPException(
            400,
            "Invalid or already used verification token.",
        )

    now = datetime.now(timezone.utc)

    expiry = verification.expires_at

    if expiry.tzinfo is None:
        expiry = expiry.replace(
            tzinfo=timezone.utc
        )

    if expiry < now:
        raise HTTPException(
            400,
            "Verification token has expired.",
        )

    user = db.get(
        User,
        verification.user_id,
    )

    if not user:
        raise HTTPException(
            404,
            "User not found.",
        )

    user.email_verified = True
    verification.used = True

    db.commit()

    return {
        "message": "Email verified successfully.",
        "verified": True,
        "user": user_response(user),
    }


# ============================================================
# RESEND VERIFICATION EMAIL
# ============================================================

@router.post("/resend-verification")
def resend_verification(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = normalize_email(data.email)

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not user:
        raise HTTPException(
            404,
            "Account not found.",
        )

    if user.email_verified:
        return {
            "message": "Email is already verified.",
            "verified": True,
        }

    # Invalidate older active verification tokens.
    active_tokens = (
        db.query(EmailVerificationToken)
        .filter(
            EmailVerificationToken.user_id
            == user.id,
            EmailVerificationToken.used == False,
        )
        .all()
    )

    for old_token in active_tokens:
        old_token.used = True

    raw_token = create_raw_token()

    verification = EmailVerificationToken(
        user_id=user.id,
        token=raw_token,
        expires_at=expires_in(60),
        used=False,
    )

    db.add(verification)
    db.commit()

    verification_url = (
        f"{get_frontend_url()}"
        f"/verify-email?token={raw_token}"
    )

    try:
        send_verification_email(
            to_email=user.email,
            language=user.language or "en",
            verification_url=verification_url,
        )

    except Exception as exc:
        verification.used = True
        db.commit()

        print(
            f"[TEXVERSE] Resend verification failed: {exc}"
        )

        raise HTTPException(
            503,
            "Verification email could not be sent. Please try again later.",
        )

    return {
        "message": (
            "A new verification email has been sent."
        ),
        "email_verification_required": True,
    }


# ============================================================
# FORGOT PASSWORD
# ============================================================

@router.post("/forgot-password")
def forgot_password(
    data: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    email = normalize_email(data.email)

    user = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    # --------------------------------------------------------
    # GENERIC RESPONSE
    #
    # This prevents account enumeration.
    # --------------------------------------------------------

    generic_response = {
        "message": (
            "If an account exists for this email, "
            "a password reset link has been sent."
        )
    }

    if not user:
        return generic_response

    if not user.email_verified:
        return generic_response

    # Invalidate older active reset tokens.
    active_tokens = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id
            == user.id,
            PasswordResetToken.used == False,
        )
        .all()
    )

    for old_token in active_tokens:
        old_token.used = True

    raw_token = create_raw_token()

    reset_url = (
        f"{get_frontend_url()}"
        f"/reset-password?token={raw_token}"
    )

    # --------------------------------------------------------
    # IMPORTANT
    #
    # Send email BEFORE persisting the new reset token.
    # --------------------------------------------------------

    try:
        send_password_reset_email(
            to_email=user.email,
            language=user.language or "en",
            reset_url=reset_url,
        )

    except Exception as exc:
        db.rollback()

        print(
            f"[TEXVERSE] Password reset email failed: {exc}"
        )

        # Still return generic response.
        return generic_response

    reset = PasswordResetToken(
        user_id=user.id,
        token=raw_token,
        expires_at=expires_in(30),
        used=False,
    )

    db.add(reset)
    db.commit()

    return generic_response


# ============================================================
# RESET PASSWORD
# ============================================================

@router.post("/reset-password")
def reset_password(
    data: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    reset = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token
            == data.token,
            PasswordResetToken.used == False,
        )
        .first()
    )

    if not reset:
        raise HTTPException(
            400,
            "Invalid or already used reset token.",
        )

    now = datetime.now(timezone.utc)

    expiry = reset.expires_at

    if expiry.tzinfo is None:
        expiry = expiry.replace(
            tzinfo=timezone.utc
        )

    if expiry < now:
        raise HTTPException(
            400,
            "Password reset token has expired.",
        )

    user = db.get(
        User,
        reset.user_id,
    )

    if not user:
        raise HTTPException(
            404,
            "User not found.",
        )

    user.password = hash_password(
        data.new_password
    )

    reset.used = True

    # Invalidate any other active reset tokens.
    other_tokens = (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.user_id
            == user.id,
            PasswordResetToken.used == False,
            PasswordResetToken.id != reset.id,
        )
        .all()
    )

    for token in other_tokens:
        token.used = True

    db.commit()

    return {
        "message": "Password reset successfully.",
    }


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):
    email = normalize_email(user.email)

    obj = (
        db.query(User)
        .filter(
            User.email == email
        )
        .first()
    )

    if not obj or not verify_password(
        user.password,
        obj.password,
    ):
        raise HTTPException(
            401,
            "Invalid email or password.",
        )

    if not obj.email_verified:
        raise HTTPException(
            403,
            "Please verify your email before logging in.",
        )

    token = create_session_token(obj)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user_response(obj),
    }


# ============================================================
# CURRENT USER
# ============================================================

@router.get("/me")
def me(
    user: User = Depends(get_current_user),
):
    return user_response(user)
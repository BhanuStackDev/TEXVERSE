from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

bearer = HTTPBearer(
    auto_error=False,
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def create_access_token(data: dict):
    payload = data.copy()

    payload["exp"] = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=settings()["ACCESS_TOKEN_EXPIRE_MINUTES"]
        )
    )

    return jwt.encode(
        payload,
        settings()["SECRET_KEY"],
        algorithm=settings()["ALGORITHM"],
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    try:
        payload = jwt.decode(
            credentials.credentials,
            settings()["SECRET_KEY"],
            algorithms=[settings()["ALGORITHM"]],
        )

        email = payload.get("sub")

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found",
        )

    return user


def require_role(role: str):
    def dependency(
        user: User = Depends(get_current_user),
    ):
        if str(user.role).lower() != str(role).lower():
            raise HTTPException(
                status_code=403,
                detail=f"{role.title()} access required",
            )

        return user

    return dependency


def require_roles(*roles):
    """
    Allow one of multiple roles.

    Example:
        require_roles("admin", "shipping")
    """

    allowed_roles = {
        str(role).lower()
        for role in roles
    }

    def dependency(
        user: User = Depends(get_current_user),
    ):
        current_role = str(user.role).lower()

        if current_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

        return user

    return dependency
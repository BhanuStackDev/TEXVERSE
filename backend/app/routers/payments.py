from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Session

from app.auth import require_role
from app.config import settings
from app.database import Base, get_db
from app.models import Order


router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


# ============================================================
# PAYMENT DATABASE MODEL
# ============================================================
# This model lives here intentionally so the existing project
# does not require a risky manual migration of the Order table.
#
# main.py already imports this router before create_all(), so
# SQLAlchemy will create the payments table automatically.
# ============================================================

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False,
        index=True,
    )

    buyer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    amount = Column(
        Float,
        nullable=False,
    )

    currency = Column(
        String(10),
        nullable=False,
        default="INR",
    )

    method = Column(
        String(40),
        nullable=False,
        default="gateway",
    )

    mode = Column(
        String(30),
        nullable=False,
        default="demo",
    )

    status = Column(
        String(30),
        nullable=False,
        default="created",
        index=True,
    )

    gateway_order_id = Column(
        String(150),
        nullable=True,
        index=True,
    )

    payment_id = Column(
        String(150),
        nullable=True,
        index=True,
    )

    signature = Column(
        String(500),
        nullable=True,
    )

    verified = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    verified_at = Column(
        DateTime,
        nullable=True,
    )

    __table_args__ = (
        UniqueConstraint(
            "order_id",
            name="uq_payment_order_id",
        ),
    )


# ============================================================
# REQUEST SCHEMAS
# ============================================================

class PaymentCreate(BaseModel):
    """
    Frontend sends only the TEXVERSE order ID and payment method.

    IMPORTANT:
    The frontend does NOT send the amount.
    The backend always reads the amount from the actual Order.
    """

    order_id: int = Field(..., gt=0)

    method: str = Field(
        default="gateway",
        max_length=40,
    )


class DemoPaymentSuccess(BaseModel):
    """
    Demo payment verification.

    OTP is intentionally fixed for demo mode:
    123456
    """

    order_id: int = Field(..., gt=0)

    otp: str = Field(
        ...,
        min_length=6,
        max_length=6,
    )

    method: str = Field(
        default="gateway",
        max_length=40,
    )


class PaymentVerify(BaseModel):
    """
    Razorpay verification payload.
    """

    texverse_order_id: int = Field(..., gt=0)

    razorpay_order_id: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    razorpay_payment_id: str = Field(
        ...,
        min_length=1,
        max_length=150,
    )

    razorpay_signature: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )


# ============================================================
# HELPERS
# ============================================================

VALID_METHODS = {
    "gateway",
    "bank",
    "terms",
}


def _utc_now():
    return datetime.now(timezone.utc)


def _razorpay_configured():
    config = settings()

    return bool(
        config.get("RAZORPAY_KEY_ID")
        and config.get("RAZORPAY_KEY_SECRET")
    )


def _payment_mode():
    """
    Razorpay is used when both keys exist.
    Otherwise the project safely runs in demo mode.
    """

    return "razorpay" if _razorpay_configured() else "demo"


def _get_buyer_order(
    db: Session,
    order_id: int,
    user,
):
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.buyer_id == user.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found or you do not have access to this order.",
        )

    return order


def _get_or_create_payment(
    db: Session,
    order: Order,
    user,
    method: str,
    mode: str,
):
    payment = (
        db.query(Payment)
        .filter(Payment.order_id == order.id)
        .first()
    )

    if payment:
        # Never change a successfully verified payment.
        if payment.verified:
            return payment

        payment.amount = float(order.total or 0)
        payment.currency = "INR"
        payment.method = method
        payment.mode = mode

        return payment

    payment = Payment(
        order_id=order.id,
        buyer_id=user.id,
        amount=float(order.total or 0),
        currency="INR",
        method=method,
        mode=mode,
        status="created",
        verified=False,
        created_at=_utc_now(),
    )

    db.add(payment)
    db.flush()

    return payment


def _payment_response(
    payment: Payment,
    order: Order,
):
    return {
        "success": True,
        "verified": bool(payment.verified),
        "payment_id": payment.payment_id,
        "payment_record_id": payment.id,
        "order_id": order.id,
        "order_status": order.status,
        "amount": float(order.total or 0),
        "currency": "INR",
        "method": payment.method,
        "mode": payment.mode,
        "status": payment.status,
        "gateway_order_id": payment.gateway_order_id,
    }


# ============================================================
# CREATE PAYMENT ORDER
# ============================================================

@router.post("/create-order")
def create_payment_order(
    data: PaymentCreate,
    user=Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    """
    Creates/resumes payment for an existing TEXVERSE order.

    SECURITY:
    - Order must belong to logged-in buyer.
    - Amount is read from backend Order.
    - Frontend cannot modify payment amount.
    """

    method = (data.method or "gateway").strip().lower()

    if method not in VALID_METHODS:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment method.",
        )

    order = _get_buyer_order(
        db=db,
        order_id=data.order_id,
        user=user,
    )

    amount = float(order.total or 0)

    if amount <= 0:
        raise HTTPException(
            status_code=400,
            detail="This order has an invalid payment amount.",
        )

    mode = _payment_mode()

    payment = _get_or_create_payment(
        db=db,
        order=order,
        user=user,
        method=method,
        mode=mode,
    )

    # Already paid.
    if payment.verified:
        db.commit()

        return _payment_response(
            payment=payment,
            order=order,
        )

    # ========================================================
    # DEMO MODE
    # ========================================================

    if mode == "demo":
        if not payment.gateway_order_id:
            payment.gateway_order_id = (
                f"DEMO-ORDER-{order.id}-{uuid4().hex[:12].upper()}"
            )

        payment.status = "pending_verification"
        payment.mode = "demo"

        db.commit()
        db.refresh(payment)

        return {
            "success": True,
            "mode": "demo",
            "verified": False,
            "order_id": order.id,
            "payment_record_id": payment.id,
            "amount": amount,
            "currency": "INR",
            "method": method,
            "gateway_order_id": payment.gateway_order_id,
            "key_id": None,
            "status": payment.status,
            "demo_otp_required": True,
        }

    # ========================================================
    # RAZORPAY MODE
    # ========================================================

    try:
        import razorpay
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail=(
                "Razorpay is configured but the Razorpay package "
                "is not installed on the backend."
            ),
        )

    config = settings()

    try:
        client = razorpay.Client(
            auth=(
                config["RAZORPAY_KEY_ID"],
                config["RAZORPAY_KEY_SECRET"],
            )
        )

        # Reuse an existing gateway order when possible.
        if not payment.gateway_order_id:
            razorpay_order = client.order.create(
                {
                    "amount": int(round(amount * 100)),
                    "currency": "INR",
                    "receipt": f"TXV-ORDER-{order.id}",
                    "notes": {
                        "texverse_order_id": str(order.id),
                        "buyer_id": str(user.id),
                        "payment_record_id": str(payment.id),
                    },
                }
            )

            payment.gateway_order_id = razorpay_order["id"]

        payment.status = "pending_gateway"
        payment.mode = "razorpay"

        db.commit()
        db.refresh(payment)

        return {
            "success": True,
            "mode": "razorpay",
            "verified": False,
            "order_id": order.id,
            "payment_record_id": payment.id,
            "amount": amount,
            "amount_paise": int(round(amount * 100)),
            "currency": "INR",
            "method": method,
            "gateway_order_id": payment.gateway_order_id,
            "key_id": config["RAZORPAY_KEY_ID"],
            "status": payment.status,
            "demo_otp_required": False,
        }

    except HTTPException:
        raise

    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=502,
            detail=f"Unable to create secure payment order: {str(exc)}",
        )


# ============================================================
# DEMO PAYMENT VERIFICATION
# ============================================================

@router.post("/demo-success")
def demo_payment_success(
    data: DemoPaymentSuccess,
    user=Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    """
    Secure demo payment verification.

    Demo OTP:
        123456

    The endpoint verifies:
    - logged-in buyer
    - order ownership
    - payment record
    - amount from server-side order
    - OTP
    - duplicate payment protection
    """

    order = _get_buyer_order(
        db=db,
        order_id=data.order_id,
        user=user,
    )

    payment = (
        db.query(Payment)
        .filter(
            Payment.order_id == order.id,
            Payment.buyer_id == user.id,
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment session not found. Please start payment again.",
        )

    # Already successfully verified.
    if payment.verified:
        return _payment_response(
            payment=payment,
            order=order,
        )

    if payment.mode != "demo":
        raise HTTPException(
            status_code=400,
            detail="This order is configured for a real payment gateway.",
        )

    if data.otp != "123456":
        payment.status = "failed"

        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP. Please enter the correct 6-digit verification code.",
        )

    # Never trust frontend amount.
    payment.amount = float(order.total or 0)
    payment.currency = "INR"
    payment.method = (
        data.method.strip().lower()
        if data.method
        else payment.method
    )

    if payment.method not in VALID_METHODS:
        payment.method = "gateway"

    payment.payment_id = (
        f"DEMO-PAY-{order.id}-{uuid4().hex[:12].upper()}"
    )

    payment.status = "verified"
    payment.verified = True
    payment.verified_at = _utc_now()

    db.commit()
    db.refresh(payment)

    return _payment_response(
        payment=payment,
        order=order,
    )


# ============================================================
# RAZORPAY VERIFICATION
# ============================================================

@router.post("/verify")
def verify_razorpay_payment(
    data: PaymentVerify,
    user=Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    """
    Verifies Razorpay signature server-side and associates the
    payment with the correct TEXVERSE order.
    """

    if not _razorpay_configured():
        raise HTTPException(
            status_code=503,
            detail="Razorpay is not configured. The system is currently in demo payment mode.",
        )

    order = _get_buyer_order(
        db=db,
        order_id=data.texverse_order_id,
        user=user,
    )

    payment = (
        db.query(Payment)
        .filter(
            Payment.order_id == order.id,
            Payment.buyer_id == user.id,
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment session not found for this order.",
        )

    # Duplicate success is safe.
    if payment.verified:
        return _payment_response(
            payment=payment,
            order=order,
        )

    if payment.gateway_order_id != data.razorpay_order_id:
        raise HTTPException(
            status_code=400,
            detail="Payment order does not match the TEXVERSE order.",
        )

    try:
        import razorpay
    except ImportError:
        raise HTTPException(
            status_code=503,
            detail="Razorpay package is not installed on the backend.",
        )

    config = settings()

    try:
        client = razorpay.Client(
            auth=(
                config["RAZORPAY_KEY_ID"],
                config["RAZORPAY_KEY_SECRET"],
            )
        )

        # First verify the cryptographic signature.
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": data.razorpay_order_id,
                "razorpay_payment_id": data.razorpay_payment_id,
                "razorpay_signature": data.razorpay_signature,
            }
        )

        # Fetch gateway order and verify the amount/currency against
        # the authoritative TEXVERSE order.
        gateway_order = client.order.fetch(
            data.razorpay_order_id
        )

        expected_amount = int(round(float(order.total or 0) * 100))

        gateway_amount = int(
            gateway_order.get("amount", 0)
        )

        gateway_currency = (
            gateway_order.get("currency") or "INR"
        ).upper()

        if gateway_amount != expected_amount:
            payment.status = "failed"
            db.commit()

            raise HTTPException(
                status_code=400,
                detail="Payment amount does not match the TEXVERSE order.",
            )

        if gateway_currency != "INR":
            payment.status = "failed"
            db.commit()

            raise HTTPException(
                status_code=400,
                detail="Unsupported payment currency.",
            )

        payment.amount = float(order.total or 0)
        payment.currency = "INR"
        payment.method = "gateway"
        payment.mode = "razorpay"
        payment.payment_id = data.razorpay_payment_id
        payment.signature = data.razorpay_signature
        payment.status = "verified"
        payment.verified = True
        payment.verified_at = _utc_now()

        db.commit()
        db.refresh(payment)

        return _payment_response(
            payment=payment,
            order=order,
        )

    except HTTPException:
        raise

    except Exception:
        payment.status = "failed"
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Payment verification failed. Please try the payment again.",
        )


# ============================================================
# PAYMENT STATUS
# ============================================================

@router.get("/status/{order_id}")
def payment_status(
    order_id: int,
    user=Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    """
    Allows the Payment page to safely restore its state after
    refresh/navigation.
    """

    order = _get_buyer_order(
        db=db,
        order_id=order_id,
        user=user,
    )

    payment = (
        db.query(Payment)
        .filter(
            Payment.order_id == order.id,
            Payment.buyer_id == user.id,
        )
        .first()
    )

    if not payment:
        return {
            "success": True,
            "exists": False,
            "verified": False,
            "order_id": order.id,
            "amount": float(order.total or 0),
            "currency": "INR",
            "order_status": order.status,
        }

    return {
        "success": True,
        "exists": True,
        "verified": bool(payment.verified),
        "payment_record_id": payment.id,
        "payment_id": payment.payment_id,
        "gateway_order_id": payment.gateway_order_id,
        "order_id": order.id,
        "order_status": order.status,
        "amount": float(order.total or 0),
        "currency": payment.currency or "INR",
        "method": payment.method,
        "mode": payment.mode,
        "status": payment.status,
        "created_at": payment.created_at.isoformat()
        if payment.created_at
        else None,
        "verified_at": payment.verified_at.isoformat()
        if payment.verified_at
        else None,
    }
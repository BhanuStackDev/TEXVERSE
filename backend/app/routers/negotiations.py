from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field

from app.database import get_db
from app.auth import require_role
from app.models import Negotiation, Product


router = APIRouter(
    prefix="/negotiations",
    tags=["Negotiations"],
)


class NegIn(BaseModel):
    product_id: int
    supplier_id: int
    quantity: int = Field(ge=1)
    offer_price: float = Field(gt=0)
    message: str = ""


class NegStatusIn(BaseModel):
    status: str


@router.post("", status_code=201)
def create(
    data: NegIn,
    user=Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    product = db.get(Product, data.product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    if product.supplier_id != data.supplier_id:
        raise HTTPException(
            status_code=400,
            detail="Product and supplier do not match",
        )

    negotiation = Negotiation(
        buyer_id=user.id,
        **data.model_dump(),
    )

    db.add(negotiation)
    db.commit()
    db.refresh(negotiation)

    return negotiation


@router.get("/mine")
def mine(
    user=Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    return (
        db.query(Negotiation)
        .filter(Negotiation.buyer_id == user.id)
        .order_by(Negotiation.created_at.desc())
        .all()
    )


@router.get("/supplier")
def supplier(
    user=Depends(require_role("supplier")),
    db: Session = Depends(get_db),
):
    return (
        db.query(Negotiation)
        .filter(Negotiation.supplier_id == user.id)
        .order_by(Negotiation.created_at.desc())
        .all()
    )


@router.get("/admin/all")
def admin_all(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return (
        db.query(Negotiation)
        .order_by(Negotiation.created_at.desc())
        .all()
    )


@router.patch("/admin/{negotiation_id}/status")
def admin_update_status(
    negotiation_id: int,
    data: NegStatusIn,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    negotiation = db.get(Negotiation, negotiation_id)

    if not negotiation:
        raise HTTPException(
            status_code=404,
            detail="Negotiation not found",
        )

    allowed_statuses = {
        "Open",
        "Accepted",
        "Rejected",
        "Closed",
    }

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid negotiation status",
        )

    negotiation.status = data.status

    db.commit()
    db.refresh(negotiation)

    return negotiation
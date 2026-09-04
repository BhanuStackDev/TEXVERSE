from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.auth import require_role
from app.models import User, Product, Order


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ============================================================
# SCHEMAS
# ============================================================

class RoleUpdate(BaseModel):
    role: str


class ProductVerify(BaseModel):
    verified: bool


class AvailabilityUpdate(BaseModel):
    available: bool


# ============================================================
# ADMIN OVERVIEW
# ============================================================

@router.get("/overview")
def overview(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return {
        "users": db.query(User).count(),

        "buyers": db.query(User).filter(
            User.role == "buyer"
        ).count(),

        "suppliers": db.query(User).filter(
            User.role == "supplier"
        ).count(),

        "shipping": db.query(User).filter(
            User.role == "shipping"
        ).count(),

        "products": db.query(Product).count(),

        "pending_products": db.query(Product).filter(
            Product.verified.is_(False)
        ).count(),

        "orders": db.query(Order).count(),
    }


# ============================================================
# USERS
# ============================================================

@router.get("/users")
def users(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )


# ============================================================
# CHANGE USER ROLE
# ============================================================

@router.patch("/users/{user_id}/role")
def set_role(
    user_id: int,
    data: RoleUpdate,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    role = str(data.role).lower().strip()

    allowed_roles = {
        "buyer",
        "supplier",
        "shipping",
        "admin",
    }

    if role not in allowed_roles:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid role. Allowed roles: "
                "buyer, supplier, shipping, admin"
            ),
        )

    obj = db.get(User, user_id)

    if not obj:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    obj.role = role

    db.commit()
    db.refresh(obj)

    return obj


# ============================================================
# PRODUCTS
# ============================================================

@router.get("/products")
def products(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return (
        db.query(Product)
        .order_by(Product.created_at.desc())
        .all()
    )


# ============================================================
# VERIFY PRODUCT
# ============================================================

@router.patch("/products/{product_id}/verify")
def verify(
    product_id: int,
    data: ProductVerify,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    product.verified = data.verified

    # If product is unverified, make it unavailable.
    # If verified, preserve the existing availability value.
    if not data.verified:
        product.available = False

    db.commit()
    db.refresh(product)

    return product


# ============================================================
# PRODUCT AVAILABILITY
# ============================================================

@router.patch("/products/{product_id}/availability")
def availability(
    product_id: int,
    data: AvailabilityUpdate,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    # An unverified product cannot be made available.
    if data.available and not product.verified:
        raise HTTPException(
            status_code=400,
            detail="Product must be verified before it can be made available.",
        )

    product.available = data.available

    db.commit()
    db.refresh(product)

    return product


# ============================================================
# DELETE PRODUCT
# ============================================================

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted",
    }


# ============================================================
# ORDERS
# ============================================================

@router.get("/orders")
def orders(
    user=Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    return (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .all()
    )
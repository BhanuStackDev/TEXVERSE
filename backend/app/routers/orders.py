from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Product, Order, OrderItem
from app.schemas import OrderCreate, StatusUpdate
from app.auth import require_role


router = APIRouter(
    prefix="/orders",
    tags=["Orders"],
)


# =========================================================
# ALLOWED SUPPLIER ORDER STATUSES
# =========================================================

ALLOWED_STATUSES = {
    "Pending",
    "Accepted",
    "Preparing",
    "Ready for Dispatch",
    "Completed",
    "Cancelled",
}


# =========================================================
# ORDER ITEM SERIALIZER
# =========================================================

def serialize_order_item(item: OrderItem):
    return {
        "id": item.id,
        "order_id": item.order_id,
        "product_id": item.product_id,
        "name": item.name,
        "supplier": item.supplier,
        "price": float(item.price or 0),
        "quantity": int(item.quantity or 0),
        "image": item.image or "",
        "subtotal": float(item.price or 0) * int(item.quantity or 0),
    }


# =========================================================
# ORDER SERIALIZER
# =========================================================

def serialize_order(order: Order):
    items = [
        serialize_order_item(item)
        for item in (order.items or [])
    ]

    return {
        "id": order.id,
        "order_number": order.id,
        "buyer_id": order.buyer_id,
        "status": order.status,
        "total": float(order.total or 0),

        "company_name": order.company_name or "",
        "contact_person": order.contact_person or "",
        "email": order.email or "",
        "phone": order.phone or "",
        "shipping_address": order.shipping_address or "",

        "created_at": (
            order.created_at.isoformat()
            if order.created_at
            else None
        ),

        "items": items,
        "order_items": items,
        "item_count": len(items),
    }


# =========================================================
# CREATE BUYER ORDER
# =========================================================

@router.post("", status_code=201)
def create_order(
    data: OrderCreate,
    user: User = Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    if not data.items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty",
        )

    total = 0
    order_items = []

    # -----------------------------------------------------
    # Validate every product before creating the order
    # -----------------------------------------------------

    for item in data.items:

        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id,
                Product.available.is_(True),
                Product.verified.is_(True),
            )
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Product {item.product_id} not found, "
                    "unavailable, or not verified."
                ),
            )

        # -------------------------------------------------
        # Quantity validation
        # -------------------------------------------------

        if item.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Invalid quantity for product "
                    f"{product.name}."
                ),
            )

        # -------------------------------------------------
        # MOQ validation
        # -------------------------------------------------

        try:
            moq_value = float(product.moq)
        except (TypeError, ValueError):
            moq_value = 0

        if moq_value > 0 and item.quantity < moq_value:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Minimum order quantity for "
                    f"{product.name} is {product.moq}."
                ),
            )

        # -------------------------------------------------
        # Stock validation
        # -------------------------------------------------

        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for "
                    f"{product.name}."
                ),
            )

        # -------------------------------------------------
        # Calculate total
        # -------------------------------------------------

        total += float(product.price) * item.quantity

        order_items.append(
            (
                product,
                item.quantity,
            )
        )

    # =====================================================
    # CREATE ORDER
    # =====================================================

    order = Order(
        buyer_id=user.id,
        total=total,
        company_name=data.company_name,
        contact_person=data.contact_person,
        email=data.email,
        phone=data.phone,
        shipping_address=data.shipping_address,
    )

    db.add(order)
    db.flush()

    # =====================================================
    # CREATE ORDER ITEMS + REDUCE STOCK
    # =====================================================

    for product, quantity in order_items:

        product.stock -= quantity

        db.add(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                name=product.name,
                supplier=product.supplier,
                price=product.price,
                quantity=quantity,
                image=product.image,
            )
        )

    db.commit()
    db.refresh(order)

    # Force relationship loading after commit.
    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    return {
        "id": order.id,
        "order_number": order.id,
        "status": order.status,
        "total": float(order.total or 0),
        "company_name": order.company_name or "",
        "contact_person": order.contact_person or "",
        "email": order.email or "",
        "phone": order.phone or "",
        "shipping_address": order.shipping_address or "",
        "created_at": (
            order.created_at.isoformat()
            if order.created_at
            else None
        ),
        "items": [
            serialize_order_item(item)
            for item in items
        ],
        "order_items": [
            serialize_order_item(item)
            for item in items
        ],
        "item_count": len(items),
    }


# =========================================================
# BUYER — MY ORDERS
# =========================================================

@router.get("/mine")
def my_orders(
    user: User = Depends(require_role("buyer")),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(
            Order.buyer_id == user.id,
        )
        .order_by(
            Order.created_at.desc(),
        )
        .all()
    )

    return [
        serialize_order(order)
        for order in orders
    ]


# =========================================================
# BUYER — SINGLE ORDER
# =========================================================

@router.get("/{order_id}")
def get_my_order(
    order_id: int,
    user: User = Depends(require_role("buyer")),
    db: Session = Depends(get_db),
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
            detail="Order not found",
        )

    return serialize_order(order)


# =========================================================
# SUPPLIER — INCOMING ORDERS
# =========================================================

@router.get("/supplier")
def supplier_orders(
    user: User = Depends(require_role("supplier")),
    db: Session = Depends(get_db),
):
    supplier_product_ids = [
        product_id
        for (product_id,) in (
            db.query(Product.id)
            .filter(
                Product.supplier_id == user.id,
            )
            .all()
        )
    ]

    if not supplier_product_ids:
        return []

    order_ids = (
        db.query(OrderItem.order_id)
        .filter(
            OrderItem.product_id.in_(
                supplier_product_ids
            )
        )
        .distinct()
        .all()
    )

    order_id_values = [
        order_id
        for (order_id,) in order_ids
    ]

    if not order_id_values:
        return []

    orders = (
        db.query(Order)
        .filter(
            Order.id.in_(order_id_values)
        )
        .order_by(
            Order.created_at.desc()
        )
        .all()
    )

    return [
        serialize_order(order)
        for order in orders
    ]


# =========================================================
# SUPPLIER — UPDATE ORDER STATUS
# =========================================================

@router.patch("/{order_id}/status")
def update_status(
    order_id: int,
    data: StatusUpdate,
    user: User = Depends(require_role("supplier")),
    db: Session = Depends(get_db),
):
    if data.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid order status. "
                "Allowed statuses: "
                + ", ".join(sorted(ALLOWED_STATUSES))
            ),
        )

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    supplier_product_ids = {
        product.id
        for product in (
            db.query(Product)
            .filter(
                Product.supplier_id == user.id,
            )
            .all()
        )
    }

    owns_order_item = any(
        item.product_id in supplier_product_ids
        for item in order.items
    )

    if not owns_order_item:
        raise HTTPException(
            status_code=403,
            detail="Not your order",
        )

    order.status = data.status

    db.commit()
    db.refresh(order)

    return {
        "message": "Status updated",
        "status": order.status,
    }


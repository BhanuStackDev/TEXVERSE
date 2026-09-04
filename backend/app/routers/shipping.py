from datetime import datetime
from typing import Optional
import secrets
import string

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import require_roles
from app.models import Order, Shipment, Vehicle, DeliveryStaff


router = APIRouter(
    prefix="/shipping",
    tags=["Shipping"],
)

shipping_access = require_roles("admin", "shipping")
buyer_access = require_roles("buyer")


# ============================================================
# SCHEMAS
# ============================================================

class ShipmentIn(BaseModel):
    order_id: int
    carrier: Optional[str] = None
    status: Optional[str] = "Pending"
    current_location: Optional[str] = None
    eta: Optional[str] = None
    pickup_address: Optional[str] = None
    delivery_address: Optional[str] = None
    delivery_staff_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    notes: Optional[str] = None


class VehicleIn(BaseModel):
    registration_number: str
    vehicle_type: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None
    capacity: Optional[str] = None
    active: bool = True


class StaffIn(BaseModel):
    name: str
    phone: Optional[str] = None
    staff_code: Optional[str] = None
    license_number: Optional[str] = None
    city: Optional[str] = None
    active: bool = True


# ============================================================
# HELPERS
# ============================================================

def generate_tracking_number(
    db: Session,
    order_id: int,
) -> str:
    """
    Generate a unique TEXVERSE tracking number.

    Example:
    TXV-20260903-ORD000123-A1B2
    """

    date_part = datetime.utcnow().strftime("%Y%m%d")
    order_part = f"{order_id:06d}"

    alphabet = string.ascii_uppercase + string.digits

    for _ in range(20):
        random_part = "".join(
            secrets.choice(alphabet)
            for _ in range(4)
        )

        tracking_number = (
            f"TXV-{date_part}-ORD{order_part}-{random_part}"
        )

        exists = (
            db.query(Shipment)
            .filter(
                Shipment.tracking_number == tracking_number
            )
            .first()
        )

        if not exists:
            return tracking_number

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Unable to generate a unique tracking number.",
    )


def serialize_vehicle(vehicle: Vehicle):
    return {
        "id": vehicle.id,
        "registration_number": vehicle.registration_number,
        "vehicle_type": vehicle.vehicle_type,
        "model": vehicle.model,
        "color": vehicle.color,
        "capacity": vehicle.capacity,
        "active": vehicle.active,
        "created_at": vehicle.created_at,
    }


def serialize_staff(staff: DeliveryStaff):
    return {
        "id": staff.id,
        "name": staff.name,
        "phone": staff.phone,
        "staff_code": staff.staff_code,
        "license_number": staff.license_number,
        "city": staff.city,
        "active": staff.active,
        "created_at": staff.created_at,
    }


def serialize_shipment(
    shipment: Shipment,
    include_private: bool = False,
):
    data = {
        "id": shipment.id,
        "order_id": shipment.order_id,
        "carrier": shipment.carrier,
        "tracking_number": shipment.tracking_number,
        "status": shipment.status,
        "current_location": shipment.current_location,
        "eta": shipment.eta,
        "pickup_address": shipment.pickup_address,
        "delivery_address": shipment.delivery_address,
        "notes": shipment.notes,
        "created_at": shipment.created_at,
    }

    if hasattr(shipment, "updated_at"):
        data["updated_at"] = shipment.updated_at

    if include_private:
        data["delivery_staff_id"] = shipment.delivery_staff_id
        data["vehicle_id"] = shipment.vehicle_id

        staff = None

        if shipment.delivery_staff_id:
            staff = (
                db_session_query_delivery_staff(shipment.delivery_staff_id)
            )

        vehicle = None

        if shipment.vehicle_id:
            vehicle = (
                db_session_query_vehicle(shipment.vehicle_id)
            )

        data["delivery_staff"] = (
            serialize_staff(staff)
            if staff
            else None
        )

        data["vehicle"] = (
            serialize_vehicle(vehicle)
            if vehicle
            else None
        )

    return data


# These helpers keep serialization independent from relationships,
# because Shipment currently stores staff_id and vehicle_id without
# SQLAlchemy ForeignKey relationships.
#
# They are replaced at runtime through the active DB session below.
db_session = None


def db_session_query_delivery_staff(staff_id: int):
    if db_session is None:
        return None

    return (
        db_session.query(DeliveryStaff)
        .filter(DeliveryStaff.id == staff_id)
        .first()
    )


def db_session_query_vehicle(vehicle_id: int):
    if db_session is None:
        return None

    return (
        db_session.query(Vehicle)
        .filter(Vehicle.id == vehicle_id)
        .first()
    )


def serialize_shipment_with_db(
    db: Session,
    shipment: Shipment,
    include_private: bool = False,
):
    data = {
        "id": shipment.id,
        "order_id": shipment.order_id,
        "carrier": shipment.carrier,
        "tracking_number": shipment.tracking_number,
        "status": shipment.status,
        "current_location": shipment.current_location,
        "eta": shipment.eta,
        "pickup_address": shipment.pickup_address,
        "delivery_address": shipment.delivery_address,
        "notes": shipment.notes,
        "created_at": shipment.created_at,
    }

    if hasattr(shipment, "updated_at"):
        data["updated_at"] = shipment.updated_at

    if include_private:
        data["delivery_staff_id"] = shipment.delivery_staff_id
        data["vehicle_id"] = shipment.vehicle_id

        staff = None
        vehicle = None

        if shipment.delivery_staff_id:
            staff = (
                db.query(DeliveryStaff)
                .filter(
                    DeliveryStaff.id
                    == shipment.delivery_staff_id
                )
                .first()
            )

        if shipment.vehicle_id:
            vehicle = (
                db.query(Vehicle)
                .filter(
                    Vehicle.id
                    == shipment.vehicle_id
                )
                .first()
            )

        data["delivery_staff"] = (
            serialize_staff(staff)
            if staff
            else None
        )

        data["vehicle"] = (
            serialize_vehicle(vehicle)
            if vehicle
            else None
        )

    return data


# ============================================================
# SHIPPING COMPANIES
# ============================================================

@router.get("/companies")
def get_shipping_companies(
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    rows = (
        db.query(Shipment.carrier)
        .filter(
            Shipment.carrier.isnot(None),
            Shipment.carrier != "",
        )
        .distinct()
        .order_by(Shipment.carrier.asc())
        .all()
    )

    companies = [
        row[0]
        for row in rows
        if row[0]
    ]

    return {
        "companies": companies
    }


# ============================================================
# SHIPMENTS - LIST
# ============================================================

@router.get("/shipments")
def get_shipments(
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    shipments = (
        db.query(Shipment)
        .order_by(
            Shipment.created_at.desc()
        )
        .all()
    )

    return [
        serialize_shipment_with_db(
            db,
            shipment,
            include_private=True,
        )
        for shipment in shipments
    ]


# ============================================================
# SHIPMENT - CREATE
# ============================================================

@router.post(
    "/shipments",
    status_code=status.HTTP_201_CREATED,
)
def create_shipment(
    payload: ShipmentIn,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    order = (
        db.query(Order)
        .filter(Order.id == payload.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    existing = (
        db.query(Shipment)
        .filter(
            Shipment.order_id == payload.order_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A shipment already exists for this order.",
        )

    # --------------------------------------------------------
    # Validate delivery staff
    # --------------------------------------------------------

    delivery_staff = None

    if payload.delivery_staff_id is not None:
        delivery_staff = (
            db.query(DeliveryStaff)
            .filter(
                DeliveryStaff.id
                == payload.delivery_staff_id
            )
            .first()
        )

        if not delivery_staff:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Delivery staff not found.",
            )

        if not delivery_staff.active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected delivery staff is inactive.",
            )

    # --------------------------------------------------------
    # Validate vehicle
    # --------------------------------------------------------

    vehicle = None

    if payload.vehicle_id is not None:
        vehicle = (
            db.query(Vehicle)
            .filter(
                Vehicle.id == payload.vehicle_id
            )
            .first()
        )

        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found.",
            )

        if not vehicle.active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected vehicle is inactive.",
            )

    # --------------------------------------------------------
    # Generate tracking number automatically
    # --------------------------------------------------------

    tracking_number = generate_tracking_number(
        db,
        payload.order_id,
    )

    shipment = Shipment(
        order_id=payload.order_id,
        carrier=(
            payload.carrier.strip()
            if payload.carrier
            else "TEXVERSE Logistics"
        ),
        tracking_number=tracking_number,
        status=(
            payload.status.strip()
            if payload.status
            else "Pending"
        ),
        current_location=(
            payload.current_location.strip()
            if payload.current_location
            else ""
        ),
        eta=(
            payload.eta
            if payload.eta
            else ""
        ),
        pickup_address=(
            payload.pickup_address
            if payload.pickup_address
            else ""
        ),
        delivery_address=(
            payload.delivery_address
            if payload.delivery_address
            else ""
        ),
        delivery_staff_id=payload.delivery_staff_id,
        vehicle_id=payload.vehicle_id,
        notes=(
            payload.notes
            if payload.notes
            else ""
        ),
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)

    return serialize_shipment_with_db(
        db,
        shipment,
        include_private=True,
    )


# ============================================================
# SHIPMENT - UPDATE
# ============================================================

@router.patch("/shipments/{shipment_id}")
def update_shipment(
    shipment_id: int,
    payload: ShipmentIn,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    shipment = (
        db.query(Shipment)
        .filter(
            Shipment.id == shipment_id
        )
        .first()
    )

    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found.",
        )

    order = (
        db.query(Order)
        .filter(Order.id == payload.order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    duplicate = (
        db.query(Shipment)
        .filter(
            Shipment.order_id == payload.order_id,
            Shipment.id != shipment_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Another shipment already exists for this order.",
        )

    # --------------------------------------------------------
    # Validate staff
    # --------------------------------------------------------

    if payload.delivery_staff_id is not None:
        staff = (
            db.query(DeliveryStaff)
            .filter(
                DeliveryStaff.id
                == payload.delivery_staff_id
            )
            .first()
        )

        if not staff:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Delivery staff not found.",
            )

        if not staff.active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected delivery staff is inactive.",
            )

    # --------------------------------------------------------
    # Validate vehicle
    # --------------------------------------------------------

    if payload.vehicle_id is not None:
        vehicle = (
            db.query(Vehicle)
            .filter(
                Vehicle.id == payload.vehicle_id
            )
            .first()
        )

        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found.",
            )

        if not vehicle.active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected vehicle is inactive.",
            )

    # --------------------------------------------------------
    # Update shipment
    # --------------------------------------------------------

    shipment.order_id = payload.order_id

    shipment.carrier = (
        payload.carrier.strip()
        if payload.carrier
        else "TEXVERSE Logistics"
    )

    shipment.status = (
        payload.status.strip()
        if payload.status
        else "Pending"
    )

    shipment.current_location = (
        payload.current_location.strip()
        if payload.current_location
        else ""
    )

    shipment.eta = (
        payload.eta
        if payload.eta
        else ""
    )

    shipment.pickup_address = (
        payload.pickup_address
        if payload.pickup_address
        else ""
    )

    shipment.delivery_address = (
        payload.delivery_address
        if payload.delivery_address
        else ""
    )

    shipment.delivery_staff_id = (
        payload.delivery_staff_id
    )

    shipment.vehicle_id = (
        payload.vehicle_id
    )

    shipment.notes = (
        payload.notes
        if payload.notes
        else ""
    )

    # --------------------------------------------------------
    # Keep existing tracking number.
    # Generate one only if old data is empty.
    # --------------------------------------------------------

    if not shipment.tracking_number:
        shipment.tracking_number = (
            generate_tracking_number(
                db,
                shipment.order_id,
            )
        )

    if hasattr(shipment, "updated_at"):
        shipment.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(shipment)

    return serialize_shipment_with_db(
        db,
        shipment,
        include_private=True,
    )


# ============================================================
# SHIPMENT - DELETE
# ============================================================

@router.delete("/shipments/{shipment_id}")
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    shipment = (
        db.query(Shipment)
        .filter(
            Shipment.id == shipment_id
        )
        .first()
    )

    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found.",
        )

    db.delete(shipment)
    db.commit()

    return {
        "message": "Shipment deleted successfully."
    }


# ============================================================
# BUYER TRACKING
# ============================================================

@router.get("/tracking/{order_id}")
def get_order_tracking(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(buyer_access),
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found.",
        )

    if order.buyer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to track this order.",
        )

    shipment = (
        db.query(Shipment)
        .filter(
            Shipment.order_id == order_id
        )
        .first()
    )

    if not shipment:
        return {
            "order_id": order.id,
            "order_status": order.status,
            "shipment": None,
            "message": "Shipment has not been created yet.",
        }

    return {
        "order_id": order.id,
        "order_status": order.status,
        "shipment": serialize_shipment_with_db(
            db,
            shipment,
            include_private=True,
        ),
    }


# ============================================================
# VEHICLES - LIST
# ============================================================

@router.get("/vehicles")
def get_vehicles(
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    vehicles = (
        db.query(Vehicle)
        .order_by(Vehicle.id.desc())
        .all()
    )

    return [
        serialize_vehicle(vehicle)
        for vehicle in vehicles
    ]


# ============================================================
# VEHICLES - CREATE
# ============================================================

@router.post(
    "/vehicles",
    status_code=status.HTTP_201_CREATED,
)
def create_vehicle(
    payload: VehicleIn,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    registration_number = (
        payload.registration_number.strip()
    )

    if not registration_number:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Registration number is required.",
        )

    existing = (
        db.query(Vehicle)
        .filter(
            Vehicle.registration_number
            == registration_number
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle registration number already exists.",
        )

    vehicle = Vehicle(
        registration_number=registration_number,
        vehicle_type=(
            payload.vehicle_type or ""
        ).strip(),
        model=(
            payload.model or ""
        ).strip(),
        color=(
            payload.color or ""
        ).strip(),
        capacity=(
            payload.capacity or ""
        ).strip(),
        active=payload.active,
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return serialize_vehicle(vehicle)


# ============================================================
# VEHICLES - UPDATE
# ============================================================

@router.patch("/vehicles/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    payload: VehicleIn,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id
        )
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found.",
        )

    registration_number = (
        payload.registration_number.strip()
    )

    duplicate = (
        db.query(Vehicle)
        .filter(
            Vehicle.registration_number
            == registration_number,
            Vehicle.id != vehicle_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle registration number already exists.",
        )

    vehicle.registration_number = registration_number
    vehicle.vehicle_type = (
        payload.vehicle_type or ""
    ).strip()
    vehicle.model = (
        payload.model or ""
    ).strip()
    vehicle.color = (
        payload.color or ""
    ).strip()
    vehicle.capacity = (
        payload.capacity or ""
    ).strip()
    vehicle.active = payload.active

    db.commit()
    db.refresh(vehicle)

    return serialize_vehicle(vehicle)


# ============================================================
# VEHICLES - DELETE
# ============================================================

@router.delete("/vehicles/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id
        )
        .first()
    )

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found.",
        )

    db.delete(vehicle)
    db.commit()

    return {
        "message": "Vehicle deleted successfully."
    }


# ============================================================
# DELIVERY STAFF - LIST
# ============================================================

@router.get("/delivery-staff")
def get_delivery_staff(
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    staff = (
        db.query(DeliveryStaff)
        .order_by(DeliveryStaff.id.desc())
        .all()
    )

    return [
        serialize_staff(member)
        for member in staff
    ]


# ============================================================
# DELIVERY STAFF - CREATE
# ============================================================

@router.post(
    "/delivery-staff",
    status_code=status.HTTP_201_CREATED,
)
def create_delivery_staff(
    payload: StaffIn,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    name = (payload.name or "").strip()
    phone = (payload.phone or "").strip()
    staff_code = (payload.staff_code or "").strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff name is required.",
        )

    if not phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff phone is required.",
        )

    if not staff_code:
        staff_code = (
            "STAFF-"
            + datetime.utcnow().strftime("%Y%m%d%H%M%S")
            + "-"
            + "".join(
                secrets.choice(
                    string.ascii_uppercase
                    + string.digits
                )
                for _ in range(4)
            )
        )

    existing = (
        db.query(DeliveryStaff)
        .filter(
            DeliveryStaff.staff_code
            == staff_code
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff code already exists.",
        )

    member = DeliveryStaff(
        name=name,
        phone=phone,
        staff_code=staff_code,
        license_number=(
            payload.license_number or ""
        ).strip(),
        city=(
            payload.city or ""
        ).strip(),
        active=payload.active,
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return serialize_staff(member)


# ============================================================
# DELIVERY STAFF - UPDATE
# ============================================================

@router.patch("/delivery-staff/{staff_id}")
def update_delivery_staff(
    staff_id: int,
    payload: StaffIn,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    member = (
        db.query(DeliveryStaff)
        .filter(
            DeliveryStaff.id == staff_id
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery staff not found.",
        )

    name = (payload.name or "").strip()
    phone = (payload.phone or "").strip()
    staff_code = (payload.staff_code or "").strip()

    if not name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff name is required.",
        )

    if not phone:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff phone is required.",
        )

    if not staff_code:
        staff_code = member.staff_code

    duplicate = (
        db.query(DeliveryStaff)
        .filter(
            DeliveryStaff.staff_code
            == staff_code,
            DeliveryStaff.id != staff_id,
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Staff code already exists.",
        )

    member.name = name
    member.phone = phone
    member.staff_code = staff_code
    member.license_number = (
        payload.license_number or ""
    ).strip()
    member.city = (
        payload.city or ""
    ).strip()
    member.active = payload.active

    db.commit()
    db.refresh(member)

    return serialize_staff(member)


# ============================================================
# DELIVERY STAFF - DELETE
# ============================================================

@router.delete("/delivery-staff/{staff_id}")
def delete_delivery_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(shipping_access),
):
    member = (
        db.query(DeliveryStaff)
        .filter(
            DeliveryStaff.id == staff_id
        )
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Delivery staff not found.",
        )

    db.delete(member)
    db.commit()

    return {
        "message": "Delivery staff deleted successfully."
    }
from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    full_name = Column(
        String(120),
        nullable=False,
    )

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(20),
        nullable=False,
        default="buyer",
    )

    company_name = Column(String(160))
    phone = Column(String(40))
    city = Column(String(80))
    state = Column(String(80))

    country = Column(
        String(80),
        default="India",
    )

    # Global UI / communication language.
    # Existing database rows are migrated to "en".
    language = Column(
        String(20),
        default="en",
        nullable=False,
    )

    email_verified = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    orders = relationship(
        "Order",
        back_populates="buyer",
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)

    name = Column(
        String(180),
        nullable=False,
    )

    category = Column(
        String(80),
        nullable=False,
        index=True,
    )

    subcategory = Column(
        String(120),
        nullable=False,
        default="General",
    )

    supplier = Column(
        String(160),
        nullable=False,
    )

    description = Column(
        Text,
        default="",
    )

    price = Column(
        Float,
        nullable=False,
    )

    moq = Column(
        String(80),
        nullable=False,
    )

    stock = Column(
        Integer,
        default=0,
    )

    image = Column(
        String(500),
        default="",
    )

    verified = Column(
        Boolean,
        default=True,
    )

    available = Column(
        Boolean,
        default=True,
    )

    supplier_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)

    buyer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    status = Column(
        String(40),
        default="Pending",
    )

    total = Column(
        Float,
        nullable=False,
    )

    company_name = Column(String(160))
    contact_person = Column(String(120))
    email = Column(String(255))
    phone = Column(String(40))
    shipping_address = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )

    buyer = relationship(
        "User",
        back_populates="orders",
    )

    items = relationship(
        "OrderItem",
        cascade="all, delete-orphan",
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False,
    )

    product_id = Column(
        Integer,
        nullable=False,
    )

    name = Column(
        String(180),
        nullable=False,
    )

    supplier = Column(
        String(160),
        nullable=False,
    )

    price = Column(
        Float,
        nullable=False,
    )

    quantity = Column(
        Integer,
        default=1,
    )

    image = Column(
        String(500),
        default="",
    )


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False,
        index=True,
    )

    carrier = Column(
        String(120),
        default="TEXVERSE Logistics",
    )

    tracking_number = Column(
        String(120),
        default="",
        index=True,
    )

    status = Column(
        String(60),
        default="Order Placed",
        index=True,
    )

    current_location = Column(
        String(200),
        default="",
    )

    eta = Column(
        String(120),
        default="",
    )

    pickup_address = Column(
        Text,
        default="",
    )

    delivery_address = Column(
        Text,
        default="",
    )

    delivery_staff_id = Column(
        Integer,
        nullable=True,
    )

    vehicle_id = Column(
        Integer,
        nullable=True,
    )

    notes = Column(
        Text,
        default="",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True)

    registration_number = Column(
        String(80),
        unique=True,
        index=True,
        nullable=False,
    )

    vehicle_type = Column(
        String(80),
        nullable=False,
    )

    model = Column(
        String(120),
        default="",
    )

    color = Column(
        String(60),
        default="",
    )

    capacity = Column(
        String(80),
        default="",
    )

    active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class DeliveryStaff(Base):
    __tablename__ = "delivery_staff"

    id = Column(Integer, primary_key=True)

    name = Column(
        String(120),
        nullable=False,
    )

    phone = Column(
        String(40),
        nullable=False,
    )

    staff_code = Column(
        String(80),
        unique=True,
        index=True,
        nullable=False,
    )

    license_number = Column(
        String(100),
        default="",
    )

    city = Column(
        String(80),
        default="",
    )

    active = Column(
        Boolean,
        default=True,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class Negotiation(Base):
    __tablename__ = "negotiations"

    id = Column(Integer, primary_key=True)

    buyer_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    supplier_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    offer_price = Column(
        Float,
        nullable=False,
    )

    status = Column(
        String(40),
        default="Open",
    )

    message = Column(
        Text,
        default="",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    subject = Column(
        String(180),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    status = Column(
        String(40),
        default="Open",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        index=True,
        nullable=False,
    )

    title = Column(
        String(180),
        nullable=False,
    )

    message = Column(
        Text,
        nullable=False,
    )

    read = Column(
        Boolean,
        default=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(
        Integer,
        primary_key=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    token = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    expires_at = Column(
        DateTime,
        nullable=False,
    )

    used = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(
        Integer,
        primary_key=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    token = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    expires_at = Column(
        DateTime,
        nullable=False,
    )

    used = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )
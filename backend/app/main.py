from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from app.database import Base, engine
from app.config import settings

from app.routers import (
    auth,
    products,
    orders,
    ai,
    admin,
    shipping,
    negotiations,
    support,
    notifications,
    payments,
)

from app.models import Product


# ============================================================
# PROJECT PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOADS_DIR = BASE_DIR / "uploads"
PRODUCT_UPLOADS_DIR = UPLOADS_DIR / "products"
CATALOG_UPLOADS_DIR = PRODUCT_UPLOADS_DIR / "catalog"

UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

PRODUCT_UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

CATALOG_UPLOADS_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# DATABASE SETUP + SAFE MIGRATION
# ============================================================

def migrate_database():
    """
    Safe TEXVERSE database migration.

    Existing records are preserved.
    Existing product IDs are preserved.
    Existing tables are not dropped.
    Missing tables are created.
    Missing columns are added safely.
    """

    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)
    table_names = inspector.get_table_names()

    # --------------------------------------------------------
    # USERS
    # --------------------------------------------------------

    if "users" in table_names:
        user_columns = {
            column["name"]
            for column in inspector.get_columns("users")
        }

        # Existing installations may not have email_verified.
        if "email_verified" not in user_columns:
            with engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        ALTER TABLE users
                        ADD COLUMN email_verified BOOLEAN
                        DEFAULT 1
                        """
                    )
                )

        # ----------------------------------------------------
        # MULTILINGUAL FOUNDATION
        # ----------------------------------------------------

        if "language" not in user_columns:
            with engine.begin() as connection:
                connection.execute(
                    text(
                        """
                        ALTER TABLE users
                        ADD COLUMN language VARCHAR(20)
                        DEFAULT 'en'
                        """
                    )
                )

                connection.execute(
                    text(
                        """
                        UPDATE users
                        SET language = 'en'
                        WHERE language IS NULL
                        """
                    )
                )

    # --------------------------------------------------------
    # PRODUCTS
    # --------------------------------------------------------

    inspector = inspect(engine)

    if "products" not in inspector.get_table_names():
        return

    columns = {
        column["name"]
        for column in inspector.get_columns("products")
    }

    if "subcategory" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    """
                    ALTER TABLE products
                    ADD COLUMN subcategory VARCHAR(120)
                    """
                )
            )

    # --------------------------------------------------------
    # KNOWN SUBCATEGORIES
    # --------------------------------------------------------

    known_subcategories = [
        {
            "name": "Premium Cotton Fabric",
            "category": "cotton",
            "subcategory": "Cotton Poplin",
        },
        {
            "name": "Blue Denim Fabric",
            "category": "denim",
            "subcategory": "Stretch Denim",
        },
        {
            "name": "Luxury Silk Fabric",
            "category": "silk",
            "subcategory": "Mulberry Silk",
        },
        {
            "name": "Premium Linen Fabric",
            "category": "linen",
            "subcategory": "Pure Linen",
        },
        {
            "name": "High Quality Polyester Fabric",
            "category": "polyester",
            "subcategory": "Performance Polyester",
        },
        {
            "name": "Custom Designer Fabric",
            "category": "custom-fabric",
            "subcategory": "Designer Fabric",
        },
    ]

    with engine.begin() as connection:

        for item in known_subcategories:
            connection.execute(
                text(
                    """
                    UPDATE products
                    SET subcategory = :subcategory
                    WHERE name = :name
                      AND category = :category
                      AND (
                          subcategory IS NULL
                          OR TRIM(subcategory) = ''
                          OR LOWER(TRIM(subcategory)) = 'general'
                      )
                    """
                ),
                item,
            )

        connection.execute(
            text(
                """
                UPDATE products
                SET subcategory = 'General'
                WHERE subcategory IS NULL
                   OR TRIM(subcategory) = ''
                """
            )
        )


migrate_database()


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="TEXVERSE Marketplace API",
    version="2.2.0",
    description=(
        "TEXVERSE B2B textile marketplace backend "
        "with multilingual authentication, email verification, "
        "password recovery, categories, subcategories, "
        "supplier product CRUD, image management, orders, "
        "negotiations, AI procurement, shipping, payments, "
        "support, notifications and admin controls."
    ),
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings()["FRONTEND_ORIGINS"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTERS
# ============================================================

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(ai.router)
app.include_router(admin.router)
app.include_router(shipping.router)
app.include_router(negotiations.router)
app.include_router(support.router)
app.include_router(notifications.router)
app.include_router(payments.router)


# ============================================================
# STATIC UPLOADS
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(UPLOADS_DIR)
    ),
    name="uploads",
)


# ============================================================
# EXISTING CATALOG SAFETY
# ============================================================

def ensure_existing_catalog():
    """
    Create the six original demo products only when
    the database contains no products.

    Existing catalog/products are never deleted.
    """

    db = Session(bind=engine)

    try:
        product_count = db.query(Product).count()

        if product_count > 0:
            return

        demo_products = [
            {
                "name": "Premium Cotton Fabric",
                "category": "cotton",
                "subcategory": "Cotton Poplin",
                "supplier": "Sharma Textiles",
                "price": 450,
                "moq": "500 meters",
                "stock": 2500,
                "description": (
                    "Premium cotton textile suitable for "
                    "apparel and bulk manufacturing."
                ),
            },
            {
                "name": "Blue Denim Fabric",
                "category": "denim",
                "subcategory": "Stretch Denim",
                "supplier": "Global Denim Mills",
                "price": 650,
                "moq": "1000 meters",
                "stock": 1800,
                "description": (
                    "Durable denim fabric for jeans, "
                    "jackets and lifestyle products."
                ),
            },
            {
                "name": "Luxury Silk Fabric",
                "category": "silk",
                "subcategory": "Mulberry Silk",
                "supplier": "Royal Silk House",
                "price": 1200,
                "moq": "300 meters",
                "stock": 900,
                "description": (
                    "Premium silk construction for "
                    "luxury apparel and accessories."
                ),
            },
            {
                "name": "Premium Linen Fabric",
                "category": "linen",
                "subcategory": "Pure Linen",
                "supplier": "Natural Linen Mills",
                "price": 700,
                "moq": "600 meters",
                "stock": 1200,
                "description": (
                    "Breathable natural linen for fashion "
                    "and home textile applications."
                ),
            },
            {
                "name": "High Quality Polyester Fabric",
                "category": "polyester",
                "subcategory": "Performance Polyester",
                "supplier": "Modern Fiber Industries",
                "price": 350,
                "moq": "1000 meters",
                "stock": 3000,
                "description": (
                    "Reliable performance polyester for "
                    "fashion, uniforms and technical applications."
                ),
            },
            {
                "name": "Custom Designer Fabric",
                "category": "custom-fabric",
                "subcategory": "Designer Fabric",
                "supplier": "Tex Custom House",
                "price": 1500,
                "moq": "200 meters",
                "stock": 500,
                "description": (
                    "Made-to-spec textile development for "
                    "private-label and bulk buyers."
                ),
            },
        ]

        for item in demo_products:
            db.add(
                Product(
                    **item,
                    verified=True,
                    available=True,
                )
            )

        db.commit()

    finally:
        db.close()


ensure_existing_catalog()


# ============================================================
# CATALOG IMAGE REPAIR / MAPPING
# ============================================================

def repair_catalog_images():
    """
    Connect existing catalog products to the existing
    TEXVERSE catalog image files.

    Existing non-empty image values are never overwritten.
    Supplier-created products are untouched.
    """

    db = Session(bind=engine)

    try:
        products = (
            db.query(Product)
            .filter(Product.supplier_id.is_(None))
            .order_by(Product.id.asc())
            .all()
        )

        updated_count = 0

        for product in products:

            if product.image and product.image.strip():
                continue

            image_filename = f"texverse-{product.id:03d}.jpg"
            image_file = CATALOG_UPLOADS_DIR / image_filename

            if not image_file.is_file():
                continue

            product.image = (
                f"/uploads/products/catalog/{image_filename}"
            )

            updated_count += 1

        if updated_count > 0:
            db.commit()

        print(
            f"[TEXVERSE] Catalog image repair complete. "
            f"Updated: {updated_count}"
        )

    except Exception as exc:
        db.rollback()

        print(
            f"[TEXVERSE] Catalog image repair failed: {exc}"
        )

    finally:
        db.close()


repair_catalog_images()


# ============================================================
# BASIC SYSTEM ENDPOINTS
# ============================================================

@app.get("/")
def home():
    return {
        "status": "ok",
        "service": "TEXVERSE Marketplace API",
        "version": "2.2.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "TEXVERSE API",
    }


@app.get("/uploads/health")
def uploads_health():
    return {
        "status": "ok",
        "uploads_directory": str(UPLOADS_DIR),
        "products_directory": str(PRODUCT_UPLOADS_DIR),
        "catalog_directory": str(CATALOG_UPLOADS_DIR),
        "uploads_directory_exists": UPLOADS_DIR.exists(),
        "products_directory_exists": PRODUCT_UPLOADS_DIR.exists(),
        "catalog_directory_exists": CATALOG_UPLOADS_DIR.exists(),
    }
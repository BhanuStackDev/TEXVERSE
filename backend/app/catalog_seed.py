import csv
import shutil
from pathlib import Path

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import Product


# ============================================================
# TEXVERSE MASTER CATALOG
# ============================================================

MASTER_CATALOG_COUNT = 479

BASE_DIR = Path(__file__).resolve().parents[2]

CATALOG_DIR = BASE_DIR / "catalog"

CSV_PATH = (
    CATALOG_DIR
    / "texverse_479_master_catalog.csv"
)

IMAGE_SOURCE_DIR = (
    CATALOG_DIR
    / "product-images"
)

IMAGE_DEST_DIR = (
    BASE_DIR
    / "uploads"
    / "products"
    / "catalog"
)


# ============================================================
# OLD DEMO PRODUCTS
# ============================================================

LEGACY_DEMO_NAMES = {
    "Premium Cotton Fabric",
    "Blue Denim Fabric",
    "Luxury Silk Fabric",
    "Premium Linen Fabric",
    "High Quality Polyester Fabric",
    "Custom Designer Fabric",
}


# ============================================================
# LOAD MASTER CATALOG
# ============================================================

def load_rows():
    if not CSV_PATH.is_file():
        raise FileNotFoundError(
            f"Master catalog CSV not found: {CSV_PATH}"
        )

    with CSV_PATH.open(
        "r",
        encoding="utf-8-sig",
        newline="",
    ) as handle:
        rows = list(
            csv.DictReader(handle)
        )

    if len(rows) != MASTER_CATALOG_COUNT:
        raise RuntimeError(
            f"Expected {MASTER_CATALOG_COUNT} catalog rows, "
            f"found {len(rows)}"
        )

    return rows


# ============================================================
# COPY MASTER CATALOG IMAGE
# ============================================================

def copy_image(image_file):
    image_file = str(
        image_file
    ).strip()

    if not image_file:
        raise RuntimeError(
            "Catalog row contains an empty image_file."
        )

    source = (
        IMAGE_SOURCE_DIR
        / image_file
    )

    if not source.is_file():
        raise FileNotFoundError(
            f"Missing catalog image: {source}"
        )

    IMAGE_DEST_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    destination = (
        IMAGE_DEST_DIR
        / image_file
    )

    # Images already copied during a previous startup
    # do not need to be copied again.
    if not destination.is_file():
        shutil.copy2(
            source,
            destination,
        )

    return (
        "/uploads/products/catalog/"
        + image_file
    )


# ============================================================
# BUILD PRODUCT DESCRIPTION
# ============================================================

def build_description(row):
    return (
        f"{row['product_name']} supplied by "
        f"{row['supplier']}. "
        f"{row['subcategory']} textile in "
        f"{row['color']} finish, "
        f"priced for B2B bulk sourcing at "
        f"₹{row['price_per_meter_inr']} per meter. "
        f"MOQ {row['moq_meters']} meters with "
        f"{row['stock_meters']} meters listed stock."
    )


# ============================================================
# MASTER NAMES
# ============================================================

def get_master_names(rows):
    names = set()

    for row in rows:
        name = str(
            row.get(
                "product_name",
                "",
            )
        ).strip()

        if name:
            names.add(name)

    if len(names) != MASTER_CATALOG_COUNT:
        raise RuntimeError(
            "Master catalog product names are not unique. "
            f"Expected {MASTER_CATALOG_COUNT} unique names, "
            f"found {len(names)}."
        )

    return names


# ============================================================
# CHECK WHETHER MASTER CATALOG ALREADY EXISTS
# ============================================================

def master_catalog_is_complete(
    db: Session,
    rows,
):
    master_names = get_master_names(
        rows
    )

    existing_count = (
        db.query(Product)
        .filter(
            Product.supplier_id.is_(None),
            Product.name.in_(master_names),
        )
        .count()
    )

    return (
        existing_count
        >= MASTER_CATALOG_COUNT
    )


# ============================================================
# HIDE OLD SIX DEMO PRODUCTS
# ============================================================

def disable_legacy_demo_products(
    db: Session,
):
    legacy_products = (
        db.query(Product)
        .filter(
            Product.supplier_id.is_(None),
            Product.name.in_(LEGACY_DEMO_NAMES),
        )
        .all()
    )

    changed = 0

    for product in legacy_products:
        if product.available:
            product.available = False
            changed += 1

    return changed


# ============================================================
# IMPORT MASTER CATALOG
# ============================================================

def seed_catalog():

    print(
        "[TEXVERSE] Starting master catalog import..."
    )

    Base.metadata.create_all(
        bind=engine
    )

    rows = load_rows()

    db = SessionLocal()

    created = 0
    updated = 0
    hidden_demo = 0

    try:

        for row in rows:

            name = str(
                row["product_name"]
            ).strip()

            # Only update an existing master/catalog row.
            # Supplier-owned products are never overwritten.
            existing_product = (
                db.query(Product)
                .filter(
                    Product.name == name,
                    Product.supplier_id.is_(None),
                )
                .first()
            )

            image_path = copy_image(
                row["image_file"]
            )

            values = {
                "name": name,

                "category": (
                    str(row["category"])
                    .strip()
                    .lower()
                    .replace(" ", "-")
                ),

                "subcategory": (
                    str(row["subcategory"])
                    .strip()
                ),

                "supplier": (
                    str(row["supplier"])
                    .strip()
                ),

                "description": (
                    build_description(row)
                ),

                "price": float(
                    row["price_per_meter_inr"]
                ),

                "moq": (
                    f"{int(row['moq_meters'])} meters"
                ),

                "stock": int(
                    row["stock_meters"]
                ),

                "image": image_path,

                "verified": (
                    str(row["verified"])
                    .strip()
                    .lower()
                    == "true"
                ),

                "available": (
                    str(row["available"])
                    .strip()
                    .lower()
                    == "true"
                ),
            }

            if existing_product:

                for key, value in values.items():
                    setattr(
                        existing_product,
                        key,
                        value,
                    )

                updated += 1

            else:

                db.add(
                    Product(
                        **values
                    )
                )

                created += 1

        hidden_demo = (
            disable_legacy_demo_products(
                db
            )
        )

        db.commit()

        total_products = (
            db.query(Product).count()
        )

        public_products = (
            db.query(Product)
            .filter(
                Product.available.is_(True),
                Product.verified.is_(True),
            )
            .count()
        )

        print(
            "============================================================"
        )
        print(
            "[TEXVERSE] MASTER CATALOG IMPORT COMPLETE"
        )
        print(
            "============================================================"
        )
        print(
            f"Master catalog : {MASTER_CATALOG_COUNT}"
        )
        print(
            f"Created        : {created}"
        )
        print(
            f"Updated        : {updated}"
        )
        print(
            f"Hidden demos   : {hidden_demo}"
        )
        print(
            f"DB total       : {total_products}"
        )
        print(
            f"Public products: {public_products}"
        )
        print(
            "[TEXVERSE] Existing supplier-owned products preserved."
        )
        print(
            "[TEXVERSE] Existing database rows were not deleted."
        )

    except Exception as exc:

        db.rollback()

        print(
            f"[TEXVERSE] Catalog import FAILED: {exc}"
        )

        raise

    finally:

        db.close()


# ============================================================
# AUTOMATIC STARTUP IMPORT
# ============================================================

def ensure_master_catalog():

    rows = load_rows()

    db = SessionLocal()

    try:

        if master_catalog_is_complete(
            db,
            rows,
        ):

            print(
                "[TEXVERSE] Master catalog already complete "
                f"({MASTER_CATALOG_COUNT} products). "
                "Skipping import."
            )

            return

    finally:

        db.close()

    print(
        "[TEXVERSE] Master catalog incomplete."
    )

    print(
        f"[TEXVERSE] Automatically importing "
        f"{MASTER_CATALOG_COUNT} master products..."
    )

    seed_catalog()


# ============================================================
# DIRECT SCRIPT EXECUTION
# ============================================================

if __name__ == "__main__":
    seed_catalog()
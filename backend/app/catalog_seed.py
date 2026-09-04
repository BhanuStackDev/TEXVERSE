from __future__ import annotations

import csv
import shutil
from pathlib import Path

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import Product

BASE_DIR = Path(__file__).resolve().parents[2]
CATALOG_DIR = BASE_DIR / "catalog"
CSV_PATH = CATALOG_DIR / "texverse_479_master_catalog.csv"
IMAGE_SOURCE_DIR = CATALOG_DIR / "product-images"
IMAGE_DEST_DIR = BASE_DIR / "uploads" / "products" / "catalog"


def load_rows() -> list[dict]:
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))
    if len(rows) != 479:
        raise RuntimeError(f"Expected 479 catalog rows, found {len(rows)}")
    return rows


def copy_image(image_file: str) -> str:
    source = IMAGE_SOURCE_DIR / image_file
    if not source.exists():
        raise FileNotFoundError(f"Missing catalog image: {source}")
    IMAGE_DEST_DIR.mkdir(parents=True, exist_ok=True)
    destination = IMAGE_DEST_DIR / image_file
    shutil.copy2(source, destination)
    return f"/uploads/products/catalog/{image_file}"


def build_description(row: dict) -> str:
    return (
        f"{row['product_name']} supplied by {row['supplier']}. "
        f"{row['subcategory']} textile in {row['color']} finish, "
        f"priced for B2B bulk sourcing at ₹{row['price_per_meter_inr']} per meter. "
        f"MOQ {row['moq_meters']} meters with {row['stock_meters']} meters listed stock."
    )


def seed_catalog() -> None:
    Base.metadata.create_all(bind=engine)
    rows = load_rows()
    db: Session = SessionLocal()
    created = 0
    updated = 0
    try:
        for row in rows:
            name = row["product_name"].strip()
            product = db.query(Product).filter(Product.name == name).first()
            image_path = copy_image(row["image_file"].strip())
            values = {
                "name": name,
                "category": row["category"].strip().lower().replace(" ", "-"),
                "subcategory": row["subcategory"].strip(),
                "supplier": row["supplier"].strip(),
                "description": build_description(row),
                "price": float(row["price_per_meter_inr"]),
                "moq": f"{int(row['moq_meters'])} meters",
                "stock": int(row["stock_meters"]),
                "image": image_path,
                "verified": row["verified"].strip().lower() == "true",
                "available": row["available"].strip().lower() == "true",
            }
            if product:
                # Existing supplier_id is preserved. This keeps current
                # supplier-owned products and historical references intact.
                for key, value in values.items():
                    setattr(product, key, value)
                updated += 1
            else:
                db.add(Product(**values))
                created += 1
        db.commit()
        total = db.query(Product).count()
        print("TEXVERSE catalog import completed")
        print(f"Master catalog rows: {len(rows)}")
        print(f"Created: {created}")
        print(f"Updated by product name: {updated}")
        print(f"Current database product rows: {total}")
        print("Catalog images copied to backend/uploads/products/catalog")
        print("No product table was dropped and no existing row was deleted.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_catalog()

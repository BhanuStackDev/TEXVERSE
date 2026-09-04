from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, User
from app.schemas import ProductCreate
from app.auth import require_role

import os
import uuid

router = APIRouter(prefix="/products", tags=["Products"])

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
}
MAX_IMAGE_SIZE = 5 * 1024 * 1024

# Master TEXVERSE marketplace taxonomy: 16 categories / 119 subcategories.
CATEGORY_SUBCATEGORIES = {'cotton': ['Cotton Poplin',
            'Cotton Twill',
            'Cotton Voile',
            'Cotton Cambric',
            'Cotton Canvas',
            'Cotton Muslin',
            'Cotton Satin',
            'Organic Cotton',
            'Combed Cotton',
            'Cotton Jersey'],
 'denim': ['Stretch Denim',
           'Rigid Denim',
           'Raw Denim',
           'Washed Denim',
           'Selvedge Denim',
           'Black Denim',
           'Colored Denim',
           'Lightweight Denim'],
 'silk': ['Mulberry Silk',
          'Tussar Silk',
          'Silk Satin',
          'Silk Crepe',
          'Silk Chiffon',
          'Silk Organza',
          'Silk Georgette',
          'Dupion Silk'],
 'linen': ['Pure Linen', 'Linen Blend', 'Linen Canvas', 'Linen Rayon', 'Linen Viscose', 'Linen Twill', 'Linen Slub'],
 'polyester': ['Performance Polyester',
               'Polyester Crepe',
               'Polyester Satin',
               'Polyester Georgette',
               'Polyester Taffeta',
               'Micro Polyester',
               'Polyester Spandex'],
 'rayon': ['Rayon Challis', 'Rayon Twill', 'Rayon Crepe', 'Rayon Viscose', 'Rayon Satin', 'Rayon Slub'],
 'viscose': ['Viscose Twill',
             'Viscose Crepe',
             'Viscose Satin',
             'Viscose Georgette',
             'Viscose Challis',
             'Viscose Jacquard'],
 'wool': ['Merino Wool', 'Wool Melton', 'Wool Flannel', 'Wool Blend', 'Tropical Wool', 'Wool Crepe', 'Wool Tweed'],
 'knits': ['Single Jersey',
           'Interlock Knit',
           'Rib Knit',
           'Pique Knit',
           'French Terry',
           'Fleece Knit',
           'Ottoman Knit',
           'Scuba Knit'],
 'blends': ['Cotton Polyester',
            'Cotton Viscose',
            'Cotton Linen',
            'Polyester Viscose',
            'Wool Polyester',
            'Linen Cotton',
            'Cotton Elastane',
            'Polyester Elastane'],
 'technical-textiles': ['Water Repellent Fabric',
                        'Antimicrobial Fabric',
                        'Fire Retardant Fabric',
                        'UV Resistant Fabric',
                        'Breathable Technical Fabric',
                        'Industrial Coated Fabric',
                        'Laminated Fabric'],
 'home-textiles': ['Curtain Fabric',
                   'Upholstery Fabric',
                   'Cushion Fabric',
                   'Bedsheet Fabric',
                   'Table Linen',
                   'Towel Fabric',
                   'Kitchen Textile',
                   'Mattress Fabric'],
 'sustainable-textiles': ['Recycled Polyester',
                          'Recycled Cotton',
                          'Organic Hemp',
                          'Bamboo Viscose',
                          'Tencel Lyocell',
                          'Recycled Denim',
                          'Organic Linen'],
 'functional-fabrics': ['Moisture Wicking',
                        'Quick Dry',
                        'Four Way Stretch',
                        'Two Way Stretch',
                        'Wrinkle Resistant',
                        'Easy Care',
                        'Thermal Fabric'],
 'fashion-fabrics': ['Jacquard Fabric',
                     'Printed Fabric',
                     'Embroidered Fabric',
                     'Lurex Fabric',
                     'Sequin Fabric',
                     'Velvet Fabric',
                     'Corduroy Fabric',
                     'Satin Fabric'],
 'industrial-fabrics': ['Filter Fabric',
                        'Packaging Textile',
                        'Conveyor Textile',
                        'Protective Textile',
                        'Geotextile',
                        'Tarpaulin Fabric',
                        'Canvas Industrial']}


def normalize_category(category: str) -> str:
    return category.strip().lower().replace("_", "-").replace(" ", "-")


def validate_category_subcategory(category: str, subcategory: str):
    normalized_category = normalize_category(category)
    clean_subcategory = subcategory.strip()
    if normalized_category not in CATEGORY_SUBCATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid product category.")
    valid_subcategories = CATEGORY_SUBCATEGORIES[normalized_category]
    matched = next((item for item in valid_subcategories if item.lower() == clean_subcategory.lower()), None)
    if not matched:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid subcategory for {category}. Allowed values: {', '.join(valid_subcategories)}",
        )
    return normalized_category, matched


def delete_local_image(image_path: str):
    if not image_path or not image_path.startswith("/uploads/"):
        return
    relative_path = image_path.lstrip("/")
    if os.path.isfile(relative_path):
        try:
            os.remove(relative_path)
        except OSError:
            pass


@router.get("")
def list_products(category: str | None = None, subcategory: str | None = None, q: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.available.is_(True), Product.verified.is_(True))
    if category:
        query = query.filter(Product.category.ilike(normalize_category(category)))
    if subcategory:
        query = query.filter(Product.subcategory.ilike(subcategory.strip()))
    if q:
        term = f"%{q}%"
        query = query.filter(
            (Product.name.ilike(term))
            | (Product.category.ilike(term))
            | (Product.subcategory.ilike(term))
            | (Product.supplier.ilike(term))
            | (Product.description.ilike(term))
        )
    return query.order_by(Product.created_at.desc(), Product.id.desc()).all()


@router.get("/categories")
def get_categories():
    return [
        {"id": category, "name": category.replace("-", " ").title(), "subcategories": subcategories}
        for category, subcategories in CATEGORY_SUBCATEGORIES.items()
    ]


@router.get("/categories/{category}/subcategories")
def get_subcategories(category: str):
    normalized_category = normalize_category(category)
    subcategories = CATEGORY_SUBCATEGORIES.get(normalized_category)
    if subcategories is None:
        raise HTTPException(status_code=404, detail="Category not found.")
    return {"category": normalized_category, "subcategories": subcategories}


@router.get("/mine/list")
def my_products(user: User = Depends(require_role("supplier")), db: Session = Depends(get_db)):
    return db.query(Product).filter(Product.supplier_id == user.id).order_by(Product.created_at.desc()).all()


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", status_code=201)
def create_product(data: ProductCreate, user: User = Depends(require_role("supplier")), db: Session = Depends(get_db)):
    category, subcategory = validate_category_subcategory(data.category, data.subcategory)
    payload = data.model_dump()
    payload["category"] = category
    payload["subcategory"] = subcategory
    product = Product(**payload, supplier=user.company_name or user.full_name, supplier_id=user.id, verified=False)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}")
def update_product(product_id: int, data: ProductCreate, user: User = Depends(require_role("supplier")), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.supplier_id == user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")
    category, subcategory = validate_category_subcategory(data.category, data.subcategory)
    payload = data.model_dump()
    payload["category"] = category
    payload["subcategory"] = subcategory
    for key, value in payload.items():
        setattr(product, key, value)
    product.verified = False
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(product_id: int, user: User = Depends(require_role("supplier")), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.supplier_id == user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")
    old_image = product.image
    db.delete(product)
    db.commit()
    delete_local_image(old_image)
    return {"message": "Product deleted"}


@router.post("/{product_id}/image")
async def upload_image(product_id: int, file: UploadFile = File(...), user: User = Depends(require_role("supplier")), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.supplier_id == user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")
    content_type = file.content_type or ""
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG or WebP images are allowed.")
    data = await file.read()
    if len(data) > MAX_IMAGE_SIZE:
        raise HTTPException(status_code=413, detail="Image must be 5MB or smaller.")
    os.makedirs("uploads/products", exist_ok=True)
    extension = ALLOWED_IMAGE_TYPES[content_type]
    filename = f"{uuid.uuid4().hex}.{extension}"
    path = os.path.join("uploads", "products", filename)
    with open(path, "wb") as output:
        output.write(data)
    new_image = f"/uploads/products/{filename}"
    old_image = product.image
    product.image = new_image
    db.commit()
    db.refresh(product)
    if old_image and old_image != new_image:
        delete_local_image(old_image)
    return {"image": product.image, "product": product, "message": "Product image uploaded successfully."}


@router.delete("/{product_id}/image")
def delete_image(product_id: int, user: User = Depends(require_role("supplier")), db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id, Product.supplier_id == user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not owned by you")
    old_image = product.image
    product.image = ""
    db.commit()
    db.refresh(product)
    delete_local_image(old_image)
    return {"message": "Product image deleted.", "product": product}

from app.database import SessionLocal, Base, engine
from app.models import Product
from app.database import engine

Base.metadata.create_all(bind=engine)
db=SessionLocal()
if db.query(Product).count()==0:
    products=[
        ("Premium Cotton Fabric","cotton","Sharma Textiles",450,"500 meters",2500),
        ("Blue Denim Fabric","denim","Global Denim Mills",650,"1000 meters",1800),
        ("Luxury Silk Fabric","silk","Royal Silk House",1200,"300 meters",900),
        ("Premium Linen Fabric","linen","Natural Linen Mills",700,"600 meters",1200),
        ("High Quality Polyester Fabric","polyester","Modern Fiber Industries",350,"1000 meters",3000),
        ("Custom Designer Fabric","custom fabric","Tex Custom House",1500,"200 meters",500),
    ]
    for name,cat,supplier,price,moq,stock in products:
        db.add(Product(name=name,category=cat,supplier=supplier,price=price,moq=moq,stock=stock,verified=True,available=True,description=f"Premium {cat} textile supplied by {supplier}."))
    db.commit()
db.close()
print("Seed complete")

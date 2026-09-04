import re
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product

router = APIRouter(prefix="/ai", tags=["TEX AI"])
ALIASES={"cotton":["cotton"],"denim":["denim","jeans"],"silk":["silk"],"linen":["linen"],"polyester":["polyester","polyster","poly"],"custom fabric":["custom","designer"]}
class AIRequest(BaseModel):
    message:str=Field(min_length=1,max_length=1200)
    history:list[dict]=Field(default_factory=list)
def money(v): return f"₹{v:,.0f}"
def num(patterns,text):
    for p in patterns:
        m=re.search(p,text,re.I)
        if m:return float(m.group(1).replace(",",""))
def qty(t): return num([r"([\d,]+)\s*(?:m|meter|meters|metre|metres)",r"(?:qty|quantity)\s*[:=]?\s*([\d,]+)"],t)
def budget(t): return num([r"(?:under|below|less than|upto|up to|at most|budget(?:\s+of)?|within)\s*₹?\s*([\d,]+)",r"₹\s*([\d,]+)\s*/?\s*m"],t)
def moqlimit(t): return num([r"(?:moq|minimum order)\s*(?:of|below|under|less than|<=|<)?\s*([\d,]+)"],t)
def category(t):
    t=t.lower()
    for c,a in ALIASES.items():
        if any(x in t for x in a): return c
def moq(v):
    m=re.search(r"([\d,]+)",v or "")
    return int(m.group(1).replace(",","")) if m else 0
def pd(p,score=None):
    d={"id":p.id,"name":p.name,"category":p.category,"supplier":p.supplier,"price":p.price,"moq":p.moq,"moq_value":moq(p.moq),"stock":p.stock,"verified":p.verified,"available":p.available,"description":p.description or ""}
    if score is not None:d["match"]=score
    return d
def rank(p,t,c,b,q,m):
    s=48
    if c and p.category.lower()==c:s+=24
    if b is not None:s+=14 if p.price<=b else -min(18,int((p.price-b)/max(b,1)*20))
    if q:s+=9 if p.stock>=q else (4 if p.stock>=q*.5 else -5)
    if m is not None:s+=7 if moq(p.moq)<=m else -7
    if p.verified:s+=4
    return max(1,min(99,s))
def build(t,db):
    low=t.lower(); c=category(t); q=qty(t); b=budget(t); m=moqlimit(t)
    if any(x in low for x in ["calculate","cost","total","estimate"]) and ("₹" in t or q):
        q2=num([r"([\d,]+)\s*(?:m|meter|meters)"],t) or q or 2500; pr=num([r"₹\s*([\d,]+)\s*/?\s*m"],t) or 450
        return {"intent":"calculation","title":"Procurement estimate","message":f"For {q2:,.0f} meters at {money(pr)}/m, the estimated material value is {money(q2*pr)}.","details":[{"label":"Quantity","value":f"{q2:,.0f} m"},{"label":"Unit price","value":f"{money(pr)}/m"},{"label":"Material value","value":money(q2*pr)}],"products":[],"actions":["Create RFQ","Find suppliers"],"disclaimer":"Estimate excludes GST, freight, duties and supplier-specific terms."}
    ranked=sorted([(rank(p,t,c,b,q,m),p) for p in db.query(Product).filter(Product.available.is_(True)).all()],key=lambda x:(x[0],x[1].stock),reverse=True)
    if any(x in low for x in ["compare","comparison"," vs ","versus"]) or "supplier" in low:
        return {"intent":"supplier_comparison","title":"Supplier comparison","message":"I ranked the current marketplace catalog using price, MOQ, stock and supplier verification.","details":[],"products":[pd(p,s) for s,p in ranked[:4]],"actions":["Create RFQ","Refine search"],"disclaimer":"Confirm live stock, lead time and final commercial terms with the supplier."}
    if any(x in low for x in ["rfq","quote","quotation","request for quote"]):
        chosen=ranked[0][1] if ranked else None; q2=q or 5000
        return {"intent":"rfq","title":"RFQ draft ready","message":"I prepared a quote-ready procurement brief from your request.","details":[{"label":"Product","value":chosen.name if chosen else (c.title() if c else "Textile requirement")},{"label":"Quantity","value":f"{q2:,.0f} meters"},{"label":"Target price","value":f"{money(b)}/m" if b else "Supplier to quote"},{"label":"Supplier","value":chosen.supplier if chosen else "Verified marketplace suppliers"}],"products":[pd(chosen,ranked[0][0])] if chosen else [],"actions":["Open marketplace","Compare suppliers"],"disclaimer":"Draft only. Confirm specifications, delivery, taxes and payment terms before sending."}
    if low.strip().split() and any(x in low.split() for x in ["hi","hello","hey","namaste"]):
        return {"intent":"welcome","title":"TEX AI Procurement Copilot","message":"Tell me what you need to source. I can match fabrics, rank suppliers, check MOQ and stock, calculate material value and prepare an RFQ.","details":[],"products":[],"actions":["Find cotton","Compare suppliers"],"disclaimer":"TEX AI uses marketplace catalog data. Verify live commercial terms."}
    top=[(s,p) for s,p in ranked if s>=45][:4]
    if c or q or b or m or any(x in low for x in ["find","need","looking","fabric","supplier"]):
        return {"intent":"search","title":f"{len(top)} procurement matches","message":"I found the closest matches in the TEXVERSE marketplace catalog." if top else "No strong match found. Try widening budget, MOQ or fabric category.","details":[{"label":"Fabric","value":c.title() if c else "Any"},{"label":"Quantity","value":f"{q:,.0f} m" if q else "Any"},{"label":"Budget","value":f"{money(b)}/m max" if b else "Any"},{"label":"MOQ","value":f"{m:,.0f} m max" if m else "Any"}],"products":[pd(p,s) for s,p in top],"actions":["Compare suppliers","Create RFQ"],"disclaimer":"Match scores are procurement guidance, not a guarantee of availability."}
    return {"intent":"help","title":"What would you like to source?","message":"Describe a textile requirement in plain language. Example: 5,000m cotton under ₹500/m with MOQ below 1,000m.","details":[],"products":[],"actions":["Find cotton","Find denim","Calculate cost","Create RFQ"],"disclaimer":"TEX AI uses marketplace catalog data for sourcing assistance."}
@router.post("/procure")
def procure(data:AIRequest,db:Session=Depends(get_db)): return build(data.message,db)

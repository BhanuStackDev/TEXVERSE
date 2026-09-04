from typing import Optional, List

from pydantic import BaseModel, EmailStr, Field


SUPPORTED_LANGUAGE_CODES = {
    "en",
    "hi",
    "bn",
    "te",
    "mr",
    "ta",
    "gu",
    "kn",
    "ml",
    "pa",
    "ur",
    "or",
    "as",
    "sa",
    "ne",
    "kok",
    "mai",
    "ks",
    "sd",
    "doi",
    "mni",
    "brx",
    "sat",
    "es",
    "fr",
    "de",
    "ar",
    "zh",
    "ja",
    "ko",
    "pt",
    "it",
    "ru",
    "tr",
}


class UserRegister(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=120,
    )

    email: EmailStr

    password: str = Field(
        min_length=8,
        max_length=128,
    )

    role: str = "buyer"

    company_name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "India"

    language: str = Field(
        default="en",
        min_length=2,
        max_length=20,
    )


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str

    new_password: str = Field(
        min_length=8,
        max_length=128,
    )


class VerifyEmailRequest(BaseModel):
    token: str


class ProductCreate(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=180,
    )

    category: str = Field(
        min_length=2,
        max_length=80,
    )

    subcategory: str = Field(
        min_length=2,
        max_length=120,
    )

    description: str = ""

    price: float = Field(
        gt=0,
    )

    moq: str = Field(
        min_length=1,
        max_length=80,
    )

    stock: int = Field(
        default=0,
        ge=0,
    )

    image: str = ""

    available: bool = True


class OrderItemIn(BaseModel):
    product_id: int

    quantity: int = Field(
        default=1,
        ge=1,
    )


class OrderCreate(BaseModel):
    items: List[OrderItemIn]

    company_name: str
    contact_person: str
    email: EmailStr
    phone: str
    shipping_address: str


class StatusUpdate(BaseModel):
    status: str
package com.texverse.marketplace.model

data class UserSession(
    val token: String,
    val id: Int? = null,
    val fullName: String = "TEXVERSE User",
    val email: String = "",
    val role: String = "buyer",
    val companyName: String = "",
    val emailVerified: Boolean = false,
    val language: String = "en"
)

data class Product(
    val id: Int,
    val name: String,
    val category: String,
    val subcategory: String,
    val price: String,
    val moq: String,
    val stock: String,
    val image: String
)
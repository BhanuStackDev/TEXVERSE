package com.texverse.marketplace.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.texverse.marketplace.data.ApiClient
import com.texverse.marketplace.i18n.AppLanguages
import com.texverse.marketplace.i18n.AppStrings
import com.texverse.marketplace.model.UserSession
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

private const val TEXVERSE_API_URL =
    "https://texverse-backend.onrender.com"

/* =========================================================
   COMMON HELPERS
========================================================= */

private fun JSONObject.stringOrEmpty(
    key: String
): String {
    return optString(key, "")
}

private fun JSONObject.intOrZero(
    key: String
): Int {
    return optInt(key, 0)
}

private fun JSONObject.doubleOrZero(
    key: String
): Double {
    return optDouble(key, 0.0)
}

private fun extractError(
    result: ApiClient.ApiResult
): String {
    val json = result.json

    if (json is JSONObject) {
        return json.optString(
            "detail",
            json.optString(
                "message",
                result.error ?: "Request failed."
            )
        )
    }

    return result.error ?: "Request failed."
}

private fun parseProductArray(
    value: Any?
): List<JSONObject> {

    return when (value) {

        is JSONArray -> {
            buildList {
                for (i in 0 until value.length()) {
                    value.optJSONObject(i)?.let {
                        add(it)
                    }
                }
            }
        }

        is JSONObject -> {

            val array =
                value.optJSONArray("items")
                    ?: value.optJSONArray("products")
                    ?: value.optJSONArray("data")

            if (array != null) {
                parseProductArray(array)
            } else {
                listOf(value)
            }
        }

        else -> emptyList()
    }
}

/* =========================================================
   NAV BUTTON
========================================================= */

@Composable
private fun NavButton(
    title: String,
    onClick: () -> Unit
) {
    TextButton(
        onClick = onClick
    ) {
        Text(
            text = title,
            color = Color.White,
            fontWeight = FontWeight.Medium,
            maxLines = 1
        )
    }
}

/* =========================================================
   LANGUAGE BUTTON
========================================================= */

@Composable
private fun LanguageButton(
    languageCode: String,
    onLanguageChange: (String) -> Unit
) {

    val currentLanguage =
        AppLanguages.find(languageCode)

    var expanded by remember {
        mutableStateOf(false)
    }

    Box(
        modifier = Modifier.wrapContentWidth()
    ) {

        OutlinedButton(
            onClick = {
                expanded = !expanded
            },
            modifier = Modifier
                .wrapContentWidth()
                .height(42.dp)
        ) {

            Text(
                text =
                    "${currentLanguage.nativeName} ▾",
                maxLines = 1
            )
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = {
                expanded = false
            }
        ) {

            AppLanguages.all.forEach { language ->

                DropdownMenuItem(
                    text = {
                        Text(
                            text =
                                "${language.nativeName} - ${language.name}",
                            maxLines = 1
                        )
                    },
                    onClick = {

                        expanded = false

                        onLanguageChange(
                            language.code
                        )
                    }
                )
            }
        }
    }
}

/* =========================================================
   TOP BAR
========================================================= */

@Composable
fun TopBar(
    languageCode: String,
    onLanguageChange: (String) -> Unit,
    session: UserSession?,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit,
    onLogin: () -> Unit,
    onLogout: () -> Unit
) {

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(
                Color(0xFF0F172A)
            )
            .padding(
                horizontal = 16.dp,
                vertical = 14.dp
            )
    ) {

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement =
                Arrangement.SpaceBetween,
            verticalAlignment =
                Alignment.CenterVertically
        ) {

            Column(
                modifier = Modifier.weight(1f)
            ) {

                Text(
                    text = "TEXVERSE",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    style =
                        MaterialTheme.typography.headlineSmall
                )

                Spacer(
                    modifier = Modifier.height(3.dp)
                )

                Text(
                    text =
                        AppStrings.value(
                            languageCode,
                            "ai_commerce"
                        ),
                    color = Color(0xFFCBD5E1),
                    style =
                        MaterialTheme.typography.bodySmall
                )
            }

            LanguageButton(
                languageCode = languageCode,
                onLanguageChange =
                    onLanguageChange
            )
        }

        Spacer(
            modifier = Modifier.height(12.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(
                    rememberScrollState()
                ),
            horizontalArrangement =
                Arrangement.spacedBy(4.dp),
            verticalAlignment =
                Alignment.CenterVertically
        ) {

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "marketplace"
                    ),
                onClick = onMarketplace
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "categories"
                    ),
                onClick = onCategories
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "suppliers"
                    ),
                onClick = onSuppliers
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "about"
                    ),
                onClick = onAbout
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "help"
                    ),
                onClick = onHelp
            )

            if (session == null) {

                NavButton(
                    title = "Sign In",
                    onClick = onLogin
                )

            } else {

                NavButton(
                    title = "Logout",
                    onClick = onLogout
                )
            }
        }
    }
}

/* =========================================================
   PUBLIC SHELL
========================================================= */

@Composable
private fun PublicPage(
    languageCode: String,
    session: UserSession?,
    onLanguageChange: (String) -> Unit,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit,
    onLogin: () -> Unit,
    onLogout: () -> Unit,
    content: @Composable () -> Unit
) {

    Column(
        modifier = Modifier.fillMaxSize()
    ) {

        TopBar(
            languageCode =
                languageCode,

            onLanguageChange =
                onLanguageChange,

            session =
                session,

            onMarketplace =
                onMarketplace,

            onCategories =
                onCategories,

            onSuppliers =
                onSuppliers,

            onAbout =
                onAbout,

            onHelp =
                onHelp,

            onLogin =
                onLogin,

            onLogout =
                onLogout
        )

        Box(
            modifier = Modifier
                .fillMaxSize()
        ) {

            content()
        }
    }
}

/* =========================================================
   HOME
========================================================= */

@Composable
fun HomeScreen(
    session: UserSession?,
    languageCode: String,
    onLanguageChange: (String) -> Unit,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit,
    onLogin: () -> Unit,
    onRegister: () -> Unit,
    onProductClick: (Int) -> Unit,
    onLogout: () -> Unit
) {

    val scope =
        rememberCoroutineScope()

    var products by remember {
        mutableStateOf<List<JSONObject>>(
            emptyList()
        )
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var error by remember {
        mutableStateOf("")
    }

    LaunchedEffect(Unit) {

        scope.launch {

            val result =
                ApiClient.get(
                    "/products"
                )

            if (result.success) {

                products =
                    parseProductArray(
                        result.json
                    )

                error = ""

            } else {

                error =
                    extractError(
                        result
                    )
            }

            loading = false
        }
    }

    PublicPage(
        languageCode =
            languageCode,

        session =
            session,

        onLanguageChange =
            onLanguageChange,

        onMarketplace =
            onMarketplace,

        onCategories =
            onCategories,

        onSuppliers =
            onSuppliers,

        onAbout =
            onAbout,

        onHelp =
            onHelp,

        onLogin =
            onLogin,

        onLogout =
            onLogout
    ) {

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement =
                Arrangement.spacedBy(16.dp)
        ) {

            item {

                Card(
                    modifier =
                        Modifier.fillMaxWidth(),
                    shape =
                        RoundedCornerShape(20.dp),
                    colors =
                        CardDefaults.cardColors(
                            containerColor =
                                Color(0xFF172554)
                        )
                ) {

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp)
                    ) {

                        Text(
                            text =
                                "TEXVERSE",
                            color =
                                Color.White,
                            fontSize =
                                32.sp,
                            fontWeight =
                                FontWeight.Bold
                        )

                        Spacer(
                            modifier =
                                Modifier.height(8.dp)
                        )

                        Text(
                            text =
                                "B2B Textile Marketplace",
                            color =
                                Color.White,
                            fontSize =
                                21.sp,
                            fontWeight =
                                FontWeight.SemiBold
                        )

                        Spacer(
                            modifier =
                                Modifier.height(8.dp)
                        )

                        Text(
                            text =
                                "Discover textile products, verified suppliers and wholesale opportunities.",
                            color =
                                Color(0xFFE2E8F0),
                            fontSize =
                                15.sp
                        )

                        Spacer(
                            modifier =
                                Modifier.height(18.dp)
                        )

                        Row(
                            horizontalArrangement =
                                Arrangement.spacedBy(10.dp)
                        ) {

                            Button(
                                onClick =
                                    onMarketplace
                            ) {

                                Text(
                                    text =
                                        "Explore Marketplace"
                                )
                            }

                            if (session == null) {

                                OutlinedButton(
                                    onClick =
                                        onRegister
                                ) {

                                    Text(
                                        text =
                                            "Register"
                                    )
                                }
                            }
                        }
                    }
                }
            }

            item {

                Text(
                    text =
                        "Featured Products",
                    fontSize =
                        23.sp,
                    fontWeight =
                        FontWeight.Bold
                )
            }

            if (loading) {

                item {

                    Box(
                        modifier =
                            Modifier
                                .fillMaxWidth()
                                .padding(30.dp),
                        contentAlignment =
                            Alignment.Center
                    ) {

                        CircularProgressIndicator()
                    }
                }

            } else if (error.isNotBlank()) {

                item {

                    ErrorCard(
                        message =
                            error
                    )
                }

            } else if (products.isEmpty()) {

                item {

                    InfoCard(
                        title =
                            "No products available",
                        message =
                            "The TEXVERSE catalog currently has no products."
                    )
                }

            } else {

                items(
                    products.take(6)
                ) { product ->

                    ProductCard(
                        product =
                            product,
                        onClick = {

                            val id =
                                product.intOrZero(
                                    "id"
                                )

                            if (id > 0) {
                                onProductClick(id)
                            }
                        }
                    )
                }
            }

            item {

                Footer()
            }
        }
    }
}

/* =========================================================
   MARKETPLACE
========================================================= */

@Composable
fun MarketplaceScreen(
    languageCode: String,
    session: UserSession?,
    onBack: () -> Unit,
    onProductClick: (Int) -> Unit,
    onLogin: () -> Unit,
    onLanguageChange: (String) -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit
) {

    var products by remember {
        mutableStateOf<List<JSONObject>>(
            emptyList()
        )
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var error by remember {
        mutableStateOf("")
    }

    LaunchedEffect(Unit) {

        val result =
            ApiClient.get(
                "/products"
            )

        if (result.success) {

            products =
                parseProductArray(
                    result.json
                )

        } else {

            error =
                extractError(
                    result
                )
        }

        loading = false
    }

    PublicPage(
        languageCode =
            languageCode,

        session =
            session,

        onLanguageChange =
            onLanguageChange,

        onMarketplace = {},

        onCategories =
            onCategories,

        onSuppliers =
            onSuppliers,

        onAbout =
            onAbout,

        onHelp =
            onHelp,

        onLogin =
            onLogin,

        onLogout = {}
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {

            Row(
                modifier =
                    Modifier.fillMaxWidth(),
                verticalAlignment =
                    Alignment.CenterVertically
            ) {

                TextButton(
                    onClick =
                        onBack
                ) {

                    Text(
                        text =
                            "← Back"
                    )
                }

                Spacer(
                    modifier =
                        Modifier.width(8.dp)
                )

                Text(
                    text =
                        "Marketplace",
                    fontSize =
                        26.sp,
                    fontWeight =
                        FontWeight.Bold
                )
            }

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            when {

                loading -> {

                    Box(
                        modifier =
                            Modifier.fillMaxSize(),
                        contentAlignment =
                            Alignment.Center
                    ) {

                        CircularProgressIndicator()
                    }
                }

                error.isNotBlank() -> {

                    ErrorCard(
                        message =
                            error
                    )
                }

                products.isEmpty() -> {

                    InfoCard(
                        title =
                            "Catalog empty",
                        message =
                            "No products are currently available."
                    )
                }

                else -> {

                    LazyColumn(
                        verticalArrangement =
                            Arrangement.spacedBy(12.dp)
                    ) {

                        items(
                            products
                        ) { product ->

                            ProductCard(
                                product =
                                    product,
                                onClick = {

                                    val id =
                                        product.intOrZero(
                                            "id"
                                        )

                                    if (id > 0) {
                                        onProductClick(id)
                                    }
                                }
                            )
                        }
                    }
                }
            }
        }
    }
}

/* =========================================================
   CATEGORIES
========================================================= */

@Composable
fun CategoriesScreen(
    languageCode: String,
    onBack: () -> Unit,
    onMarketplace: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit,
    onLanguageChange: (String) -> Unit
) {

    var categories by remember {
        mutableStateOf<List<String>>(
            emptyList()
        )
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var error by remember {
        mutableStateOf("")
    }

    LaunchedEffect(Unit) {

        val result =
            ApiClient.get(
                "/products/categories"
            )

        if (result.success) {

            val json =
                result.json

            if (json is JSONArray) {

                categories =
                    buildList {

                        for (i in 0 until json.length()) {

                            val value =
                                json.optString(i)

                            if (value.isNotBlank()) {
                                add(value)
                            }
                        }
                    }
            } else {

                categories =
                    listOf(
                        "Cotton",
                        "Silk",
                        "Polyester",
                        "Denim",
                        "Rayon",
                        "Blended Fabrics"
                    )
            }

        } else {

            error =
                extractError(
                    result
                )
        }

        loading = false
    }

    PublicPage(
        languageCode =
            languageCode,

        session = null,

        onLanguageChange =
            onLanguageChange,

        onMarketplace =
            onMarketplace,

        onCategories = {},

        onSuppliers =
            onSuppliers,

        onAbout =
            onAbout,

        onHelp =
            onHelp,

        onLogin = {},

        onLogout = {}
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {

            Row(
                verticalAlignment =
                    Alignment.CenterVertically
            ) {

                TextButton(
                    onClick =
                        onBack
                ) {

                    Text(
                        text =
                            "← Back"
                    )
                }

                Text(
                    text =
                        "Categories",
                    fontSize =
                        26.sp,
                    fontWeight =
                        FontWeight.Bold
                )
            }

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            if (loading) {

                Box(
                    modifier =
                        Modifier.fillMaxSize(),
                    contentAlignment =
                        Alignment.Center
                ) {

                    CircularProgressIndicator()
                }

            } else if (error.isNotBlank()) {

                ErrorCard(
                    message =
                        error
                )

            } else {

                LazyColumn(
                    verticalArrangement =
                        Arrangement.spacedBy(12.dp)
                ) {

                    items(
                        categories
                    ) { category ->

                        Card(
                            modifier =
                                Modifier.fillMaxWidth(),
                            shape =
                                RoundedCornerShape(14.dp)
                        ) {

                            Text(
                                text =
                                    category,
                                modifier =
                                    Modifier.padding(
                                        20.dp
                                    ),
                                fontSize =
                                    18.sp,
                                fontWeight =
                                    FontWeight.SemiBold
                            )
                        }
                    }
                }
            }
        }
    }
}

/* =========================================================
   SUPPLIERS
========================================================= */

@Composable
fun SuppliersScreen(
    languageCode: String,
    onBack: () -> Unit,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit,
    onLanguageChange: (String) -> Unit
) {

    PublicPage(
        languageCode =
            languageCode,

        session = null,

        onLanguageChange =
            onLanguageChange,

        onMarketplace =
            onMarketplace,

        onCategories =
            onCategories,

        onSuppliers = {},

        onAbout =
            onAbout,

        onHelp =
            onHelp,

        onLogin = {},

        onLogout = {}
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(16.dp)
        ) {

            TextButton(
                onClick =
                    onBack
            ) {

                Text(
                    text =
                        "← Back"
                )
            }

            Text(
                text =
                    "Verified Suppliers",
                fontSize =
                    28.sp,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(16.dp)
            )

            InfoCard(
                title =
                    "Trusted Textile Suppliers",
                message =
                    "TEXVERSE connects buyers with textile manufacturers, wholesalers and verified supply partners."
            )

            InfoCard(
                title =
                    "B2B Procurement",
                message =
                    "Compare wholesale products, MOQ, stock and supplier information before placing an order."
            )

            InfoCard(
                title =
                    "Supplier Verification",
                message =
                    "Supplier-side verification and administration workflows are handled by the TEXVERSE backend."
            )
        }
    }
}

/* =========================================================
   ABOUT
========================================================= */

@Composable
fun AboutScreen(
    languageCode: String,
    onBack: () -> Unit,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onHelp: () -> Unit,
    onLanguageChange: (String) -> Unit
) {

    PublicPage(
        languageCode =
            languageCode,

        session = null,

        onLanguageChange =
            onLanguageChange,

        onMarketplace =
            onMarketplace,

        onCategories =
            onCategories,

        onSuppliers =
            onSuppliers,

        onAbout = {},

        onHelp =
            onHelp,

        onLogin = {},

        onLogout = {}
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(16.dp)
        ) {

            TextButton(
                onClick =
                    onBack
            ) {

                Text(
                    text =
                        "← Back"
                )
            }

            Text(
                text =
                    "About TEXVERSE",
                fontSize =
                    28.sp,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(16.dp)
            )

            InfoCard(
                title =
                    "B2B Textile Marketplace",
                message =
                    "TEXVERSE is designed for wholesale textile sourcing, supplier discovery, product comparison and procurement workflows."
            )

            InfoCard(
                title =
                    "Production API",
                message =
                    TEXVERSE_API_URL
            )

            InfoCard(
                title =
                    "Platform",
                message =
                    "Android application powered by Jetpack Compose and the TEXVERSE FastAPI backend."
            )
        }
    }
}

/* =========================================================
   HELP
========================================================= */

@Composable
fun HelpScreen(
    languageCode: String,
    onBack: () -> Unit,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onLanguageChange: (String) -> Unit
) {

    PublicPage(
        languageCode =
            languageCode,

        session = null,

        onLanguageChange =
            onLanguageChange,

        onMarketplace =
            onMarketplace,

        onCategories =
            onCategories,

        onSuppliers =
            onSuppliers,

        onAbout =
            onAbout,

        onHelp = {},

        onLogin = {},

        onLogout = {}
    ) {

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(16.dp)
        ) {

            TextButton(
                onClick =
                    onBack
            ) {

                Text(
                    text =
                        "← Back"
                )
            }

            Text(
                text =
                    "Help Center",
                fontSize =
                    28.sp,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(16.dp)
            )

            InfoCard(
                title =
                    "Marketplace",
                message =
                    "Browse textile products and open a product to view wholesale details."
            )

            InfoCard(
                title =
                    "Account",
                message =
                    "Use Sign In or Register to access your TEXVERSE account."
            )

            InfoCard(
                title =
                    "Support",
                message =
                    "For authenticated users, support and procurement workflows are handled through the TEXVERSE platform."
            )
        }
    }
}

/* =========================================================
   PRODUCT DETAILS
========================================================= */

@Composable
fun ProductDetailsScreen(
    productId: Int,
    token: String?,
    languageCode: String,
    onBack: () -> Unit,
    onLogin: () -> Unit
) {

    var product by remember {
        mutableStateOf<JSONObject?>(null)
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var error by remember {
        mutableStateOf("")
    }

    LaunchedEffect(productId) {

        val result =
            ApiClient.get(
                "/products/$productId",
                token
            )

        if (result.success) {

            product =
                result.json as? JSONObject

        } else {

            error =
                extractError(
                    result
                )
        }

        loading = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(
                rememberScrollState()
            )
            .padding(16.dp)
    ) {

        TextButton(
            onClick =
                onBack
        ) {

            Text(
                text =
                    "← Back to Marketplace"
            )
        }

        Spacer(
            modifier =
                Modifier.height(8.dp)
        )

        when {

            loading -> {

                Box(
                    modifier =
                        Modifier.fillMaxWidth(),
                    contentAlignment =
                        Alignment.Center
                ) {

                    CircularProgressIndicator()
                }
            }

            error.isNotBlank() -> {

                ErrorCard(
                    message =
                        error
                )
            }

            product == null -> {

                InfoCard(
                    title =
                        "Product unavailable",
                    message =
                        "The requested product could not be loaded."
                )
            }

            else -> {

                val item =
                    product!!

                Text(
                    text =
                        item.stringOrEmpty(
                            "name"
                        ).ifBlank {
                            item.stringOrEmpty(
                                "title"
                            )
                        }.ifBlank {
                            "TEXVERSE Product"
                        },
                    fontSize =
                        28.sp,
                    fontWeight =
                        FontWeight.Bold
                )

                Spacer(
                    modifier =
                        Modifier.height(16.dp)
                )

                ProductDetailRow(
                    label =
                        "Category",
                    value =
                        item.stringOrEmpty(
                            "category"
                        )
                )

                ProductDetailRow(
                    label =
                        "Subcategory",
                    value =
                        item.stringOrEmpty(
                            "subcategory"
                        )
                )

                ProductDetailRow(
                    label =
                        "Price",
                    value =
                        formatPrice(
                            item
                        )
                )

                ProductDetailRow(
                    label =
                        "MOQ",
                    value =
                        item.intOrZero(
                            "moq"
                        ).toString()
                )

                ProductDetailRow(
                    label =
                        "Stock",
                    value =
                        item.intOrZero(
                            "stock"
                        ).toString()
                )

                ProductDetailRow(
                    label =
                        "Supplier",
                    value =
                        item.stringOrEmpty(
                            "supplier_name"
                        ).ifBlank {
                            item.stringOrEmpty(
                                "company_name"
                            )
                        }
                )

                Spacer(
                    modifier =
                        Modifier.height(20.dp)
                )

                if (token.isNullOrBlank()) {

                    Button(
                        onClick =
                            onLogin,
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {

                        Text(
                            text =
                                "Sign In to Continue"
                        )
                    }
                }
            }
        }
    }
}

/* =========================================================
   LOGIN
========================================================= */

@Composable
fun LoginScreen(
    languageCode: String,
    onBack: () -> Unit,
    onRegister: () -> Unit,
    onLoginSuccess: (UserSession) -> Unit
) {

    val scope =
        rememberCoroutineScope()

    var email by remember {
        mutableStateOf("")
    }

    var password by remember {
        mutableStateOf("")
    }

    var loading by remember {
        mutableStateOf(false)
    }

    var error by remember {
        mutableStateOf("")
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(
                rememberScrollState()
            )
            .padding(20.dp),
        horizontalAlignment =
            Alignment.CenterHorizontally
    ) {

        TextButton(
            onClick =
                onBack,
            modifier =
                Modifier.align(
                    Alignment.Start
                )
        ) {

            Text(
                text =
                    "← Back"
            )
        }

        Spacer(
            modifier =
                Modifier.height(20.dp)
        )

        Text(
            text =
                "TEXVERSE",
            fontSize =
                32.sp,
            fontWeight =
                FontWeight.Bold
        )

        Text(
            text =
                "Sign In",
            fontSize =
                24.sp,
            fontWeight =
                FontWeight.SemiBold
        )

        Spacer(
            modifier =
                Modifier.height(24.dp)
        )

        OutlinedTextField(
            value =
                email,
            onValueChange = {
                email = it
                error = ""
            },
            modifier =
                Modifier.fillMaxWidth(),
            label = {
                Text(
                    text =
                        "Email"
                )
            },
            keyboardOptions =
                KeyboardOptions(
                    keyboardType =
                        KeyboardType.Email,
                    imeAction =
                        ImeAction.Next
                ),
            singleLine = true
        )

        Spacer(
            modifier =
                Modifier.height(12.dp)
        )

        OutlinedTextField(
            value =
                password,
            onValueChange = {
                password = it
                error = ""
            },
            modifier =
                Modifier.fillMaxWidth(),
            label = {
                Text(
                    text =
                        "Password"
                )
            },
            visualTransformation =
                PasswordVisualTransformation(),
            keyboardOptions =
                KeyboardOptions(
                    keyboardType =
                        KeyboardType.Password,
                    imeAction =
                        ImeAction.Done
                ),
            singleLine = true
        )

        Spacer(
            modifier =
                Modifier.height(16.dp)
        )

        if (error.isNotBlank()) {

            ErrorCard(
                message =
                    error
            )

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )
        }

        Button(
            onClick = {

                if (
                    email.isBlank() ||
                    password.isBlank()
                ) {

                    error =
                        "Please enter email and password."

                    return@Button
                }

                loading = true
                error = ""

                scope.launch {

                    val body =
                        JSONObject()
                            .put(
                                "email",
                                email.trim()
                            )
                            .put(
                                "password",
                                password
                            )

                    val result =
                        ApiClient.post(
                            "/auth/login",
                            body
                        )

                    if (!result.success) {

                        error =
                            extractError(
                                result
                            )

                        loading = false
                        return@launch
                    }

                    val json =
                        result.json as? JSONObject

                    if (json == null) {

                        error =
                            "Invalid login response."

                        loading = false
                        return@launch
                    }

                    val token =
                        json.optString(
                            "access_token",
                            json.optString(
                                "token",
                                ""
                            )
                        )

                    if (token.isBlank()) {

                        error =
                            "Login succeeded but access token was not returned."

                        loading = false
                        return@launch
                    }

                    val user =
                        json.optJSONObject(
                            "user"
                        )

                    val session =
                        UserSession(
                            token =
                                token,

                            id =
                                user?.optInt(
                                    "id",
                                    -1
                                )?.takeIf {
                                    it >= 0
                                },

                            fullName =
                                user?.optString(
                                    "full_name",
                                    email.substringBefore("@")
                                ) ?: email.substringBefore("@"),

                            email =
                                user?.optString(
                                    "email",
                                    email
                                ) ?: email,

                            role =
                                user?.optString(
                                    "role",
                                    "buyer"
                                ) ?: "buyer",

                            companyName =
                                user?.optString(
                                    "company_name",
                                    ""
                                ) ?: "",

                            emailVerified =
                                user?.optBoolean(
                                    "email_verified",
                                    false
                                ) ?: false,

                            language =
                                user?.optString(
                                    "language",
                                    languageCode
                                ) ?: languageCode
                        )

                    loading = false

                    onLoginSuccess(
                        session
                    )
                }
            },
            modifier =
                Modifier.fillMaxWidth(),
            enabled =
                !loading
        ) {

            if (loading) {

                CircularProgressIndicator(
                    modifier =
                        Modifier.size(20.dp),
                    strokeWidth =
                        2.dp
                )

            } else {

                Text(
                    text =
                        "Sign In"
                )
            }
        }

        Spacer(
            modifier =
                Modifier.height(10.dp)
        )

        TextButton(
            onClick =
                onRegister
        ) {

            Text(
                text =
                    "Don't have an account? Register"
            )
        }
    }
}

/* =========================================================
   REGISTER
========================================================= */

@Composable
fun RegisterScreen(
    languageCode: String,
    onBack: () -> Unit,
    onLogin: () -> Unit,
    onRegistered: () -> Unit
) {

    val scope =
        rememberCoroutineScope()

    var fullName by remember {
        mutableStateOf("")
    }

    var email by remember {
        mutableStateOf("")
    }

    var password by remember {
        mutableStateOf("")
    }

    var companyName by remember {
        mutableStateOf("")
    }

    var phone by remember {
        mutableStateOf("")
    }

    var city by remember {
        mutableStateOf("")
    }

    var state by remember {
        mutableStateOf("")
    }

    var country by remember {
        mutableStateOf("India")
    }

    var role by remember {
        mutableStateOf("buyer")
    }

    var loading by remember {
        mutableStateOf(false)
    }

    var error by remember {
        mutableStateOf("")
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(
                rememberScrollState()
            )
            .padding(20.dp),
        horizontalAlignment =
            Alignment.CenterHorizontally
    ) {

        TextButton(
            onClick =
                onBack,
            modifier =
                Modifier.align(
                    Alignment.Start
                )
        ) {

            Text(
                text =
                    "← Back"
            )
        }

        Text(
            text =
                "Create TEXVERSE Account",
            fontSize =
                27.sp,
            fontWeight =
                FontWeight.Bold,
            textAlign =
                TextAlign.Center
        )

        Spacer(
            modifier =
                Modifier.height(20.dp)
        )

        RegisterField(
            value =
                fullName,
            label =
                "Full Name",
            onValueChange = {
                fullName = it
                error = ""
            }
        )

        RegisterField(
            value =
                email,
            label =
                "Email",
            keyboardType =
                KeyboardType.Email,
            onValueChange = {
                email = it
                error = ""
            }
        )

        RegisterField(
            value =
                password,
            label =
                "Password",
            keyboardType =
                KeyboardType.Password,
            password =
                true,
            onValueChange = {
                password = it
                error = ""
            }
        )

        RegisterField(
            value =
                companyName,
            label =
                "Company Name",
            onValueChange = {
                companyName = it
            }
        )

        RegisterField(
            value =
                phone,
            label =
                "Phone",
            keyboardType =
                KeyboardType.Phone,
            onValueChange = {
                phone = it
            }
        )

        RegisterField(
            value =
                city,
            label =
                "City",
            onValueChange = {
                city = it
            }
        )

        RegisterField(
            value =
                state,
            label =
                "State",
            onValueChange = {
                state = it
            }
        )

        RegisterField(
            value =
                country,
            label =
                "Country",
            onValueChange = {
                country = it
            }
        )

        Spacer(
            modifier =
                Modifier.height(8.dp)
        )

        Text(
            text =
                "Account Type",
            modifier =
                Modifier.align(
                    Alignment.Start
                ),
            fontWeight =
                FontWeight.SemiBold
        )

        Spacer(
            modifier =
                Modifier.height(6.dp)
        )

        Row(
            modifier =
                Modifier.fillMaxWidth(),
            horizontalArrangement =
                Arrangement.spacedBy(8.dp)
        ) {

            OutlinedButton(
                onClick = {
                    role = "buyer"
                },
                modifier =
                    Modifier.weight(1f)
            ) {

                Text(
                    text =
                        if (role == "buyer")
                            "✓ Buyer"
                        else
                            "Buyer"
                )
            }

            OutlinedButton(
                onClick = {
                    role = "supplier"
                },
                modifier =
                    Modifier.weight(1f)
            ) {

                Text(
                    text =
                        if (role == "supplier")
                            "✓ Supplier"
                        else
                            "Supplier"
                )
            }
        }

        Spacer(
            modifier =
                Modifier.height(14.dp)
        )

        if (error.isNotBlank()) {

            ErrorCard(
                message =
                    error
            )

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )
        }

        Button(
            onClick = {

                if (
                    fullName.isBlank() ||
                    email.isBlank() ||
                    password.isBlank()
                ) {

                    error =
                        "Full name, email and password are required."

                    return@Button
                }

                loading = true
                error = ""

                scope.launch {

                    val body =
                        JSONObject()
                            .put(
                                "full_name",
                                fullName.trim()
                            )
                            .put(
                                "email",
                                email.trim()
                            )
                            .put(
                                "password",
                                password
                            )
                            .put(
                                "role",
                                role
                            )
                            .put(
                                "company_name",
                                companyName.trim()
                            )
                            .put(
                                "phone",
                                phone.trim()
                            )
                            .put(
                                "city",
                                city.trim()
                            )
                            .put(
                                "state",
                                state.trim()
                            )
                            .put(
                                "country",
                                country.trim()
                            )
                            .put(
                                "language",
                                languageCode
                            )

                    val result =
                        ApiClient.post(
                            "/auth/register",
                            body
                        )

                    loading = false

                    if (result.success) {

                        onRegistered()

                    } else {

                        error =
                            extractError(
                                result
                            )
                    }
                }
            },
            modifier =
                Modifier.fillMaxWidth(),
            enabled =
                !loading
        ) {

            if (loading) {

                CircularProgressIndicator(
                    modifier =
                        Modifier.size(20.dp),
                    strokeWidth =
                        2.dp
                )

            } else {

                Text(
                    text =
                        "Create Account"
                )
            }
        }

        Spacer(
            modifier =
                Modifier.height(8.dp)
        )

        TextButton(
            onClick =
                onLogin
        ) {

            Text(
                text =
                    "Already have an account? Sign In"
            )
        }

        Spacer(
            modifier =
                Modifier.height(20.dp)
        )
    }
}

/* =========================================================
   PRODUCT CARD
========================================================= */

@Composable
private fun ProductCard(
    product: JSONObject,
    onClick: () -> Unit
) {

    val name =
        product.stringOrEmpty(
            "name"
        ).ifBlank {
            product.stringOrEmpty(
                "title"
            )
        }.ifBlank {
            "TEXVERSE Product"
        }

    val category =
        product.stringOrEmpty(
            "category"
        )

    val subcategory =
        product.stringOrEmpty(
            "subcategory"
        )

    val price =
        formatPrice(
            product
        )

    val moq =
        product.intOrZero(
            "moq"
        )

    val stock =
        product.intOrZero(
            "stock"
        )

    Card(
        modifier =
            Modifier
                .fillMaxWidth()
                .clickable(
                    onClick = onClick
                ),
        shape =
            RoundedCornerShape(16.dp),
        elevation =
            CardDefaults.cardElevation(
                defaultElevation = 3.dp
            )
    ) {

        Column(
            modifier =
                Modifier.padding(18.dp)
        ) {

            Text(
                text =
                    name,
                fontSize =
                    20.sp,
                fontWeight =
                    FontWeight.Bold
            )

            if (category.isNotBlank()) {

                Spacer(
                    modifier =
                        Modifier.height(5.dp)
                )

                Text(
                    text =
                        if (subcategory.isNotBlank())
                            "$category • $subcategory"
                        else
                            category,
                    color =
                        Color(0xFF475569)
                )
            }

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            Row(
                modifier =
                    Modifier.fillMaxWidth(),
                horizontalArrangement =
                    Arrangement.SpaceBetween
            ) {

                Column {

                    Text(
                        text =
                            "Price",
                        fontSize =
                            12.sp,
                        color =
                            Color.Gray
                    )

                    Text(
                        text =
                            price,
                        fontWeight =
                            FontWeight.Bold
                    )
                }

                Column {

                    Text(
                        text =
                            "MOQ",
                        fontSize =
                            12.sp,
                            color =
                                Color.Gray
                    )

                    Text(
                        text =
                            moq.toString(),
                        fontWeight =
                            FontWeight.Bold
                    )
                }

                Column {

                    Text(
                        text =
                            "Stock",
                        fontSize =
                            12.sp,
                        color =
                            Color.Gray
                    )

                    Text(
                        text =
                            stock.toString(),
                        fontWeight =
                            FontWeight.Bold
                    )
                }
            }

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            Text(
                text =
                    "View product details →",
                color =
                    Color(0xFF2563EB),
                fontWeight =
                    FontWeight.SemiBold
            )
        }
    }
}

/* =========================================================
   PRICE
========================================================= */

private fun formatPrice(
    product: JSONObject
): String {

    val price =
        product.doubleOrZero(
            "price"
        )

    val currency =
        product.stringOrEmpty(
            "currency"
        ).ifBlank {
            "₹"
        }

    return "$currency ${"%.2f".format(price)}"
}

/* =========================================================
   PRODUCT DETAIL ROW
========================================================= */

@Composable
private fun ProductDetailRow(
    label: String,
    value: String
) {

    if (value.isBlank()) {
        return
    }

    Card(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 4.dp
                )
    ) {

        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
            horizontalArrangement =
                Arrangement.SpaceBetween
        ) {

            Text(
                text =
                    label,
                fontWeight =
                    FontWeight.SemiBold
            )

            Text(
                text =
                    value,
                textAlign =
                    TextAlign.End
            )
        }
    }
}

/* =========================================================
   REGISTER FIELD
========================================================= */

@Composable
private fun RegisterField(
    value: String,
    label: String,
    onValueChange: (String) -> Unit,
    keyboardType: KeyboardType =
        KeyboardType.Text,
    password: Boolean = false
) {

    OutlinedTextField(
        value =
            value,

        onValueChange =
            onValueChange,

        modifier =
            Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 5.dp
                ),

        label = {
            Text(
                text =
                    label
            )
        },

        visualTransformation =
            if (password)
                PasswordVisualTransformation()
            else
                androidx.compose.ui.text.input.VisualTransformation.None,

        keyboardOptions =
            KeyboardOptions(
                keyboardType =
                    keyboardType
            ),

        singleLine = true
    )
}

/* =========================================================
   INFO CARD
========================================================= */

@Composable
private fun InfoCard(
    title: String,
    message: String
) {

    Card(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 6.dp
                ),
        shape =
            RoundedCornerShape(14.dp)
    ) {

        Column(
            modifier =
                Modifier.padding(18.dp)
        ) {

            Text(
                text =
                    title,
                fontSize =
                    18.sp,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(6.dp)
            )

            Text(
                text =
                    message,
                color =
                    Color(0xFF475569)
            )
        }
    }
}

/* =========================================================
   ERROR CARD
========================================================= */

@Composable
private fun ErrorCard(
    message: String
) {

    Card(
        modifier =
            Modifier.fillMaxWidth(),
        colors =
            CardDefaults.cardColors(
                containerColor =
                    Color(0xFFFFF1F2)
            ),
        shape =
            RoundedCornerShape(12.dp)
    ) {

        Text(
            text =
                message,
            modifier =
                Modifier.padding(16.dp),
            color =
                Color(0xFFB91C1C)
        )
    }
}

/* =========================================================
   FOOTER
========================================================= */

@Composable
private fun Footer() {

    Divider(
        modifier =
            Modifier.padding(
                top = 20.dp
            )
    )

    Spacer(
        modifier =
            Modifier.height(16.dp)
    )

    Text(
        text =
            "TEXVERSE Marketplace",
        modifier =
            Modifier.fillMaxWidth(),
        textAlign =
            TextAlign.Center,
        fontWeight =
            FontWeight.Bold
    )

    Spacer(
        modifier =
            Modifier.height(4.dp)
    )

    Text(
        text =
            "Bhanuday Urmaliya — Full Stack Developer",
        modifier =
            Modifier.fillMaxWidth(),
        textAlign =
            TextAlign.Center,
        color =
            Color.Gray,
        fontSize =
            12.sp
    )

    Spacer(
        modifier =
            Modifier.height(20.dp)
    )
}

/* =========================================================
   B2B MARKETPLACE WIDGET
   Kept for compatibility with any existing references.
========================================================= */

@Composable
fun B2BMarketplaceWidget(
    languageCode: String
) {

    MarketplaceScreen(
        languageCode =
            languageCode,

        session = null,

        onBack = {},

        onProductClick = {},

        onLogin = {},

        onLanguageChange = {},

        onCategories = {},

        onSuppliers = {},

        onAbout = {},

        onHelp = {}
    )
}

package com.texverse.marketplace.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
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
import com.texverse.marketplace.data.ApiClient
import com.texverse.marketplace.i18n.AppLanguages
import com.texverse.marketplace.i18n.AppStrings
import com.texverse.marketplace.model.Product
import com.texverse.marketplace.model.UserSession
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject

private const val TEXVERSE_API_URL =
    "https://texverse-backend.onrender.com"

private val publicHttpClient =
    OkHttpClient()

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

    BoxWithContent {
        OutlinedButton(
            onClick = {
                expanded = true
            }
        ) {
            Text(
                text =
                    "${currentLanguage.nativeName} ▾"
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
                            "${language.nativeName} — ${language.name}"
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
   TOP BAR / NAVBAR
========================================================= */

@Composable
private fun TopBar(
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
        modifier =
            Modifier
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
            modifier =
                Modifier.fillMaxWidth(),
            horizontalArrangement =
                Arrangement.SpaceBetween,
            verticalAlignment =
                Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "TEXVERSE",
                    color = Color.White,
                    fontWeight =
                        FontWeight.Bold,
                    style =
                        MaterialTheme.typography
                            .headlineSmall
                )

                Text(
                    text =
                        AppStrings.value(
                            languageCode,
                            "ai_commerce"
                        ),
                    color =
                        Color(0xFFCBD5E1),
                    style =
                        MaterialTheme.typography
                            .bodySmall
                )
            }

            LanguageButton(
                languageCode =
                    languageCode,
                onLanguageChange =
                    onLanguageChange
            )
        }

        Spacer(
            modifier =
                Modifier.height(12.dp)
        )

        Row(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .horizontalScroll(
                        rememberScrollState()
                    ),
            horizontalArrangement =
                Arrangement.spacedBy(8.dp)
        ) {
            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "marketplace"
                    ),
                onClick =
                    onMarketplace
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "categories"
                    ),
                onClick =
                    onCategories
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "suppliers"
                    ),
                onClick =
                    onSuppliers
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "about"
                    ),
                onClick =
                    onAbout
            )

            NavButton(
                title =
                    AppStrings.value(
                        languageCode,
                        "help"
                    ),
                onClick =
                    onHelp
            )

            NavButton(
                title = "AI Search",
                onClick =
                    onHelp
            )

            if (session == null) {
                NavButton(
                    title =
                        AppStrings.value(
                            languageCode,
                            "sign_in"
                        ),
                    onClick =
                        onLogin
                )
            } else {
                NavButton(
                    title =
                        AppStrings.value(
                            languageCode,
                            "logout"
                        ),
                    onClick =
                        onLogout
                )
            }
        }
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
    OutlinedButton(
        onClick = onClick
    ) {
        Text(
            text = title,
            color = Color.White
        )
    }
}

/* =========================================================
   HOME SCREEN
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
    var products by remember {
        mutableStateOf<List<Product>>(
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
                parseProducts(
                    result.json
                )
        } else {
            error =
                result.error
                    ?: "Unable to load products."
        }

        loading = false
    }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Color(0xFFF8FAFC)
                )
                .verticalScroll(
                    rememberScrollState()
                )
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

        Column(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(18.dp)
        ) {
            Card(
                modifier =
                    Modifier.fillMaxWidth(),
                shape =
                    RoundedCornerShape(26.dp)
            ) {
                Column(
                    modifier =
                        Modifier.padding(24.dp)
                ) {
                    Text(
                        text =
                            AppStrings.value(
                                languageCode,
                                "welcome"
                            ),
                        style =
                            MaterialTheme.typography
                                .headlineMedium,
                        fontWeight =
                            FontWeight.Bold
                    )

                    Spacer(
                        modifier =
                            Modifier.height(10.dp)
                    )

                    Text(
                        text =
                            "AI-powered B2B textile commerce for sourcing products, comparing suppliers, requesting quotes and managing textile orders.",
                        style =
                            MaterialTheme.typography
                                .bodyLarge
                    )

                    Spacer(
                        modifier =
                            Modifier.height(18.dp)
                    )

                    OutlinedTextField(
                        value = "",
                        onValueChange = {},
                        enabled = false,
                        modifier =
                            Modifier.fillMaxWidth(),
                        label = {
                            Text(
                                AppStrings.value(
                                    languageCode,
                                    "search"
                                )
                            )
                        }
                    )

                    Spacer(
                        modifier =
                            Modifier.height(14.dp)
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
                                AppStrings.value(
                                    languageCode,
                                    "browse"
                                )
                            )
                        }

                        OutlinedButton(
                            onClick =
                                onRegister
                        ) {
                            Text(
                                AppStrings.value(
                                    languageCode,
                                    "get_started"
                                )
                            )
                        }
                    }
                }
            }

            Spacer(
                modifier =
                    Modifier.height(24.dp)
            )

            Text(
                text =
                    "Explore TEXVERSE",
                style =
                    MaterialTheme.typography
                        .headlineSmall,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            Row(
                modifier =
                    Modifier.fillMaxWidth(),
                horizontalArrangement =
                    Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick =
                        onMarketplace,
                    modifier =
                        Modifier.weight(1f)
                ) {
                    Text(
                        AppStrings.value(
                            languageCode,
                            "marketplace"
                        )
                    )
                }

                OutlinedButton(
                    onClick =
                        onCategories,
                    modifier =
                        Modifier.weight(1f)
                ) {
                    Text(
                        AppStrings.value(
                            languageCode,
                            "categories"
                        )
                    )
                }
            }

            Spacer(
                modifier =
                    Modifier.height(8.dp)
            )

            Row(
                modifier =
                    Modifier.fillMaxWidth(),
                horizontalArrangement =
                    Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick =
                        onSuppliers,
                    modifier =
                        Modifier.weight(1f)
                ) {
                    Text(
                        AppStrings.value(
                            languageCode,
                            "suppliers"
                        )
                    )
                }

                OutlinedButton(
                    onClick =
                        onAbout,
                    modifier =
                        Modifier.weight(1f)
                ) {
                    Text(
                        AppStrings.value(
                            languageCode,
                            "about"
                        )
                    )
                }
            }

            Spacer(
                modifier =
                    Modifier.height(8.dp)
            )

            OutlinedButton(
                onClick =
                    onHelp,
                modifier =
                    Modifier.fillMaxWidth()
            ) {
                Text(
                    AppStrings.value(
                        languageCode,
                        "help"
                    )
                )
            }

            Spacer(
                modifier =
                    Modifier.height(26.dp)
            )

            Text(
                text =
                    AppStrings.value(
                        languageCode,
                        "featured"
                    ),
                style =
                    MaterialTheme.typography
                        .headlineSmall,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            when {
                loading -> {
                    Card(
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Column(
                            modifier =
                                Modifier.padding(22.dp),
                            horizontalAlignment =
                                Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator()

                            Spacer(
                                modifier =
                                    Modifier.height(10.dp)
                            )

                            Text(
                                "Loading TEXVERSE products..."
                            )
                        }
                    }
                }

                error.isNotBlank() -> {
                    Card(
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text =
                                error,
                            modifier =
                                Modifier.padding(18.dp),
                            color =
                                Color(0xFFDC2626)
                        )
                    }
                }

                products.isEmpty() -> {
                    Card(
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text =
                                "No products available.",
                            modifier =
                                Modifier.padding(18.dp)
                        )
                    }
                }

                else -> {
                    products
                        .take(6)
                        .forEach { product ->
                            ProductCard(
                                product =
                                    product,
                                onClick = {
                                    onProductClick(
                                        product.id
                                    )
                                }
                            )

                            Spacer(
                                modifier =
                                    Modifier.height(10.dp)
                            )
                        }
                }
            }

            Spacer(
                modifier =
                    Modifier.height(26.dp)
            )

            Text(
                text =
                    AppStrings.value(
                        languageCode,
                        "why_choose"
                    ),
                style =
                    MaterialTheme.typography
                        .headlineSmall,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            InfoCard(
                title =
                    "Verified Textile Marketplace",
                description =
                    "Discover textile products and structured B2B sourcing information."
            )

            InfoCard(
                title =
                    "Supplier Discovery",
                description =
                    "Browse categories, products and supplier-related information."
            )

            InfoCard(
                title =
                    "AI Procurement",
                description =
                    "Use the TEXVERSE AI procurement system for sourcing assistance."
            )

            InfoCard(
                title =
                    "Orders & Shipping",
                description =
                    "The platform supports ordering, payment, shipping and tracking workflows."
            )

            Spacer(
                modifier =
                    Modifier.height(24.dp)
            )

            Card(
                modifier =
                    Modifier.fillMaxWidth(),
                shape =
                    RoundedCornerShape(20.dp)
            ) {
                Column(
                    modifier =
                        Modifier.padding(22.dp)
                ) {
                    Text(
                        text =
                            "Ready to source textiles?",
                        style =
                            MaterialTheme.typography
                                .headlineSmall,
                        fontWeight =
                            FontWeight.Bold
                    )

                    Spacer(
                        modifier =
                            Modifier.height(8.dp)
                    )

                    Text(
                        "Explore the marketplace or create your TEXVERSE account."
                    )

                    Spacer(
                        modifier =
                            Modifier.height(14.dp)
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
                                AppStrings.value(
                                    languageCode,
                                    "marketplace"
                                )
                            )
                        }

                        OutlinedButton(
                            onClick =
                                onRegister
                        ) {
                            Text(
                                AppStrings.value(
                                    languageCode,
                                    "get_started"
                                )
                            )
                        }
                    }
                }
            }

            Spacer(
                modifier =
                    Modifier.height(30.dp)
            )

            Text(
                text = "TEXVERSE",
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
                    "AI-powered textile commerce",
                modifier =
                    Modifier.fillMaxWidth(),
                textAlign =
                    TextAlign.Center,
                color =
                    Color(0xFF64748B)
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
                style =
                    MaterialTheme.typography
                        .bodySmall,
                color =
                    Color(0xFF64748B)
            )

            Spacer(
                modifier =
                    Modifier.height(28.dp)
            )
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
        mutableStateOf<List<Product>>(
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
                parseProducts(
                    result.json
                )
        } else {
            error =
                result.error
                    ?: "Unable to load marketplace."
        }

        loading = false
    }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Color(0xFFF8FAFC)
                )
    ) {
        TopBar(
            languageCode =
                languageCode,
            onLanguageChange =
                onLanguageChange,
            session =
                session,
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
        )

        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .verticalScroll(
                        rememberScrollState()
                    )
                    .padding(18.dp)
        ) {
            Text(
                text =
                    AppStrings.value(
                        languageCode,
                        "marketplace"
                    ),
                style =
                    MaterialTheme.typography
                        .headlineLarge,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(6.dp)
            )

            Text(
                "Public TEXVERSE product catalog"
            )

            Spacer(
                modifier =
                    Modifier.height(14.dp)
            )

            OutlinedButton(
                onClick =
                    onBack
            ) {
                Text("← Back")
            }

            Spacer(
                modifier =
                    Modifier.height(16.dp)
            )

            when {
                loading ->
                    CircularProgressIndicator()

                error.isNotBlank() ->
                    Text(
                        error,
                        color =
                            Color(0xFFDC2626)
                    )

                products.isEmpty() ->
                    Text(
                        "No products found."
                    )

                else ->
                    products.forEach { product ->
                        ProductCard(
                            product =
                                product,
                            onClick = {
                                onProductClick(
                                    product.id
                                )
                            }
                        )

                        Spacer(
                            modifier =
                                Modifier.height(10.dp)
                        )
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
            categories =
                parseStringList(
                    result.json
                )
        } else {
            error =
                result.error
                    ?: "Unable to load categories."
        }

        loading = false
    }

    PublicPage(
        title =
            AppStrings.value(
                languageCode,
                "categories"
            ),
        languageCode =
            languageCode,
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
        content = {
            OutlinedButton(
                onClick =
                    onBack
            ) {
                Text("← Back")
            }

            Spacer(
                modifier =
                    Modifier.height(16.dp)
            )

            when {
                loading ->
                    CircularProgressIndicator()

                error.isNotBlank() ->
                    Text(
                        error,
                        color =
                            Color(0xFFDC2626)
                    )

                categories.isEmpty() ->
                    Text(
                        "No categories found."
                    )

                else ->
                    categories.forEach { category ->
                        Card(
                            modifier =
                                Modifier
                                    .fillMaxWidth()
                                    .padding(
                                        bottom = 10.dp
                                    )
                        ) {
                            Text(
                                text =
                                    category,
                                modifier =
                                    Modifier.padding(18.dp),
                                fontWeight =
                                    FontWeight.Bold
                            )
                        }
                    }
            }
        }
    )
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
        title =
            AppStrings.value(
                languageCode,
                "suppliers"
            ),
        languageCode =
            languageCode,
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
        content = {
            OutlinedButton(
                onClick =
                    onBack
            ) {
                Text("← Back")
            }

            Spacer(
                modifier =
                    Modifier.height(18.dp)
            )

            InfoCard(
                title =
                    "Supplier Directory",
                description =
                    "TEXVERSE currently exposes the product catalog publicly. Supplier-specific management and authenticated supplier workflows are handled after login."
            )

            InfoCard(
                title =
                    "Supplier Dashboard",
                description =
                    "Registered suppliers will use their protected dashboard for product management, orders and negotiations."
            )

            Spacer(
                modifier =
                    Modifier.height(10.dp)
            )

            Button(
                onClick =
                    onMarketplace
            ) {
                Text(
                    AppStrings.value(
                        languageCode,
                        "marketplace"
                    )
                )
            }
        }
    )
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
        title =
            AppStrings.value(
                languageCode,
                "about"
            ),
        languageCode =
            languageCode,
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
        content = {
            OutlinedButton(
                onClick =
                    onBack
            ) {
                Text("← Back")
            }

            Spacer(
                modifier =
                    Modifier.height(18.dp)
            )

            InfoCard(
                title =
                    "TEXVERSE",
                description =
                    "AI-powered B2B textile commerce platform."
            )

            InfoCard(
                title =
                    "Textile Marketplace",
                description =
                    "Browse textile products and categories through the public catalog."
            )

            InfoCard(
                title =
                    "B2B Workflows",
                description =
                    "The full platform supports authentication, products, orders, negotiations, payments, shipping, support, notifications and AI procurement."
            )

            InfoCard(
                title =
                    "Native Android",
                description =
                    "This native Android application connects directly to the existing TEXVERSE Render backend."
            )
        }
    )
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
        title =
            AppStrings.value(
                languageCode,
                "help"
            ),
        languageCode =
            languageCode,
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
        content = {
            OutlinedButton(
                onClick =
                    onBack
            ) {
                Text("← Back")
            }

            Spacer(
                modifier =
                    Modifier.height(18.dp)
            )

            InfoCard(
                title =
                    "Marketplace Help",
                description =
                    "Use Marketplace, Categories and product details to browse the public catalog."
            )

            InfoCard(
                title =
                    "Account Help",
                description =
                    "Use Sign In or Get Started to access protected TEXVERSE features."
            )

            InfoCard(
                title =
                    "Orders & Payments",
                description =
                    "Authenticated buyer workflows include orders, checkout and payment."
            )

            InfoCard(
                title =
                    "Shipping",
                description =
                    "Buyer tracking and shipping management use role-based access."
            )

            InfoCard(
                title =
                    "AI Procurement",
                description =
                    "TEXVERSE includes an AI procurement capability connected to the backend."
            )
        }
    )
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
        mutableStateOf<Product?>(null)
    }

    var loading by remember {
        mutableStateOf(true)
    }

    var error by remember {
        mutableStateOf("")
    }

    LaunchedEffect(productId, token) {
        loading = true
        error = ""

        val result =
            ApiClient.get(
                "/products/$productId",
                token
            )

        if (result.success) {
            product =
                parseSingleProduct(
                    result.json
                )

            if (product == null) {
                error =
                    "Product details could not be parsed."
            }
        } else {
            error =
                result.error
                    ?: "Unable to load product details."
        }

        loading = false
    }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Color(0xFFF8FAFC)
                )
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(18.dp)
    ) {
        OutlinedButton(
            onClick =
                onBack
        ) {
            Text("← Back")
        }

        Spacer(
            modifier =
                Modifier.height(18.dp)
        )

        Text(
            text =
                AppStrings.value(
                    languageCode,
                    "marketplace"
                ),
            style =
                MaterialTheme.typography
                    .headlineMedium,
            fontWeight =
                FontWeight.Bold
        )

        Spacer(
            modifier =
                Modifier.height(16.dp)
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
                Card(
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    Column(
                        modifier =
                            Modifier.padding(18.dp)
                    ) {
                        Text(
                            text =
                                error,
                            color =
                                Color(0xFFDC2626)
                        )

                        Spacer(
                            modifier =
                                Modifier.height(12.dp)
                        )

                        if (token.isNullOrBlank()) {
                            OutlinedButton(
                                onClick =
                                    onLogin
                            ) {
                                Text(
                                    AppStrings.value(
                                        languageCode,
                                        "sign_in"
                                    )
                                )
                            }
                        }
                    }
                }
            }

            product != null -> {
                val currentProduct =
                    product!!

                Card(
                    modifier =
                        Modifier.fillMaxWidth(),
                    shape =
                        RoundedCornerShape(20.dp)
                ) {
                    Column(
                        modifier =
                            Modifier.padding(20.dp)
                    ) {
                        Text(
                            text =
                                currentProduct.name,
                            style =
                                MaterialTheme.typography
                                    .headlineSmall,
                            fontWeight =
                                FontWeight.Bold
                        )

                        Spacer(
                            modifier =
                                Modifier.height(12.dp)
                        )

                        val categoryText =
                            listOf(
                                currentProduct.category,
                                currentProduct.subcategory
                            )
                                .filter {
                                    it.isNotBlank()
                                }
                                .joinToString(" • ")

                        if (categoryText.isNotBlank()) {
                            Text(
                                text =
                                    categoryText,
                                color =
                                    Color(0xFF64748B)
                            )

                            Spacer(
                                modifier =
                                    Modifier.height(16.dp)
                            )
                        }

                        ProductDetailRow(
                            label = "Price",
                            value =
                                currentProduct.price
                        )

                        ProductDetailRow(
                            label = "MOQ",
                            value =
                                currentProduct.moq
                        )

                        ProductDetailRow(
                            label = "Stock",
                            value =
                                currentProduct.stock
                        )

                        if (
                            currentProduct.image.isNotBlank()
                        ) {
                            Spacer(
                                modifier =
                                    Modifier.height(10.dp)
                            )

                            Text(
                                text =
                                    "Image: ${currentProduct.image}",
                                style =
                                    MaterialTheme.typography
                                        .bodySmall,
                                color =
                                    Color(0xFF64748B)
                            )
                        }
                    }
                }
            }
        }
    }
}

/* =========================================================
   PRODUCT DETAIL ROW
========================================================= */

@Composable
private fun ProductDetailRow(
    label: String,
    value: String
) {
    Row(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(
                    vertical = 8.dp
                ),
        horizontalArrangement =
            Arrangement.SpaceBetween
    ) {
        Text(
            text =
                label,
            fontWeight =
                FontWeight.Bold
        )

        Text(
            text =
                value.ifBlank {
                    "-"
                }
        )
    }
}

/* =========================================================
   LOGIN SCREEN
========================================================= */

@Composable
fun LoginScreen(
    languageCode: String,
    onBack: () -> Unit,
    onRegister: () -> Unit,
    onLoginSuccess: (UserSession) -> Unit
) {
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

    var successMessage by remember {
        mutableStateOf("")
    }

    val scope =
        rememberCoroutineScope()

    fun submitLogin() {
        if (email.isBlank()) {
            error = "Please enter your email."
            return
        }

        if (password.isBlank()) {
            error = "Please enter your password."
            return
        }

        loading = true
        error = ""
        successMessage = ""

        scope.launch {
            val result =
                loginRequest(
                    email =
                        email.trim(),
                    password =
                        password
                )

            loading = false

            if (result.success) {
                val session =
                    result.session

                if (session != null) {
                    onLoginSuccess(
                        session
                    )
                } else {
                    error =
                        "Login succeeded but session data was missing."
                }
            } else {
                error =
                    result.error
                        ?: "Login failed."
            }
        }
    }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Color(0xFFF8FAFC)
                )
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(18.dp),
        horizontalAlignment =
            Alignment.CenterHorizontally
    ) {
        Card(
            modifier =
                Modifier
                    .fillMaxWidth()
                    .padding(
                        top = 20.dp
                    ),
            shape =
                RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier =
                    Modifier.padding(22.dp)
            ) {
                Text(
                    text =
                        "TEXVERSE",
                    style =
                        MaterialTheme.typography
                            .headlineMedium,
                    fontWeight =
                        FontWeight.Bold
                )

                Spacer(
                    modifier =
                        Modifier.height(6.dp)
                )

                Text(
                    text =
                        "Sign in to your TEXVERSE account."
                )

                Spacer(
                    modifier =
                        Modifier.height(20.dp)
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
                        Text("Email")
                    },
                    singleLine = true,
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType =
                                KeyboardType.Email,
                            imeAction =
                                ImeAction.Next
                        )
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
                        Text("Password")
                    },
                    singleLine = true,
                    visualTransformation =
                        PasswordVisualTransformation(),
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType =
                                KeyboardType.Password,
                            imeAction =
                                ImeAction.Done
                        )
                )

                Spacer(
                    modifier =
                        Modifier.height(16.dp)
                )

                if (error.isNotBlank()) {
                    Text(
                        text =
                            error,
                        color =
                            Color(0xFFDC2626)
                    )

                    Spacer(
                        modifier =
                            Modifier.height(10.dp)
                    )
                }

                if (
                    successMessage.isNotBlank()
                ) {
                    Text(
                        text =
                            successMessage,
                        color =
                            Color(0xFF16A34A)
                    )

                    Spacer(
                        modifier =
                            Modifier.height(10.dp)
                    )
                }

                Button(
                    onClick =
                        ::submitLogin,
                    enabled =
                        !loading,
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    if (loading) {
                        CircularProgressIndicator(
                            modifier =
                                Modifier.height(20.dp)
                        )
                    } else {
                        Text("Sign In")
                    }
                }

                Spacer(
                    modifier =
                        Modifier.height(8.dp)
                )

                OutlinedButton(
                    onClick =
                        onRegister,
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    Text(
                        AppStrings.value(
                            languageCode,
                            "get_started"
                        )
                    )
                }

                Spacer(
                    modifier =
                        Modifier.height(8.dp)
                )

                TextButton(
                    onClick =
                        onBack,
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    Text("← Back to Home")
                }
            }
        }
    }
}

/* =========================================================
   REGISTER SCREEN
========================================================= */

@Composable
fun RegisterScreen(
    languageCode: String,
    onBack: () -> Unit,
    onLogin: () -> Unit,
    onRegistered: () -> Unit
) {
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

    var roleMenuExpanded by remember {
        mutableStateOf(false)
    }

    val scope =
        rememberCoroutineScope()

    fun submitRegister() {
        when {
            fullName.isBlank() ->
                error =
                    "Please enter your full name."

            email.isBlank() ->
                error =
                    "Please enter your email."

            password.length < 6 ->
                error =
                    "Password must contain at least 6 characters."

            city.isBlank() ->
                error =
                    "Please enter your city."

            state.isBlank() ->
                error =
                    "Please enter your state."

            country.isBlank() ->
                error =
                    "Please enter your country."

            else -> {
                loading = true
                error = ""

                scope.launch {
                    val result =
                        registerRequest(
                            fullName =
                                fullName.trim(),
                            email =
                                email.trim(),
                            password =
                                password,
                            role =
                                role,
                            companyName =
                                companyName.trim(),
                            phone =
                                phone.trim(),
                            city =
                                city.trim(),
                            state =
                                state.trim(),
                            country =
                                country.trim(),
                            language =
                                languageCode
                        )

                    loading = false

                    if (result.success) {
                        onRegistered()
                    } else {
                        error =
                            result.error
                                ?: "Registration failed."
                    }
                }
            }
        }
    }

    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Color(0xFFF8FAFC)
                )
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(18.dp)
    ) {
        Card(
            modifier =
                Modifier.fillMaxWidth(),
            shape =
                RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier =
                    Modifier.padding(22.dp)
            ) {
                Text(
                    text =
                        "Create TEXVERSE Account",
                    style =
                        MaterialTheme.typography
                            .headlineSmall,
                    fontWeight =
                        FontWeight.Bold
                )

                Spacer(
                    modifier =
                        Modifier.height(6.dp)
                )

                Text(
                    "Join the TEXVERSE B2B textile marketplace."
                )

                Spacer(
                    modifier =
                        Modifier.height(18.dp)
                )

                OutlinedTextField(
                    value =
                        fullName,
                    onValueChange = {
                        fullName = it
                        error = ""
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("Full Name")
                    },
                    singleLine = true
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
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
                        Text("Email")
                    },
                    singleLine = true,
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType =
                                KeyboardType.Email
                        )
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
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
                        Text("Password")
                    },
                    singleLine = true,
                    visualTransformation =
                        PasswordVisualTransformation(),
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType =
                                KeyboardType.Password
                        )
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
                )

                BoxWithContent {
                    OutlinedButton(
                        onClick = {
                            roleMenuExpanded =
                                true
                        },
                        modifier =
                            Modifier.fillMaxWidth()
                    ) {
                        Text(
                            "Role: ${role.replaceFirstChar { it.uppercase() }} ▾"
                        )
                    }

                    DropdownMenu(
                        expanded =
                            roleMenuExpanded,
                        onDismissRequest = {
                            roleMenuExpanded =
                                false
                        }
                    ) {
                        DropdownMenuItem(
                            text = {
                                Text("Buyer")
                            },
                            onClick = {
                                role = "buyer"
                                roleMenuExpanded =
                                    false
                            }
                        )

                        DropdownMenuItem(
                            text = {
                                Text("Supplier")
                            },
                            onClick = {
                                role = "supplier"
                                roleMenuExpanded =
                                    false
                            }
                        )

                        DropdownMenuItem(
                            text = {
                                Text("Shipping")
                            },
                            onClick = {
                                role = "shipping"
                                roleMenuExpanded =
                                    false
                            }
                        )
                    }
                }

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
                )

                OutlinedTextField(
                    value =
                        companyName,
                    onValueChange = {
                        companyName = it
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("Company Name")
                    },
                    singleLine = true
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
                )

                OutlinedTextField(
                    value =
                        phone,
                    onValueChange = {
                        phone = it
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("Phone")
                    },
                    singleLine = true,
                    keyboardOptions =
                        KeyboardOptions(
                            keyboardType =
                                KeyboardType.Phone
                        )
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
                )

                OutlinedTextField(
                    value =
                        city,
                    onValueChange = {
                        city = it
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("City")
                    },
                    singleLine = true
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
                )

                OutlinedTextField(
                    value =
                        state,
                    onValueChange = {
                        state = it
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("State")
                    },
                    singleLine = true
                )

                Spacer(
                    modifier =
                        Modifier.height(10.dp)
                )

                OutlinedTextField(
                    value =
                        country,
                    onValueChange = {
                        country = it
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("Country")
                    },
                    singleLine = true
                )

                Spacer(
                    modifier =
                        Modifier.height(16.dp)
                )

                if (error.isNotBlank()) {
                    Text(
                        text =
                            error,
                        color =
                            Color(0xFFDC2626)
                    )

                    Spacer(
                        modifier =
                            Modifier.height(10.dp)
                    )
                }

                Button(
                    onClick =
                        ::submitRegister,
                    enabled =
                        !loading,
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    if (loading) {
                        CircularProgressIndicator(
                            modifier =
                                Modifier.height(20.dp)
                        )
                    } else {
                        Text(
                            "Create Account"
                        )
                    }
                }

                Spacer(
                    modifier =
                        Modifier.height(8.dp)
                )

                OutlinedButton(
                    onClick =
                        onLogin,
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    Text(
                        AppStrings.value(
                            languageCode,
                            "sign_in"
                        )
                    )
                }

                Spacer(
                    modifier =
                        Modifier.height(8.dp)
                )

                TextButton(
                    onClick =
                        onBack,
                    modifier =
                        Modifier.fillMaxWidth()
                ) {
                    Text("← Back to Home")
                }
            }
        }

        Spacer(
            modifier =
                Modifier.height(24.dp)
        )
    }
}

/* =========================================================
   GENERIC PUBLIC PAGE
========================================================= */

@Composable
private fun PublicPage(
    title: String,
    languageCode: String,
    onLanguageChange: (String) -> Unit,
    onMarketplace: () -> Unit,
    onCategories: () -> Unit,
    onSuppliers: () -> Unit,
    onAbout: () -> Unit,
    onHelp: () -> Unit,
    content: @Composable ColumnScope.() -> Unit
) {
    Column(
        modifier =
            Modifier
                .fillMaxSize()
                .background(
                    Color(0xFFF8FAFC)
                )
    ) {
        TopBar(
            languageCode =
                languageCode,
            onLanguageChange =
                onLanguageChange,
            session = null,
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
            onLogin = {},
            onLogout = {}
        )

        Column(
            modifier =
                Modifier
                    .fillMaxSize()
                    .verticalScroll(
                        rememberScrollState()
                    )
                    .padding(18.dp),
            content = {
                Text(
                    text =
                        title,
                    style =
                        MaterialTheme.typography
                            .headlineLarge,
                    fontWeight =
                        FontWeight.Bold
                )

                Spacer(
                    modifier =
                        Modifier.height(16.dp)
                )

                content()
            }
        )
    }
}

/* =========================================================
   PRODUCT CARD
========================================================= */

@Composable
private fun ProductCard(
    product: Product,
    onClick: () -> Unit
) {
    Card(
        modifier =
            Modifier
                .fillMaxWidth()
                .clickable(
                    onClick = onClick
                )
    ) {
        Column(
            modifier =
                Modifier.padding(18.dp)
        ) {
            Text(
                text =
                    product.name,
                style =
                    MaterialTheme.typography
                        .titleMedium,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(5.dp)
            )

            val categoryText =
                listOf(
                    product.category,
                    product.subcategory
                )
                    .filter {
                        it.isNotBlank()
                    }
                    .joinToString(" • ")

            if (categoryText.isNotBlank()) {
                Text(
                    text =
                        categoryText,
                    color =
                        Color(0xFF64748B)
                )
            }

            Spacer(
                modifier =
                    Modifier.height(10.dp)
            )

            Row(
                modifier =
                    Modifier.fillMaxWidth(),
                horizontalArrangement =
                    Arrangement.SpaceBetween
            ) {
                Text(
                    "Price: ${product.price}"
                )

                Text(
                    "MOQ: ${product.moq}"
                )
            }

            Spacer(
                modifier =
                    Modifier.height(6.dp)
            )

            Text(
                "Stock: ${product.stock}",
                color =
                    Color(0xFF64748B)
            )

            Spacer(
                modifier =
                    Modifier.height(8.dp)
            )

            Text(
                "Tap to view details",
                style =
                    MaterialTheme.typography
                        .bodySmall,
                color =
                    Color(0xFF2563EB)
            )
        }
    }
}

/* =========================================================
   INFO CARD
========================================================= */

@Composable
private fun InfoCard(
    title: String,
    description: String
) {
    Card(
        modifier =
            Modifier
                .fillMaxWidth()
                .padding(
                    bottom = 10.dp
                )
    ) {
        Column(
            modifier =
                Modifier.padding(16.dp)
        ) {
            Text(
                text =
                    title,
                fontWeight =
                    FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(5.dp)
            )

            Text(
                text =
                    description,
                color =
                    Color(0xFF64748B)
            )
        }
    }
}

/* =========================================================
   PRODUCT PARSING
========================================================= */

private fun parseProducts(
    value: Any?
): List<Product> {
    val array =
        when (value) {
            is JSONArray ->
                value

            is JSONObject -> {
                when {
                    value.has("items") ->
                        value.optJSONArray(
                            "items"
                        )

                    value.has("products") ->
                        value.optJSONArray(
                            "products"
                        )

                    value.has("data") ->
                        value.optJSONArray(
                            "data"
                        )

                    else ->
                        null
                }
            }

            else ->
                null
        }

    if (array == null) {
        return emptyList()
    }

    val result =
        mutableListOf<Product>()

    for (
        index in
        0 until array.length()
    ) {
        val item =
            array.optJSONObject(
                index
            ) ?: continue

        result.add(
            productFromJson(
                item
            )
        )
    }

    return result
}

/* =========================================================
   SINGLE PRODUCT
========================================================= */

private fun parseSingleProduct(
    value: Any?
): Product? {
    val objectValue =
        value as? JSONObject
            ?: return null

    return productFromJson(
        objectValue
    )
}

/* =========================================================
   PRODUCT JSON
========================================================= */

private fun productFromJson(
    item: JSONObject
): Product {
    return Product(
        id =
            item.optInt(
                "id",
                0
            ),
        name =
            item.optString(
                "name",
                "Unnamed Product"
            ),
        category =
            item.optString(
                "category",
                ""
            ),
        subcategory =
            item.optString(
                "subcategory",
                ""
            ),
        price =
            item.optString(
                "price",
                "-"
            ),
        moq =
            item.optString(
                "moq",
                "-"
            ),
        stock =
            item.optString(
                "stock",
                "-"
            ),
        image =
            item.optString(
                "image",
                ""
            )
    )
}

/* =========================================================
   STRING LIST PARSER
========================================================= */

private fun parseStringList(
    value: Any?
): List<String> {
    when (value) {
        is JSONArray -> {
            val result =
                mutableListOf<String>()

            for (
                index in
                0 until value.length()
            ) {
                val item =
                    value.opt(index)

                when (item) {
                    is String ->
                        result.add(
                            item
                        )

                    is JSONObject -> {
                        val name =
                            item.optString(
                                "name",
                                ""
                            )

                        if (
                            name.isNotBlank()
                        ) {
                            result.add(
                                name
                            )
                        }
                    }
                }
            }

            return result
        }

        is JSONObject -> {
            listOf(
                "items",
                "categories",
                "data"
            ).forEach { key ->
                if (value.has(key)) {
                    val parsed =
                        parseStringList(
                            value.opt(key)
                        )

                    if (
                        parsed.isNotEmpty()
                    ) {
                        return parsed
                    }
                }
            }
        }
    }

    return emptyList()
}

/* =========================================================
   LOGIN RESULT
========================================================= */

private data class LoginResult(
    val success: Boolean,
    val session: UserSession? = null,
    val error: String? = null
)

/* =========================================================
   REGISTER RESULT
========================================================= */

private data class RegisterResult(
    val success: Boolean,
    val error: String? = null
)

/* =========================================================
   LOGIN REQUEST
========================================================= */

private suspend fun loginRequest(
    email: String,
    password: String
): LoginResult =
    withContext(Dispatchers.IO) {
        try {
            val payload =
                JSONObject()
                    .put(
                        "email",
                        email
                    )
                    .put(
                        "password",
                        password
                    )

            val requestBody =
                payload
                    .toString()
                    .toRequestBody(
                        "application/json"
                            .toMediaType()
                    )

            val request =
                Request.Builder()
                    .url(
                        "$TEXVERSE_API_URL/auth/login"
                    )
                    .post(
                        requestBody
                    )
                    .header(
                        "Accept",
                        "application/json"
                    )
                    .build()

            publicHttpClient
                .newCall(request)
                .execute()
                .use { response ->

                    val body =
                        response.body
                            ?.string()
                            .orEmpty()

                    if (!response.isSuccessful) {
                        return@withContext LoginResult(
                            success = false,
                            error =
                                extractApiError(
                                    body,
                                    "Login failed."
                                )
                        )
                    }

                    val json =
                        JSONObject(body)

                    val token =
                        json.optString(
                            "access_token",
                            ""
                        )

                    if (
                        token.isBlank()
                    ) {
                        return@withContext LoginResult(
                            success = false,
                            error =
                                "Login response did not contain an access token."
                        )
                    }

                    val userJson =
                        json.optJSONObject(
                            "user"
                        )

                    if (userJson == null) {
                        return@withContext LoginResult(
                            success = false,
                            error =
                                "Login response did not contain user data."
                        )
                    }

                    val session =
                        UserSession(
                            token =
                                token,
                            id =
                                if (
                                    userJson.has("id")
                                ) {
                                    userJson.optInt(
                                        "id"
                                    )
                                } else {
                                    null
                                },
                            fullName =
                                userJson.optString(
                                    "full_name",
                                    "TEXVERSE User"
                                ),
                            email =
                                userJson.optString(
                                    "email",
                                    email
                                ),
                            role =
                                userJson.optString(
                                    "role",
                                    "buyer"
                                ),
                            companyName =
                                userJson.optString(
                                    "company_name",
                                    ""
                                ),
                            emailVerified =
                                userJson.optBoolean(
                                    "email_verified",
                                    false
                                ),
                            language =
                                userJson.optString(
                                    "language",
                                    "en"
                                )
                        )

                    LoginResult(
                        success = true,
                        session = session
                    )
                }
        } catch (exception: Exception) {
            LoginResult(
                success = false,
                error =
                    exception.message
                        ?: "Unable to connect to TEXVERSE."
            )
        }
    }

/* =========================================================
   REGISTER REQUEST
========================================================= */

private suspend fun registerRequest(
    fullName: String,
    email: String,
    password: String,
    role: String,
    companyName: String,
    phone: String,
    city: String,
    state: String,
    country: String,
    language: String
): RegisterResult =
    withContext(Dispatchers.IO) {
        try {
            val payload =
                JSONObject()
                    .put(
                        "full_name",
                        fullName
                    )
                    .put(
                        "email",
                        email
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
                        companyName
                    )
                    .put(
                        "phone",
                        phone
                    )
                    .put(
                        "city",
                        city
                    )
                    .put(
                        "state",
                        state
                    )
                    .put(
                        "country",
                        country
                    )
                    .put(
                        "language",
                        language
                    )

            val requestBody =
                payload
                    .toString()
                    .toRequestBody(
                        "application/json"
                            .toMediaType()
                    )

            val request =
                Request.Builder()
                    .url(
                        "$TEXVERSE_API_URL/auth/register"
                    )
                    .post(
                        requestBody
                    )
                    .header(
                        "Accept",
                        "application/json"
                    )
                    .build()

            publicHttpClient
                .newCall(request)
                .execute()
                .use { response ->

                    val body =
                        response.body
                            ?.string()
                            .orEmpty()

                    if (!response.isSuccessful) {
                        return@withContext RegisterResult(
                            success = false,
                            error =
                                extractApiError(
                                    body,
                                    "Registration failed."
                                )
                        )
                    }

                    RegisterResult(
                        success = true
                    )
                }
        } catch (exception: Exception) {
            RegisterResult(
                success = false,
                error =
                    exception.message
                        ?: "Unable to connect to TEXVERSE."
            )
        }
    }

/* =========================================================
   API ERROR EXTRACTION
========================================================= */

private fun extractApiError(
    body: String,
    fallback: String
): String {
    if (body.isBlank()) {
        return fallback
    }

    return try {
        val json =
            JSONObject(body)

        when {
            json.has("detail") -> {
                val detail =
                    json.opt("detail")

                when (detail) {
                    is JSONArray -> {
                        val messages =
                            mutableListOf<String>()

                        for (
                            index in
                            0 until detail.length()
                        ) {
                            val item =
                                detail.optJSONObject(
                                    index
                                )

                            if (
                                item != null
                            ) {
                                val message =
                                    item.optString(
                                        "msg",
                                        ""
                                    )

                                if (
                                    message.isNotBlank()
                                ) {
                                    messages.add(
                                        message
                                    )
                                }
                            } else {
                                val text =
                                    detail.optString(
                                        index,
                                        ""
                                    )

                                if (
                                    text.isNotBlank()
                                ) {
                                    messages.add(
                                        text
                                    )
                                }
                            }
                        }

                        if (
                            messages.isNotEmpty()
                        ) {
                            messages.joinToString(
                                "\n"
                            )
                        } else {
                            fallback
                        }
                    }

                    else ->
                        json.optString(
                            "detail",
                            fallback
                        )
                }
            }

            json.has("message") ->
                json.optString(
                    "message",
                    fallback
                )

            else ->
                fallback
        }
    } catch (_: Exception) {
        body
            .replace(
                "\"",
                ""
            )
            .ifBlank {
                fallback
            }
    }
}

/* =========================================================
   BOX HELPER
========================================================= */

@Composable
private fun BoxWithContent(
    content:
        @Composable BoxScope.() -> Unit
) {
    Box(
        content = content
    )
}


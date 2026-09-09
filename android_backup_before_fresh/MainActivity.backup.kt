package com.texverse.marketplace

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.texverse.marketplace.ui.theme.TEXVERSETheme
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject

private const val API_URL =
    "https://texverse-backend.onrender.com"

private val httpClient = OkHttpClient()

private val jsonMediaType =
    "application/json; charset=utf-8".toMediaType()

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            TEXVERSETheme(
                dynamicColor = false
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color(0xFFF8FAFC)
                ) {
                    TEXVERSEApp()
                }
            }
        }
    }
}

@Composable
private fun TEXVERSEApp() {

    var token by remember {
        mutableStateOf<String?>(null)
    }

    var user by remember {
        mutableStateOf<JSONObject?>(null)
    }

    var loading by remember {
        mutableStateOf(false)
    }

    if (loading) {
        LoadingScreen()
        return
    }

    if (token == null) {
        LoginScreen(
            onLoginSuccess = { newToken, newUser ->
                token = newToken
                user = newUser
            }
        )
    } else {
        DashboardScreen(
            user = user,
            token = token!!,
            onLogout = {
                token = null
                user = null
            }
        )
    }
}

@Composable
private fun LoadingScreen() {

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment =
            Alignment.CenterHorizontally,
        verticalArrangement =
            Arrangement.Center
    ) {

        CircularProgressIndicator()

        Spacer(
            modifier = Modifier.height(16.dp)
        )

        Text(
            text = "Connecting to TEXVERSE...",
            style =
                MaterialTheme.typography.bodyLarge
        )
    }
}

@Composable
private fun LoginScreen(
    onLoginSuccess: (String, JSONObject?) -> Unit
) {

    val scope = rememberCoroutineScope()

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
            .background(Color(0xFFF8FAFC))
            .verticalScroll(
                rememberScrollState()
            )
            .padding(24.dp),
        horizontalAlignment =
            Alignment.CenterHorizontally,
        verticalArrangement =
            Arrangement.Center
    ) {

        Text(
            text = "TEXVERSE",
            style =
                MaterialTheme.typography.headlineLarge,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF0F172A)
        )

        Spacer(
            modifier = Modifier.height(6.dp)
        )

        Text(
            text = "AI-powered textile commerce",
            style =
                MaterialTheme.typography.bodyMedium,
            color = Color(0xFF64748B)
        )

        Spacer(
            modifier = Modifier.height(36.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth()
        ) {

            Column(
                modifier = Modifier.padding(20.dp)
            ) {

                Text(
                    text = "Sign in",
                    style =
                        MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )

                Spacer(
                    modifier = Modifier.height(20.dp)
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = {
                        email = it
                        error = ""
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    label = {
                        Text("Email")
                    },
                    singleLine = true
                )

                Spacer(
                    modifier = Modifier.height(12.dp)
                )

                OutlinedTextField(
                    value = password,
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
                        PasswordVisualTransformation()
                )

                Spacer(
                    modifier = Modifier.height(20.dp)
                )

                if (error.isNotBlank()) {

                    Text(
                        text = error,
                        color = Color(0xFFDC2626),
                        style =
                            MaterialTheme.typography.bodyMedium
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

                            val result =
                                LoginApi.login(
                                    email =
                                        email.trim(),
                                    password =
                                        password
                                )

                            loading = false

                            if (result.success) {

                                onLoginSuccess(
                                    result.token!!,
                                    result.user
                                )

                            } else {

                                error =
                                    result.error
                                        ?: "Login failed."
                            }
                        }
                    },
                    modifier =
                        Modifier.fillMaxWidth(),
                    enabled = !loading
                ) {

                    if (loading) {

                        CircularProgressIndicator(
                            modifier =
                                Modifier.height(20.dp),
                            strokeWidth = 2.dp
                        )

                    } else {

                        Text("Sign in")
                    }
                }

                Spacer(
                    modifier = Modifier.height(12.dp)
                )

                OutlinedButton(
                    onClick = {
                        error =
                            "Registration will be connected next."
                    },
                    modifier =
                        Modifier.fillMaxWidth()
                ) {

                    Text("Create account")
                }
            }
        }

        Spacer(
            modifier = Modifier.height(24.dp)
        )

        Text(
            text = "Connected API",
            fontWeight = FontWeight.SemiBold
        )

        Text(
            text = API_URL,
            style =
                MaterialTheme.typography.bodySmall,
            color = Color(0xFF64748B)
        )
    }
}

@Composable
private fun DashboardScreen(
    user: JSONObject?,
    token: String,
    onLogout: () -> Unit
) {

    val scope = rememberCoroutineScope()

    val name =
        user?.optString(
            "full_name",
            "TEXVERSE User"
        ) ?: "TEXVERSE User"

    val role =
        user?.optString(
            "role",
            "buyer"
        ) ?: "buyer"

    var products by remember {
        mutableStateOf<List<JSONObject>>(
            emptyList()
        )
    }

    var loadingProducts by remember {
        mutableStateOf(true)
    }

    var apiError by remember {
        mutableStateOf("")
    }

    LaunchedEffect(token) {

        val result =
            ProductsApi.list(token)

        loadingProducts = false

        if (result.success) {

            products = result.products

        } else {

            apiError =
                result.error
                    ?: "Unable to load products."
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Color(0xFF0F172A)
                )
                .padding(
                    horizontal = 20.dp,
                    vertical = 18.dp
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
                        text = "Native Android",
                        color =
                            Color(0xFFCBD5E1),
                        style =
                            MaterialTheme.typography
                                .bodySmall
                    )
                }

                OutlinedButton(
                    onClick = onLogout
                ) {

                    Text("Logout")
                }
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(
                    rememberScrollState()
                )
                .padding(20.dp)
        ) {

            Text(
                text = "Welcome, $name",
                style =
                    MaterialTheme.typography
                        .headlineMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(4.dp)
            )

            Text(
                text =
                    "Role: ${role.uppercase()}",
                color = Color(0xFF64748B)
            )

            Spacer(
                modifier = Modifier.height(24.dp)
            )

            Text(
                text = "Marketplace",
                style =
                    MaterialTheme.typography
                        .headlineSmall,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier = Modifier.height(12.dp)
            )

            if (loadingProducts) {

                Card(
                    modifier =
                        Modifier.fillMaxWidth()
                ) {

                    Column(
                        modifier =
                            Modifier.padding(20.dp),
                        horizontalAlignment =
                            Alignment.CenterHorizontally
                    ) {

                        CircularProgressIndicator()

                        Spacer(
                            modifier =
                                Modifier.height(12.dp)
                        )

                        Text(
                            "Loading products..."
                        )
                    }
                }

            } else if (
                apiError.isNotBlank()
            ) {

                Card(
                    modifier =
                        Modifier.fillMaxWidth()
                ) {

                    Text(
                        text = apiError,
                        modifier =
                            Modifier.padding(20.dp),
                        color =
                            Color(0xFFDC2626)
                    )
                }

            } else if (
                products.isEmpty()
            ) {

                Card(
                    modifier =
                        Modifier.fillMaxWidth()
                ) {

                    Text(
                        text =
                            "No products found.",
                        modifier =
                            Modifier.padding(20.dp)
                    )
                }

            } else {

                products.forEach { product ->

                    ProductCard(
                        product = product
                    )

                    Spacer(
                        modifier =
                            Modifier.height(12.dp)
                    )
                }
            }

            Spacer(
                modifier =
                    Modifier.height(20.dp)
            )

            Text(
                text = "Connected modules",
                style =
                    MaterialTheme.typography
                        .titleLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(12.dp)
            )

            ModuleCard(
                "Orders",
                "/orders/mine"
            )

            ModuleCard(
                "Negotiations",
                "/negotiations/mine"
            )

            ModuleCard(
                "Notifications",
                "/notifications"
            )

            ModuleCard(
                "Shipping",
                "/shipping/tracking/{order_id}"
            )

            ModuleCard(
                "Support",
                "/support/mine"
            )

            ModuleCard(
                "AI Procurement",
                "/ai/procure"
            )
        }
    }
}

@Composable
private fun ProductCard(
    product: JSONObject
) {

    val name =
        product.optString(
            "name",
            "Unnamed Product"
        )

    val category =
        product.optString(
            "category",
            "Textile"
        )

    val price =
        product.optString(
            "price",
            "-"
        )

    val moq =
        product.optString(
            "moq",
            "-"
        )

    Card(
        modifier =
            Modifier.fillMaxWidth()
    ) {

        Column(
            modifier =
                Modifier.padding(18.dp)
        ) {

            Text(
                text = name,
                style =
                    MaterialTheme.typography
                        .titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(
                modifier =
                    Modifier.height(6.dp)
            )

            Text(
                text = category,
                color =
                    Color(0xFF64748B)
            )

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
                    text = "Price: $price"
                )

                Text(
                    text = "MOQ: $moq"
                )
            }
        }
    }
}

@Composable
private fun ModuleCard(
    title: String,
    endpoint: String
) {

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 8.dp)
    ) {

        Column(
            modifier =
                Modifier.padding(16.dp)
        ) {

            Text(
                text = title,
                fontWeight =
                    FontWeight.SemiBold
            )

            Text(
                text = endpoint,
                style =
                    MaterialTheme.typography
                        .bodySmall,
                color =
                    Color(0xFF64748B)
            )
        }
    }
}

private data class LoginResult(
    val success: Boolean,
    val token: String? = null,
    val user: JSONObject? = null,
    val error: String? = null
)

private object LoginApi {

    suspend fun login(
        email: String,
        password: String
    ): LoginResult =
        withContext(Dispatchers.IO) {

            try {

                val json =
                    JSONObject().apply {
                        put("email", email)
                        put("password", password)
                    }

                val requestBody =
                    json.toString()
                        .toRequestBody(
                            jsonMediaType
                        )

                val request =
                    Request.Builder()
                        .url(
                            "$API_URL/auth/login"
                        )
                        .post(requestBody)
                        .addHeader(
                            "Accept",
                            "application/json"
                        )
                        .build()

                val response =
                    httpClient
                        .newCall(request)
                        .execute()

                val body =
                    response.body
                        ?.string()
                        ?: ""

                if (!response.isSuccessful) {

                    val message =
                        try {

                            JSONObject(body)
                                .optString(
                                    "detail",
                                    "Login failed."
                                )

                        } catch (
                            _: Exception
                        ) {

                            "Login failed (${response.code})."
                        }

                    return@withContext LoginResult(
                        success = false,
                        error = message
                    )
                }

                val responseJson =
                    JSONObject(body)

                val accessToken =
                    responseJson.optString(
                        "access_token",
                        ""
                    )

                val responseUser =
                    responseJson.optJSONObject(
                        "user"
                    )

                if (accessToken.isBlank()) {

                    return@withContext LoginResult(
                        success = false,
                        error =
                            "Server did not return an access token."
                    )
                }

                LoginResult(
                    success = true,
                    token = accessToken,
                    user = responseUser
                )

            } catch (e: Exception) {

                LoginResult(
                    success = false,
                    error =
                        "Network error: ${e.message}"
                )
            }
        }
}

private data class ProductsResult(
    val success: Boolean,
    val products: List<JSONObject> =
        emptyList(),
    val error: String? = null
)

private object ProductsApi {

    suspend fun list(
        token: String
    ): ProductsResult =
        withContext(Dispatchers.IO) {

            try {

                val request =
                    Request.Builder()
                        .url(
                            "$API_URL/products"
                        )
                        .get()
                        .addHeader(
                            "Accept",
                            "application/json"
                        )
                        .addHeader(
                            "Authorization",
                            "Bearer $token"
                        )
                        .build()

                val response =
                    httpClient
                        .newCall(request)
                        .execute()

                val body =
                    response.body
                        ?.string()
                        ?: ""

                if (!response.isSuccessful) {

                    return@withContext ProductsResult(
                        success = false,
                        error =
                            "Products request failed (${response.code})."
                    )
                }

                val products =
                    mutableListOf<JSONObject>()

                try {

                    val json =
                        JSONObject(body)

                    val array =
                        when {

                            json.has("items") ->
                                json.optJSONArray(
                                    "items"
                                )

                            json.has("products") ->
                                json.optJSONArray(
                                    "products"
                                )

                            else -> null
                        }

                    if (array != null) {

                        for (
                            index in
                            0 until array.length()
                        ) {

                            array
                                .optJSONObject(index)
                                ?.let {
                                    products.add(it)
                                }
                        }
                    }

                } catch (
                    _: Exception
                ) {

                    // Some APIs may return
                    // a different JSON structure.
                }

                ProductsResult(
                    success = true,
                    products = products
                )

            } catch (e: Exception) {

                ProductsResult(
                    success = false,
                    error =
                        "Network error: ${e.message}"
                )
            }
        }
}
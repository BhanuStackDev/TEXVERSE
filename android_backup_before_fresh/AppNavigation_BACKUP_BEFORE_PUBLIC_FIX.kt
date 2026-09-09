package com.texverse.marketplace.ui.navigation

import android.content.Context
import android.content.SharedPreferences
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.texverse.marketplace.model.UserSession
import com.texverse.marketplace.ui.screens.AboutScreen
import com.texverse.marketplace.ui.screens.CategoriesScreen
import com.texverse.marketplace.ui.screens.HelpScreen
import com.texverse.marketplace.ui.screens.HomeScreen
import com.texverse.marketplace.ui.screens.LoginScreen
import com.texverse.marketplace.ui.screens.MarketplaceScreen
import com.texverse.marketplace.ui.screens.ProductDetailsScreen
import com.texverse.marketplace.ui.screens.RegisterScreen
import com.texverse.marketplace.ui.screens.SuppliersScreen

enum class AppScreen {
    HOME,
    MARKETPLACE,
    CATEGORIES,
    SUPPLIERS,
    ABOUT,
    HELP,
    PRODUCT_DETAILS,
    LOGIN,
    REGISTER
}

@Composable
fun TEXVERSEApp() {

    val context =
        androidx.compose.ui.platform.LocalContext.current

    val preferences =
        remember {
            context.getSharedPreferences(
                "texverse_android",
                Context.MODE_PRIVATE
            )
        }

    var languageCode by remember {
        mutableStateOf(
            preferences.getString(
                "language",
                "en"
            ) ?: "en"
        )
    }

    var session by remember {
        mutableStateOf(
            SessionStore.load(
                preferences
            )
        )
    }

    var screen by remember {
        mutableStateOf(
            AppScreen.HOME
        )
    }

    var selectedProductId by remember {
        mutableStateOf<Int?>(null)
    }

    fun changeLanguage(
        code: String
    ) {
        languageCode = code

        preferences.edit()
            .putString(
                "language",
                code
            )
            .apply()
    }

    fun loginSuccess(
        newSession: UserSession
    ) {
        session = newSession

        SessionStore.save(
            preferences,
            newSession
        )

        /*
         * For the moment we return to the
         * public native shell after login.
         *
         * Role dashboards will be wired into
         * the same navigator in the next phase.
         */
        screen =
            AppScreen.HOME
    }

    Box(
        modifier =
            Modifier.fillMaxSize()
    ) {

        when (screen) {

            AppScreen.HOME -> {

                HomeScreen(
                    session = session,
                    languageCode = languageCode,
                    onLanguageChange =
                        ::changeLanguage,

                    onMarketplace = {
                        screen =
                            AppScreen.MARKETPLACE
                    },

                    onCategories = {
                        screen =
                            AppScreen.CATEGORIES
                    },

                    onSuppliers = {
                        screen =
                            AppScreen.SUPPLIERS
                    },

                    onAbout = {
                        screen =
                            AppScreen.ABOUT
                    },

                    onHelp = {
                        screen =
                            AppScreen.HELP
                    },

                    onLogin = {
                        screen =
                            AppScreen.LOGIN
                    },

                    onRegister = {
                        screen =
                            AppScreen.REGISTER
                    },

                    onProductClick = { id ->
                        selectedProductId = id

                        screen =
                            AppScreen.PRODUCT_DETAILS
                    },

                    onLogout = {
                        session = null

                        SessionStore.clear(
                            preferences
                        )

                        screen =
                            AppScreen.HOME
                    }
                )
            }

            AppScreen.MARKETPLACE -> {

                MarketplaceScreen(
                    languageCode = languageCode,
                    session = session,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onProductClick = { id ->
                        selectedProductId = id

                        screen =
                            AppScreen.PRODUCT_DETAILS
                    },

                    onLogin = {
                        screen =
                            AppScreen.LOGIN
                    },

                    onLanguageChange =
                        ::changeLanguage,

                    onCategories = {
                        screen =
                            AppScreen.CATEGORIES
                    },

                    onSuppliers = {
                        screen =
                            AppScreen.SUPPLIERS
                    },

                    onAbout = {
                        screen =
                            AppScreen.ABOUT
                    },

                    onHelp = {
                        screen =
                            AppScreen.HELP
                    }
                )
            }

            AppScreen.CATEGORIES -> {

                CategoriesScreen(
                    languageCode = languageCode,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onMarketplace = {
                        screen =
                            AppScreen.MARKETPLACE
                    },

                    onSuppliers = {
                        screen =
                            AppScreen.SUPPLIERS
                    },

                    onAbout = {
                        screen =
                            AppScreen.ABOUT
                    },

                    onHelp = {
                        screen =
                            AppScreen.HELP
                    },

                    onLanguageChange =
                        ::changeLanguage
                )
            }

            AppScreen.SUPPLIERS -> {

                SuppliersScreen(
                    languageCode = languageCode,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onMarketplace = {
                        screen =
                            AppScreen.MARKETPLACE
                    },

                    onCategories = {
                        screen =
                            AppScreen.CATEGORIES
                    },

                    onAbout = {
                        screen =
                            AppScreen.ABOUT
                    },

                    onHelp = {
                        screen =
                            AppScreen.HELP
                    },

                    onLanguageChange =
                        ::changeLanguage
                )
            }

            AppScreen.ABOUT -> {

                AboutScreen(
                    languageCode = languageCode,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onMarketplace = {
                        screen =
                            AppScreen.MARKETPLACE
                    },

                    onCategories = {
                        screen =
                            AppScreen.CATEGORIES
                    },

                    onSuppliers = {
                        screen =
                            AppScreen.SUPPLIERS
                    },

                    onHelp = {
                        screen =
                            AppScreen.HELP
                    },

                    onLanguageChange =
                        ::changeLanguage
                )
            }

            AppScreen.HELP -> {

                HelpScreen(
                    languageCode = languageCode,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onMarketplace = {
                        screen =
                            AppScreen.MARKETPLACE
                    },

                    onCategories = {
                        screen =
                            AppScreen.CATEGORIES
                    },

                    onSuppliers = {
                        screen =
                            AppScreen.SUPPLIERS
                    },

                    onAbout = {
                        screen =
                            AppScreen.ABOUT
                    },

                    onLanguageChange =
                        ::changeLanguage
                )
            }

            AppScreen.PRODUCT_DETAILS -> {

                ProductDetailsScreen(
                    productId =
                        selectedProductId ?: 0,

                    token =
                        session?.token,

                    languageCode =
                        languageCode,

                    onBack = {
                        screen =
                            AppScreen.MARKETPLACE
                    },

                    onLogin = {
                        screen =
                            AppScreen.LOGIN
                    }
                )
            }

            AppScreen.LOGIN -> {

                LoginScreen(
                    languageCode =
                        languageCode,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onRegister = {
                        screen =
                            AppScreen.REGISTER
                    },

                    onLoginSuccess =
                        ::loginSuccess
                )
            }

            AppScreen.REGISTER -> {

                RegisterScreen(
                    languageCode =
                        languageCode,

                    onBack = {
                        screen =
                            AppScreen.HOME
                    },

                    onLogin = {
                        screen =
                            AppScreen.LOGIN
                    },

                    onRegistered = {
                        screen =
                            AppScreen.LOGIN
                    }
                )
            }
        }
    }
}

private object SessionStore {

    private const val TOKEN =
        "token"

    private const val USER_ID =
        "user_id"

    private const val NAME =
        "full_name"

    private const val EMAIL =
        "email"

    private const val ROLE =
        "role"

    private const val COMPANY =
        "company_name"

    private const val VERIFIED =
        "email_verified"

    private const val LANGUAGE =
        "user_language"

    fun save(
        preferences: SharedPreferences,
        session: UserSession
    ) {

        preferences.edit()
            .putString(
                TOKEN,
                session.token
            )
            .putInt(
                USER_ID,
                session.id ?: -1
            )
            .putString(
                NAME,
                session.fullName
            )
            .putString(
                EMAIL,
                session.email
            )
            .putString(
                ROLE,
                session.role
            )
            .putString(
                COMPANY,
                session.companyName
            )
            .putBoolean(
                VERIFIED,
                session.emailVerified
            )
            .putString(
                LANGUAGE,
                session.language
            )
            .apply()
    }

    fun load(
        preferences: SharedPreferences
    ): UserSession? {

        val token =
            preferences.getString(
                TOKEN,
                null
            )

        if (token.isNullOrBlank()) {
            return null
        }

        val storedId =
            preferences.getInt(
                USER_ID,
                -1
            )

        return UserSession(
            token = token,

            id =
                if (storedId >= 0) {
                    storedId
                } else {
                    null
                },

            fullName =
                preferences.getString(
                    NAME,
                    "TEXVERSE User"
                ) ?: "TEXVERSE User",

            email =
                preferences.getString(
                    EMAIL,
                    ""
                ) ?: "",

            role =
                preferences.getString(
                    ROLE,
                    "buyer"
                ) ?: "buyer",

            companyName =
                preferences.getString(
                    COMPANY,
                    ""
                ) ?: "",

            emailVerified =
                preferences.getBoolean(
                    VERIFIED,
                    false
                ),

            language =
                preferences.getString(
                    LANGUAGE,
                    "en"
                ) ?: "en"
        )
    }

    fun clear(
        preferences: SharedPreferences
    ) {

        preferences.edit()
            .remove(TOKEN)
            .remove(USER_ID)
            .remove(NAME)
            .remove(EMAIL)
            .remove(ROLE)
            .remove(COMPANY)
            .remove(VERIFIED)
            .remove(LANGUAGE)
            .apply()
    }
}
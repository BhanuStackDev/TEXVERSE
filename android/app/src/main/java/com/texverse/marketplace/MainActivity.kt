package com.texverse.marketplace

import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.View
import androidx.activity.ComponentActivity
import androidx.browser.customtabs.CustomTabsClient
import androidx.browser.customtabs.CustomTabsServiceConnection
import androidx.browser.customtabs.CustomTabsSession
import androidx.browser.trusted.TrustedWebActivityIntentBuilder

private const val TEXVERSE_URL =
    "https://texverse-professional.vercel.app/"

private const val TAG =
    "TEXVERSE_TWA"

class MainActivity : ComponentActivity() {

    private var customTabsClient: CustomTabsClient? = null
    private var customTabsSession: CustomTabsSession? = null
    private var serviceBound = false
    private var launchStarted = false

    private val customTabsServiceConnection =
        object : CustomTabsServiceConnection() {

            override fun onCustomTabsServiceConnected(
                name: android.content.ComponentName,
                client: CustomTabsClient
            ) {

                Log.d(
                    TAG,
                    "Custom Tabs connected: ${name.packageName}"
                )

                customTabsClient = client

                client.warmup(0L)

                customTabsSession =
                    client.newSession(null)

                if (customTabsSession == null) {

                    Log.e(
                        TAG,
                        "Unable to create Custom Tabs session"
                    )

                    launchCustomTabFallback()
                    return
                }

                launchTrustedWebActivity()
            }

            override fun onServiceDisconnected(
                name: android.content.ComponentName
            ) {

                Log.d(
                    TAG,
                    "Custom Tabs disconnected: ${name.packageName}"
                )

                customTabsClient = null
                customTabsSession = null
            }
        }

    override fun onCreate(
        savedInstanceState: Bundle?
    ) {
        super.onCreate(savedInstanceState)

        /*
         * Keep the launcher activity visually empty.
         * The actual TEXVERSE UI is the live web app.
         */
        val background =
            View(this).apply {
                setBackgroundColor(Color.WHITE)
            }

        setContentView(background)

        launchTEXVERSE()
    }

    private fun launchTEXVERSE() {

        if (launchStarted) {
            return
        }

        launchStarted = true

        val provider =
            CustomTabsClient.getPackageName(
                this,
                null
            )

        if (provider == null) {

            Log.e(
                TAG,
                "No Custom Tabs provider found"
            )

            launchBrowserFallback()
            return
        }

        Log.d(
            TAG,
            "Using browser provider: $provider"
        )

        serviceBound =
            CustomTabsClient.bindCustomTabsService(
                this,
                provider,
                customTabsServiceConnection
            )

        if (!serviceBound) {

            Log.e(
                TAG,
                "Could not bind Custom Tabs service"
            )

            launchBrowserFallback()
        }
    }

    private fun launchTrustedWebActivity() {

        val session =
            customTabsSession

        if (session == null) {

            launchCustomTabFallback()
            return
        }

        try {

            val builder =
                TrustedWebActivityIntentBuilder(
                    Uri.parse(TEXVERSE_URL)
                )

            val twaIntent =
                builder.build(session)

            Log.d(
                TAG,
                "Launching Trusted Web Activity"
            )

            twaIntent.launchTrustedWebActivity(
                this
            )

            finish()

        } catch (error: Exception) {

            Log.e(
                TAG,
                "TWA launch failed",
                error
            )

            launchCustomTabFallback()
        }
    }

    private fun launchCustomTabFallback() {

        try {

            Log.d(
                TAG,
                "Launching Custom Tab fallback"
            )

            val intent =
                TrustedWebActivityIntentBuilder(
                    Uri.parse(TEXVERSE_URL)
                ).buildCustomTabsIntent()

            intent.launchUrl(
                this,
                Uri.parse(TEXVERSE_URL)
            )

            finish()

        } catch (error: Exception) {

            Log.e(
                TAG,
                "Custom Tab fallback failed",
                error
            )

            launchBrowserFallback()
        }
    }

    private fun launchBrowserFallback() {

        try {

            val intent =
                android.content.Intent(
                    android.content.Intent.ACTION_VIEW,
                    Uri.parse(TEXVERSE_URL)
                )

            startActivity(intent)

        } catch (error: Exception) {

            Log.e(
                TAG,
                "Browser fallback failed",
                error
            )
        }

        finish()
    }

    override fun onDestroy() {

        if (serviceBound) {

            try {
                unbindService(
                    customTabsServiceConnection
                )
            } catch (_: Exception) {
            }

            serviceBound = false
        }

        customTabsSession = null
        customTabsClient = null

        super.onDestroy()
    }
}
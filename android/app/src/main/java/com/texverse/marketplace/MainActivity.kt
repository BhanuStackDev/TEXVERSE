package com.texverse.marketplace

import android.annotation.SuppressLint
import android.content.Intent
import android.graphics.Color
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback

class MainActivity : ComponentActivity() {

    companion object {
        private const val TEXVERSE_URL =
            "https://texverse-professional.vercel.app/"

        private const val RETRY_DELAY_MS = 3000L
        private const val MAX_RETRY_DELAY_MS = 10000L
    }

    private lateinit var webView: WebView
    private lateinit var loadingText: TextView
    private lateinit var progressBar: ProgressBar

    private val handler = Handler(Looper.getMainLooper())

    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var retryDelay = RETRY_DELAY_MS
    private var isPageLoaded = false
    private var isRetryScheduled = false

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        window.setSoftInputMode(
            WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
        )

        val root = FrameLayout(this)
        root.setBackgroundColor(Color.WHITE)

        webView = WebView(this)

        progressBar = ProgressBar(this).apply {
            isIndeterminate = true
        }

        loadingText = TextView(this).apply {
            text = "Connecting to TEXVERSE…"
            textSize = 16f
            setTextColor(Color.DKGRAY)
            gravity = Gravity.CENTER
        }

        root.addView(
            webView,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )

        root.addView(
            progressBar,
            FrameLayout.LayoutParams(
                64,
                64
            ).apply {
                gravity = Gravity.CENTER
            }
        )

        root.addView(
            loadingText,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                gravity = Gravity.CENTER
                topMargin = 90
            }
        )

        setContentView(root)

        setupWebView()

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState)

            if (webView.url.isNullOrBlank()) {
                loadTexverse()
            } else {
                hideLoading()
            }
        } else {
            loadTexverse()
        }

        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        finish()
                    }
                }
            }
        )
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {

        /*
         * IMPORTANT:
         *
         * Emulator mein WebView ke sticky/fixed top navbar ke
         * touch hit-testing ko hardware compositing affect kar
         * raha tha.
         *
         * Isliye software rendering use kar rahe hain.
         *
         * Koi JavaScript click injection nahi hai.
         */
        webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null)

        webView.isFocusable = true
        webView.isFocusableInTouchMode = true

        webView.setOnTouchListener { view, _ ->
            view.parent?.requestDisallowInterceptTouchEvent(true)

            if (!view.hasFocus()) {
                view.requestFocus()
            }

            false
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true

            allowFileAccess = true
            allowContentAccess = true

            loadsImagesAutomatically = true
            blockNetworkImage = false

            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(false)

            mediaPlaybackRequiresUserGesture = false

            cacheMode = WebSettings.LOAD_DEFAULT

            mixedContentMode =
                WebSettings.MIXED_CONTENT_NEVER_ALLOW

            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false

            userAgentString =
                "$userAgentString TEXVERSE-Android"
        }

        CookieManager.getInstance().apply {
            setAcceptCookie(true)
            setAcceptThirdPartyCookies(webView, true)
        }

        webView.webViewClient = object : WebViewClient() {

            override fun shouldOverrideUrlLoading(
                view: WebView,
                request: WebResourceRequest
            ): Boolean {

                val url = request.url.toString()

                return if (
                    url.startsWith("http://") ||
                    url.startsWith("https://")
                ) {
                    false
                } else {
                    try {
                        startActivity(
                            Intent(
                                Intent.ACTION_VIEW,
                                request.url
                            )
                        )
                    } catch (_: Exception) {
                    }

                    true
                }
            }

            override fun onPageStarted(
                view: WebView,
                url: String?,
                favicon: android.graphics.Bitmap?
            ) {
                super.onPageStarted(view, url, favicon)

                isPageLoaded = false
                showLoading("Connecting to TEXVERSE…")
            }

            override fun onPageFinished(
                view: WebView,
                url: String?
            ) {
                super.onPageFinished(view, url)

                isPageLoaded = true
                retryDelay = RETRY_DELAY_MS
                isRetryScheduled = false

                hideLoading()
            }

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                super.onReceivedError(view, request, error)

                if (request.isForMainFrame) {
                    isPageLoaded = false

                    showLoading(
                        "Connecting to TEXVERSE…"
                    )

                    scheduleRetry()
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {

            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {

                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = filePathCallback

                return try {
                    val intent =
                        fileChooserParams?.createIntent()
                            ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                                type = "*/*"
                            }

                    startActivityForResult(
                        intent,
                        1001
                    )

                    true
                } catch (_: Exception) {
                    fileChooserCallback?.onReceiveValue(null)
                    fileChooserCallback = null
                    false
                }
            }
        }
    }

    private fun loadTexverse() {

        if (!hasInternet()) {
            showLoading(
                "Waiting for internet connection…"
            )

            scheduleRetry()
            return
        }

        showLoading("Connecting to TEXVERSE…")

        webView.loadUrl(TEXVERSE_URL)
    }

    private fun scheduleRetry() {

        if (isRetryScheduled || isPageLoaded) {
            return
        }

        isRetryScheduled = true

        handler.postDelayed({

            isRetryScheduled = false

            if (!isPageLoaded) {
                loadTexverse()
            }

            retryDelay = minOf(
                retryDelay + 2000L,
                MAX_RETRY_DELAY_MS
            )

        }, retryDelay)
    }

    private fun hasInternet(): Boolean {

        val connectivityManager =
            getSystemService(
                ConnectivityManager::class.java
            )

        val network =
            connectivityManager.activeNetwork
                ?: return false

        val capabilities =
            connectivityManager.getNetworkCapabilities(
                network
            )
                ?: return false

        return capabilities.hasCapability(
            NetworkCapabilities.NET_CAPABILITY_INTERNET
        ) &&
            capabilities.hasCapability(
                NetworkCapabilities.NET_CAPABILITY_VALIDATED
            )
    }

    private fun showLoading(message: String) {

        loadingText.text = message

        progressBar.visibility = View.VISIBLE
        loadingText.visibility = View.VISIBLE

        webView.visibility = View.INVISIBLE
    }

    private fun hideLoading() {

        progressBar.visibility = View.GONE
        loadingText.visibility = View.GONE

        webView.visibility = View.VISIBLE
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.onActivityResult(
            requestCode,
            resultCode,
            data
        )

        if (requestCode == 1001) {

            val results =
                if (resultCode == RESULT_OK) {

                    data?.clipData?.let { clipData ->

                        Array(clipData.itemCount) { index ->
                            clipData.getItemAt(index).uri
                        }

                    } ?: data?.data?.let {
                        arrayOf(it)
                    }

                } else {
                    null
                }

            fileChooserCallback?.onReceiveValue(
                results
            )

            fileChooserCallback = null
        }
    }

    override fun onSaveInstanceState(
        outState: Bundle
    ) {
        webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {

        handler.removeCallbacksAndMessages(null)

        fileChooserCallback?.onReceiveValue(null)
        fileChooserCallback = null

        webView.stopLoading()
        webView.clearHistory()

        super.onDestroy()
    }
}


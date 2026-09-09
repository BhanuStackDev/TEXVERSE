package com.texverse.marketplace.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject

object ApiClient {

    const val BASE_URL = "https://texverse-backend.onrender.com"

    private val client = OkHttpClient()

    private val jsonMediaType =
        "application/json; charset=utf-8".toMediaType()

    suspend fun get(
        path: String,
        token: String? = null
    ): ApiResult = request(
        method = "GET",
        path = path,
        token = token
    )

    suspend fun post(
        path: String,
        body: JSONObject,
        token: String? = null
    ): ApiResult = request(
        method = "POST",
        path = path,
        body = body,
        token = token
    )

    suspend fun patch(
        path: String,
        body: JSONObject,
        token: String? = null
    ): ApiResult = request(
        method = "PATCH",
        path = path,
        body = body,
        token = token
    )

    suspend fun delete(
        path: String,
        token: String? = null
    ): ApiResult = request(
        method = "DELETE",
        path = path,
        token = token
    )

    private suspend fun request(
        method: String,
        path: String,
        body: JSONObject? = null,
        token: String? = null
    ): ApiResult = withContext(Dispatchers.IO) {

        try {
            val builder = Request.Builder()
                .url("$BASE_URL$path")
                .addHeader("Accept", "application/json")

            if (body != null) {
                builder.addHeader(
                    "Content-Type",
                    "application/json"
                )

                builder.method(
                    method,
                    body.toString()
                        .toRequestBody(jsonMediaType)
                )
            } else {
                builder.method(method, null)
            }

            if (!token.isNullOrBlank()) {
                builder.addHeader(
                    "Authorization",
                    "Bearer $token"
                )
            }

            client.newCall(builder.build()).execute().use { response ->

                val responseText =
                    response.body?.string().orEmpty()

                val parsed =
                    parseJson(responseText)

                if (!response.isSuccessful) {

                    val message =
                        when (parsed) {
                            is JSONObject ->
                                parsed.optString(
                                    "detail",
                                    parsed.optString(
                                        "message",
                                        "Request failed (${response.code})."
                                    )
                                )

                            is JSONArray ->
                                "Request failed (${response.code})."

                            else ->
                                "Request failed (${response.code})."
                        }

                    return@withContext ApiResult(
                        success = false,
                        statusCode = response.code,
                        json = parsed,
                        error = message
                    )
                }

                ApiResult(
                    success = true,
                    statusCode = response.code,
                    json = parsed
                )
            }

        } catch (e: Exception) {

            ApiResult(
                success = false,
                statusCode = -1,
                error = e.message
                    ?: "Unable to connect to TEXVERSE API."
            )
        }
    }

    private fun parseJson(
        value: String
    ): Any? {

        val trimmed = value.trim()

        if (trimmed.isBlank()) {
            return null
        }

        return try {
            when {
                trimmed.startsWith("{") ->
                    JSONObject(trimmed)

                trimmed.startsWith("[") ->
                    JSONArray(trimmed)

                else ->
                    trimmed
            }
        } catch (_: Exception) {
            trimmed
        }
    }
}

data class ApiResult(
    val success: Boolean,
    val statusCode: Int,
    val json: Any? = null,
    val error: String? = null
)
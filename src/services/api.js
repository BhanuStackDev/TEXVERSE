const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");


/* =========================================================
   BASE API
========================================================= */

export async function api(path, options = {}) {
  const token = localStorage.getItem(
    "texverse_token"
  );

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    Accept: "application/json",

    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),

    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(
      `${API_URL}${path}`,
      {
        ...options,
        headers,
      }
    );
  } catch (error) {
    throw new Error(
      "TEXVERSE API is unavailable. Please check that the backend server is running."
    );
  }

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data = {};

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    data =
      await response
        .json()
        .catch(() => ({}));
  } else {
    data =
      await response
        .text()
        .catch(() => "");
  }

  if (response.status === 401) {
    localStorage.removeItem(
      "texverse_token"
    );

    localStorage.removeItem(
      "texverse_user"
    );

    window.dispatchEvent(
      new Event(
        "texverse-auth-expired"
      )
    );
  }

  if (!response.ok) {
    let message =
      `Request failed (${response.status})`;

    if (
      typeof data === "string" &&
      data.trim()
    ) {
      message = data;
    } else if (data?.detail) {
      if (Array.isArray(data.detail)) {
        message = data.detail
          .map(
            (item) =>
              item?.msg ||
              "Validation error"
          )
          .join(", ");
      } else {
        message = data.detail;
      }
    } else if (data?.message) {
      message = data.message;
    }

    throw new Error(message);
  }

  return data;
}


/* =========================================================
   IMAGE URL
========================================================= */

export function getImageUrl(image) {
  if (!image) {
    return "";
  }

  const value =
    String(image).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${API_URL}${value}`;
  }

  return `${API_URL}/${value}`;
}


/* =========================================================
   AUTHENTICATION
========================================================= */

export const authApi = {
  login: (payload) =>
    api("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  register: (payload) =>
    api("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () =>
    api("/auth/me"),

  verifyEmail: (token) =>
    api("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({
        token,
      }),
    }),

  resendVerification: (email) =>
    api("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }),

  forgotPassword: (email) =>
    api("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({
        email,
      }),
    }),

  resetPassword: (
    token,
    newPassword
  ) =>
    api("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    }),
};


/* =========================================================
   PRODUCTS
========================================================= */

export const productApi = {
  list: (query = "") => {
    const cleanQuery =
      String(query || "")
        .replace(/^\?/, "");

    return api(
      `/products${
        cleanQuery
          ? `?${cleanQuery}`
          : ""
      }`
    );
  },

  get: (id) =>
    api(
      `/products/${encodeURIComponent(id)}`
    ),

  mine: () =>
    api("/products/mine/list"),

  create: (payload) =>
    api("/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (
    id,
    payload
  ) =>
    api(
      `/products/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  remove: (id) =>
    api(
      `/products/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    ),

  uploadImage: (
    id,
    file
  ) => {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    return api(
      `/products/${encodeURIComponent(id)}/image`,
      {
        method: "POST",
        body: formData,
      }
    );
  },

  removeImage: (id) =>
    api(
      `/products/${encodeURIComponent(id)}/image`,
      {
        method: "DELETE",
      }
    ),

  categories: () =>
    api("/products/categories"),

  subcategories: (category) =>
    api(
      `/products/categories/${encodeURIComponent(
        category
      )}/subcategories`
    ),

  byCategory: (category) =>
    api(
      `/products?category=${encodeURIComponent(
        category
      )}`
    ),

  bySubcategory: (
    category,
    subcategory
  ) =>
    api(
      `/products?category=${encodeURIComponent(
        category
      )}&subcategory=${encodeURIComponent(
        subcategory
      )}`
    ),

  search: (query) =>
    api(
      `/products?q=${encodeURIComponent(
        query || ""
      )}`
    ),
};


/* =========================================================
   ORDERS
========================================================= */

export const orderApi = {
  create: (payload) =>
    api("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  mine: () =>
    api("/orders/mine"),

  supplier: () =>
    api("/orders/supplier"),

  status: (
    id,
    status
  ) =>
    api(
      `/orders/${encodeURIComponent(id)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    ),
};


/* =========================================================
   AI PROCUREMENT
========================================================= */

export const aiApi = {
  procure: (
    message,
    history = []
  ) =>
    api("/ai/procure", {
      method: "POST",
      body: JSON.stringify({
        message,
        history,
      }),
    }),
};


/* =========================================================
   NEGOTIATIONS
========================================================= */

export const negotiationApi = {
  create: (payload) =>
    api("/negotiations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  mine: () =>
    api("/negotiations/mine"),

  supplier: () =>
    api("/negotiations/supplier"),

  adminAll: () =>
    api("/negotiations/admin/all"),

  updateAdminStatus: (
    id,
    status
  ) =>
    api(
      `/negotiations/admin/${encodeURIComponent(
        id
      )}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    ),
};


/* =========================================================
   SUPPORT
========================================================= */

export const supportApi = {
  ticket: (payload) =>
    api("/support/ticket", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  mine: () =>
    api("/support/mine"),

  all: () =>
    api("/support/all"),

  updateStatus: (
    id,
    status
  ) =>
    api(
      `/support/${encodeURIComponent(
        id
      )}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      }
    ),
};


/* =========================================================
   NOTIFICATIONS
========================================================= */

export const notificationApi = {
  list: () =>
    api("/notifications"),

  read: (id) =>
    api(
      `/notifications/${encodeURIComponent(
        id
      )}/read`,
      {
        method: "PATCH",
      }
    ),
};


/* =========================================================
   PAYMENTS
========================================================= */

export const paymentApi = {
  createOrder: (payload) =>
    api("/payments/create-order", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verify: (payload) =>
    api("/payments/verify", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  demoSuccess: () =>
    api("/payments/demo-success", {
      method: "POST",
    }),

  /*
   * Get payment status for a specific order.
   * Backend endpoint:
   * GET /payments/status/{order_id}
   */
  status: (orderId) =>
    api(
      `/payments/status/${encodeURIComponent(
        orderId
      )}`
    ),
};


/* =========================================================
   SHIPPING
========================================================= */

export const shippingApi = {
  companies: () =>
    api("/shipping/companies"),

  shipments: () =>
    api("/shipping/shipments"),

  /*
   * Buyer read-only tracking.
   * Backend verifies that the order belongs
   * to the authenticated buyer.
   */
  tracking: (orderId) =>
    api(
      `/shipping/tracking/${encodeURIComponent(
        orderId
      )}`
    ),

  createShipment: (payload) =>
    api("/shipping/shipments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateShipment: (
    id,
    payload
  ) =>
    api(
      `/shipping/shipments/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  deleteShipment: (id) =>
    api(
      `/shipping/shipments/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    ),

  vehicles: () =>
    api("/shipping/vehicles"),

  createVehicle: (payload) =>
    api("/shipping/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateVehicle: (
    id,
    payload
  ) =>
    api(
      `/shipping/vehicles/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  deleteVehicle: (id) =>
    api(
      `/shipping/vehicles/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      }
    ),

  staff: () =>
    api("/shipping/delivery-staff"),

  createStaff: (payload) =>
    api("/shipping/delivery-staff", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateStaff: (
    id,
    payload
  ) =>
    api(
      `/shipping/delivery-staff/${encodeURIComponent(
        id
      )}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    ),

  deleteStaff: (id) =>
    api(
      `/shipping/delivery-staff/${encodeURIComponent(
        id
      )}`,
      {
        method: "DELETE",
      }
    ),
};


/* =========================================================
   ADMIN
========================================================= */

export const adminApi = {
  overview: () =>
    api("/admin/overview"),

  users: () =>
    api("/admin/users"),

  setRole: (
    id,
    role
  ) =>
    api(
      `/admin/users/${encodeURIComponent(
        id
      )}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({
          role,
        }),
      }
    ),

  products: () =>
    api("/admin/products"),

  verify: (
    id,
    verified
  ) =>
    api(
      `/admin/products/${encodeURIComponent(
        id
      )}/verify`,
      {
        method: "PATCH",
        body: JSON.stringify({
          verified,
        }),
      }
    ),

  setAvailability: (
    id,
    available
  ) =>
    api(
      `/admin/products/${encodeURIComponent(
        id
      )}/availability`,
      {
        method: "PATCH",
        body: JSON.stringify({
          available,
        }),
      }
    ),

  deleteProduct: (id) =>
    api(
      `/admin/products/${encodeURIComponent(
        id
      )}`,
      {
        method: "DELETE",
      }
    ),

  orders: () =>
    api("/admin/orders"),
};


/* =========================================================
   HELPERS
========================================================= */

export async function categoryProducts(
  category
) {
  return productApi.byCategory(
    category
  );
}

export async function subcategoryProducts(
  category,
  subcategory
) {
  return productApi.bySubcategory(
    category,
    subcategory
  );
}

export async function uploadProductImage(
  productId,
  file
) {
  const result =
    await productApi.uploadImage(
      productId,
      file
    );

  return {
    ...result,
    imageUrl:
      getImageUrl(result?.image),
  };
}

export function logout() {
  let previousUser = null;

  try {
    previousUser = JSON.parse(
      localStorage.getItem(
        "texverse_user"
      ) || "null"
    );
  } catch {
    previousUser = null;
  }

  window.dispatchEvent(
    new CustomEvent(
      "texverse-auth-greeting",
      {
        detail: {
          type: "logout",
          user: previousUser,
        },
      }
    )
  );

  localStorage.removeItem(
    "texverse_token"
  );

  localStorage.removeItem(
    "texverse_user"
  );

  window.dispatchEvent(
    new Event("texverse-logout")
  );
}

export function isAuthenticated() {
  return Boolean(
    localStorage.getItem(
      "texverse_token"
    )
  );
}

export function getStoredUser() {
  try {
    return JSON.parse(
      localStorage.getItem(
        "texverse_user"
      ) || "null"
    );
  } catch {
    return null;
  }
}

export function getApiUrl() {
  return API_URL;
}


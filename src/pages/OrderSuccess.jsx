import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Package,
  CreditCard,
  Truck,
  MapPin,
  User,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  AlertCircle,
  Clock3,
  Car,
  Users,
  RefreshCw,
} from "lucide-react";

import {
  orderApi,
  paymentApi,
  shippingApi,
} from "../services/api";

/* =========================================================
   LANGUAGES
========================================================= */

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "te", label: "తెలుగు" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "ml", label: "മലയാളം" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "ur", label: "اردو" },
  { code: "ks", label: "कॉशुर" },
  { code: "sd", label: "سنڌي" },
  { code: "ar", label: "العربية" },
];

const RTL_LANGUAGES = new Set([
  "ur",
  "ks",
  "sd",
  "ar",
]);

const translations = {
  en: {
    back: "Back",
    orderPlaced: "Order Placed",
    orderPlacedSuccessfully: "Order Placed Successfully",
    successDescription:
      "Your textile order has been successfully placed.",
    orderNumber: "Order Number",
    orderStatus: "Order Status",
    payment: "Payment",
    paymentMethod: "Payment Method",
    orderTotal: "Order Total",
    customerDetails: "Customer Details",
    company: "Company",
    contactPerson: "Contact Person",
    email: "Email",
    phone: "Phone",
    shippingAddress: "Shipping Address",
    orderItems: "Order Items",
    noItems:
      "No item details were returned for this order.",
    item: "Item",
    items: "Items",
    quantity: "Quantity",
    price: "Price",
    subtotal: "Subtotal",
    shippingTracking: "Shipping & Tracking",
    shippingDescription:
      "Your shipment information is available below.",
    viewShipping: "View Shipping & Tracking",
    shipmentStatus: "Shipment Status",
    carrier: "Carrier",
    trackingNumber: "Tracking Number",
    currentLocation: "Current Location",
    estimatedDelivery: "Estimated Delivery",
    deliveryStaff: "Delivery Staff",
    assignedPersonnel: "Assigned personnel",
    name: "Name",
    code: "Code",
    vehicle: "Vehicle",
    assignedVehicle: "Assigned shipment vehicle",
    registration: "Registration",
    type: "Type",
    model: "Model",
    goDashboard: "Go to Buyer Dashboard",
    continueSourcing: "Continue Sourcing",
    secureOrder:
      "Secure Order — Your order and payment information are protected.",
    unknown: "Unknown",
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    processing: "Processing",
    awaitingShipment: "Awaiting shipment",
    inTransit: "In Transit",
    notAvailable: "Not available",
    notAssigned: "Not assigned",
    loading: "Loading order information...",
    paymentLoading: "Checking payment status...",
    shippingLoading: "Checking shipment status...",
    refresh: "Refresh",
    paymentUnavailable:
      "Payment details are currently unavailable.",
    shippingUnavailable:
      "Shipping details are currently unavailable.",
    orderUnavailable:
      "Order details could not be loaded.",
    retry: "Retry",
  },

  hi: {
    back: "वापस",
    orderPlaced: "ऑर्डर प्लेस हो गया",
    orderPlacedSuccessfully:
      "ऑर्डर सफलतापूर्वक प्लेस हो गया",
    successDescription:
      "आपका टेक्सटाइल ऑर्डर सफलतापूर्वक प्लेस हो गया है।",
    orderNumber: "ऑर्डर नंबर",
    orderStatus: "ऑर्डर स्थिति",
    payment: "भुगतान",
    paymentMethod: "भुगतान माध्यम",
    orderTotal: "ऑर्डर कुल",
    customerDetails: "ग्राहक विवरण",
    company: "कंपनी",
    contactPerson: "संपर्क व्यक्ति",
    email: "ईमेल",
    phone: "फोन",
    shippingAddress: "शिपिंग पता",
    orderItems: "ऑर्डर आइटम",
    noItems:
      "इस ऑर्डर के लिए आइटम विवरण उपलब्ध नहीं है।",
    item: "आइटम",
    items: "आइटम",
    quantity: "मात्रा",
    price: "कीमत",
    subtotal: "उप-योग",
    shippingTracking: "शिपिंग और ट्रैकिंग",
    shippingDescription:
      "आपकी शिपमेंट जानकारी नीचे उपलब्ध है।",
    viewShipping: "शिपिंग और ट्रैकिंग देखें",
    shipmentStatus: "शिपमेंट स्थिति",
    carrier: "कैरियर",
    trackingNumber: "ट्रैकिंग नंबर",
    currentLocation: "वर्तमान स्थान",
    estimatedDelivery: "अनुमानित डिलीवरी",
    deliveryStaff: "डिलीवरी स्टाफ",
    assignedPersonnel: "नियुक्त कर्मचारी",
    name: "नाम",
    code: "कोड",
    vehicle: "वाहन",
    assignedVehicle: "नियुक्त शिपमेंट वाहन",
    registration: "रजिस्ट्रेशन",
    type: "प्रकार",
    model: "मॉडल",
    goDashboard: "बायर डैशबोर्ड पर जाएँ",
    continueSourcing: "सोर्सिंग जारी रखें",
    secureOrder:
      "सुरक्षित ऑर्डर — आपकी ऑर्डर और भुगतान जानकारी सुरक्षित है।",
    unknown: "अज्ञात",
    pending: "लंबित",
    paid: "भुगतान हो गया",
    failed: "असफल",
    processing: "प्रोसेसिंग",
    awaitingShipment: "शिपमेंट की प्रतीक्षा",
    inTransit: "रास्ते में",
    notAvailable: "उपलब्ध नहीं",
    notAssigned: "नियुक्त नहीं",
    loading: "ऑर्डर जानकारी लोड हो रही है...",
    paymentLoading:
      "भुगतान स्थिति जांची जा रही है...",
    shippingLoading:
      "शिपमेंट स्थिति जांची जा रही है...",
    refresh: "रिफ्रेश",
    paymentUnavailable:
      "भुगतान विवरण अभी उपलब्ध नहीं है।",
    shippingUnavailable:
      "शिपिंग विवरण अभी उपलब्ध नहीं है।",
    orderUnavailable:
      "ऑर्डर विवरण लोड नहीं हो सका।",
    retry: "पुनः प्रयास",
  },

  bn: {
    back: "ফিরে যান",
    orderPlaced: "অর্ডার সম্পন্ন",
    orderPlacedSuccessfully:
      "অর্ডার সফলভাবে সম্পন্ন হয়েছে",
    successDescription:
      "আপনার টেক্সটাইল অর্ডার সফলভাবে সম্পন্ন হয়েছে।",
  },

  te: {
    back: "వెనక్కి",
    orderPlaced: "ఆర్డర్ పూర్తయింది",
    orderPlacedSuccessfully:
      "ఆర్డర్ విజయవంతంగా పూర్తయింది",
    successDescription:
      "మీ టెక్స్‌టైల్ ఆర్డర్ విజయవంతంగా పూర్తయింది.",
  },

  mr: {
    back: "मागे",
    orderPlaced: "ऑर्डर पूर्ण",
    orderPlacedSuccessfully:
      "ऑर्डर यशस्वीरित्या पूर्ण झाले",
    successDescription:
      "तुमची टेक्सटाइल ऑर्डर यशस्वीरित्या पूर्ण झाली आहे.",
  },

  ta: {
    back: "பின் செல்லவும்",
    orderPlaced: "ஆர்டர் செய்யப்பட்டது",
    orderPlacedSuccessfully:
      "ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது",
    successDescription:
      "உங்கள் டெக்ஸ்டைல் ஆர்டர் வெற்றிகரமாக செய்யப்பட்டது.",
  },

  gu: {
    back: "પાછા",
    orderPlaced: "ઓર્ડર મૂકાયો",
    orderPlacedSuccessfully:
      "ઓર્ડર સફળતાપૂર્વક મૂકાયો",
    successDescription:
      "તમારો ટેક્સટાઇલ ઓર્ડર સફળતાપૂર્વક મૂકાયો છે.",
  },

  kn: {
    back: "ಹಿಂದೆ",
    orderPlaced: "ಆರ್ಡರ್ ಪೂರ್ಣಗೊಂಡಿದೆ",
    orderPlacedSuccessfully:
      "ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ",
    successDescription:
      "ನಿಮ್ಮ ಟೆಕ್ಸ್ಟೈಲ್ ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ.",
  },

  ml: {
    back: "തിരികെ",
    orderPlaced: "ഓർഡർ നൽകി",
    orderPlacedSuccessfully:
      "ഓർഡർ വിജയകരമായി നൽകി",
    successDescription:
      "നിങ്ങളുടെ ടെക്സ്റ്റൈൽ ഓർഡർ വിജയകരമായി നൽകി.",
  },

  pa: {
    back: "ਵਾਪਸ",
    orderPlaced: "ਆਰਡਰ ਕੀਤਾ ਗਿਆ",
    orderPlacedSuccessfully:
      "ਆਰਡਰ ਸਫਲਤਾਪੂਰਵਕ ਕੀਤਾ ਗਿਆ",
    successDescription:
      "ਤੁਹਾਡਾ ਟੈਕਸਟਾਈਲ ਆਰਡਰ ਸਫਲਤਾਪੂਰਵਕ ਕੀਤਾ ਗਿਆ ਹੈ।",
  },

  ur: {
    back: "واپس",
    orderPlaced: "آرڈر مکمل",
    orderPlacedSuccessfully:
      "آرڈر کامیابی سے مکمل ہو گیا",
    successDescription:
      "آپ کا ٹیکسٹائل آرڈر کامیابی سے مکمل ہو گیا ہے۔",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function getLanguage() {
  const stored =
    localStorage.getItem("texverse_language") ||
    localStorage.getItem("language") ||
    document.documentElement.lang ||
    "en";

  return LANGUAGES.some(
    (language) => language.code === stored
  )
    ? stored
    : "en";
}

function normalizeStatus(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function numberValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : null;
}

function formatCurrency(
  value,
  currency = "INR"
) {
  const amount = numberValue(value);

  if (amount === null) {
    return "—";
  }

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }
}

function formatDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return String(value);
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

function unwrap(value) {
  if (!value) {
    return null;
  }

  if (
    value.data &&
    typeof value.data === "object"
  ) {
    return value.data;
  }

  if (
    value.result &&
    typeof value.result === "object"
  ) {
    return value.result;
  }

  return value;
}

function extractOrders(response) {
  const data = unwrap(response);

  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.orders)) {
    return data.orders;
  }

  if (Array.isArray(data.results)) {
    return data.results;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

function getOrderId(order) {
  return (
    order?.id ??
    order?.order_id ??
    order?.orderId ??
    null
  );
}

function getOrderTotal(order) {
  return (
    numberValue(order?.total) ??
    numberValue(order?.total_amount) ??
    numberValue(order?.totalAmount) ??
    numberValue(order?.grand_total) ??
    numberValue(order?.grandTotal) ??
    numberValue(order?.amount) ??
    numberValue(order?.order_total)
  );
}

function getOrderStatus(order) {
  return (
    order?.status ??
    order?.order_status ??
    order?.orderStatus ??
    "Pending"
  );
}

function getItems(order) {
  if (!order) {
    return [];
  }

  const candidates = [
    order.items,
    order.order_items,
    order.orderItems,
    order.line_items,
    order.lineItems,
    order.products,
    order.details,
    order.order_details,
    order.orderDetails,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function getItemName(item) {
  if (!item) {
    return "Textile Product";
  }

  if (typeof item === "string") {
    return item;
  }

  return (
    item.product_name ??
    item.productName ??
    item.name ??
    item.title ??
    item.fabric_name ??
    item.fabricName ??
    item.product?.name ??
    item.product?.title ??
    item.product?.product_name ??
    "Textile Product"
  );
}

function getItemQuantity(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return (
    numberValue(item.quantity) ??
    numberValue(item.qty) ??
    numberValue(item.order_quantity) ??
    numberValue(item.orderQuantity) ??
    numberValue(item.units)
  );
}

function getItemPrice(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return (
    numberValue(item.price) ??
    numberValue(item.unit_price) ??
    numberValue(item.unitPrice) ??
    numberValue(item.amount) ??
    numberValue(item.unit_amount) ??
    numberValue(item.unitAmount)
  );
}

function getItemSubtotal(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  return (
    numberValue(item.subtotal) ??
    numberValue(item.total) ??
    numberValue(item.total_amount) ??
    numberValue(item.line_total) ??
    numberValue(item.lineTotal)
  );
}

/* =========================================================
   PAYMENT
========================================================= */

function getPaymentObject(response) {
  const data = unwrap(response);

  if (!data) {
    return null;
  }

  if (
    data.payment &&
    typeof data.payment === "object"
  ) {
    return data.payment;
  }

  return data;
}

function getPaymentStatus(payment) {
  if (!payment) {
    return "";
  }

  return normalizeStatus(
    payment.status ??
      payment.payment_status ??
      payment.paymentStatus ??
      payment.state ??
      payment.verification_status ??
      payment.result ??
      ""
  );
}

function getPaymentLabel(
  payment,
  t
) {
  const status =
    getPaymentStatus(payment);

  const successful = [
    "success",
    "successful",
    "paid",
    "completed",
    "complete",
    "captured",
    "verified",
    "payment_success",
    "payment_completed",
    "successfully_paid",
  ];

  const failed = [
    "failed",
    "failure",
    "cancelled",
    "canceled",
    "rejected",
    "declined",
  ];

  const pending = [
    "pending",
    "processing",
    "pending_verification",
    "created",
    "initiated",
    "awaiting_payment",
    "payment_pending",
  ];

  if (successful.includes(status)) {
    return t.paid;
  }

  if (failed.includes(status)) {
    return t.failed;
  }

  if (pending.includes(status)) {
    return t.pending;
  }

  return t.unknown;
}

function getPaymentMethod(payment) {
  if (!payment) {
    return null;
  }

  return (
    payment.method ??
    payment.payment_method ??
    payment.paymentMethod ??
    payment.mode ??
    payment.gateway ??
    payment.provider ??
    null
  );
}

function getPaymentAmount(payment) {
  if (!payment) {
    return null;
  }

  return (
    numberValue(payment.amount) ??
    numberValue(payment.total_amount) ??
    numberValue(payment.total) ??
    numberValue(payment.amount_paid) ??
    numberValue(payment.paid_amount)
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
      <div className="mt-0.5 shrink-0 rounded-lg bg-slate-800 p-2 text-cyan-400">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>

        <div className="mt-1 wrap-break-words text-sm text-slate-200">
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  t,
}) {
  const normalized =
    normalizeStatus(status);

  let classes =
    "border-slate-700 bg-slate-800 text-slate-300";

  if (
    [
      "success",
      "successful",
      "paid",
      "completed",
      "complete",
      "delivered",
      "verified",
    ].includes(normalized)
  ) {
    classes =
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  } else if (
    [
      "failed",
      "failure",
      "cancelled",
      "canceled",
      "rejected",
      "declined",
    ].includes(normalized)
  ) {
    classes =
      "border-red-500/20 bg-red-500/10 text-red-400";
  } else if (
    [
      "processing",
      "in_transit",
      "shipped",
      "dispatched",
    ].includes(normalized)
  ) {
    classes =
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-400";
  } else if (
    [
      "pending",
      "created",
      "initiated",
      "awaiting_shipment",
    ].includes(normalized)
  ) {
    classes =
      "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status || t.unknown}
    </span>
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function OrderSuccess() {
  const [searchParams] =
    useSearchParams();

  const [language, setLanguage] =
    useState(getLanguage);

  const [order, setOrder] =
    useState(null);

  const [payment, setPayment] =
    useState(null);

  const [shipping, setShipping] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [shippingLoading, setShippingLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [paymentError, setPaymentError] =
    useState("");

  const [shippingError, setShippingError] =
    useState("");

  const orderIdFromQuery =
    searchParams.get("order");

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const t = useMemo(
    () => ({
      ...translations.en,
      ...(translations[language] || {}),
    }),
    [language]
  );

  const isRTL =
    RTL_LANGUAGES.has(language);

  /* =======================================================
     LANGUAGE
  ======================================================= */

  useEffect(() => {
    const checkLanguage = () => {
      setLanguage(getLanguage());
    };

    window.addEventListener(
      "storage",
      checkLanguage
    );

    const interval = window.setInterval(
      checkLanguage,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        checkLanguage
      );

      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      language;

    /*
     * Keep the whole page LTR.
     * Only content sections that need
     * RTL receive dir="rtl".
     *
     * This prevents the complete UI from
     * swapping left/right when language changes.
     */
    document.documentElement.dir =
      "ltr";
  }, [language]);

  /* =======================================================
     ORDER
  ======================================================= */

  const loadOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await orderApi.mine();

      const orders =
        extractOrders(response);

      let selectedOrder = null;

      if (orderIdFromQuery) {
        selectedOrder =
          orders.find(
            (item) =>
              String(
                getOrderId(item)
              ) ===
              String(
                orderIdFromQuery
              )
          ) || null;
      }

      if (
        !selectedOrder &&
        orders.length
      ) {
        selectedOrder =
          orders[0];
      }

      if (!selectedOrder) {
        const pendingRaw =
          localStorage.getItem(
            "texverse_pending_payment"
          );

        if (pendingRaw) {
          try {
            const pending =
              JSON.parse(
                pendingRaw
              );

            if (pending?.order) {
              selectedOrder =
                pending.order;
            } else if (
              pending?.id ||
              pending?.order_id
            ) {
              selectedOrder =
                pending;
            }
          } catch {
            // Ignore invalid localStorage.
          }
        }
      }

      if (!selectedOrder) {
        throw new Error(
          t.orderUnavailable
        );
      }

      setOrder(selectedOrder);
    } catch (err) {
      console.error(
        "OrderSuccess order error:",
        err
      );

      setError(
        err?.message ||
          t.orderUnavailable
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderIdFromQuery]);

  /* =======================================================
     PAYMENT
  ======================================================= */

  const loadPayment = async (
    selectedOrderId
  ) => {
    if (!selectedOrderId) {
      return;
    }

    setPaymentLoading(true);
    setPaymentError("");

    try {
      /*
       * Backend endpoint:
       *
       * GET /payments/status/{order_id}
       *
       * paymentApi.status() calls that
       * endpoint through the authenticated
       * api() helper.
       */
      const response =
        await paymentApi.status(
          selectedOrderId
        );

      const paymentData =
        getPaymentObject(response);

      /*
       * Backend returns:
       *
       * exists: false
       * verified: false
       *
       * when no payment record exists.
       *
       * In that case keep payment null so
       * UI correctly shows Unknown instead
       * of falsely showing Paid.
       */
      if (
        paymentData &&
        paymentData.exists === false
      ) {
        setPayment(null);
        return;
      }

      setPayment(
        paymentData
      );
    } catch (err) {
      console.error(
        "Payment load error:",
        err
      );

      /*
       * Do not invent a payment status when
       * the API fails.
       */
      setPayment(null);

      setPaymentError(
        err?.message ||
          t.paymentUnavailable
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  /* =======================================================
     SHIPPING
  ======================================================= */

  const loadShipping = async (
    selectedOrderId
  ) => {
    if (!selectedOrderId) {
      return;
    }

    setShippingLoading(true);
    setShippingError("");

    try {
      const response =
        await shippingApi.tracking(
          selectedOrderId
        );

      setShipping(
        unwrap(response)
      );
    } catch (err) {
      console.error(
        "Shipping tracking error:",
        err
      );

      setShipping(null);

      setShippingError(
        err?.message ||
          t.shippingUnavailable
      );
    } finally {
      setShippingLoading(false);
    }
  };

  useEffect(() => {
    const id =
      getOrderId(order);

    if (!id) {
      return;
    }

    loadPayment(id);
    loadShipping(id);
  }, [order]);

  /* =======================================================
     DATA
  ======================================================= */

  const selectedOrderId =
    getOrderId(order);

  const orderTotal =
    getOrderTotal(order);

  const orderStatus =
    getOrderStatus(order);

  const items =
    getItems(order);

  const shipment =
    shipping?.shipment ??
    shipping?.data?.shipment ??
    shipping?.result?.shipment ??
    null;

  const deliveryStaff =
    shipment?.delivery_staff ??
    shipment?.deliveryStaff ??
    shipping?.delivery_staff ??
    null;

  const vehicle =
    shipment?.vehicle ??
    shipping?.vehicle ??
    null;

  const shipmentStatus =
    shipment?.status ??
    shipping?.status ??
    null;

  const shipmentCarrier =
    shipment?.carrier ??
    shipping?.carrier ??
    null;

  const trackingNumber =
    shipment?.tracking_number ??
    shipment?.trackingNumber ??
    shipping?.tracking_number ??
    null;

  const currentLocation =
    shipment?.current_location ??
    shipment?.currentLocation ??
    shipping?.current_location ??
    null;

  const eta =
    shipment?.eta ??
    shipment?.estimated_delivery ??
    shipment?.estimatedDelivery ??
    shipping?.eta ??
    null;

  const customerCompany =
    order?.company_name ??
    order?.companyName ??
    order?.company ??
    order?.buyer_company ??
    order?.buyerCompany ??
    "—";

  const contactPerson =
    order?.contact_person ??
    order?.contactPerson ??
    order?.customer_name ??
    order?.customerName ??
    order?.buyer_name ??
    "—";

  const customerEmail =
    order?.email ??
    order?.customer_email ??
    order?.customerEmail ??
    "—";

  const customerPhone =
    order?.phone ??
    order?.customer_phone ??
    order?.customerPhone ??
    "—";

  const shippingAddress =
    order?.shipping_address ??
    order?.shippingAddress ??
    order?.delivery_address ??
    order?.deliveryAddress ??
    "—";

  const paymentLabel =
    getPaymentLabel(
      payment,
      t
    );

  const paymentMethod =
    getPaymentMethod(
      payment
    );

  const paymentAmount =
    getPaymentAmount(
      payment
    );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white md:px-6"
        style={{
          direction: "ltr",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-center py-32">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-8 py-10 text-center">
            <RefreshCw
              size={34}
              className="mx-auto animate-spin text-cyan-400"
            />

            <p className="mt-4 text-sm text-slate-300">
              {t.loading}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !order) {
    return (
      <main
        className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white md:px-6"
        style={{
          direction: "ltr",
        }}
      >
        <div className="mx-auto max-w-5xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
          >
            <ArrowLeft size={17} />
            {t.back}
          </Link>

          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <AlertCircle
              size={42}
              className="mx-auto text-red-400"
            />

            <h1 className="mt-4 text-xl font-bold text-white">
              {t.orderUnavailable}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              {error ||
                t.orderUnavailable}
            </p>

            <button
              type="button"
              onClick={loadOrder}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              <RefreshCw size={16} />
              {t.retry}
            </button>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <main
      className="min-h-screen bg-slate-950 px-4 pb-20 pt-28 text-white md:px-6"
      style={{
        direction: "ltr",
      }}
    >
      <div className="mx-auto max-w-6xl">
        {/* BACK */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500/40 hover:text-white"
        >
          <ArrowLeft size={17} />
          {t.back}
        </Link>

        {/* HEADER */}
        <section
          className="mt-6 overflow-hidden rounded-3xl border border-cyan-500/20 bg-linear-to-r from-cyan-500/10 via-slate-900 to-slate-900"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                    <CheckCircle2 size={30} />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-cyan-400">
                      {t.orderPlaced}
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                      {t.orderPlacedSuccessfully}
                    </h1>
                  </div>
                </div>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
                  {t.successDescription}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-5 py-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  {t.orderNumber}
                </p>

                <p className="mt-1 text-2xl font-bold text-cyan-400">
                  #{selectedOrderId}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SUMMARY */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                <Package size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {t.orderStatus}
                </p>

                <div className="mt-2">
                  <StatusBadge
                    status={orderStatus}
                    t={t}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                <CreditCard size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {t.payment}
                </p>

                <div className="mt-2">
                  {paymentLoading ? (
                    <span className="text-sm text-slate-400">
                      {t.paymentLoading}
                    </span>
                  ) : (
                    <StatusBadge
                      status={
                        paymentLabel
                      }
                      t={t}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400">
                <CreditCard size={20} />
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {t.orderTotal}
                </p>

                <p className="mt-1 text-xl font-bold text-white">
                  {formatCurrency(
                    orderTotal
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PAYMENT */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t.payment}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {paymentError ||
                  (payment
                    ? ""
                    : t.paymentUnavailable)}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                loadPayment(
                  selectedOrderId
                )
              }
              disabled={
                paymentLoading
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={15}
                className={
                  paymentLoading
                    ? "animate-spin"
                    : ""
                }
              />
              {t.refresh}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoRow
              icon={CreditCard}
              label={t.payment}
              value={
                paymentLabel
              }
            />

            <InfoRow
              icon={CreditCard}
              label={t.paymentMethod}
              value={
                paymentMethod ||
                t.unknown
              }
            />

            <InfoRow
              icon={CheckCircle2}
              label={t.orderTotal}
              value={
                paymentAmount !==
                null
                  ? formatCurrency(
                      paymentAmount
                    )
                  : formatCurrency(
                      orderTotal
                    )
              }
            />
          </div>
        </section>

        {/* CUSTOMER */}
        <section
          className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"
          dir={
            isRTL
              ? "rtl"
              : "ltr"
          }
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
              <User size={20} />
            </div>

            <h2 className="text-lg font-semibold text-white">
              {t.customerDetails}
            </h2>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <InfoRow
              icon={Building2}
              label={t.company}
              value={
                customerCompany
              }
            />

            <InfoRow
              icon={User}
              label={t.contactPerson}
              value={
                contactPerson
              }
            />

            <InfoRow
              icon={Mail}
              label={t.email}
              value={
                customerEmail
              }
            />

            <InfoRow
              icon={Phone}
              label={t.phone}
              value={
                customerPhone
              }
            />

            <div className="md:col-span-2">
              <InfoRow
                icon={MapPin}
                label={
                  t.shippingAddress
                }
                value={
                  shippingAddress
                }
              />
            </div>
          </div>
        </section>

        {/* ORDER ITEMS */}
        <section
          className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"
          dir={
            isRTL
              ? "rtl"
              : "ltr"
          }
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                <Package size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {t.orderItems}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {items.length}{" "}
                  {items.length ===
                  1
                    ? t.item
                    : t.items}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {t.orderTotal}
              </p>

              <p className="mt-1 text-lg font-bold text-cyan-400">
                {formatCurrency(
                  orderTotal
                )}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <div>
                  <p className="text-sm font-medium text-amber-300">
                    {t.noItems}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    The current
                    <span className="text-slate-300">
                      {" "}
                      /orders/mine{" "}
                    </span>
                    response does not contain
                    line-item data.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-800">
              <div className="hidden grid-cols-[1fr_120px_140px_140px] gap-4 bg-slate-950 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                <span>{t.item}</span>
                <span>{t.quantity}</span>
                <span>{t.price}</span>
                <span>{t.subtotal}</span>
              </div>

              <div className="divide-y divide-slate-800">
                {items.map(
                  (
                    item,
                    index
                  ) => {
                    const quantity =
                      getItemQuantity(
                        item
                      );

                    const price =
                      getItemPrice(
                        item
                      );

                    const subtotal =
                      getItemSubtotal(
                        item
                      );

                    return (
                      <div
                        key={
                          item?.id ??
                          item?.product_id ??
                          item?.productId ??
                          index
                        }
                        className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_120px_140px_140px] md:items-center md:gap-4"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {getItemName(
                              item
                            )}
                          </p>

                          {item?.product_id ||
                          item?.productId ? (
                            <p className="mt-1 text-xs text-slate-500">
                              Product #
                              {item.product_id ??
                                item.productId}
                            </p>
                          ) : null}
                        </div>

                        <div className="text-sm text-slate-300">
                          <span className="md:hidden">
                            {t.quantity}:{" "}
                          </span>
                          {quantity ??
                            "—"}
                        </div>

                        <div className="text-sm text-slate-300">
                          <span className="md:hidden">
                            {t.price}:{" "}
                          </span>
                          {price !==
                          null
                            ? formatCurrency(
                                price
                              )
                            : "—"}
                        </div>

                        <div className="text-sm font-semibold text-cyan-400">
                          <span className="md:hidden">
                            {t.subtotal}:{" "}
                          </span>
                          {subtotal !==
                          null
                            ? formatCurrency(
                                subtotal
                              )
                            : "—"}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </section>

        {/* SHIPPING */}
        <section
          className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-5 md:p-6"
          dir={
            isRTL
              ? "rtl"
              : "ltr"
          }
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                <Truck size={21} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {t.shippingTracking}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {t.shippingDescription}
                </p>
              </div>
            </div>

            <Link
              to={`/shipping?order=${selectedOrderId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              {t.viewShipping}

              {isRTL ? (
                <ArrowLeft
                  size={16}
                />
              ) : (
                <ArrowRight
                  size={16}
                />
              )}
            </Link>
          </div>

          {shippingLoading ? (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-5">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <RefreshCw
                  size={17}
                  className="animate-spin text-cyan-400"
                />
                {t.shippingLoading}
              </div>
            </div>
          ) : shipment ? (
            <div className="mt-5">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <InfoRow
                  icon={Truck}
                  label={
                    t.shipmentStatus
                  }
                  value={
                    shipmentStatus ? (
                      <StatusBadge
                        status={
                          shipmentStatus
                        }
                        t={t}
                      />
                    ) : (
                      t.unknown
                    )
                  }
                />

                <InfoRow
                  icon={Truck}
                  label={t.carrier}
                  value={
                    shipmentCarrier ||
                    t.notAvailable
                  }
                />

                <InfoRow
                  icon={Package}
                  label={
                    t.trackingNumber
                  }
                  value={
                    trackingNumber ||
                    t.notAvailable
                  }
                />

                <InfoRow
                  icon={MapPin}
                  label={
                    t.currentLocation
                  }
                  value={
                    currentLocation ||
                    t.notAvailable
                  }
                />

                <InfoRow
                  icon={Clock3}
                  label={
                    t.estimatedDelivery
                  }
                  value={
                    formatDateTime(
                      eta
                    ) ||
                    eta ||
                    t.notAvailable
                  }
                />

                <InfoRow
                  icon={Package}
                  label={
                    t.orderNumber
                  }
                  value={`#${selectedOrderId}`}
                />
              </div>

              {/* DELIVERY STAFF */}
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400">
                    <Users size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {t.deliveryStaff}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {t.assignedPersonnel}
                    </p>
                  </div>
                </div>

                {deliveryStaff ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <InfoRow
                      icon={User}
                      label={t.name}
                      value={
                        deliveryStaff.name
                      }
                    />

                    <InfoRow
                      icon={Phone}
                      label={t.phone}
                      value={
                        deliveryStaff.phone
                      }
                    />

                    <InfoRow
                      icon={Users}
                      label={t.code}
                      value={
                        deliveryStaff.staff_code ??
                        deliveryStaff.staffCode ??
                        t.notAvailable
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-500">
                    {t.notAssigned}
                  </div>
                )}
              </div>

              {/* VEHICLE */}
              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400">
                    <Car size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {t.vehicle}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {t.assignedVehicle}
                    </p>
                  </div>
                </div>

                {vehicle ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <InfoRow
                      icon={Car}
                      label={
                        t.registration
                      }
                      value={
                        vehicle.registration_number ??
                        vehicle.registrationNumber ??
                        t.notAvailable
                      }
                    />

                    <InfoRow
                      icon={Truck}
                      label={t.type}
                      value={
                        vehicle.vehicle_type ??
                        vehicle.vehicleType ??
                        t.notAvailable
                      }
                    />

                    <InfoRow
                      icon={Car}
                      label={t.model}
                      value={
                        vehicle.model ||
                        t.notAvailable
                      }
                    />
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-500">
                    {t.notAssigned}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-start gap-3">
                <Clock3
                  size={20}
                  className="mt-0.5 shrink-0 text-amber-400"
                />

                <div>
                  <p className="font-medium text-amber-300">
                    {t.awaitingShipment}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {shippingError ||
                      t.shippingUnavailable}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ACTIONS */}
        <section className="mt-6 grid gap-3 md:grid-cols-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            {t.goDashboard}

            {isRTL ? (
              <ArrowLeft
                size={17}
              />
            ) : (
              <ArrowRight
                size={17}
              />
            )}
          </Link>

          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-white"
          >
            {t.continueSourcing}

            {isRTL ? (
              <ArrowLeft
                size={17}
              />
            ) : (
              <ArrowRight
                size={17}
              />
            )}
          </Link>
        </section>

        {/* SECURITY */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4 text-center text-xs text-emerald-400">
          <ShieldCheck size={17} />

          <span>
            {t.secureOrder}
          </span>
        </div>
      </div>
    </main>
  );
}


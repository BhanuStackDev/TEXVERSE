import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Box,
  Car,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  ExternalLink,
  Eye,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Truck,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const LANGUAGES = [
  { code: "en", name: "English", native: "English" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "ur", name: "Urdu", native: "اردو" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", name: "Assamese", native: "অসমীয়া" },
  { code: "ne", name: "Nepali", native: "नेपाली" },
  { code: "sa", name: "Sanskrit", native: "संस्कृतम्" },
  { code: "kok", name: "Konkani", native: "कोंकणी" },
  { code: "mai", name: "Maithili", native: "मैथिली" },
  { code: "ks", name: "Kashmiri", native: "कॉशुर" },
  { code: "sd", name: "Sindhi", native: "سنڌي" },
  { code: "doi", name: "Dogri", native: "डोगरी" },
  { code: "mni", name: "Manipuri", native: "মৈতৈলোন্" },
  { code: "brx", name: "Bodo", native: "बड़ो" },
  { code: "sat", name: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "es", name: "Spanish", native: "Español" },
  { code: "fr", name: "French", native: "Français" },
  { code: "de", name: "German", native: "Deutsch" },
  { code: "ar", name: "Arabic", native: "العربية" },
  { code: "zh", name: "Chinese", native: "中文" },
  { code: "ja", name: "Japanese", native: "日本語" },
  { code: "ko", name: "Korean", native: "한국어" },
  { code: "pt", name: "Portuguese", native: "Português" },
  { code: "it", name: "Italian", native: "Italiano" },
  { code: "ru", name: "Russian", native: "Русский" },
  { code: "tr", name: "Turkish", native: "Türkçe" },
];

const RTL_LANGUAGES = new Set(["ur", "ks", "sd", "ar"]);

const SHIPMENT_STATUSES = [
  "Pending",
  "Confirmed",
  "Packaging",
  "Packed",
  "Ready for Pickup",
  "Shipped",
  "In Transit",
  "Out for Delivery",
  "Delivered",
  "Failed Delivery",
  "Returned",
  "Cancelled",
];

/* =========================================================
   TRANSLATIONS
========================================================= */

const TRANSLATIONS = {
  en: {
    shipping: "Shipping",
    logistics: "TEXVERSE Logistics",
    dashboard: "Shipping Dashboard",
    subtitle:
      "Manage shipments, delivery vehicles, delivery staff and tracking operations.",
    tracking: "Track Order",
    shipments: "Shipments",
    vehicles: "Vehicles",
    staff: "Delivery Staff",
    shipmentManagement: "Shipment Management",
    vehicleManagement: "Vehicle Management",
    staffManagement: "Delivery Staff Management",
    manageShipments: "Manage shipments and tracking information.",
    manageVehicles: "Manage delivery vehicles.",
    manageStaff: "Manage delivery staff.",
    createShipment: "Create Shipment",
    editShipment: "Edit Shipment",
    createVehicle: "Add Vehicle",
    editVehicle: "Edit Vehicle",
    createStaff: "Add Delivery Staff",
    editStaff: "Edit Delivery Staff",
    orderId: "Order ID",
    orderNumber: "Order",
    carrier: "Carrier / Logistics Partner",
    trackingNumber: "Tracking Number",
    status: "Status",
    location: "Current Location",
    eta: "Estimated Delivery",
    pickupAddress: "Pickup Address",
    deliveryAddress: "Delivery Address",
    deliveryStaff: "Delivery Staff",
    vehicle: "Vehicle",
    notes: "Notes",
    save: "Save",
    cancel: "Cancel",
    update: "Update",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    refresh: "Refresh",
    search: "Search",
    noShipments: "No shipments found.",
    noVehicles: "No vehicles found.",
    noStaff: "No delivery staff found.",
    loading: "Loading...",
    retry: "Retry",
    buyerTracking: "Order Tracking",
    orderStatus: "Order Status",
    shipmentStatus: "Shipment Status",
    shipmentDetails: "Shipment Details",
    trackingDetails: "Tracking Details",
    deliveryDetails: "Delivery Details",
    vehicleDetails: "Vehicle Details",
    driverDetails: "Delivery Staff Details",
    noShipmentYet: "Shipment has not been created yet.",
    backToDashboard: "Back to Dashboard",
    buyerOnlyOwnOrder: "You can only track your own orders.",
    accessDenied: "You do not have access to Shipping Management.",
    admin: "Admin",
    shippingTeam: "Shipping Team",
    buyer: "Buyer",
    supplier: "Supplier",
    registrationNumber: "Registration Number",
    vehicleType: "Vehicle Type",
    model: "Model",
    color: "Color",
    capacity: "Capacity",
    name: "Name",
    phone: "Phone",
    staffCode: "Staff Code",
    licenseNumber: "License Number",
    city: "City",
    active: "Active",
    inactive: "Inactive",
    actions: "Actions",
    totalShipments: "Total Shipments",
    inTransit: "In Transit",
    delivered: "Delivered",
    pending: "Pending",
    availableVehicles: "Available Vehicles",
    availableStaff: "Available Staff",
    success: "Success",
    error: "Error",
    confirmDelete: "Are you sure you want to delete this item?",
    required: "This field is required.",
    orderRequired: "Order ID is required.",
    trackingTimeline: "Tracking Timeline",
    orderPlaced: "Order Placed",
    confirmed: "Confirmed",
    packaging: "Packaging",
    packed: "Packed",
    readyForPickup: "Ready for Pickup",
    shipped: "Shipped",
    transit: "In Transit",
    outForDelivery: "Out for Delivery",
    deliveredStatus: "Delivered",
    failedDelivery: "Failed Delivery",
    returned: "Returned",
    cancelled: "Cancelled",
    shipmentNotCreated:
      "Your order is confirmed, but shipment tracking is not available yet.",
    trackAnother: "Track Another Order",
    orderNumberLabel: "Order Number",
    assignedDriver: "Assigned Delivery Staff",
    assignedVehicle: "Assigned Vehicle",
    createdAt: "Created",
    updatedAt: "Updated",
    close: "Close",
  },

  hi: {
    shipping: "शिपिंग",
    logistics: "TEXVERSE लॉजिस्टिक्स",
    dashboard: "शिपिंग डैशबोर्ड",
    subtitle:
      "शिपमेंट, डिलीवरी वाहन, डिलीवरी स्टाफ और ट्रैकिंग को मैनेज करें।",
    tracking: "ऑर्डर ट्रैक करें",
    shipments: "शिपमेंट",
    vehicles: "वाहन",
    staff: "डिलीवरी स्टाफ",
    shipmentManagement: "शिपमेंट प्रबंधन",
    vehicleManagement: "वाहन प्रबंधन",
    staffManagement: "डिलीवरी स्टाफ प्रबंधन",
    manageShipments: "शिपमेंट और ट्रैकिंग जानकारी मैनेज करें।",
    manageVehicles: "डिलीवरी वाहनों को मैनेज करें।",
    manageStaff: "डिलीवरी स्टाफ को मैनेज करें।",
    createShipment: "शिपमेंट बनाएं",
    editShipment: "शिपमेंट एडिट करें",
    createVehicle: "वाहन जोड़ें",
    editVehicle: "वाहन एडिट करें",
    createStaff: "डिलीवरी स्टाफ जोड़ें",
    editStaff: "डिलीवरी स्टाफ एडिट करें",
    orderId: "ऑर्डर ID",
    orderNumber: "ऑर्डर",
    carrier: "कैरियर / लॉजिस्टिक्स पार्टनर",
    trackingNumber: "ट्रैकिंग नंबर",
    status: "स्थिति",
    location: "वर्तमान स्थान",
    eta: "अनुमानित डिलीवरी",
    pickupAddress: "पिकअप पता",
    deliveryAddress: "डिलीवरी पता",
    deliveryStaff: "डिलीवरी स्टाफ",
    vehicle: "वाहन",
    notes: "नोट्स",
    save: "सेव करें",
    cancel: "रद्द करें",
    update: "अपडेट करें",
    delete: "डिलीट करें",
    edit: "एडिट",
    view: "देखें",
    refresh: "रिफ्रेश",
    search: "सर्च",
    noShipments: "कोई शिपमेंट नहीं मिला।",
    noVehicles: "कोई वाहन नहीं मिला।",
    noStaff: "कोई डिलीवरी स्टाफ नहीं मिला।",
    loading: "लोड हो रहा है...",
    retry: "दोबारा प्रयास करें",
    buyerTracking: "ऑर्डर ट्रैकिंग",
    orderStatus: "ऑर्डर स्थिति",
    shipmentStatus: "शिपमेंट स्थिति",
    shipmentDetails: "शिपमेंट विवरण",
    trackingDetails: "ट्रैकिंग विवरण",
    deliveryDetails: "डिलीवरी विवरण",
    vehicleDetails: "वाहन विवरण",
    driverDetails: "डिलीवरी स्टाफ विवरण",
    noShipmentYet: "अभी तक शिपमेंट नहीं बनाया गया है।",
    backToDashboard: "डैशबोर्ड पर वापस जाएं",
    buyerOnlyOwnOrder: "आप केवल अपने ऑर्डर को ट्रैक कर सकते हैं।",
    accessDenied: "आपको Shipping Management का access नहीं है।",
    admin: "एडमिन",
    shippingTeam: "शिपिंग टीम",
    buyer: "बायर",
    supplier: "सप्लायर",
    registrationNumber: "रजिस्ट्रेशन नंबर",
    vehicleType: "वाहन प्रकार",
    model: "मॉडल",
    color: "रंग",
    capacity: "क्षमता",
    name: "नाम",
    phone: "फोन",
    staffCode: "स्टाफ कोड",
    licenseNumber: "लाइसेंस नंबर",
    city: "शहर",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    actions: "एक्शन",
    totalShipments: "कुल शिपमेंट",
    inTransit: "ट्रांजिट में",
    delivered: "डिलीवर हो चुका",
    pending: "पेंडिंग",
    availableVehicles: "उपलब्ध वाहन",
    availableStaff: "उपलब्ध स्टाफ",
    success: "सफल",
    error: "त्रुटि",
    confirmDelete: "क्या आप इसे डिलीट करना चाहते हैं?",
    required: "यह फील्ड जरूरी है।",
    orderRequired: "ऑर्डर ID जरूरी है।",
    trackingTimeline: "ट्रैकिंग टाइमलाइन",
    orderPlaced: "ऑर्डर प्लेस्ड",
    confirmed: "कन्फर्म्ड",
    packaging: "पैकेजिंग",
    packed: "पैक्ड",
    readyForPickup: "पिकअप के लिए तैयार",
    shipped: "शिप्ड",
    transit: "ट्रांजिट में",
    outForDelivery: "डिलीवरी के लिए निकल चुका",
    deliveredStatus: "डिलीवर हो चुका",
    failedDelivery: "डिलीवरी असफल",
    returned: "रिटर्न",
    cancelled: "रद्द",
    shipmentNotCreated:
      "आपका ऑर्डर कन्फर्म है, लेकिन अभी shipment tracking उपलब्ध नहीं है।",
    trackAnother: "दूसरा ऑर्डर ट्रैक करें",
    orderNumberLabel: "ऑर्डर नंबर",
    assignedDriver: "असाइन किया गया डिलीवरी स्टाफ",
    assignedVehicle: "असाइन किया गया वाहन",
    createdAt: "बनाया गया",
    updatedAt: "अपडेट किया गया",
    close: "बंद करें",
  },

  bn: {
    shipping: "শিপিং",
    logistics: "TEXVERSE লজিস্টিক্স",
    dashboard: "শিপিং ড্যাশবোর্ড",
    subtitle: "শিপমেন্ট, যানবাহন, ডেলিভারি স্টাফ এবং ট্র্যাকিং পরিচালনা করুন।",
    tracking: "অর্ডার ট্র্যাক করুন",
    shipments: "শিপমেন্ট",
    vehicles: "যানবাহন",
    staff: "ডেলিভারি স্টাফ",
    createShipment: "শিপমেন্ট তৈরি করুন",
    editShipment: "শিপমেন্ট সম্পাদনা করুন",
    createVehicle: "যানবাহন যোগ করুন",
    editVehicle: "যানবাহন সম্পাদনা করুন",
    createStaff: "ডেলিভারি স্টাফ যোগ করুন",
    editStaff: "ডেলিভারি স্টাফ সম্পাদনা করুন",
    orderId: "অর্ডার ID",
    carrier: "ক্যারিয়ার / লজিস্টিক্স পার্টনার",
    trackingNumber: "ট্র্যাকিং নম্বর",
    status: "স্ট্যাটাস",
    location: "বর্তমান অবস্থান",
    eta: "আনুমানিক ডেলিভারি",
    save: "সংরক্ষণ করুন",
    cancel: "বাতিল",
    update: "আপডেট",
    delete: "ডিলিট",
    edit: "সম্পাদনা",
    view: "দেখুন",
    refresh: "রিফ্রেশ",
    search: "সার্চ",
    noShipments: "কোনো শিপমেন্ট পাওয়া যায়নি।",
    noVehicles: "কোনো যানবাহন পাওয়া যায়নি।",
    noStaff: "কোনো ডেলিভারি স্টাফ পাওয়া যায়নি।",
    loading: "লোড হচ্ছে...",
    retry: "আবার চেষ্টা করুন",
    buyerTracking: "অর্ডার ট্র্যাকিং",
    orderStatus: "অর্ডার স্ট্যাটাস",
    shipmentStatus: "শিপমেন্ট স্ট্যাটাস",
    shipmentDetails: "শিপমেন্টের বিবরণ",
    noShipmentYet: "এখনও শিপমেন্ট তৈরি হয়নি।",
    backToDashboard: "ড্যাশবোর্ডে ফিরে যান",
    accessDenied: "আপনার Shipping Management access নেই।",
    admin: "অ্যাডমিন",
    shippingTeam: "শিপিং টিম",
    buyer: "বায়ার",
    supplier: "সাপ্লায়ার",
    name: "নাম",
    phone: "ফোন",
    city: "শহর",
    active: "সক্রিয়",
    inactive: "নিষ্ক্রিয়",
    actions: "অ্যাকশন",
    totalShipments: "মোট শিপমেন্ট",
    inTransit: "ট্রানজিটে",
    delivered: "ডেলিভার হয়েছে",
    pending: "পেন্ডিং",
    availableVehicles: "উপলব্ধ যানবাহন",
    availableStaff: "উপলব্ধ স্টাফ",
    success: "সফল",
    error: "ত্রুটি",
    confirmDelete: "আপনি কি এটি ডিলিট করতে চান?",
    required: "এই ফিল্ডটি প্রয়োজনীয়।",
    trackingTimeline: "ট্র্যাকিং টাইমলাইন",
    orderPlaced: "অর্ডার প্লেসড",
    confirmed: "কনফার্মড",
    packaging: "প্যাকেজিং",
    packed: "প্যাকড",
    readyForPickup: "পিকআপের জন্য প্রস্তুত",
    shipped: "শিপড",
    transit: "ট্রানজিটে",
    outForDelivery: "ডেলিভারির জন্য বের হয়েছে",
    deliveredStatus: "ডেলিভার হয়েছে",
    failedDelivery: "ডেলিভারি ব্যর্থ",
    returned: "রিটার্ন",
    cancelled: "বাতিল",
    trackAnother: "অন্য অর্ডার ট্র্যাক করুন",
    close: "বন্ধ করুন",
  },

  te: {
    shipping: "షిప్పింగ్",
    logistics: "TEXVERSE లాజిస్టిక్స్",
    dashboard: "షిప్పింగ్ డ్యాష్‌బోర్డ్",
    subtitle: "షిప్‌మెంట్లు, వాహనాలు మరియు డెలివరీ స్టాఫ్‌ను నిర్వహించండి.",
    tracking: "ఆర్డర్ ట్రాక్ చేయండి",
    shipments: "షిప్‌మెంట్లు",
    vehicles: "వాహనాలు",
    staff: "డెలివరీ స్టాఫ్",
    createShipment: "షిప్‌మెంట్ సృష్టించండి",
    editShipment: "షిప్‌మెంట్ సవరించండి",
    createVehicle: "వాహనం జోడించండి",
    editVehicle: "వాహనం సవరించండి",
    createStaff: "డెలివరీ స్టాఫ్ జోడించండి",
    editStaff: "డెలివరీ స్టాఫ్ సవరించండి",
    orderId: "ఆర్డర్ ID",
    carrier: "క్యారియర్ / లాజిస్టిక్స్ భాగస్వామి",
    trackingNumber: "ట్రాకింగ్ నంబర్",
    status: "స్థితి",
    location: "ప్రస్తుత స్థానం",
    eta: "అంచనా డెలివరీ",
    save: "సేవ్",
    cancel: "రద్దు",
    update: "అప్‌డేట్",
    delete: "తొలగించు",
    edit: "సవరించు",
    view: "చూడండి",
    refresh: "రిఫ్రెష్",
    search: "శోధన",
    noShipments: "షిప్‌మెంట్లు లేవు.",
    noVehicles: "వాహనాలు లేవు.",
    noStaff: "డెలివరీ స్టాఫ్ లేరు.",
    loading: "లోడ్ అవుతోంది...",
    retry: "మళ్లీ ప్రయత్నించండి",
    buyerTracking: "ఆర్డర్ ట్రాకింగ్",
    orderStatus: "ఆర్డర్ స్థితి",
    shipmentStatus: "షిప్‌మెంట్ స్థితి",
    shipmentDetails: "షిప్‌మెంట్ వివరాలు",
    noShipmentYet: "ఇంకా షిప్‌మెంట్ సృష్టించలేదు.",
    backToDashboard: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
    accessDenied: "మీకు Shipping Management access లేదు.",
    admin: "అడ్మిన్",
    shippingTeam: "షిప్పింగ్ టీమ్",
    buyer: "బయ్యర్",
    supplier: "సప్లయర్",
    name: "పేరు",
    phone: "ఫోన్",
    city: "నగరం",
    active: "యాక్టివ్",
    inactive: "ఇన్‌యాక్టివ్",
    actions: "చర్యలు",
    totalShipments: "మొత్తం షిప్‌మెంట్లు",
    inTransit: "ట్రాన్సిట్‌లో",
    delivered: "డెలివర్ అయింది",
    pending: "పెండింగ్",
    availableVehicles: "అందుబాటులో ఉన్న వాహనాలు",
    availableStaff: "అందుబాటులో ఉన్న స్టాఫ్",
    success: "విజయం",
    error: "లోపం",
    confirmDelete: "దీన్ని తొలగించాలా?",
    required: "ఈ ఫీల్డ్ అవసరం.",
    trackingTimeline: "ట్రాకింగ్ టైమ్‌లైన్",
    orderPlaced: "ఆర్డర్ ప్లేస్‌డ్",
    confirmed: "కన్ఫర్మ్డ్",
    packaging: "ప్యాకేజింగ్",
    packed: "ప్యాక్డ్",
    readyForPickup: "పికప్‌కు సిద్ధం",
    shipped: "షిప్డ్",
    transit: "ట్రాన్సిట్‌లో",
    outForDelivery: "డెలివరీకి బయలుదేరింది",
    deliveredStatus: "డెలివర్ అయింది",
    failedDelivery: "డెలివరీ విఫలమైంది",
    returned: "రిటర్న్",
    cancelled: "రద్దు",
    trackAnother: "మరొక ఆర్డర్ ట్రాక్ చేయండి",
    close: "మూసివేయండి",
  },

  mr: {
    shipping: "शिपिंग",
    logistics: "TEXVERSE लॉजिस्टिक्स",
    dashboard: "शिपिंग डॅशबोर्ड",
    subtitle: "शिपमेंट, वाहने आणि डिलिव्हरी स्टाफ व्यवस्थापित करा.",
    tracking: "ऑर्डर ट्रॅक करा",
    shipments: "शिपमेंट",
    vehicles: "वाहने",
    staff: "डिलिव्हरी स्टाफ",
    createShipment: "शिपमेंट तयार करा",
    editShipment: "शिपमेंट संपादित करा",
    createVehicle: "वाहन जोडा",
    editVehicle: "वाहन संपादित करा",
    createStaff: "डिलिव्हरी स्टाफ जोडा",
    editStaff: "डिलिव्हरी स्टाफ संपादित करा",
    orderId: "ऑर्डर ID",
    carrier: "कॅरियर / लॉजिस्टिक्स पार्टनर",
    trackingNumber: "ट्रॅकिंग नंबर",
    status: "स्थिती",
    location: "सध्याचे स्थान",
    eta: "अंदाजे डिलिव्हरी",
    save: "सेव्ह",
    cancel: "रद्द",
    update: "अपडेट",
    delete: "डिलीट",
    edit: "संपादित",
    view: "पहा",
    refresh: "रिफ्रेश",
    search: "शोध",
    noShipments: "शिपमेंट सापडले नाही.",
    noVehicles: "वाहने सापडली नाहीत.",
    noStaff: "डिलिव्हरी स्टाफ सापडला नाही.",
    loading: "लोड होत आहे...",
    retry: "पुन्हा प्रयत्न करा",
    buyerTracking: "ऑर्डर ट्रॅकिंग",
    orderStatus: "ऑर्डर स्थिती",
    shipmentStatus: "शिपमेंट स्थिती",
    shipmentDetails: "शिपमेंट तपशील",
    noShipmentYet: "अजून शिपमेंट तयार केलेले नाही.",
    backToDashboard: "डॅशबोर्डवर परत जा",
    accessDenied: "तुमच्याकडे Shipping Management access नाही.",
    admin: "अॅडमिन",
    shippingTeam: "शिपिंग टीम",
    buyer: "बायर",
    supplier: "सप्लायर",
    name: "नाव",
    phone: "फोन",
    city: "शहर",
    active: "सक्रिय",
    inactive: "निष्क्रिय",
    actions: "कृती",
    totalShipments: "एकूण शिपमेंट",
    inTransit: "ट्रान्झिटमध्ये",
    delivered: "डिलिव्हर झाले",
    pending: "प्रलंबित",
    availableVehicles: "उपलब्ध वाहने",
    availableStaff: "उपलब्ध स्टाफ",
    success: "यशस्वी",
    error: "त्रुटी",
    confirmDelete: "हे डिलीट करायचे आहे का?",
    required: "हे फील्ड आवश्यक आहे.",
    trackingTimeline: "ट्रॅकिंग टाइमलाइन",
    orderPlaced: "ऑर्डर प्लेस्ड",
    confirmed: "कन्फर्म्ड",
    packaging: "पॅकेजिंग",
    packed: "पॅक्ड",
    readyForPickup: "पिकअपसाठी तयार",
    shipped: "शिप्ड",
    transit: "ट्रान्झिटमध्ये",
    outForDelivery: "डिलिव्हरीसाठी निघाले",
    deliveredStatus: "डिलिव्हर झाले",
    failedDelivery: "डिलिव्हरी अयशस्वी",
    returned: "रिटर्न",
    cancelled: "रद्द",
    trackAnother: "दुसरा ऑर्डर ट्रॅक करा",
    close: "बंद करा",
  },

  ta: {
    shipping: "ஷிப்பிங்",
    logistics: "TEXVERSE லாஜிஸ்டிக்ஸ்",
    dashboard: "ஷிப்பிங் டாஷ்போர்டு",
    subtitle: "ஷிப்மெண்ட்கள், வாகனங்கள் மற்றும் டெலிவரி பணியாளர்களை நிர்வகிக்கவும்.",
    tracking: "ஆர்டரை கண்காணிக்கவும்",
    shipments: "ஷிப்மெண்ட்கள்",
    vehicles: "வாகனங்கள்",
    staff: "டெலிவரி பணியாளர்கள்",
    createShipment: "ஷிப்மெண்ட் உருவாக்கவும்",
    editShipment: "ஷிப்மெண்ட் திருத்தவும்",
    createVehicle: "வாகனம் சேர்க்கவும்",
    editVehicle: "வாகனம் திருத்தவும்",
    createStaff: "டெலிவரி பணியாளர் சேர்க்கவும்",
    editStaff: "டெலிவரி பணியாளர் திருத்தவும்",
    orderId: "ஆர்டர் ID",
    carrier: "கேரியர் / லாஜிஸ்டிக்ஸ் பார்ட்னர்",
    trackingNumber: "டிராக்கிங் எண்",
    status: "நிலை",
    location: "தற்போதைய இடம்",
    eta: "மதிப்பிடப்பட்ட டெலிவரி",
    save: "சேமி",
    cancel: "ரத்து",
    update: "புதுப்பி",
    delete: "நீக்கு",
    edit: "திருத்து",
    view: "பார்",
    refresh: "புதுப்பி",
    search: "தேடு",
    noShipments: "ஷிப்மெண்ட்கள் இல்லை.",
    noVehicles: "வாகனங்கள் இல்லை.",
    noStaff: "டெலிவரி பணியாளர்கள் இல்லை.",
    loading: "ஏற்றுகிறது...",
    retry: "மீண்டும் முயற்சிக்கவும்",
    buyerTracking: "ஆர்டர் டிராக்கிங்",
    orderStatus: "ஆர்டர் நிலை",
    shipmentStatus: "ஷிப்மெண்ட் நிலை",
    shipmentDetails: "ஷிப்மெண்ட் விவரங்கள்",
    noShipmentYet: "இன்னும் ஷிப்மெண்ட் உருவாக்கப்படவில்லை.",
    backToDashboard: "டாஷ்போர்டுக்கு திரும்பு",
    accessDenied: "Shipping Management access உங்களுக்கு இல்லை.",
    admin: "நிர்வாகி",
    shippingTeam: "ஷிப்பிங் குழு",
    buyer: "வாங்குபவர்",
    supplier: "சப்ளையர்",
    name: "பெயர்",
    phone: "தொலைபேசி",
    city: "நகரம்",
    active: "செயலில்",
    inactive: "செயலற்ற",
    actions: "செயல்கள்",
    totalShipments: "மொத்த ஷிப்மெண்ட்கள்",
    inTransit: "பயணத்தில்",
    delivered: "டெலிவரி முடிந்தது",
    pending: "நிலுவையில்",
    availableVehicles: "கிடைக்கும் வாகனங்கள்",
    availableStaff: "கிடைக்கும் பணியாளர்கள்",
    success: "வெற்றி",
    error: "பிழை",
    confirmDelete: "இதை நீக்க வேண்டுமா?",
    required: "இந்த புலம் அவசியம்.",
    trackingTimeline: "டிராக்கிங் காலவரிசை",
    orderPlaced: "ஆர்டர் வைக்கப்பட்டது",
    confirmed: "உறுதி செய்யப்பட்டது",
    packaging: "பேக்கேஜிங்",
    packed: "பேக் செய்யப்பட்டது",
    readyForPickup: "பிக்கப்பிற்கு தயார்",
    shipped: "அனுப்பப்பட்டது",
    transit: "பயணத்தில்",
    outForDelivery: "டெலிவரிக்கு புறப்பட்டது",
    deliveredStatus: "டெலிவரி முடிந்தது",
    failedDelivery: "டெலிவரி தோல்வி",
    returned: "திரும்பியது",
    cancelled: "ரத்து",
    trackAnother: "மற்றொரு ஆர்டரை கண்காணிக்கவும்",
    close: "மூடு",
  },

  gu: {
    shipping: "શિપિંગ",
    logistics: "TEXVERSE લોજિસ્ટિક્સ",
    dashboard: "શિપિંગ ડેશબોર્ડ",
    subtitle: "શિપમેન્ટ, વાહનો અને ડિલિવરી સ્ટાફ મેનેજ કરો.",
    tracking: "ઓર્ડર ટ્રેક કરો",
    shipments: "શિપમેન્ટ",
    vehicles: "વાહનો",
    staff: "ડિલિવરી સ્ટાફ",
    createShipment: "શિપમેન્ટ બનાવો",
    editShipment: "શિપમેન્ટ સંપાદિત કરો",
    createVehicle: "વાહન ઉમેરો",
    editVehicle: "વાહન સંપાદિત કરો",
    createStaff: "ડિલિવરી સ્ટાફ ઉમેરો",
    editStaff: "ડિલિવરી સ્ટાફ સંપાદિત કરો",
    orderId: "ઓર્ડર ID",
    carrier: "કેરિયર / લોજિસ્ટિક્સ પાર્ટનર",
    trackingNumber: "ટ્રેકિંગ નંબર",
    status: "સ્થિતિ",
    location: "વર્તમાન સ્થાન",
    eta: "અંદાજિત ડિલિવરી",
    save: "સેવ",
    cancel: "રદ",
    update: "અપડેટ",
    delete: "ડિલીટ",
    edit: "એડિટ",
    view: "જુઓ",
    refresh: "રિફ્રેશ",
    search: "શોધો",
    noShipments: "કોઈ શિપમેન્ટ મળ્યું નથી.",
    noVehicles: "કોઈ વાહન મળ્યું નથી.",
    noStaff: "કોઈ ડિલિવરી સ્ટાફ મળ્યો નથી.",
    loading: "લોડ થઈ રહ્યું છે...",
    retry: "ફરી પ્રયાસ કરો",
    buyerTracking: "ઓર્ડર ટ્રેકિંગ",
    orderStatus: "ઓર્ડર સ્થિતિ",
    shipmentStatus: "શિપમેન્ટ સ્થિતિ",
    shipmentDetails: "શિપમેન્ટ વિગતો",
    noShipmentYet: "હજુ સુધી શિપમેન્ટ બનાવ્યું નથી.",
    backToDashboard: "ડેશબોર્ડ પર પાછા જાઓ",
    accessDenied: "તમને Shipping Management access નથી.",
    admin: "એડમિન",
    shippingTeam: "શિપિંગ ટીમ",
    buyer: "બાયર",
    supplier: "સપ્લાયર",
    name: "નામ",
    phone: "ફોન",
    city: "શહેર",
    active: "સક્રિય",
    inactive: "નિષ્ક્રિય",
    actions: "ક્રિયાઓ",
    totalShipments: "કુલ શિપમેન્ટ",
    inTransit: "ટ્રાન્ઝિટમાં",
    delivered: "ડિલિવર થયું",
    pending: "પેન્ડિંગ",
    availableVehicles: "ઉપલબ્ધ વાહનો",
    availableStaff: "ઉપલબ્ધ સ્ટાફ",
    success: "સફળ",
    error: "ભૂલ",
    confirmDelete: "શું તમે આ ડિલીટ કરવા માંગો છો?",
    required: "આ ફીલ્ડ જરૂરી છે.",
    trackingTimeline: "ટ્રેકિંગ ટાઇમલાઇન",
    orderPlaced: "ઓર્ડર પ્લેસ્ડ",
    confirmed: "કન્ફર્મ્ડ",
    packaging: "પેકેજિંગ",
    packed: "પેક્ડ",
    readyForPickup: "પિકઅપ માટે તૈયાર",
    shipped: "શિપ્ડ",
    transit: "ટ્રાન્ઝિટમાં",
    outForDelivery: "ડિલિવરી માટે નીકળ્યું",
    deliveredStatus: "ડિલિવર થયું",
    failedDelivery: "ડિલિવરી નિષ્ફળ",
    returned: "રિટર્ન",
    cancelled: "રદ",
    trackAnother: "બીજો ઓર્ડર ટ્રેક કરો",
    close: "બંધ કરો",
  },

  kn: {
    shipping: "ಶಿಪ್ಪಿಂಗ್",
    logistics: "TEXVERSE ಲಾಜಿಸ್ಟಿಕ್ಸ್",
    dashboard: "ಶಿಪ್ಪಿಂಗ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    subtitle: "ಶಿಪ್‌ಮೆಂಟ್, ವಾಹನ ಮತ್ತು ಡೆಲಿವರಿ ಸಿಬ್ಬಂದಿಯನ್ನು ನಿರ್ವಹಿಸಿ.",
    tracking: "ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    shipments: "ಶಿಪ್‌ಮೆಂಟ್‌ಗಳು",
    vehicles: "ವಾಹನಗಳು",
    staff: "ಡೆಲಿವರಿ ಸಿಬ್ಬಂದಿ",
    createShipment: "ಶಿಪ್‌ಮೆಂಟ್ ರಚಿಸಿ",
    editShipment: "ಶಿಪ್‌ಮೆಂಟ್ ಸಂಪಾದಿಸಿ",
    createVehicle: "ವಾಹನ ಸೇರಿಸಿ",
    editVehicle: "ವಾಹನ ಸಂಪಾದಿಸಿ",
    createStaff: "ಡೆಲಿವರಿ ಸಿಬ್ಬಂದಿ ಸೇರಿಸಿ",
    editStaff: "ಡೆಲಿವರಿ ಸಿಬ್ಬಂದಿ ಸಂಪಾದಿಸಿ",
    orderId: "ಆರ್ಡರ್ ID",
    carrier: "ಕ್ಯಾರಿಯರ್ / ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಪಾಲುದಾರ",
    trackingNumber: "ಟ್ರ್ಯಾಕಿಂಗ್ ಸಂಖ್ಯೆ",
    status: "ಸ್ಥಿತಿ",
    location: "ಪ್ರಸ್ತುತ ಸ್ಥಳ",
    eta: "ಅಂದಾಜು ಡೆಲಿವರಿ",
    save: "ಉಳಿಸಿ",
    cancel: "ರದ್ದು",
    update: "ನವೀಕರಿಸಿ",
    delete: "ಅಳಿಸಿ",
    edit: "ಸಂಪಾದಿಸಿ",
    view: "ನೋಡಿ",
    refresh: "ರಿಫ್ರೆಶ್",
    search: "ಹುಡುಕಿ",
    noShipments: "ಶಿಪ್‌ಮೆಂಟ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    noVehicles: "ವಾಹನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    noStaff: "ಡೆಲಿವರಿ ಸಿಬ್ಬಂದಿ ಕಂಡುಬಂದಿಲ್ಲ.",
    loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    buyerTracking: "ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್",
    orderStatus: "ಆರ್ಡರ್ ಸ್ಥಿತಿ",
    shipmentStatus: "ಶಿಪ್‌ಮೆಂಟ್ ಸ್ಥಿತಿ",
    shipmentDetails: "ಶಿಪ್‌ಮೆಂಟ್ ವಿವರಗಳು",
    noShipmentYet: "ಇನ್ನೂ ಶಿಪ್‌ಮೆಂಟ್ ರಚಿಸಲಾಗಿಲ್ಲ.",
    backToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    accessDenied: "ನಿಮಗೆ Shipping Management access ಇಲ್ಲ.",
    admin: "ಅಡ್ಮಿನ್",
    shippingTeam: "ಶಿಪ್ಪಿಂಗ್ ತಂಡ",
    buyer: "ಬಯರ್",
    supplier: "ಸಪ್ಲೈಯರ್",
    name: "ಹೆಸರು",
    phone: "ಫೋನ್",
    city: "ನಗರ",
    active: "ಸಕ್ರಿಯ",
    inactive: "ನಿಷ್ಕ್ರಿಯ",
    actions: "ಕ್ರಿಯೆಗಳು",
    totalShipments: "ಒಟ್ಟು ಶಿಪ್‌ಮೆಂಟ್‌ಗಳು",
    inTransit: "ಟ್ರಾನ್ಸಿಟ್‌ನಲ್ಲಿ",
    delivered: "ಡೆಲಿವರ್ ಆಗಿದೆ",
    pending: "ಬಾಕಿ",
    availableVehicles: "ಲಭ್ಯವಿರುವ ವಾಹನಗಳು",
    availableStaff: "ಲಭ್ಯವಿರುವ ಸಿಬ್ಬಂದಿ",
    success: "ಯಶಸ್ವಿ",
    error: "ದೋಷ",
    confirmDelete: "ಇದನ್ನು ಅಳಿಸಲು ಖಚಿತವೇ?",
    required: "ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯ.",
    trackingTimeline: "ಟ್ರ್ಯಾಕಿಂಗ್ ಟೈಮ್‌ಲೈನ್",
    orderPlaced: "ಆರ್ಡರ್ ಪ್ಲೇಸ್ ಮಾಡಲಾಗಿದೆ",
    confirmed: "ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    packaging: "ಪ್ಯಾಕೇಜಿಂಗ್",
    packed: "ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ",
    readyForPickup: "ಪಿಕಪ್‌ಗೆ ಸಿದ್ಧ",
    shipped: "ಶಿಪ್ ಮಾಡಲಾಗಿದೆ",
    transit: "ಟ್ರಾನ್ಸಿಟ್‌ನಲ್ಲಿ",
    outForDelivery: "ಡೆಲಿವರಿಗೆ ಹೊರಟಿದೆ",
    deliveredStatus: "ಡೆಲಿವರ್ ಆಗಿದೆ",
    failedDelivery: "ಡೆಲಿವರಿ ವಿಫಲ",
    returned: "ರಿಟರ್ನ್",
    cancelled: "ರದ್ದು",
    trackAnother: "ಮತ್ತೊಂದು ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
    close: "ಮುಚ್ಚಿ",
  },

  ml: {
    shipping: "ഷിപ്പിംഗ്",
    logistics: "TEXVERSE ലോജിസ്റ്റിക്സ്",
    dashboard: "ഷിപ്പിംഗ് ഡാഷ്ബോർഡ്",
    subtitle: "ഷിപ്പ്മെന്റുകൾ, വാഹനങ്ങൾ, ഡെലിവറി സ്റ്റാഫ് എന്നിവ മാനേജ് ചെയ്യുക.",
    tracking: "ഓർഡർ ട്രാക്ക് ചെയ്യുക",
    shipments: "ഷിപ്പ്മെന്റുകൾ",
    vehicles: "വാഹനങ്ങൾ",
    staff: "ഡെലിവറി സ്റ്റാഫ്",
    createShipment: "ഷിപ്പ്മെന്റ് സൃഷ്ടിക്കുക",
    editShipment: "ഷിപ്പ്മെന്റ് തിരുത്തുക",
    createVehicle: "വാഹനം ചേർക്കുക",
    editVehicle: "വാഹനം തിരുത്തുക",
    createStaff: "ഡെലിവറി സ്റ്റാഫ് ചേർക്കുക",
    editStaff: "ഡെലിവറി സ്റ്റാഫ് തിരുത്തുക",
    orderId: "ഓർഡർ ID",
    carrier: "കാരിയർ / ലോജിസ്റ്റിക്സ് പാർട്ണർ",
    trackingNumber: "ട്രാക്കിംഗ് നമ്പർ",
    status: "സ്ഥിതി",
    location: "നിലവിലെ സ്ഥലം",
    eta: "അനുമാനിച്ച ഡെലിവറി",
    save: "സേവ്",
    cancel: "റദ്ദാക്കുക",
    update: "അപ്ഡേറ്റ്",
    delete: "ഡിലീറ്റ്",
    edit: "തിരുത്തുക",
    view: "കാണുക",
    refresh: "റിഫ്രഷ്",
    search: "തിരയുക",
    noShipments: "ഷിപ്പ്മെന്റുകൾ കണ്ടെത്തിയില്ല.",
    noVehicles: "വാഹനങ്ങൾ കണ്ടെത്തിയില്ല.",
    noStaff: "ഡെലിവറി സ്റ്റാഫ് കണ്ടെത്തിയില്ല.",
    loading: "ലോഡ് ചെയ്യുന്നു...",
    retry: "വീണ്ടും ശ്രമിക്കുക",
    buyerTracking: "ഓർഡർ ട്രാക്കിംഗ്",
    orderStatus: "ഓർഡർ സ്ഥിതി",
    shipmentStatus: "ഷിപ്പ്മെന്റ് സ്ഥിതി",
    shipmentDetails: "ഷിപ്പ്മെന്റ് വിശദാംശങ്ങൾ",
    noShipmentYet: "ഇതുവരെ ഷിപ്പ്മെന്റ് സൃഷ്ടിച്ചിട്ടില്ല.",
    backToDashboard: "ഡാഷ്ബോർഡിലേക്ക് മടങ്ങുക",
    accessDenied: "നിങ്ങൾക്ക് Shipping Management access ഇല്ല.",
    admin: "അഡ്മിൻ",
    shippingTeam: "ഷിപ്പിംഗ് ടീം",
    buyer: "ബയർ",
    supplier: "സപ്ലയർ",
    name: "പേര്",
    phone: "ഫോൺ",
    city: "നഗരം",
    active: "സജീവം",
    inactive: "നിഷ്ക്രിയം",
    actions: "പ്രവർത്തനങ്ങൾ",
    totalShipments: "മൊത്തം ഷിപ്പ്മെന്റുകൾ",
    inTransit: "ട്രാൻസിറ്റിൽ",
    delivered: "ഡെലിവർ ചെയ്തു",
    pending: "പെൻഡിംഗ്",
    availableVehicles: "ലഭ്യമായ വാഹനങ്ങൾ",
    availableStaff: "ലഭ്യമായ സ്റ്റാഫ്",
    success: "വിജയം",
    error: "പിശക്",
    confirmDelete: "ഇത് ഡിലീറ്റ് ചെയ്യണോ?",
    required: "ഈ ഫീൽഡ് ആവശ്യമാണ്.",
    trackingTimeline: "ട്രാക്കിംഗ് ടൈംലൈൻ",
    orderPlaced: "ഓർഡർ നൽകി",
    confirmed: "സ്ഥിരീകരിച്ചു",
    packaging: "പാക്കേജിംഗ്",
    packed: "പാക്ക് ചെയ്തു",
    readyForPickup: "പിക്കപ്പിന് തയ്യാറാണ്",
    shipped: "ഷിപ്പ് ചെയ്തു",
    transit: "ട്രാൻസിറ്റിൽ",
    outForDelivery: "ഡെലിവറിക്ക് പുറപ്പെട്ടു",
    deliveredStatus: "ഡെലിവർ ചെയ്തു",
    failedDelivery: "ഡെലിവറി പരാജയപ്പെട്ടു",
    returned: "റിട്ടേൺ",
    cancelled: "റദ്ദാക്കി",
    trackAnother: "മറ്റൊരു ഓർഡർ ട്രാക്ക് ചെയ്യുക",
    close: "അടയ്ക്കുക",
  },

  pa: {
    shipping: "ਸ਼ਿਪਿੰਗ",
    logistics: "TEXVERSE ਲੌਜਿਸਟਿਕਸ",
    dashboard: "ਸ਼ਿਪਿੰਗ ਡੈਸ਼ਬੋਰਡ",
    subtitle: "ਸ਼ਿਪਮੈਂਟ, ਵਾਹਨ ਅਤੇ ਡਿਲਿਵਰੀ ਸਟਾਫ ਮੈਨੇਜ ਕਰੋ।",
    tracking: "ਆਰਡਰ ਟ੍ਰੈਕ ਕਰੋ",
    shipments: "ਸ਼ਿਪਮੈਂਟ",
    vehicles: "ਵਾਹਨ",
    staff: "ਡਿਲਿਵਰੀ ਸਟਾਫ",
    createShipment: "ਸ਼ਿਪਮੈਂਟ ਬਣਾਓ",
    editShipment: "ਸ਼ਿਪਮੈਂਟ ਐਡਿਟ ਕਰੋ",
    createVehicle: "ਵਾਹਨ ਸ਼ਾਮਲ ਕਰੋ",
    editVehicle: "ਵਾਹਨ ਐਡਿਟ ਕਰੋ",
    createStaff: "ਡਿਲਿਵਰੀ ਸਟਾਫ ਸ਼ਾਮਲ ਕਰੋ",
    editStaff: "ਡਿਲਿਵਰੀ ਸਟਾਫ ਐਡਿਟ ਕਰੋ",
    orderId: "ਆਰਡਰ ID",
    carrier: "ਕੈਰੀਅਰ / ਲੌਜਿਸਟਿਕਸ ਪਾਰਟਨਰ",
    trackingNumber: "ਟ੍ਰੈਕਿੰਗ ਨੰਬਰ",
    status: "ਸਥਿਤੀ",
    location: "ਮੌਜੂਦਾ ਸਥਾਨ",
    eta: "ਅਨੁਮਾਨਿਤ ਡਿਲਿਵਰੀ",
    save: "ਸੇਵ",
    cancel: "ਰੱਦ",
    update: "ਅਪਡੇਟ",
    delete: "ਡਿਲੀਟ",
    edit: "ਐਡਿਟ",
    view: "ਵੇਖੋ",
    refresh: "ਰਿਫਰੈਸ਼",
    search: "ਖੋਜ",
    noShipments: "ਕੋਈ ਸ਼ਿਪਮੈਂਟ ਨਹੀਂ ਮਿਲੀ।",
    noVehicles: "ਕੋਈ ਵਾਹਨ ਨਹੀਂ ਮਿਲਿਆ।",
    noStaff: "ਕੋਈ ਡਿਲਿਵਰੀ ਸਟਾਫ ਨਹੀਂ ਮਿਲਿਆ।",
    loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    buyerTracking: "ਆਰਡਰ ਟ੍ਰੈਕਿੰਗ",
    orderStatus: "ਆਰਡਰ ਸਥਿਤੀ",
    shipmentStatus: "ਸ਼ਿਪਮੈਂਟ ਸਥਿਤੀ",
    shipmentDetails: "ਸ਼ਿਪਮੈਂਟ ਵੇਰਵੇ",
    noShipmentYet: "ਅਜੇ ਸ਼ਿਪਮੈਂਟ ਨਹੀਂ ਬਣੀ।",
    backToDashboard: "ਡੈਸ਼ਬੋਰਡ ਤੇ ਵਾਪਸ ਜਾਓ",
    accessDenied: "ਤੁਹਾਨੂੰ Shipping Management access ਨਹੀਂ ਹੈ।",
    admin: "ਐਡਮਿਨ",
    shippingTeam: "ਸ਼ਿਪਿੰਗ ਟੀਮ",
    buyer: "ਬਾਇਰ",
    supplier: "ਸਪਲਾਇਰ",
    name: "ਨਾਮ",
    phone: "ਫੋਨ",
    city: "ਸ਼ਹਿਰ",
    active: "ਐਕਟਿਵ",
    inactive: "ਇਨਐਕਟਿਵ",
    actions: "ਕਾਰਵਾਈਆਂ",
    totalShipments: "ਕੁੱਲ ਸ਼ਿਪਮੈਂਟ",
    inTransit: "ਟ੍ਰਾਂਜ਼ਿਟ ਵਿੱਚ",
    delivered: "ਡਿਲਿਵਰ ਹੋ ਗਿਆ",
    pending: "ਪੈਂਡਿੰਗ",
    availableVehicles: "ਉਪਲਬਧ ਵਾਹਨ",
    availableStaff: "ਉਪਲਬਧ ਸਟਾਫ",
    success: "ਸਫਲ",
    error: "ਗਲਤੀ",
    confirmDelete: "ਕੀ ਤੁਸੀਂ ਇਸਨੂੰ ਡਿਲੀਟ ਕਰਨਾ ਚਾਹੁੰਦੇ ਹੋ?",
    required: "ਇਹ ਫੀਲਡ ਲਾਜ਼ਮੀ ਹੈ।",
    trackingTimeline: "ਟ੍ਰੈਕਿੰਗ ਟਾਈਮਲਾਈਨ",
    orderPlaced: "ਆਰਡਰ ਪਲੇਸਡ",
    confirmed: "ਕਨਫਰਮਡ",
    packaging: "ਪੈਕੇਜਿੰਗ",
    packed: "ਪੈਕਡ",
    readyForPickup: "ਪਿਕਅਪ ਲਈ ਤਿਆਰ",
    shipped: "ਸ਼ਿਪਡ",
    transit: "ਟ੍ਰਾਂਜ਼ਿਟ ਵਿੱਚ",
    outForDelivery: "ਡਿਲਿਵਰੀ ਲਈ ਨਿਕਲ ਗਿਆ",
    deliveredStatus: "ਡਿਲਿਵਰ ਹੋ ਗਿਆ",
    failedDelivery: "ਡਿਲਿਵਰੀ ਅਸਫਲ",
    returned: "ਰਿਟਰਨ",
    cancelled: "ਰੱਦ",
    trackAnother: "ਹੋਰ ਆਰਡਰ ਟ੍ਰੈਕ ਕਰੋ",
    close: "ਬੰਦ ਕਰੋ",
  },

  ur: {
    shipping: "شپنگ",
    logistics: "TEXVERSE لاجسٹکس",
    dashboard: "شپنگ ڈیش بورڈ",
    subtitle: "شپمنٹس، گاڑیاں، ڈلیوری اسٹاف اور ٹریکنگ مینیج کریں۔",
    tracking: "آرڈر ٹریک کریں",
    shipments: "شپمنٹس",
    vehicles: "گاڑیاں",
    staff: "ڈلیوری اسٹاف",
    createShipment: "شپمنٹ بنائیں",
    editShipment: "شپمنٹ ترمیم کریں",
    createVehicle: "گاڑی شامل کریں",
    editVehicle: "گاڑی ترمیم کریں",
    createStaff: "ڈلیوری اسٹاف شامل کریں",
    editStaff: "ڈلیوری اسٹاف ترمیم کریں",
    orderId: "آرڈر ID",
    carrier: "کیریئر / لاجسٹکس پارٹنر",
    trackingNumber: "ٹریکنگ نمبر",
    status: "حیثیت",
    location: "موجودہ مقام",
    eta: "متوقع ڈلیوری",
    save: "محفوظ کریں",
    cancel: "منسوخ",
    update: "اپڈیٹ",
    delete: "حذف",
    edit: "ترمیم",
    view: "دیکھیں",
    refresh: "ریفریش",
    search: "تلاش",
    noShipments: "کوئی شپمنٹ نہیں ملی۔",
    noVehicles: "کوئی گاڑی نہیں ملی۔",
    noStaff: "کوئی ڈلیوری اسٹاف نہیں ملا۔",
    loading: "لوڈ ہو رہا ہے...",
    retry: "دوبارہ کوشش کریں",
    buyerTracking: "آرڈر ٹریکنگ",
    orderStatus: "آرڈر کی حیثیت",
    shipmentStatus: "شپمنٹ کی حیثیت",
    shipmentDetails: "شپمنٹ کی تفصیلات",
    noShipmentYet: "ابھی تک شپمنٹ نہیں بنائی گئی۔",
    backToDashboard: "ڈیش بورڈ پر واپس جائیں",
    accessDenied: "آپ کو Shipping Management کی اجازت نہیں ہے۔",
    admin: "ایڈمن",
    shippingTeam: "شپنگ ٹیم",
    buyer: "خریدار",
    supplier: "سپلائر",
    name: "نام",
    phone: "فون",
    city: "شہر",
    active: "فعال",
    inactive: "غیر فعال",
    actions: "کارروائیاں",
    totalShipments: "کل شپمنٹس",
    inTransit: "ٹرانزٹ میں",
    delivered: "ڈیلیور ہو گیا",
    pending: "زیر التوا",
    availableVehicles: "دستیاب گاڑیاں",
    availableStaff: "دستیاب اسٹاف",
    success: "کامیاب",
    error: "خرابی",
    confirmDelete: "کیا آپ اسے حذف کرنا چاہتے ہیں؟",
    required: "یہ فیلڈ ضروری ہے۔",
    trackingTimeline: "ٹریکنگ ٹائم لائن",
    orderPlaced: "آرڈر پلیسڈ",
    confirmed: "تصدیق شدہ",
    packaging: "پیکیجنگ",
    packed: "پیکڈ",
    readyForPickup: "پک اپ کے لیے تیار",
    shipped: "شپڈ",
    transit: "ٹرانزٹ میں",
    outForDelivery: "ڈلیوری کے لیے روانہ",
    deliveredStatus: "ڈیلیور ہو گیا",
    failedDelivery: "ڈلیوری ناکام",
    returned: "واپس",
    cancelled: "منسوخ",
    trackAnother: "دوسرا آرڈر ٹریک کریں",
    close: "بند کریں",
  },

  or: {},
  as: {},
  ne: {},
  sa: {},
  kok: {},
  mai: {},
  ks: {},
  sd: {},
  doi: {},
  mni: {},
  brx: {},
  sat: {},
  es: {},
  fr: {},
  de: {},
  ar: {},
  zh: {},
  ja: {},
  ko: {},
  pt: {},
  it: {},
  ru: {},
  tr: {},
};

/* =========================================================
   HELPERS
========================================================= */

function getStoredUser() {
  const raw =
    localStorage.getItem("texverse_user") ||
    localStorage.getItem("user");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getRole(user) {
  const role =
    user?.role ||
    user?.user_role ||
    user?.account_role ||
    "";

  return String(role).trim().toLowerCase();
}

function getInitialLanguage(user) {
  const stored =
    localStorage.getItem("texverse_language") ||
    user?.language ||
    "en";

  return LANGUAGES.some((item) => item.code === stored)
    ? stored
    : "en";
}

function translate(language, key) {
  const languagePack = TRANSLATIONS[language] || {};
  const englishPack = TRANSLATIONS.en || {};

  return (
    languagePack[key] ||
    englishPack[key] ||
    key
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function normalizeStatus(status) {
  if (!status) return "Pending";

  const value = String(status).trim();

  const match = SHIPMENT_STATUSES.find(
    (item) => item.toLowerCase() === value.toLowerCase()
  );

  return match || value;
}

function statusKey(status) {
  const normalized = normalizeStatus(status);

  const map = {
    Pending: "pending",
    Confirmed: "confirmed",
    Packaging: "packaging",
    Packed: "packed",
    "Ready for Pickup": "readyForPickup",
    Shipped: "shipped",
    "In Transit": "transit",
    "Out for Delivery": "outForDelivery",
    Delivered: "deliveredStatus",
    "Failed Delivery": "failedDelivery",
    Returned: "returned",
    Cancelled: "cancelled",
  };

  return map[normalized] || "status";
}

function getStatusClass(status) {
  const value = normalizeStatus(status);

  if (value === "Delivered") {
    return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  }

  if (
    value === "Shipped" ||
    value === "In Transit" ||
    value === "Out for Delivery"
  ) {
    return "bg-cyan-500/15 text-cyan-300 border-cyan-500/30";
  }

  if (
    value === "Cancelled" ||
    value === "Returned" ||
    value === "Failed Delivery"
  ) {
    return "bg-rose-500/15 text-rose-300 border-rose-500/30";
  }

  return "bg-amber-500/15 text-amber-300 border-amber-500/30";
}

function extractErrorMessage(data, fallback) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => item?.msg || "Validation error")
      .join(", ");
  }

  if (data?.detail) return String(data.detail);
  if (data?.message) return String(data.message);

  return fallback;
}

/* =========================================================
   API
========================================================= */

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("texverse_token");

  const isFormData = options.body instanceof FormData;

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
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "TEXVERSE API is unavailable. Please check that the backend server is running."
    );
  }

  const contentType =
    response.headers.get("content-type") || "";

  let data = {};

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  } else {
    data = await response.text().catch(() => "");
  }

  if (response.status === 401) {
    localStorage.removeItem("texverse_token");
    localStorage.removeItem("texverse_user");

    window.dispatchEvent(
      new Event("texverse-auth-expired")
    );
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(
        data,
        `Request failed (${response.status})`
      )
    );
  }

  return data;
}

/* =========================================================
   EMPTY FORMS
========================================================= */

const EMPTY_SHIPMENT = {
  order_id: "",
  carrier: "",
  tracking_number: "",
  status: "Pending",
  current_location: "",
  eta: "",
  pickup_address: "",
  delivery_address: "",
  delivery_staff_id: "",
  vehicle_id: "",
  notes: "",
};

const EMPTY_VEHICLE = {
  registration_number: "",
  vehicle_type: "",
  model: "",
  color: "",
  capacity: "",
  active: true,
};

const EMPTY_STAFF = {
  name: "",
  phone: "",
  staff_code: "",
  license_number: "",
  city: "",
  active: true,
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Shipping() {
  const [searchParams, setSearchParams] = useSearchParams();

  const storedUser = useMemo(
    () => getStoredUser(),
    []
  );

  const role = getRole(storedUser);

  const [language, setLanguage] = useState(
    getInitialLanguage(storedUser)
  );

  const t = useCallback(
    (key) => translate(language, key),
    [language]
  );

  const isRTL = RTL_LANGUAGES.has(language);

  const orderIdFromUrl =
    searchParams.get("order") || "";

  const isBuyer = role === "buyer";
  const isShipping = role === "shipping";
  const isAdmin = role === "admin";
  const canManage = isShipping || isAdmin;

  const [activeTab, setActiveTab] = useState(
    isBuyer ? "tracking" : "shipments"
  );

  const [shipments, setShipments] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [staff, setStaff] = useState([]);

  const [buyerTracking, setBuyerTracking] =
    useState(null);

  const [buyerOrderId, setBuyerOrderId] =
    useState(orderIdFromUrl);

  const [loading, setLoading] = useState(false);
  const [trackingLoading, setTrackingLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [shipmentModal, setShipmentModal] =
    useState(false);

  const [vehicleModal, setVehicleModal] =
    useState(false);

  const [staffModal, setStaffModal] =
    useState(false);

  const [shipmentForm, setShipmentForm] =
    useState(EMPTY_SHIPMENT);

  const [vehicleForm, setVehicleForm] =
    useState(EMPTY_VEHICLE);

  const [staffForm, setStaffForm] =
    useState(EMPTY_STAFF);

  const [editingShipment, setEditingShipment] =
    useState(null);

  const [editingVehicle, setEditingVehicle] =
    useState(null);

  const [editingStaff, setEditingStaff] =
    useState(null);

  /* =======================================================
     LANGUAGE
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "texverse_language",
      language
    );
  }, [language]);

  /* =======================================================
     LOAD MANAGEMENT DATA
  ======================================================= */

  const loadManagementData = useCallback(
    async () => {
      if (!canManage) return;

      setLoading(true);
      setError("");

      try {
        const [
          shipmentResult,
          vehicleResult,
          staffResult,
        ] = await Promise.all([
          apiRequest("/shipping/shipments"),
          apiRequest("/shipping/vehicles"),
          apiRequest("/shipping/delivery-staff"),
        ]);

        setShipments(
          Array.isArray(shipmentResult)
            ? shipmentResult
            : shipmentResult?.shipments || []
        );

        setVehicles(
          Array.isArray(vehicleResult)
            ? vehicleResult
            : vehicleResult?.vehicles || []
        );

        setStaff(
          Array.isArray(staffResult)
            ? staffResult
            : staffResult?.staff || []
        );
      } catch (err) {
        setError(
          err?.message ||
            "Unable to load shipping data."
        );
      } finally {
        setLoading(false);
      }
    },
    [canManage]
  );

  useEffect(() => {
    if (canManage) {
      loadManagementData();
    }
  }, [canManage, loadManagementData]);

  /* =======================================================
     BUYER TRACKING
  ======================================================= */

  const loadBuyerTracking = useCallback(
    async (id) => {
      const numericId = Number(id);

      if (
        !Number.isInteger(numericId) ||
        numericId <= 0
      ) {
        setBuyerTracking(null);
        setError(t("orderRequired"));
        return;
      }

      setTrackingLoading(true);
      setError("");
      setSuccess("");

      try {
        const result = await apiRequest(
          `/shipping/tracking/${numericId}`
        );

        setBuyerTracking(result);
      } catch (err) {
        setBuyerTracking(null);
        setError(
          err?.message ||
            t("buyerOnlyOwnOrder")
        );
      } finally {
        setTrackingLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    if (isBuyer && orderIdFromUrl) {
      setBuyerOrderId(orderIdFromUrl);
      loadBuyerTracking(orderIdFromUrl);
    }
  }, [
    isBuyer,
    orderIdFromUrl,
    loadBuyerTracking,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {
    const total = shipments.length;

    const inTransit = shipments.filter((item) =>
      ["Shipped", "In Transit", "Out for Delivery"].includes(
        normalizeStatus(item.status)
      )
    ).length;

    const delivered = shipments.filter(
      (item) =>
        normalizeStatus(item.status) ===
        "Delivered"
    ).length;

    const pending = shipments.filter((item) =>
      ["Pending", "Confirmed", "Packaging", "Packed"].includes(
        normalizeStatus(item.status)
      )
    ).length;

    const availableVehicles =
      vehicles.filter((item) => item.active).length;

    const availableStaff =
      staff.filter((item) => item.active).length;

    return {
      total,
      inTransit,
      delivered,
      pending,
      availableVehicles,
      availableStaff,
    };
  }, [shipments, vehicles, staff]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredShipments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return shipments;

    return shipments.filter((item) => {
      const values = [
        item.id,
        item.order_id,
        item.carrier,
        item.tracking_number,
        item.status,
        item.current_location,
      ];

      return values.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query)
      );
    });
  }, [shipments, search]);

  /* =======================================================
     SHIPMENT FORM
  ======================================================= */

  const openCreateShipment = () => {
    setEditingShipment(null);

    setShipmentForm({
      ...EMPTY_SHIPMENT,
      order_id: orderIdFromUrl || "",
    });

    setShipmentModal(true);
    setError("");
    setSuccess("");
  };

  const openEditShipment = (shipment) => {
    setEditingShipment(shipment);

    setShipmentForm({
      order_id: shipment.order_id ?? "",
      carrier: shipment.carrier ?? "",
      tracking_number:
        shipment.tracking_number ?? "",
      status:
        normalizeStatus(shipment.status) ||
        "Pending",
      current_location:
        shipment.current_location ?? "",
      eta: shipment.eta ?? "",
      pickup_address:
        shipment.pickup_address ?? "",
      delivery_address:
        shipment.delivery_address ?? "",
      delivery_staff_id:
        shipment.delivery_staff_id ?? "",
      vehicle_id:
        shipment.vehicle_id ?? "",
      notes: shipment.notes ?? "",
    });

    setShipmentModal(true);
    setError("");
    setSuccess("");
  };

  const closeShipmentModal = () => {
    setShipmentModal(false);
    setEditingShipment(null);
    setShipmentForm(EMPTY_SHIPMENT);
  };

  const saveShipment = async (event) => {
    event.preventDefault();

    const orderId = Number(
      shipmentForm.order_id
    );

    if (
      !Number.isInteger(orderId) ||
      orderId <= 0
    ) {
      setError(t("orderRequired"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      order_id: orderId,
      carrier:
        shipmentForm.carrier.trim() || null,
      tracking_number:
        shipmentForm.tracking_number.trim() ||
        null,
      status:
        shipmentForm.status || "Pending",
      current_location:
        shipmentForm.current_location.trim() ||
        null,
      eta:
        shipmentForm.eta.trim() || null,
      pickup_address:
        shipmentForm.pickup_address.trim() ||
        null,
      delivery_address:
        shipmentForm.delivery_address.trim() ||
        null,
      delivery_staff_id:
        shipmentForm.delivery_staff_id
          ? Number(shipmentForm.delivery_staff_id)
          : null,
      vehicle_id:
        shipmentForm.vehicle_id
          ? Number(shipmentForm.vehicle_id)
          : null,
      notes:
        shipmentForm.notes.trim() || null,
    };

    try {
      if (editingShipment) {
        await apiRequest(
          `/shipping/shipments/${editingShipment.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Shipment updated successfully."
        );
      } else {
        await apiRequest(
          "/shipping/shipments",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Shipment created successfully."
        );
      }

      closeShipmentModal();

      await loadManagementData();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save shipment."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteShipment = async (shipment) => {
    if (!window.confirm(t("confirmDelete"))) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/shipping/shipments/${shipment.id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Shipment deleted successfully."
      );

      await loadManagementData();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete shipment."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     VEHICLE FORM
  ======================================================= */

  const openCreateVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm(EMPTY_VEHICLE);
    setVehicleModal(true);
    setError("");
    setSuccess("");
  };

  const openEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);

    setVehicleForm({
      registration_number:
        vehicle.registration_number ?? "",
      vehicle_type:
        vehicle.vehicle_type ?? "",
      model: vehicle.model ?? "",
      color: vehicle.color ?? "",
      capacity: vehicle.capacity ?? "",
      active: vehicle.active !== false,
    });

    setVehicleModal(true);
    setError("");
    setSuccess("");
  };

  const closeVehicleModal = () => {
    setVehicleModal(false);
    setEditingVehicle(null);
    setVehicleForm(EMPTY_VEHICLE);
  };

  const saveVehicle = async (event) => {
    event.preventDefault();

    if (
      !vehicleForm.registration_number.trim()
    ) {
      setError(t("required"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      registration_number:
        vehicleForm.registration_number.trim(),
      vehicle_type:
        vehicleForm.vehicle_type.trim() ||
        null,
      model:
        vehicleForm.model.trim() || null,
      color:
        vehicleForm.color.trim() || null,
      capacity:
        vehicleForm.capacity.trim() || null,
      active: Boolean(vehicleForm.active),
    };

    try {
      if (editingVehicle) {
        await apiRequest(
          `/shipping/vehicles/${editingVehicle.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Vehicle updated successfully."
        );
      } else {
        await apiRequest(
          "/shipping/vehicles",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Vehicle created successfully."
        );
      }

      closeVehicleModal();

      await loadManagementData();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteVehicle = async (vehicle) => {
    if (!window.confirm(t("confirmDelete"))) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/shipping/vehicles/${vehicle.id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Vehicle deleted successfully."
      );

      await loadManagementData();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete vehicle."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     STAFF FORM
  ======================================================= */

  const openCreateStaff = () => {
    setEditingStaff(null);
    setStaffForm(EMPTY_STAFF);
    setStaffModal(true);
    setError("");
    setSuccess("");
  };

  const openEditStaff = (member) => {
    setEditingStaff(member);

    setStaffForm({
      name: member.name ?? "",
      phone: member.phone ?? "",
      staff_code: member.staff_code ?? "",
      license_number:
        member.license_number ?? "",
      city: member.city ?? "",
      active: member.active !== false,
    });

    setStaffModal(true);
    setError("");
    setSuccess("");
  };

  const closeStaffModal = () => {
    setStaffModal(false);
    setEditingStaff(null);
    setStaffForm(EMPTY_STAFF);
  };

  const saveStaff = async (event) => {
    event.preventDefault();

    if (!staffForm.name.trim()) {
      setError(t("required"));
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: staffForm.name.trim(),
      phone:
        staffForm.phone.trim() || null,
      staff_code:
        staffForm.staff_code.trim() || null,
      license_number:
        staffForm.license_number.trim() ||
        null,
      city:
        staffForm.city.trim() || null,
      active: Boolean(staffForm.active),
    };

    try {
      if (editingStaff) {
        await apiRequest(
          `/shipping/delivery-staff/${editingStaff.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Delivery staff updated successfully."
        );
      } else {
        await apiRequest(
          "/shipping/delivery-staff",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setSuccess(
          "Delivery staff created successfully."
        );
      }

      closeStaffModal();

      await loadManagementData();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to save delivery staff."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteStaff = async (member) => {
    if (!window.confirm(t("confirmDelete"))) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiRequest(
        `/shipping/delivery-staff/${member.id}`,
        {
          method: "DELETE",
        }
      );

      setSuccess(
        "Delivery staff deleted successfully."
      );

      await loadManagementData();
    } catch (err) {
      setError(
        err?.message ||
          "Unable to delete delivery staff."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     BUYER TRACKING HANDLER
  ======================================================= */

  const handleBuyerTrack = async (event) => {
    event.preventDefault();

    const id = Number(buyerOrderId);

    if (!Number.isInteger(id) || id <= 0) {
      setError(t("orderRequired"));
      return;
    }

    setSearchParams({ order: String(id) });

    await loadBuyerTracking(id);
  };

  /* =======================================================
     ACCESS DENIED FOR SUPPLIER
  ======================================================= */

  if (!isBuyer && !canManage) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl border border-rose-500/20 bg-slate-900 p-8 sm:p-12 text-center">
            <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldCheck size={30} />
            </div>

            <h1 className="text-3xl font-bold">
              {t("accessDenied")}
            </h1>

            <p className="mt-3 text-slate-400">
              Shipping Management is available only
              to Shipping and Admin users.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition"
            >
              <ArrowLeft size={18} />
              {t("backToDashboard")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     BUYER TRACKING VIEW
  ======================================================= */

  if (isBuyer) {
    const shipment =
      buyerTracking?.shipment || null;

    const orderStatus =
      buyerTracking?.order_status ||
      "Pending";

    const shipmentStatus =
      shipment?.status ||
      orderStatus;

    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-8 sm:py-12"
      >
        <div className="max-w-5xl mx-auto">
          {/* HEADER */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
            <div>
              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
                {t("logistics")}
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold mt-2">
                {t("buyerTracking")}
              </h1>

              <p className="text-slate-400 mt-2">
                {t("tracking")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSelector
                language={language}
                setLanguage={setLanguage}
              />

              <Link
                to="/buyer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-500/50 transition text-sm font-semibold"
              >
                <ArrowLeft size={17} />
                {t("backToDashboard")}
              </Link>
            </div>
          </div>

          {/* ALERTS */}

          <Alerts
            error={error}
            success={success}
            onCloseError={() => setError("")}
            onCloseSuccess={() => setSuccess("")}
            t={t}
          />

          {/* TRACK SEARCH */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 mb-7">
            <form
              onSubmit={handleBuyerTrack}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={buyerOrderId}
                  onChange={(event) =>
                    setBuyerOrderId(
                      event.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="Enter Order ID"
                  inputMode="numeric"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3.5 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={trackingLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 disabled:opacity-50 transition"
              >
                {trackingLoading ? (
                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Search size={18} />
                )}

                {t("tracking")}
              </button>
            </form>
          </div>

          {/* LOADING */}

          {trackingLoading && (
            <LoadingState t={t} />
          )}

          {/* TRACKING */}

          {!trackingLoading &&
            buyerTracking && (
              <>
                {/* ORDER SUMMARY */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <InfoCard
                    icon={Package}
                    label={t("orderNumberLabel")}
                    value={`#${buyerTracking.order_id}`}
                  />

                  <InfoCard
                    icon={Box}
                    label={t("orderStatus")}
                    value={translate(
                      language,
                      statusKey(orderStatus)
                    )}
                  />

                  <InfoCard
                    icon={Truck}
                    label={t("shipmentStatus")}
                    value={translate(
                      language,
                      statusKey(shipmentStatus)
                    )}
                  />
                </div>

                {!shipment ? (
                  <div className="rounded-3xl border border-amber-500/20 bg-slate-900 p-7 sm:p-9 text-center">
                    <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Clock3 size={30} />
                    </div>

                    <h2 className="text-2xl font-bold">
                      {t("noShipmentYet")}
                    </h2>

                    <p className="text-slate-400 mt-3 max-w-xl mx-auto">
                      {t("shipmentNotCreated")}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* STATUS */}

                    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                          <p className="text-slate-500 text-sm">
                            {t("trackingNumber")}
                          </p>

                          <p className="text-xl font-bold mt-1 break-all">
                            {shipment.tracking_number ||
                              "—"}
                          </p>
                        </div>

                        <StatusBadge
                          status={shipmentStatus}
                          t={t}
                          language={language}
                        />
                      </div>

                      <TrackingTimeline
                        status={shipmentStatus}
                        t={t}
                        language={language}
                      />
                    </div>

                    {/* DETAILS */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DetailPanel
                        title={t("shipmentDetails")}
                        icon={Truck}
                        items={[
                          [
                            t("carrier"),
                            shipment.carrier ||
                              "—",
                          ],
                          [
                            t("trackingNumber"),
                            shipment.tracking_number ||
                              "—",
                          ],
                          [
                            t("location"),
                            shipment.current_location ||
                              "—",
                          ],
                          [
                            t("eta"),
                            shipment.eta ||
                              "—",
                          ],
                          [
                            t("createdAt"),
                            formatDate(
                              shipment.created_at
                            ),
                          ],
                        ]}
                      />

                      <DetailPanel
                        title={t("deliveryDetails")}
                        icon={MapPin}
                        items={[
                          [
                            t("pickupAddress"),
                            shipment.pickup_address ||
                              "—",
                          ],
                          [
                            t("deliveryAddress"),
                            shipment.delivery_address ||
                              "—",
                          ],
                          [
                            t("notes"),
                            shipment.notes ||
                              "—",
                          ],
                        ]}
                      />

                      <DetailPanel
                        title={t("driverDetails")}
                        icon={UserRound}
                        items={[
                          [
                            t("name"),
                            shipment
                              .delivery_staff
                              ?.name || "—",
                          ],
                          [
                            t("phone"),
                            shipment
                              .delivery_staff
                              ?.phone || "—",
                          ],
                          [
                            t("staffCode"),
                            shipment
                              .delivery_staff
                              ?.staff_code || "—",
                          ],
                          [
                            t("city"),
                            shipment
                              .delivery_staff
                              ?.city || "—",
                          ],
                        ]}
                      />

                      <DetailPanel
                        title={t("vehicleDetails")}
                        icon={Car}
                        items={[
                          [
                            t("registrationNumber"),
                            shipment.vehicle
                              ?.registration_number ||
                              "—",
                          ],
                          [
                            t("vehicleType"),
                            shipment.vehicle
                              ?.vehicle_type ||
                              "—",
                          ],
                          [
                            t("model"),
                            shipment.vehicle
                              ?.model || "—",
                          ],
                          [
                            t("capacity"),
                            shipment.vehicle
                              ?.capacity || "—",
                          ],
                        ]}
                      />
                    </div>
                  </>
                )}

                <div className="mt-7 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      loadBuyerTracking(
                        buyerTracking.order_id
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-500/50 transition font-semibold"
                  >
                    <RefreshCw size={17} />
                    {t("refresh")}
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    );
  }

  /* =======================================================
     SHIPPING / ADMIN MANAGEMENT
  ======================================================= */

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-8 sm:py-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <p className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">
              {t("logistics")}
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-2">
              {t("dashboard")}
            </h1>

            <p className="text-slate-400 mt-3 max-w-2xl">
              {t("subtitle")}
            </p>

            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
                <ShieldCheck size={14} />
                {isAdmin
                  ? t("admin")
                  : t("shippingTeam")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <LanguageSelector
              language={language}
              setLanguage={setLanguage}
            />

            <button
              type="button"
              onClick={loadManagementData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:border-cyan-500/50 transition text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              {t("refresh")}
            </button>
          </div>
        </div>

        {/* ALERTS */}

        <Alerts
          error={error}
          success={success}
          onCloseError={() => setError("")}
          onCloseSuccess={() => setSuccess("")}
          t={t}
        />

        {/* STATS */}

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          <StatCard
            icon={Truck}
            label={t("totalShipments")}
            value={stats.total}
          />

          <StatCard
            icon={Send}
            label={t("inTransit")}
            value={stats.inTransit}
          />

          <StatCard
            icon={CheckCircle2}
            label={t("delivered")}
            value={stats.delivered}
          />

          <StatCard
            icon={Clock3}
            label={t("pending")}
            value={stats.pending}
          />

          <StatCard
            icon={Car}
            label={t("availableVehicles")}
            value={stats.availableVehicles}
          />

          <StatCard
            icon={Users}
            label={t("availableStaff")}
            value={stats.availableStaff}
          />
        </div>

        {/* TABS */}

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          <TabButton
            active={activeTab === "shipments"}
            onClick={() => setActiveTab("shipments")}
            icon={Truck}
            label={t("shipments")}
          />

          <TabButton
            active={activeTab === "vehicles"}
            onClick={() => setActiveTab("vehicles")}
            icon={Car}
            label={t("vehicles")}
          />

          <TabButton
            active={activeTab === "staff"}
            onClick={() => setActiveTab("staff")}
            icon={Users}
            label={t("staff")}
          />
        </div>

        {/* SHIPMENTS */}

        {activeTab === "shipments" && (
          <section>
            <ManagementHeader
              title={t("shipmentManagement")}
              description={t("manageShipments")}
              actionLabel={t("createShipment")}
              icon={Plus}
              onAction={openCreateShipment}
            />

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-slate-800">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder={`${t("search")}...`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {loading &&
              filteredShipments.length === 0 ? (
                <LoadingState t={t} />
              ) : filteredShipments.length === 0 ? (
                <EmptyState
                  icon={Truck}
                  text={t("noShipments")}
                />
              ) : (
                <div className="divide-y divide-slate-800">
                  {filteredShipments.map(
                    (shipment) => (
                      <ShipmentRow
                        key={shipment.id}
                        shipment={shipment}
                        t={t}
                        language={language}
                        onEdit={() =>
                          openEditShipment(
                            shipment
                          )
                        }
                        onDelete={() =>
                          deleteShipment(
                            shipment
                          )
                        }
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* VEHICLES */}

        {activeTab === "vehicles" && (
          <section>
            <ManagementHeader
              title={t("vehicleManagement")}
              description={t("manageVehicles")}
              actionLabel={t("createVehicle")}
              icon={Plus}
              onAction={openCreateVehicle}
            />

            {vehicles.length === 0 ? (
              <EmptyState
                icon={Car}
                text={t("noVehicles")}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    t={t}
                    onEdit={() =>
                      openEditVehicle(vehicle)
                    }
                    onDelete={() =>
                      deleteVehicle(vehicle)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* STAFF */}

        {activeTab === "staff" && (
          <section>
            <ManagementHeader
              title={t("staffManagement")}
              description={t("manageStaff")}
              actionLabel={t("createStaff")}
              icon={Plus}
              onAction={openCreateStaff}
            />

            {staff.length === 0 ? (
              <EmptyState
                icon={Users}
                text={t("noStaff")}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {staff.map((member) => (
                  <StaffCard
                    key={member.id}
                    member={member}
                    t={t}
                    onEdit={() =>
                      openEditStaff(member)
                    }
                    onDelete={() =>
                      deleteStaff(member)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* SHIPMENT MODAL */}

      {shipmentModal && (
        <Modal
          title={
            editingShipment
              ? t("editShipment")
              : t("createShipment")
          }
          onClose={closeShipmentModal}
        >
          <form
            onSubmit={saveShipment}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t("orderId")}
                value={shipmentForm.order_id}
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    order_id: value.replace(
                      /\D/g,
                      ""
                    ),
                  }))
                }
                required
                inputMode="numeric"
              />

              <SelectField
                label={t("status")}
                value={shipmentForm.status}
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    status: value,
                  }))
                }
                options={SHIPMENT_STATUSES}
              />

              <Field
                label={t("carrier")}
                value={shipmentForm.carrier}
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    carrier: value,
                  }))
                }
              />

              <Field
                label={t("trackingNumber")}
                value={
                  shipmentForm.tracking_number
                }
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    tracking_number: value,
                  }))
                }
              />

              <Field
                label={t("location")}
                value={
                  shipmentForm.current_location
                }
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    current_location: value,
                  }))
                }
              />

              <Field
                label={t("eta")}
                value={shipmentForm.eta}
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    eta: value,
                  }))
                }
              />

              <SelectField
                label={t("deliveryStaff")}
                value={
                  shipmentForm.delivery_staff_id
                }
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    delivery_staff_id: value,
                  }))
                }
                options={[
                  {
                    value: "",
                    label: "—",
                  },
                  ...staff
                    .filter(
                      (item) => item.active
                    )
                    .map((item) => ({
                      value: String(item.id),
                      label: `${item.name}${
                        item.staff_code
                          ? ` (${item.staff_code})`
                          : ""
                      }`,
                    })),
                ]}
              />

              <SelectField
                label={t("vehicle")}
                value={
                  shipmentForm.vehicle_id
                }
                onChange={(value) =>
                  setShipmentForm((current) => ({
                    ...current,
                    vehicle_id: value,
                  }))
                }
                options={[
                  {
                    value: "",
                    label: "—",
                  },
                  ...vehicles
                    .filter(
                      (item) => item.active
                    )
                    .map((item) => ({
                      value: String(item.id),
                      label:
                        item.registration_number,
                    })),
                ]}
              />
            </div>

            <TextAreaField
              label={t("pickupAddress")}
              value={
                shipmentForm.pickup_address
              }
              onChange={(value) =>
                setShipmentForm((current) => ({
                  ...current,
                  pickup_address: value,
                }))
              }
            />

            <TextAreaField
              label={t("deliveryAddress")}
              value={
                shipmentForm.delivery_address
              }
              onChange={(value) =>
                setShipmentForm((current) => ({
                  ...current,
                  delivery_address: value,
                }))
              }
            />

            <TextAreaField
              label={t("notes")}
              value={shipmentForm.notes}
              onChange={(value) =>
                setShipmentForm((current) => ({
                  ...current,
                  notes: value,
                }))
              }
            />

            <ModalActions
              cancelLabel={t("cancel")}
              saveLabel={
                editingShipment
                  ? t("update")
                  : t("save")
              }
              onCancel={closeShipmentModal}
            />
          </form>
        </Modal>
      )}

      {/* VEHICLE MODAL */}

      {vehicleModal && (
        <Modal
          title={
            editingVehicle
              ? t("editVehicle")
              : t("createVehicle")
          }
          onClose={closeVehicleModal}
        >
          <form
            onSubmit={saveVehicle}
            className="space-y-4"
          >
            <Field
              label={t("registrationNumber")}
              value={
                vehicleForm.registration_number
              }
              onChange={(value) =>
                setVehicleForm((current) => ({
                  ...current,
                  registration_number: value,
                }))
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t("vehicleType")}
                value={
                  vehicleForm.vehicle_type
                }
                onChange={(value) =>
                  setVehicleForm((current) => ({
                    ...current,
                    vehicle_type: value,
                  }))
                }
              />

              <Field
                label={t("model")}
                value={vehicleForm.model}
                onChange={(value) =>
                  setVehicleForm((current) => ({
                    ...current,
                    model: value,
                  }))
                }
              />

              <Field
                label={t("color")}
                value={vehicleForm.color}
                onChange={(value) =>
                  setVehicleForm((current) => ({
                    ...current,
                    color: value,
                  }))
                }
              />

              <Field
                label={t("capacity")}
                value={vehicleForm.capacity}
                onChange={(value) =>
                  setVehicleForm((current) => ({
                    ...current,
                    capacity: value,
                  }))
                }
              />
            </div>

            <ToggleField
              label={t("active")}
              checked={vehicleForm.active}
              onChange={(value) =>
                setVehicleForm((current) => ({
                  ...current,
                  active: value,
                }))
              }
            />

            <ModalActions
              cancelLabel={t("cancel")}
              saveLabel={
                editingVehicle
                  ? t("update")
                  : t("save")
              }
              onCancel={closeVehicleModal}
            />
          </form>
        </Modal>
      )}

      {/* STAFF MODAL */}

      {staffModal && (
        <Modal
          title={
            editingStaff
              ? t("editStaff")
              : t("createStaff")
          }
          onClose={closeStaffModal}
        >
          <form
            onSubmit={saveStaff}
            className="space-y-4"
          >
            <Field
              label={t("name")}
              value={staffForm.name}
              onChange={(value) =>
                setStaffForm((current) => ({
                  ...current,
                  name: value,
                }))
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label={t("phone")}
                value={staffForm.phone}
                onChange={(value) =>
                  setStaffForm((current) => ({
                    ...current,
                    phone: value,
                  }))
                }
              />

              <Field
                label={t("staffCode")}
                value={staffForm.staff_code}
                onChange={(value) =>
                  setStaffForm((current) => ({
                    ...current,
                    staff_code: value,
                  }))
                }
              />

              <Field
                label={t("licenseNumber")}
                value={
                  staffForm.license_number
                }
                onChange={(value) =>
                  setStaffForm((current) => ({
                    ...current,
                    license_number: value,
                  }))
                }
              />

              <Field
                label={t("city")}
                value={staffForm.city}
                onChange={(value) =>
                  setStaffForm((current) => ({
                    ...current,
                    city: value,
                  }))
                }
              />
            </div>

            <ToggleField
              label={t("active")}
              checked={staffForm.active}
              onChange={(value) =>
                setStaffForm((current) => ({
                  ...current,
                  active: value,
                }))
              }
            />

            <ModalActions
              cancelLabel={t("cancel")}
              saveLabel={
                editingStaff
                  ? t("update")
                  : t("save")
              }
              onCancel={closeStaffModal}
            />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   LANGUAGE SELECTOR
========================================================= */

function LanguageSelector({
  language,
  setLanguage,
}) {
  return (
    <div className="relative">
      <select
        value={language}
        onChange={(event) =>
          setLanguage(event.target.value)
        }
        className="appearance-none bg-slate-900 border border-slate-700 rounded-xl pl-3 pr-9 py-2.5 text-sm text-white outline-none focus:border-cyan-400 cursor-pointer"
        aria-label="Language"
      >
        {LANGUAGES.map((item) => (
          <option
            key={item.code}
            value={item.code}
          >
            {item.native}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
      />
    </div>
  );
}

/* =========================================================
   ALERTS
========================================================= */

function Alerts({
  error,
  success,
  onCloseError,
  onCloseSuccess,
  t,
}) {
  if (!error && !success) {
    return null;
  }

  return (
    <div className="space-y-3 mb-6">
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-200">
          <AlertCircle
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1 text-sm">
            <p className="font-semibold">
              {t("error")}
            </p>

            <p className="mt-1 text-rose-200/80">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={onCloseError}
            className="text-rose-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-emerald-200">
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <div className="flex-1 text-sm">
            <p className="font-semibold">
              {t("success")}
            </p>

            <p className="mt-1 text-emerald-200/80">
              {success}
            </p>
          </div>

          <button
            type="button"
            onClick={onCloseSuccess}
            className="text-emerald-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-slate-500 text-xs sm:text-sm truncate">
            {label}
          </p>

          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-slate-500 text-xs">
            {label}
          </p>

          <p className="font-bold mt-1 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MANAGEMENT HEADER
========================================================= */

function ManagementHeader({
  title,
  description,
  actionLabel,
  icon: Icon,
  onAction,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
      <div>
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="text-slate-400 mt-1">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onAction}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition"
      >
        <Icon size={18} />
        {actionLabel}
      </button>
    </div>
  );
}

/* =========================================================
   TAB BUTTON
========================================================= */

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-semibold transition ${
        active
          ? "bg-cyan-400 text-slate-950"
          : "bg-slate-900 border border-slate-800 text-slate-300 hover:border-cyan-500/40"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

/* =========================================================
   SHIPMENT ROW
========================================================= */

function ShipmentRow({
  shipment,
  t,
  language,
  onEdit,
  onDelete,
}) {
  return (
    <div className="p-4 sm:p-5 hover:bg-slate-800/30 transition">
      <div className="flex flex-col xl:flex-row xl:items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-bold">
              #{shipment.id}
            </span>

            <span className="text-slate-500">
              •
            </span>

            <span className="text-cyan-300 font-semibold">
              {t("orderNumber")} #
              {shipment.order_id}
            </span>

            <StatusBadge
              status={shipment.status}
              t={t}
              language={language}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniDetail
              icon={Truck}
              label={t("carrier")}
              value={
                shipment.carrier || "—"
              }
            />

            <MiniDetail
              icon={Search}
              label={t("trackingNumber")}
              value={
                shipment.tracking_number ||
                "—"
              }
            />

            <MiniDetail
              icon={MapPin}
              label={t("location")}
              value={
                shipment.current_location ||
                "—"
              }
            />

            <MiniDetail
              icon={Clock3}
              label={t("eta")}
              value={shipment.eta || "—"}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 xl:shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 hover:border-cyan-500/50 text-sm font-semibold transition"
          >
            <Edit3 size={16} />
            <span className="hidden sm:inline">
              {t("edit")}
            </span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10 text-sm font-semibold transition"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">
              {t("delete")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
  t,
  language,
}) {
  const normalized = normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
        normalized
      )}`}
    >
      {translate(
        language,
        statusKey(normalized)
      )}
    </span>
  );
}

/* =========================================================
   MINI DETAIL
========================================================= */

function MiniDetail({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-slate-500 text-xs">
        <Icon size={13} />
        {label}
      </div>

      <p className="text-sm text-slate-200 mt-1 truncate">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   VEHICLE CARD
========================================================= */

function VehicleCard({
  vehicle,
  t,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          <Car size={23} />
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            vehicle.active
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}
        >
          {vehicle.active
            ? t("active")
            : t("inactive")}
        </span>
      </div>

      <h3 className="text-xl font-bold mt-5">
        {vehicle.registration_number ||
          "—"}
      </h3>

      <div className="space-y-3 mt-5">
        <MiniDetail
          label={t("vehicleType")}
          value={vehicle.vehicle_type || "—"}
          icon={Truck}
        />

        <MiniDetail
          label={t("model")}
          value={vehicle.model || "—"}
          icon={Car}
        />

        <MiniDetail
          label={t("color")}
          value={vehicle.color || "—"}
          icon={Box}
        />

        <MiniDetail
          label={t("capacity")}
          value={vehicle.capacity || "—"}
          icon={Package}
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition text-sm font-semibold"
        >
          <Edit3 size={16} />
          {t("edit")}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-rose-500/20 text-rose-300 hover:bg-rose-500/10 transition"
          aria-label={t("delete")}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   STAFF CARD
========================================================= */

function StaffCard({
  member,
  t,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          <UserRound size={23} />
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            member.active
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
              : "bg-slate-800 text-slate-400 border-slate-700"
          }`}
        >
          {member.active
            ? t("active")
            : t("inactive")}
        </span>
      </div>

      <h3 className="text-xl font-bold mt-5">
        {member.name || "—"}
      </h3>

      <div className="space-y-3 mt-5">
        <MiniDetail
          label={t("phone")}
          value={member.phone || "—"}
          icon={UserRound}
        />

        <MiniDetail
          label={t("staffCode")}
          value={
            member.staff_code || "—"
          }
          icon={ShieldCheck}
        />

        <MiniDetail
          label={t("licenseNumber")}
          value={
            member.license_number || "—"
          }
          icon={Car}
        />

        <MiniDetail
          label={t("city")}
          value={member.city || "—"}
          icon={MapPin}
        />
      </div>

      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-700 hover:border-cyan-500/50 transition text-sm font-semibold"
        >
          <Edit3 size={16} />
          {t("edit")}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-rose-500/20 text-rose-300 hover:bg-rose-500/10 transition"
          aria-label={t("delete")}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   TRACKING TIMELINE
========================================================= */

function TrackingTimeline({
  status,
  t,
  language,
}) {
  const currentIndex =
    SHIPMENT_STATUSES.indexOf(
      normalizeStatus(status)
    );

  const timeline = [
    {
      key: "orderPlaced",
      status: "Pending",
      icon: Package,
    },
    {
      key: "confirmed",
      status: "Confirmed",
      icon: CheckCircle2,
    },
    {
      key: "packaging",
      status: "Packaging",
      icon: Box,
    },
    {
      key: "packed",
      status: "Packed",
      icon: Package,
    },
    {
      key: "readyForPickup",
      status: "Ready for Pickup",
      icon: Send,
    },
    {
      key: "shipped",
      status: "Shipped",
      icon: Truck,
    },
    {
      key: "transit",
      status: "In Transit",
      icon: Truck,
    },
    {
      key: "outForDelivery",
      status: "Out for Delivery",
      icon: MapPin,
    },
    {
      key: "deliveredStatus",
      status: "Delivered",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="space-y-1">
      {timeline.map((item, index) => {
        const Icon = item.icon;

        const statusIndex =
          SHIPMENT_STATUSES.indexOf(
            item.status
          );

        const completed =
          currentIndex >= statusIndex;

        const current =
          normalizeStatus(status) ===
          item.status;

        return (
          <div
            key={item.key}
            className="relative flex gap-4"
          >
            {index !==
              timeline.length - 1 && (
              <div
                className={`absolute left-5 top-11 bottom-0 w-px ${
                  completed
                    ? "bg-cyan-400/60"
                    : "bg-slate-800"
                }`}
              />
            )}

            <div
              className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                completed
                  ? "bg-cyan-400 text-slate-950 border-cyan-300"
                  : "bg-slate-950 text-slate-500 border-slate-700"
              } ${
                current
                  ? "ring-4 ring-cyan-400/10"
                  : ""
              }`}
            >
              <Icon size={17} />
            </div>

            <div className="pb-6 pt-1">
              <p
                className={`font-semibold ${
                  completed
                    ? "text-white"
                    : "text-slate-500"
                }`}
              >
                {translate(
                  language,
                  item.key
                )}
              </p>

              {current && (
                <p className="text-cyan-300 text-xs mt-1 font-medium">
                  {t("status")}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================
   DETAIL PANEL
========================================================= */

function DetailPanel({
  title,
  icon: Icon,
  items,
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
          <Icon size={19} />
        </div>

        <h3 className="font-bold text-lg">
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {items.map(([label, value]) => (
          <div
            key={`${label}-${value}`}
            className="flex flex-col gap-1"
          >
            <span className="text-xs text-slate-500">
              {label}
            </span>

            <span className="text-sm text-slate-200 wrap-break-words">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingState({ t }) {
  return (
    <div className="flex items-center justify-center py-16 text-slate-400">
      <div className="flex items-center gap-3">
        <RefreshCw
          size={20}
          className="animate-spin text-cyan-400"
        />

        <span>{t("loading")}</span>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  icon: Icon,
  text,
}) {
  return (
    <div className="py-16 px-6 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center">
        <Icon size={25} />
      </div>

      <p className="text-slate-400 mt-4">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  required = false,
  inputMode,
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-300 mb-2">
        {label}
        {required && (
          <span className="text-rose-400 ml-1">
            *
          </span>
        )}
      </span>

      <input
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        inputMode={inputMode}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400"
      />
    </label>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-300 mb-2">
        {label}
      </span>

      <textarea
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={3}
        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400 resize-y"
      />
    </label>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-slate-300 mb-2">
        {label}
      </span>

      <div className="relative">
        <select
          value={value ?? ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="appearance-none w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 pr-10 text-white outline-none focus:border-cyan-400"
        >
          {options.map((option) => {
            const normalized =
              typeof option === "string"
                ? {
                    value: option,
                    label: option,
                  }
                : option;

            return (
              <option
                key={normalized.value}
                value={normalized.value}
              >
                {normalized.label}
              </option>
            );
          })}
        </select>

        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
        />
      </div>
    </label>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function ToggleField({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 cursor-pointer">
      <span className="text-sm font-semibold text-slate-300">
        {label}
      </span>

      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="w-5 h-5 accent-cyan-400"
      />
    </label>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-900">
          <h2 className="text-xl font-bold">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MODAL ACTIONS
========================================================= */

function ModalActions({
  cancelLabel,
  saveLabel,
  onCancel,
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-3">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-950 hover:border-slate-500 transition font-semibold"
      >
        {cancelLabel}
      </button>

      <button
        type="submit"
        className="px-5 py-3 rounded-xl bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition font-bold"
      >
        {saveLabel}
      </button>
    </div>
  );
}
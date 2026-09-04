// src/pages/Payment.jsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  WalletCards,
  XCircle,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

/*
  TEXVERSE Payment
  Flow:
  Cart -> Checkout -> Payment -> Order Confirmed -> Shipping/Tracking

  Important:
  - Backend is authoritative for order amount.
  - Demo OTP = 123456
  - Razorpay is used only when backend is configured for Razorpay.
  - Layout stays LTR; only text direction changes for RTL languages.
*/

const LANGUAGES = [
  ["en", "English"],
  ["hi", "हिन्दी"],
  ["bn", "বাংলা"],
  ["te", "తెలుగు"],
  ["mr", "मराठी"],
  ["ta", "தமிழ்"],
  ["gu", "ગુજરાતી"],
  ["kn", "ಕನ್ನಡ"],
  ["ml", "മലയാളം"],
  ["pa", "ਪੰਜਾਬੀ"],
  ["ur", "اردو"],
  ["or", "ଓଡ଼ିଆ"],
  ["as", "অসমীয়া"],
  ["ne", "नेपाली"],
  ["sa", "संस्कृतम्"],
  ["kok", "कोंकणी"],
  ["mai", "मैथिली"],
  ["ks", "کٲشُر"],
  ["sd", "سنڌي"],
  ["doi", "डोगरी"],
  ["mni", "মৈতৈলোন্"],
  ["brx", "बड़ो"],
  ["sat", "ᱥᱟᱱᱛᱟᱲᱤ"],
  ["es", "Español"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["ar", "العربية"],
  ["zh", "中文"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["pt", "Português"],
  ["it", "Italiano"],
  ["ru", "Русский"],
  ["tr", "Türkçe"],
];

const RTL_LANGUAGES = new Set(["ur", "ks", "sd", "ar"]);

const PAYMENT_METHODS = [
  {
    id: "gateway",
    icon: CreditCard,
  },
  {
    id: "bank",
    icon: WalletCards,
  },
  {
    id: "terms",
    icon: Smartphone,
  },
];

const translations = {
  en: {
    title: "Secure Payment",
    subtitle: "Complete your payment securely to confirm your textile order.",
    backToCheckout: "Back to Checkout",
    order: "Order",
    orderId: "Order ID",
    payment: "Payment",
    paymentMethod: "Payment Method",
    paymentMode: "Payment mode",
    gateway: "Online Payment",
    gatewayDesc: "Pay securely using Razorpay.",
    bank: "Bank Transfer",
    bankDesc: "Demo bank-transfer payment flow.",
    terms: "Credit / Terms",
    termsDesc: "Demo payment under agreed terms.",
    amount: "Amount Payable",
    total: "Total",
    securePayment: "Secure Payment",
    secureText: "Your payment is protected and verified by the TEXVERSE backend.",
    demoMode: "Demo Payment Mode",
    demoText: "This development environment uses OTP verification.",
    enterOtp: "Enter 6-digit OTP",
    otpPlaceholder: "123456",
    verifyPayment: "Verify Payment",
    processing: "Processing...",
    payNow: "Pay Now",
    createPayment: "Continue to Payment",
    paymentCreated: "Payment session created.",
    paymentSuccessful: "Payment Successful",
    paymentVerified: "Your payment has been verified successfully.",
    orderConfirmed: "Order Confirmed",
    continue: "Continue",
    goToOrder: "View Order Confirmation",
    dashboard: "Buyer Dashboard",
    retry: "Retry",
    somethingWrong: "Something went wrong",
    invalidOtp: "Invalid OTP. Please enter the correct 6-digit OTP.",
    loginRequired: "Please sign in to continue with payment.",
    orderMissing: "Order information is missing.",
    loading: "Loading payment...",
    checkingPayment: "Checking existing payment...",
    alreadyPaid: "This order has already been paid.",
    paymentFailed: "Payment failed. Please try again.",
    razorpayUnavailable: "Online payment is currently unavailable.",
    demoOtpHint: "Demo OTP: 123456",
    currency: "INR",
    verified: "Verified",
    pending: "Pending",
    failed: "Failed",
    method: "Method",
    gatewaySecure: "Razorpay Secure Checkout",
    bankDemo: "Bank transfer is currently available in demo mode.",
    termsDemo: "Credit / terms payment is currently available in demo mode.",
    orderNotFound: "Order not found.",
    sessionExpired: "Your session has expired. Please sign in again.",
  },

  hi: {
    title: "सुरक्षित भुगतान",
    subtitle: "अपने टेक्सटाइल ऑर्डर की पुष्टि करने के लिए सुरक्षित भुगतान पूरा करें।",
    backToCheckout: "चेकआउट पर वापस जाएँ",
    order: "ऑर्डर",
    orderId: "ऑर्डर आईडी",
    payment: "भुगतान",
    paymentMethod: "भुगतान का तरीका",
    paymentMode: "भुगतान मोड",
    gateway: "ऑनलाइन भुगतान",
    gatewayDesc: "Razorpay के माध्यम से सुरक्षित भुगतान करें।",
    bank: "बैंक ट्रांसफर",
    bankDesc: "डेमो बैंक-ट्रांसफर भुगतान प्रक्रिया।",
    terms: "क्रेडिट / टर्म्स",
    termsDesc: "सहमति के अनुसार डेमो भुगतान।",
    amount: "भुगतान राशि",
    total: "कुल",
    securePayment: "सुरक्षित भुगतान",
    secureText: "आपका भुगतान TEXVERSE बैकएंड द्वारा सुरक्षित और सत्यापित किया जाता है।",
    demoMode: "डेमो पेमेंट मोड",
    demoText: "इस डेवलपमेंट वातावरण में OTP सत्यापन का उपयोग किया जा रहा है।",
    enterOtp: "6 अंकों का OTP दर्ज करें",
    otpPlaceholder: "123456",
    verifyPayment: "भुगतान सत्यापित करें",
    processing: "प्रोसेस हो रहा है...",
    payNow: "अभी भुगतान करें",
    createPayment: "भुगतान पर जाएँ",
    paymentCreated: "भुगतान सत्र तैयार है।",
    paymentSuccessful: "भुगतान सफल",
    paymentVerified: "आपका भुगतान सफलतापूर्वक सत्यापित हो गया है।",
    orderConfirmed: "ऑर्डर कन्फर्म हो गया",
    continue: "आगे बढ़ें",
    goToOrder: "ऑर्डर कन्फर्मेशन देखें",
    dashboard: "बायर डैशबोर्ड",
    retry: "फिर प्रयास करें",
    somethingWrong: "कुछ गलत हो गया",
    invalidOtp: "गलत OTP। कृपया सही 6 अंकों का OTP दर्ज करें।",
    loginRequired: "भुगतान जारी रखने के लिए कृपया साइन इन करें।",
    orderMissing: "ऑर्डर की जानकारी उपलब्ध नहीं है।",
    loading: "भुगतान लोड हो रहा है...",
    checkingPayment: "मौजूदा भुगतान की जाँच हो रही है...",
    alreadyPaid: "इस ऑर्डर का भुगतान पहले ही हो चुका है।",
    paymentFailed: "भुगतान असफल हुआ। कृपया दोबारा प्रयास करें।",
    razorpayUnavailable: "ऑनलाइन भुगतान अभी उपलब्ध नहीं है।",
    demoOtpHint: "डेमो OTP: 123456",
    currency: "INR",
    verified: "सत्यापित",
    pending: "लंबित",
    failed: "असफल",
    method: "तरीका",
    gatewaySecure: "Razorpay सुरक्षित चेकआउट",
    bankDemo: "बैंक ट्रांसफर अभी डेमो मोड में उपलब्ध है।",
    termsDemo: "क्रेडिट / टर्म्स भुगतान अभी डेमो मोड में उपलब्ध है।",
    orderNotFound: "ऑर्डर नहीं मिला।",
    sessionExpired: "आपका सेशन समाप्त हो गया है। कृपया दोबारा साइन इन करें।",
  },

  bn: {
    title: "নিরাপদ পেমেন্ট",
    subtitle: "আপনার টেক্সটাইল অর্ডার নিশ্চিত করতে নিরাপদ পেমেন্ট সম্পূর্ণ করুন।",
    backToCheckout: "চেকআউটে ফিরে যান",
    order: "অর্ডার",
    orderId: "অর্ডার আইডি",
    payment: "পেমেন্ট",
    paymentMethod: "পেমেন্ট পদ্ধতি",
    paymentMode: "পেমেন্ট মোড",
    gateway: "অনলাইন পেমেন্ট",
    gatewayDesc: "Razorpay ব্যবহার করে নিরাপদে পেমেন্ট করুন।",
    bank: "ব্যাংক ট্রান্সফার",
    bankDesc: "ডেমো ব্যাংক ট্রান্সফার পেমেন্ট।",
    terms: "ক্রেডিট / টার্মস",
    termsDesc: "সম্মত শর্ত অনুযায়ী ডেমো পেমেন্ট।",
    amount: "পরিশোধযোগ্য পরিমাণ",
    total: "মোট",
    securePayment: "নিরাপদ পেমেন্ট",
    secureText: "আপনার পেমেন্ট TEXVERSE ব্যাকএন্ড দ্বারা সুরক্ষিত ও যাচাই করা হয়।",
    demoMode: "ডেমো পেমেন্ট মোড",
    demoText: "এই ডেভেলপমেন্ট পরিবেশে OTP যাচাইকরণ ব্যবহার করা হচ্ছে।",
    enterOtp: "৬ সংখ্যার OTP লিখুন",
    otpPlaceholder: "123456",
    verifyPayment: "পেমেন্ট যাচাই করুন",
    processing: "প্রক্রিয়াধীন...",
    payNow: "এখন পেমেন্ট করুন",
    createPayment: "পেমেন্টে এগিয়ে যান",
    paymentCreated: "পেমেন্ট সেশন তৈরি হয়েছে।",
    paymentSuccessful: "পেমেন্ট সফল",
    paymentVerified: "আপনার পেমেন্ট সফলভাবে যাচাই হয়েছে।",
    orderConfirmed: "অর্ডার নিশ্চিত",
    continue: "এগিয়ে যান",
    goToOrder: "অর্ডার নিশ্চিতকরণ দেখুন",
    dashboard: "বায়ার ড্যাশবোর্ড",
    retry: "আবার চেষ্টা করুন",
    somethingWrong: "কিছু ভুল হয়েছে",
    invalidOtp: "ভুল OTP। সঠিক ৬ সংখ্যার OTP লিখুন।",
    loginRequired: "পেমেন্ট চালিয়ে যেতে সাইন ইন করুন।",
    orderMissing: "অর্ডারের তথ্য পাওয়া যায়নি।",
    loading: "পেমেন্ট লোড হচ্ছে...",
    checkingPayment: "বিদ্যমান পেমেন্ট পরীক্ষা করা হচ্ছে...",
    alreadyPaid: "এই অর্ডারের পেমেন্ট ইতিমধ্যে সম্পন্ন হয়েছে।",
    paymentFailed: "পেমেন্ট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
    razorpayUnavailable: "অনলাইন পেমেন্ট বর্তমানে উপলব্ধ নয়।",
    demoOtpHint: "ডেমো OTP: 123456",
    currency: "INR",
    verified: "যাচাই করা",
    pending: "অপেক্ষমাণ",
    failed: "ব্যর্থ",
    method: "পদ্ধতি",
    gatewaySecure: "Razorpay নিরাপদ চেকআউট",
    bankDemo: "ব্যাংক ট্রান্সফার বর্তমানে ডেমো মোডে উপলব্ধ।",
    termsDemo: "ক্রেডিট / টার্মস পেমেন্ট বর্তমানে ডেমো মোডে উপলব্ধ।",
    orderNotFound: "অর্ডার পাওয়া যায়নি।",
    sessionExpired: "আপনার সেশন শেষ হয়েছে। আবার সাইন ইন করুন।",
  },

  te: {
    title: "సురక్షిత చెల్లింపు",
    subtitle: "మీ టెక్స్‌టైల్ ఆర్డర్‌ను నిర్ధారించడానికి సురక్షిత చెల్లింపును పూర్తి చేయండి.",
    backToCheckout: "చెకౌట్‌కు తిరిగి వెళ్లండి",
    order: "ఆర్డర్",
    orderId: "ఆర్డర్ ID",
    payment: "చెల్లింపు",
    paymentMethod: "చెల్లింపు విధానం",
    paymentMode: "చెల్లింపు మోడ్",
    gateway: "ఆన్‌లైన్ చెల్లింపు",
    gatewayDesc: "Razorpay ద్వారా సురక్షితంగా చెల్లించండి.",
    bank: "బ్యాంక్ ట్రాన్స్‌ఫర్",
    bankDesc: "డెమో బ్యాంక్ ట్రాన్స్‌ఫర్ చెల్లింపు.",
    terms: "క్రెడిట్ / టర్మ్స్",
    termsDesc: "అంగీకరించిన నిబంధనల ప్రకారం డెమో చెల్లింపు.",
    amount: "చెల్లించాల్సిన మొత్తం",
    total: "మొత్తం",
    securePayment: "సురక్షిత చెల్లింపు",
    secureText: "మీ చెల్లింపు TEXVERSE బ్యాకెండ్ ద్వారా రక్షించబడుతుంది మరియు ధృవీకరించబడుతుంది.",
    demoMode: "డెమో పేమెంట్ మోడ్",
    demoText: "ఈ డెవలప్‌మెంట్ వాతావరణంలో OTP ధృవీకరణ ఉపయోగించబడుతుంది.",
    enterOtp: "6 అంకెల OTP నమోదు చేయండి",
    otpPlaceholder: "123456",
    verifyPayment: "చెల్లింపును ధృవీకరించండి",
    processing: "ప్రాసెస్ అవుతోంది...",
    payNow: "ఇప్పుడే చెల్లించండి",
    createPayment: "చెల్లింపుకు కొనసాగండి",
    paymentCreated: "చెల్లింపు సెషన్ సృష్టించబడింది.",
    paymentSuccessful: "చెల్లింపు విజయవంతం",
    paymentVerified: "మీ చెల్లింపు విజయవంతంగా ధృవీకరించబడింది.",
    orderConfirmed: "ఆర్డర్ నిర్ధారించబడింది",
    continue: "కొనసాగండి",
    goToOrder: "ఆర్డర్ నిర్ధారణ చూడండి",
    dashboard: "బయ్యర్ డ్యాష్‌బోర్డ్",
    retry: "మళ్లీ ప్రయత్నించండి",
    somethingWrong: "ఏదో తప్పు జరిగింది",
    invalidOtp: "తప్పు OTP. సరైన 6 అంకెల OTP నమోదు చేయండి.",
    loginRequired: "చెల్లింపు కొనసాగించడానికి సైన్ ఇన్ చేయండి.",
    orderMissing: "ఆర్డర్ సమాచారం లేదు.",
    loading: "చెల్లింపు లోడ్ అవుతోంది...",
    checkingPayment: "ఇప్పటికే ఉన్న చెల్లింపును తనిఖీ చేస్తున్నాం...",
    alreadyPaid: "ఈ ఆర్డర్‌కు ఇప్పటికే చెల్లింపు పూర్తయింది.",
    paymentFailed: "చెల్లింపు విఫలమైంది. మళ్లీ ప్రయత్నించండి.",
    razorpayUnavailable: "ఆన్‌లైన్ చెల్లింపు ప్రస్తుతం అందుబాటులో లేదు.",
    demoOtpHint: "డెమో OTP: 123456",
    currency: "INR",
    verified: "ధృవీకరించబడింది",
    pending: "పెండింగ్",
    failed: "విఫలమైంది",
    method: "విధానం",
    gatewaySecure: "Razorpay సురక్షిత చెకౌట్",
    bankDemo: "బ్యాంక్ ట్రాన్స్‌ఫర్ ప్రస్తుతం డెమో మోడ్‌లో అందుబాటులో ఉంది.",
    termsDemo: "క్రెడిట్ / టర్మ్స్ చెల్లింపు ప్రస్తుతం డెమో మోడ్‌లో అందుబాటులో ఉంది.",
    orderNotFound: "ఆర్డర్ కనుగొనబడలేదు.",
    sessionExpired: "మీ సెషన్ ముగిసింది. మళ్లీ సైన్ ఇన్ చేయండి.",
  },

  mr: {
    title: "सुरक्षित पेमेंट",
    subtitle: "तुमची टेक्सटाइल ऑर्डर निश्चित करण्यासाठी सुरक्षित पेमेंट पूर्ण करा.",
    backToCheckout: "चेकआउटवर परत जा",
    order: "ऑर्डर",
    orderId: "ऑर्डर ID",
    payment: "पेमेंट",
    paymentMethod: "पेमेंट पद्धत",
    paymentMode: "पेमेंट मोड",
    gateway: "ऑनलाइन पेमेंट",
    gatewayDesc: "Razorpay वापरून सुरक्षित पेमेंट करा.",
    bank: "बँक ट्रान्सफर",
    bankDesc: "डेमो बँक ट्रान्सफर पेमेंट.",
    terms: "क्रेडिट / टर्म्स",
    termsDesc: "मान्य अटींनुसार डेमो पेमेंट.",
    amount: "देय रक्कम",
    total: "एकूण",
    securePayment: "सुरक्षित पेमेंट",
    secureText: "तुमचे पेमेंट TEXVERSE बॅकएंडद्वारे सुरक्षित आणि सत्यापित केले जाते.",
    demoMode: "डेमो पेमेंट मोड",
    demoText: "या डेव्हलपमेंट वातावरणात OTP पडताळणी वापरली जाते.",
    enterOtp: "6 अंकी OTP टाका",
    otpPlaceholder: "123456",
    verifyPayment: "पेमेंट सत्यापित करा",
    processing: "प्रक्रिया सुरू आहे...",
    payNow: "आता पेमेंट करा",
    createPayment: "पेमेंटकडे जा",
    paymentCreated: "पेमेंट सेशन तयार झाले.",
    paymentSuccessful: "पेमेंट यशस्वी",
    paymentVerified: "तुमचे पेमेंट यशस्वीरित्या सत्यापित झाले.",
    orderConfirmed: "ऑर्डर निश्चित झाली",
    continue: "पुढे जा",
    goToOrder: "ऑर्डर पुष्टीकरण पहा",
    dashboard: "बायर डॅशबोर्ड",
    retry: "पुन्हा प्रयत्न करा",
    somethingWrong: "काहीतरी चूक झाली",
    invalidOtp: "चुकीचा OTP. योग्य 6 अंकी OTP टाका.",
    loginRequired: "पेमेंट सुरू ठेवण्यासाठी साइन इन करा.",
    orderMissing: "ऑर्डरची माहिती उपलब्ध नाही.",
    loading: "पेमेंट लोड होत आहे...",
    checkingPayment: "विद्यमान पेमेंट तपासत आहोत...",
    alreadyPaid: "या ऑर्डरचे पेमेंट आधीच झाले आहे.",
    paymentFailed: "पेमेंट अयशस्वी झाले. पुन्हा प्रयत्न करा.",
    razorpayUnavailable: "ऑनलाइन पेमेंट सध्या उपलब्ध नाही.",
    demoOtpHint: "डेमो OTP: 123456",
    currency: "INR",
    verified: "सत्यापित",
    pending: "प्रलंबित",
    failed: "अयशस्वी",
    method: "पद्धत",
    gatewaySecure: "Razorpay सुरक्षित चेकआउट",
    bankDemo: "बँक ट्रान्सफर सध्या डेमो मोडमध्ये उपलब्ध आहे.",
    termsDemo: "क्रेडिट / टर्म्स पेमेंट सध्या डेमो मोडमध्ये उपलब्ध आहे.",
    orderNotFound: "ऑर्डर सापडली नाही.",
    sessionExpired: "तुमचे सेशन संपले आहे. पुन्हा साइन इन करा.",
  },

  ta: {
    title: "பாதுகாப்பான கட்டணம்",
    subtitle: "உங்கள் டெக்ஸ்டைல் ஆர்டரை உறுதிப்படுத்த பாதுகாப்பான கட்டணத்தை முடிக்கவும்.",
    backToCheckout: "செக்அவுட்டிற்கு திரும்பவும்",
    order: "ஆர்டர்",
    orderId: "ஆர்டர் ID",
    payment: "கட்டணம்",
    paymentMethod: "கட்டண முறை",
    paymentMode: "கட்டண முறைமை",
    gateway: "ஆன்லைன் கட்டணம்",
    gatewayDesc: "Razorpay மூலம் பாதுகாப்பாக பணம் செலுத்தவும்.",
    bank: "வங்கி பரிமாற்றம்",
    bankDesc: "டெமோ வங்கி பரிமாற்ற கட்டணம்.",
    terms: "கிரெடிட் / விதிமுறைகள்",
    termsDesc: "ஒப்புக்கொண்ட விதிமுறைகளின்படி டெமோ கட்டணம்.",
    amount: "செலுத்த வேண்டிய தொகை",
    total: "மொத்தம்",
    securePayment: "பாதுகாப்பான கட்டணம்",
    secureText: "உங்கள் கட்டணம் TEXVERSE backend மூலம் பாதுகாக்கப்பட்டு சரிபார்க்கப்படுகிறது.",
    demoMode: "டெமோ கட்டண முறை",
    demoText: "இந்த development சூழலில் OTP சரிபார்ப்பு பயன்படுத்தப்படுகிறது.",
    enterOtp: "6 இலக்க OTP உள்ளிடவும்",
    otpPlaceholder: "123456",
    verifyPayment: "கட்டணத்தை சரிபார்க்கவும்",
    processing: "செயலாக்கப்படுகிறது...",
    payNow: "இப்போது செலுத்தவும்",
    createPayment: "கட்டணத்திற்கு தொடரவும்",
    paymentCreated: "கட்டண session உருவாக்கப்பட்டது.",
    paymentSuccessful: "கட்டணம் வெற்றி",
    paymentVerified: "உங்கள் கட்டணம் வெற்றிகரமாக சரிபார்க்கப்பட்டது.",
    orderConfirmed: "ஆர்டர் உறுதி செய்யப்பட்டது",
    continue: "தொடரவும்",
    goToOrder: "ஆர்டர் உறுதிப்படுத்தலை பார்க்கவும்",
    dashboard: "Buyer Dashboard",
    retry: "மீண்டும் முயற்சிக்கவும்",
    somethingWrong: "ஏதோ தவறு ஏற்பட்டது",
    invalidOtp: "தவறான OTP. சரியான 6 இலக்க OTP உள்ளிடவும்.",
    loginRequired: "கட்டணத்தை தொடர உள்நுழையவும்.",
    orderMissing: "ஆர்டர் தகவல் இல்லை.",
    loading: "கட்டணம் ஏற்றப்படுகிறது...",
    checkingPayment: "ஏற்கனவே உள்ள கட்டணம் சரிபார்க்கப்படுகிறது...",
    alreadyPaid: "இந்த ஆர்டருக்கு ஏற்கனவே கட்டணம் செலுத்தப்பட்டுள்ளது.",
    paymentFailed: "கட்டணம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
    razorpayUnavailable: "ஆன்லைன் கட்டணம் தற்போது கிடைக்கவில்லை.",
    demoOtpHint: "டெமோ OTP: 123456",
    currency: "INR",
    verified: "சரிபார்க்கப்பட்டது",
    pending: "நிலுவையில்",
    failed: "தோல்வி",
    method: "முறை",
    gatewaySecure: "Razorpay பாதுகாப்பான Checkout",
    bankDemo: "வங்கி பரிமாற்றம் தற்போது டெமோ முறையில் கிடைக்கிறது.",
    termsDemo: "கிரெடிட் / விதிமுறைகள் கட்டணம் தற்போது டெமோ முறையில் கிடைக்கிறது.",
    orderNotFound: "ஆர்டர் கிடைக்கவில்லை.",
    sessionExpired: "உங்கள் session முடிந்துவிட்டது. மீண்டும் உள்நுழையவும்.",
  },

  gu: {
    title: "સુરક્ષિત ચુકવણી",
    subtitle: "તમારા ટેક્સટાઇલ ઓર્ડરની પુષ્ટિ કરવા માટે સુરક્ષિત ચુકવણી પૂર્ણ કરો.",
    backToCheckout: "ચેકઆઉટ પર પાછા જાઓ",
    order: "ઓર્ડર",
    orderId: "ઓર્ડર ID",
    payment: "ચુકવણી",
    paymentMethod: "ચુકવણી પદ્ધતિ",
    paymentMode: "ચુકવણી મોડ",
    gateway: "ઓનલાઇન ચુકવણી",
    gatewayDesc: "Razorpay દ્વારા સુરક્ષિત ચુકવણી કરો.",
    bank: "બેંક ટ્રાન્સફર",
    bankDesc: "ડેમો બેંક ટ્રાન્સફર ચુકવણી.",
    terms: "ક્રેડિટ / ટર્મ્સ",
    termsDesc: "સંમત શરતો હેઠળ ડેમો ચુકવણી.",
    amount: "ચૂકવવાપાત્ર રકમ",
    total: "કુલ",
    securePayment: "સુરક્ષિત ચુકવણી",
    secureText: "તમારી ચુકવણી TEXVERSE backend દ્વારા સુરક્ષિત અને ચકાસવામાં આવે છે.",
    demoMode: "ડેમો ચુકવણી મોડ",
    demoText: "આ વિકાસ વાતાવરણમાં OTP ચકાસણીનો ઉપયોગ થાય છે.",
    enterOtp: "6 અંકનો OTP દાખલ કરો",
    otpPlaceholder: "123456",
    verifyPayment: "ચુકવણી ચકાસો",
    processing: "પ્રક્રિયા થઈ રહી છે...",
    payNow: "હવે ચૂકવો",
    createPayment: "ચુકવણી માટે આગળ વધો",
    paymentCreated: "ચુકવણી સેશન બનાવવામાં આવ્યું.",
    paymentSuccessful: "ચુકવણી સફળ",
    paymentVerified: "તમારી ચુકવણી સફળતાપૂર્વક ચકાસવામાં આવી છે.",
    orderConfirmed: "ઓર્ડર કન્ફર્મ થયો",
    continue: "આગળ વધો",
    goToOrder: "ઓર્ડર કન્ફર્મેશન જુઓ",
    dashboard: "બાયર ડેશબોર્ડ",
    retry: "ફરી પ્રયાસ કરો",
    somethingWrong: "કંઈક ખોટું થયું",
    invalidOtp: "ખોટો OTP. સાચો 6 અંકનો OTP દાખલ કરો.",
    loginRequired: "ચુકવણી ચાલુ રાખવા માટે સાઇન ઇન કરો.",
    orderMissing: "ઓર્ડરની માહિતી ઉપલબ્ધ નથી.",
    loading: "ચુકવણી લોડ થઈ રહી છે...",
    checkingPayment: "હાલની ચુકવણી તપાસી રહ્યા છીએ...",
    alreadyPaid: "આ ઓર્ડરની ચુકવણી પહેલેથી થઈ ગઈ છે.",
    paymentFailed: "ચુકવણી નિષ્ફળ થઈ. ફરી પ્રયાસ કરો.",
    razorpayUnavailable: "ઓનલાઇન ચુકવણી હાલમાં ઉપલબ્ધ નથી.",
    demoOtpHint: "ડેમો OTP: 123456",
    currency: "INR",
    verified: "ચકાસાયેલ",
    pending: "બાકી",
    failed: "નિષ્ફળ",
    method: "પદ્ધતિ",
    gatewaySecure: "Razorpay સુરક્ષિત Checkout",
    bankDemo: "બેંક ટ્રાન્સફર હાલમાં ડેમો મોડમાં ઉપલબ્ધ છે.",
    termsDemo: "ક્રેડિટ / ટર્મ્સ ચુકવણી હાલમાં ડેમો મોડમાં ઉપલબ્ધ છે.",
    orderNotFound: "ઓર્ડર મળ્યો નથી.",
    sessionExpired: "તમારું સેશન સમાપ્ત થઈ ગયું છે. ફરી સાઇન ઇન કરો.",
  },

  kn: {
    title: "ಸುರಕ್ಷಿತ ಪಾವತಿ",
    subtitle: "ನಿಮ್ಮ ಟೆಕ್ಸ್ಟೈಲ್ ಆರ್ಡರ್ ಅನ್ನು ಖಚಿತಪಡಿಸಲು ಸುರಕ್ಷಿತ ಪಾವತಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.",
    backToCheckout: "ಚೆಕ್‌ಔಟ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    order: "ಆರ್ಡರ್",
    orderId: "ಆರ್ಡರ್ ID",
    payment: "ಪಾವತಿ",
    paymentMethod: "ಪಾವತಿ ವಿಧಾನ",
    paymentMode: "ಪಾವತಿ ಮೋಡ್",
    gateway: "ಆನ್‌ಲೈನ್ ಪಾವತಿ",
    gatewayDesc: "Razorpay ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಪಾವತಿಸಿ.",
    bank: "ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ",
    bankDesc: "ಡೆಮೋ ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಪಾವತಿ.",
    terms: "ಕ್ರೆಡಿಟ್ / ಟರ್ಮ್ಸ್",
    termsDesc: "ಒಪ್ಪಿಕೊಂಡ ಷರತ್ತುಗಳ ಅಡಿಯಲ್ಲಿ ಡೆಮೋ ಪಾವತಿ.",
    amount: "ಪಾವತಿಸಬೇಕಾದ ಮೊತ್ತ",
    total: "ಒಟ್ಟು",
    securePayment: "ಸುರಕ್ಷಿತ ಪಾವತಿ",
    secureText: "ನಿಮ್ಮ ಪಾವತಿಯನ್ನು TEXVERSE backend ರಕ್ಷಿಸಿ ಪರಿಶೀಲಿಸುತ್ತದೆ.",
    demoMode: "ಡೆಮೋ ಪಾವತಿ ಮೋಡ್",
    demoText: "ಈ development environment ನಲ್ಲಿ OTP ಪರಿಶೀಲನೆ ಬಳಸಲಾಗುತ್ತದೆ.",
    enterOtp: "6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    otpPlaceholder: "123456",
    verifyPayment: "ಪಾವತಿ ಪರಿಶೀಲಿಸಿ",
    processing: "ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...",
    payNow: "ಈಗ ಪಾವತಿಸಿ",
    createPayment: "ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    paymentCreated: "ಪಾವತಿ session ಸೃಷ್ಟಿಸಲಾಗಿದೆ.",
    paymentSuccessful: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
    paymentVerified: "ನಿಮ್ಮ ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿ ಪರಿಶೀಲಿಸಲಾಗಿದೆ.",
    orderConfirmed: "ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ",
    continue: "ಮುಂದುವರಿಸಿ",
    goToOrder: "ಆರ್ಡರ್ ದೃಢೀಕರಣ ನೋಡಿ",
    dashboard: "Buyer Dashboard",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    somethingWrong: "ಏನೋ ತಪ್ಪಾಗಿದೆ",
    invalidOtp: "ತಪ್ಪಾದ OTP. ಸರಿಯಾದ 6 ಅಂಕಿಯ OTP ನಮೂದಿಸಿ.",
    loginRequired: "ಪಾವತಿ ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    orderMissing: "ಆರ್ಡರ್ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.",
    loading: "ಪಾವತಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
    checkingPayment: "ಈಗಿರುವ ಪಾವತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",
    alreadyPaid: "ಈ ಆರ್ಡರ್‌ಗೆ ಈಗಾಗಲೇ ಪಾವತಿ ಮಾಡಲಾಗಿದೆ.",
    paymentFailed: "ಪಾವತಿ ವಿಫಲವಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    razorpayUnavailable: "ಆನ್‌ಲೈನ್ ಪಾವತಿ ಪ್ರಸ್ತುತ ಲಭ್ಯವಿಲ್ಲ.",
    demoOtpHint: "ಡೆಮೋ OTP: 123456",
    currency: "INR",
    verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    pending: "ಬಾಕಿ",
    failed: "ವಿಫಲ",
    method: "ವಿಧಾನ",
    gatewaySecure: "Razorpay ಸುರಕ್ಷಿತ Checkout",
    bankDemo: "ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ ಪ್ರಸ್ತುತ ಡೆಮೋ ಮೋಡ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.",
    termsDemo: "ಕ್ರೆಡಿಟ್ / ಟರ್ಮ್ಸ್ ಪಾವತಿ ಪ್ರಸ್ತುತ ಡೆಮೋ ಮೋಡ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ.",
    orderNotFound: "ಆರ್ಡರ್ ಕಂಡುಬಂದಿಲ್ಲ.",
    sessionExpired: "ನಿಮ್ಮ session ಮುಗಿದಿದೆ. ಮತ್ತೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  },

  ml: {
    title: "സുരക്ഷിത പേയ്മെന്റ്",
    subtitle: "നിങ്ങളുടെ ടെക്സ്റ്റൈൽ ഓർഡർ സ്ഥിരീകരിക്കാൻ സുരക്ഷിത പേയ്മെന്റ് പൂർത്തിയാക്കുക.",
    backToCheckout: "ചെക്കൗട്ടിലേക്ക് മടങ്ങുക",
    order: "ഓർഡർ",
    orderId: "ഓർഡർ ID",
    payment: "പേയ്മെന്റ്",
    paymentMethod: "പേയ്മെന്റ് രീതി",
    paymentMode: "പേയ്മെന്റ് മോഡ്",
    gateway: "ഓൺലൈൻ പേയ്മെന്റ്",
    gatewayDesc: "Razorpay ഉപയോഗിച്ച് സുരക്ഷിതമായി പണമടയ്ക്കുക.",
    bank: "ബാങ്ക് ട്രാൻസ്ഫർ",
    bankDesc: "ഡെമോ ബാങ്ക് ട്രാൻസ്ഫർ പേയ്മെന്റ്.",
    terms: "ക്രെഡിറ്റ് / ടേംസ്",
    termsDesc: "അംഗീകരിച്ച നിബന്ധനകൾ പ്രകാരമുള്ള ഡെമോ പേയ്മെന്റ്.",
    amount: "അടയ്ക്കേണ്ട തുക",
    total: "ആകെ",
    securePayment: "സുരക്ഷിത പേയ്മെന്റ്",
    secureText: "നിങ്ങളുടെ പേയ്മെന്റ് TEXVERSE backend വഴി സുരക്ഷിതമായി പരിശോധിക്കുന്നു.",
    demoMode: "ഡെമോ പേയ്മെന്റ് മോഡ്",
    demoText: "ഈ development environment-ൽ OTP verification ഉപയോഗിക്കുന്നു.",
    enterOtp: "6 അക്ക OTP നൽകുക",
    otpPlaceholder: "123456",
    verifyPayment: "പേയ്മെന്റ് പരിശോധിക്കുക",
    processing: "പ്രോസസ്സ് ചെയ്യുന്നു...",
    payNow: "ഇപ്പോൾ പണമടയ്ക്കുക",
    createPayment: "പേയ്മെന്റിലേക്ക് തുടരുക",
    paymentCreated: "പേയ്മെന്റ് session സൃഷ്ടിച്ചു.",
    paymentSuccessful: "പേയ്മെന്റ് വിജയിച്ചു",
    paymentVerified: "നിങ്ങളുടെ പേയ്മെന്റ് വിജയകരമായി പരിശോധിച്ചു.",
    orderConfirmed: "ഓർഡർ സ്ഥിരീകരിച്ചു",
    continue: "തുടരുക",
    goToOrder: "ഓർഡർ സ്ഥിരീകരണം കാണുക",
    dashboard: "Buyer Dashboard",
    retry: "വീണ്ടും ശ്രമിക്കുക",
    somethingWrong: "എന്തോ തെറ്റ് സംഭവിച്ചു",
    invalidOtp: "തെറ്റായ OTP. ശരിയായ 6 അക്ക OTP നൽകുക.",
    loginRequired: "പേയ്മെന്റ് തുടരാൻ സൈൻ ഇൻ ചെയ്യുക.",
    orderMissing: "ഓർഡർ വിവരങ്ങൾ ലഭ്യമല്ല.",
    loading: "പേയ്മെന്റ് ലോഡ് ചെയ്യുന്നു...",
    checkingPayment: "നിലവിലുള്ള പേയ്മെന്റ് പരിശോധിക്കുന്നു...",
    alreadyPaid: "ഈ ഓർഡറിന്റെ പേയ്മെന്റ് ഇതിനകം പൂർത്തിയായി.",
    paymentFailed: "പേയ്മെന്റ് പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.",
    razorpayUnavailable: "ഓൺലൈൻ പേയ്മെന്റ് ഇപ്പോൾ ലഭ്യമല്ല.",
    demoOtpHint: "ഡെമോ OTP: 123456",
    currency: "INR",
    verified: "പരിശോധിച്ചു",
    pending: "തീർപ്പാക്കാത്തത്",
    failed: "പരാജയപ്പെട്ടു",
    method: "രീതി",
    gatewaySecure: "Razorpay സുരക്ഷിത Checkout",
    bankDemo: "ബാങ്ക് ട്രാൻസ്ഫർ നിലവിൽ ഡെമോ മോഡിൽ ലഭ്യമാണ്.",
    termsDemo: "ക്രെഡിറ്റ് / ടേംസ് പേയ്മെന്റ് നിലവിൽ ഡെമോ മോഡിൽ ലഭ്യമാണ്.",
    orderNotFound: "ഓർഡർ കണ്ടെത്തിയില്ല.",
    sessionExpired: "നിങ്ങളുടെ session അവസാനിച്ചു. വീണ്ടും സൈൻ ഇൻ ചെയ്യുക.",
  },

  pa: {
    title: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
    subtitle: "ਆਪਣੇ ਟੈਕਸਟਾਈਲ ਆਰਡਰ ਦੀ ਪੁਸ਼ਟੀ ਕਰਨ ਲਈ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਪੂਰਾ ਕਰੋ।",
    backToCheckout: "ਚੈੱਕਆਉਟ ਤੇ ਵਾਪਸ ਜਾਓ",
    order: "ਆਰਡਰ",
    orderId: "ਆਰਡਰ ID",
    payment: "ਭੁਗਤਾਨ",
    paymentMethod: "ਭੁਗਤਾਨ ਢੰਗ",
    paymentMode: "ਭੁਗਤਾਨ ਮੋਡ",
    gateway: "ਆਨਲਾਈਨ ਭੁਗਤਾਨ",
    gatewayDesc: "Razorpay ਰਾਹੀਂ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ ਕਰੋ।",
    bank: "ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ",
    bankDesc: "ਡੈਮੋ ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ ਭੁਗਤਾਨ।",
    terms: "ਕ੍ਰੈਡਿਟ / ਟਰਮਜ਼",
    termsDesc: "ਸਹਿਮਤ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ ਡੈਮੋ ਭੁਗਤਾਨ।",
    amount: "ਭੁਗਤਾਨਯੋਗ ਰਕਮ",
    total: "ਕੁੱਲ",
    securePayment: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
    secureText: "ਤੁਹਾਡਾ ਭੁਗਤਾਨ TEXVERSE backend ਦੁਆਰਾ ਸੁਰੱਖਿਅਤ ਅਤੇ verify ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    demoMode: "ਡੈਮੋ ਭੁਗਤਾਨ ਮੋਡ",
    demoText: "ਇਸ development environment ਵਿੱਚ OTP verification ਵਰਤੀ ਜਾਂਦੀ ਹੈ।",
    enterOtp: "6 ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ",
    otpPlaceholder: "123456",
    verifyPayment: "ਭੁਗਤਾਨ verify ਕਰੋ",
    processing: "ਪ੍ਰਕਿਰਿਆ ਜਾਰੀ ਹੈ...",
    payNow: "ਹੁਣ ਭੁਗਤਾਨ ਕਰੋ",
    createPayment: "ਭੁਗਤਾਨ ਵੱਲ ਜਾਓ",
    paymentCreated: "ਭੁਗਤਾਨ session ਬਣ ਗਿਆ ਹੈ।",
    paymentSuccessful: "ਭੁਗਤਾਨ ਸਫਲ",
    paymentVerified: "ਤੁਹਾਡਾ ਭੁਗਤਾਨ ਸਫਲਤਾਪੂਰਵਕ verify ਹੋ ਗਿਆ ਹੈ।",
    orderConfirmed: "ਆਰਡਰ ਪੁਸ਼ਟੀ ਹੋ ਗਿਆ",
    continue: "ਜਾਰੀ ਰੱਖੋ",
    goToOrder: "ਆਰਡਰ ਪੁਸ਼ਟੀ ਵੇਖੋ",
    dashboard: "Buyer Dashboard",
    retry: "ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    somethingWrong: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ",
    invalidOtp: "ਗਲਤ OTP। ਸਹੀ 6 ਅੰਕਾਂ ਦਾ OTP ਦਰਜ ਕਰੋ।",
    loginRequired: "ਭੁਗਤਾਨ ਜਾਰੀ ਰੱਖਣ ਲਈ sign in ਕਰੋ।",
    orderMissing: "ਆਰਡਰ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਮਿਲੀ।",
    loading: "ਭੁਗਤਾਨ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...",
    checkingPayment: "ਮੌਜੂਦਾ ਭੁਗਤਾਨ ਦੀ ਜਾਂਚ ਹੋ ਰਹੀ ਹੈ...",
    alreadyPaid: "ਇਸ ਆਰਡਰ ਦਾ ਭੁਗਤਾਨ ਪਹਿਲਾਂ ਹੀ ਹੋ ਚੁੱਕਾ ਹੈ।",
    paymentFailed: "ਭੁਗਤਾਨ ਅਸਫਲ ਹੋਇਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    razorpayUnavailable: "ਆਨਲਾਈਨ ਭੁਗਤਾਨ ਇਸ ਸਮੇਂ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    demoOtpHint: "ਡੈਮੋ OTP: 123456",
    currency: "INR",
    verified: "ਤਸਦੀਕਸ਼ੁਦਾ",
    pending: "ਬਕਾਇਆ",
    failed: "ਅਸਫਲ",
    method: "ਢੰਗ",
    gatewaySecure: "Razorpay Secure Checkout",
    bankDemo: "ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ ਇਸ ਸਮੇਂ ਡੈਮੋ ਮੋਡ ਵਿੱਚ ਉਪਲਬਧ ਹੈ।",
    termsDemo: "ਕ੍ਰੈਡਿਟ / ਟਰਮਜ਼ ਭੁਗਤਾਨ ਇਸ ਸਮੇਂ ਡੈਮੋ ਮੋਡ ਵਿੱਚ ਉਪਲਬਧ ਹੈ।",
    orderNotFound: "ਆਰਡਰ ਨਹੀਂ ਮਿਲਿਆ।",
    sessionExpired: "ਤੁਹਾਡਾ session ਖਤਮ ਹੋ ਗਿਆ ਹੈ। ਦੁਬਾਰਾ sign in ਕਰੋ।",
  },

  ur: {
    title: "محفوظ ادائیگی",
    subtitle: "اپنے ٹیکسٹائل آرڈر کی تصدیق کے لیے محفوظ ادائیگی مکمل کریں۔",
    backToCheckout: "چیک آؤٹ پر واپس جائیں",
    order: "آرڈر",
    orderId: "آرڈر ID",
    payment: "ادائیگی",
    paymentMethod: "ادائیگی کا طریقہ",
    paymentMode: "ادائیگی موڈ",
    gateway: "آن لائن ادائیگی",
    gatewayDesc: "Razorpay کے ذریعے محفوظ ادائیگی کریں۔",
    bank: "بینک ٹرانسفر",
    bankDesc: "ڈیمو بینک ٹرانسفر ادائیگی۔",
    terms: "کریڈٹ / شرائط",
    termsDesc: "طے شدہ شرائط کے مطابق ڈیمو ادائیگی۔",
    amount: "قابل ادائیگی رقم",
    total: "کل",
    securePayment: "محفوظ ادائیگی",
    secureText: "آپ کی ادائیگی TEXVERSE backend کے ذریعے محفوظ اور تصدیق شدہ ہے۔",
    demoMode: "ڈیمو ادائیگی موڈ",
    demoText: "اس development environment میں OTP verification استعمال ہوتی ہے۔",
    enterOtp: "6 ہندسوں کا OTP درج کریں",
    otpPlaceholder: "123456",
    verifyPayment: "ادائیگی کی تصدیق کریں",
    processing: "عمل جاری ہے...",
    payNow: "ابھی ادائیگی کریں",
    createPayment: "ادائیگی کے لیے آگے بڑھیں",
    paymentCreated: "ادائیگی session تیار ہے۔",
    paymentSuccessful: "ادائیگی کامیاب",
    paymentVerified: "آپ کی ادائیگی کامیابی سے verify ہو گئی ہے۔",
    orderConfirmed: "آرڈر کی تصدیق ہو گئی",
    continue: "جاری رکھیں",
    goToOrder: "آرڈر کی تصدیق دیکھیں",
    dashboard: "Buyer Dashboard",
    retry: "دوبارہ کوشش کریں",
    somethingWrong: "کچھ غلط ہو گیا",
    invalidOtp: "غلط OTP۔ درست 6 ہندسوں کا OTP درج کریں۔",
    loginRequired: "ادائیگی جاری رکھنے کے لیے sign in کریں۔",
    orderMissing: "آرڈر کی معلومات دستیاب نہیں۔",
    loading: "ادائیگی لوڈ ہو رہی ہے...",
    checkingPayment: "موجودہ ادائیگی چیک کی جا رہی ہے...",
    alreadyPaid: "اس آرڈر کی ادائیگی پہلے ہی ہو چکی ہے۔",
    paymentFailed: "ادائیگی ناکام ہوگئی۔ دوبارہ کوشش کریں۔",
    razorpayUnavailable: "آن لائن ادائیگی فی الحال دستیاب نہیں۔",
    demoOtpHint: "ڈیمو OTP: 123456",
    currency: "INR",
    verified: "تصدیق شدہ",
    pending: "زیر التوا",
    failed: "ناکام",
    method: "طریقہ",
    gatewaySecure: "Razorpay محفوظ Checkout",
    bankDemo: "بینک ٹرانسفر فی الحال ڈیمو موڈ میں دستیاب ہے۔",
    termsDemo: "کریڈٹ / شرائط ادائیگی فی الحال ڈیمو موڈ میں دستیاب ہے۔",
    orderNotFound: "آرڈر نہیں ملا۔",
    sessionExpired: "آپ کا session ختم ہو گیا ہے۔ دوبارہ sign in کریں۔",
  },
};

/*
  For languages not having a dedicated dictionary above,
  English is intentionally used as a safe fallback.
*/
const getLanguage = () => {
  const htmlLang =
    typeof document !== "undefined"
      ? document.documentElement.lang
      : "";

  const stored =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("texverse_language")
      : "";

  const value = String(htmlLang || stored || "en")
    .toLowerCase()
    .split("-")[0];

  return LANGUAGES.some(([code]) => code === value) ? value : "en";
};

const formatMoney = (value, currency = "INR") => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return "₹0.00";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};

const safeJsonParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const apiRequest = async (path, options = {}) => {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("texverse_token")
      : "";

  const headers = {
    Accept: "application/json",
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const raw = await response.text();

  let data = null;

  if (raw) {
    data = safeJsonParse(raw, raw);
  }

  if (!response.ok) {
    const detail =
      typeof data === "object" && data !== null
        ? data.detail || data.message
        : typeof data === "string"
          ? data
          : "";

    const error = new Error(
      detail || `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
};

const getFriendlyError = (error, t) => {
  if (!error) {
    return t("somethingWrong");
  }

  if (error.status === 401) {
    return t("sessionExpired");
  }

  const message = String(error.message || "").toLowerCase();

  if (message.includes("order not found")) {
    return t("orderNotFound");
  }

  if (
    message.includes("otp") ||
    message.includes("verification")
  ) {
    return t("invalidOtp");
  }

  if (
    message.includes("razorpay") ||
    message.includes("gateway")
  ) {
    return t("razorpayUnavailable");
  }

  return error.message || t("somethingWrong");
};

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Browser environment required."));
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(true), {
        once: true,
      });

      existing.addEventListener("error", () => {
        reject(new Error("Razorpay script failed to load."));
      }, {
        once: true,
      });

      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () =>
      reject(new Error("Razorpay script failed to load."));

    document.body.appendChild(script);
  });

const normalizeStatus = (status) =>
  String(status || "").toLowerCase().replace(/\s+/g, "_");

export default function Payment() {
  const location = useLocation();

  const [language, setLanguage] = useState(getLanguage);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [paymentState, setPaymentState] = useState("pending");

  const [paymentMethod, setPaymentMethod] =
    useState("gateway");

  const [otp, setOtp] = useState("");

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const orderIdFromQuery = query.get("order");

  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("texverse_token")
      : "";

  const dictionary =
    translations[language] || translations.en;

  const t = useCallback(
    (key) => dictionary[key] || translations.en[key] || key,
    [dictionary]
  );

  const isRTL = RTL_LANGUAGES.has(language);

  /*
    Keep the whole page structure LTR.
    Only text/input direction changes.
    This prevents left/right layout swapping.
  */
  const textDirection = isRTL ? "rtl" : "ltr";

  useEffect(() => {
    const updateLanguage = () => {
      setLanguage(getLanguage());
    };

    updateLanguage();

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(updateLanguage)
        : null;

    if (observer && document.documentElement) {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["lang"],
      });
    }

    window.addEventListener(
      "texverse-language-changed",
      updateLanguage
    );

    window.addEventListener("storage", updateLanguage);

    return () => {
      observer?.disconnect();

      window.removeEventListener(
        "texverse-language-changed",
        updateLanguage
      );

      window.removeEventListener("storage", updateLanguage);
    };
  }, []);

  const pendingPayment = useMemo(() => {
    if (typeof localStorage === "undefined") {
      return null;
    }

    return safeJsonParse(
      localStorage.getItem("texverse_pending_payment"),
      null
    );
  }, []);

  const orderId = useMemo(() => {
    const fromQuery = Number(orderIdFromQuery);

    if (Number.isFinite(fromQuery) && fromQuery > 0) {
      return fromQuery;
    }

    const fromStorage = Number(pendingPayment?.orderId);

    if (Number.isFinite(fromStorage) && fromStorage > 0) {
      return fromStorage;
    }

    return null;
  }, [orderIdFromQuery, pendingPayment]);

  const fetchOrderAndPayment = useCallback(async () => {
    if (!token) {
      setError(t("loginRequired"));
      setLoading(false);
      return;
    }

    if (!orderId) {
      setError(t("orderMissing"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      /*
        Existing backend has GET /orders/mine,
        not a guaranteed GET /orders/{id}.
      */
      const ordersResponse = await apiRequest(
        "/orders/mine"
      );

      const orders = Array.isArray(ordersResponse)
        ? ordersResponse
        : Array.isArray(ordersResponse?.orders)
          ? ordersResponse.orders
          : [];

      const foundOrder = orders.find(
        (item) => Number(item?.id) === Number(orderId)
      );

      if (!foundOrder) {
        throw new Error(t("orderNotFound"));
      }

      setOrder(foundOrder);

      try {
        const paymentStatus = await apiRequest(
          `/payments/status/${orderId}`
        );

        setPayment(paymentStatus);

        const status = normalizeStatus(
          paymentStatus?.status
        );

        if (
          paymentStatus?.verified === true ||
          status === "verified" ||
          status === "paid" ||
          status === "success" ||
          status === "successful"
        ) {
          setPaymentState("success");
        } else if (
          status === "failed" ||
          status === "cancelled"
        ) {
          setPaymentState("failed");
        } else {
          setPaymentState("pending");
        }
      } catch (paymentError) {
        /*
          Payment may not exist yet.
          That is not a fatal error because Checkout creates
          the payment session from this page.
        */
        if (paymentError?.status === 404) {
          setPayment(null);
          setPaymentState("pending");
        } else {
          throw paymentError;
        }
      }
    } catch (requestError) {
      setError(getFriendlyError(requestError, t));
    } finally {
      setLoading(false);
    }
  }, [orderId, t, token]);

  useEffect(() => {
    fetchOrderAndPayment();
  }, [fetchOrderAndPayment]);

  const savePendingPayment = useCallback(
    (data) => {
      if (typeof localStorage === "undefined") {
        return;
      }

      localStorage.setItem(
        "texverse_pending_payment",
        JSON.stringify({
          orderId: Number(orderId),
          total:
            Number(data?.amount) ||
            Number(order?.total) ||
            0,
          method: paymentMethod,
          mode: data?.mode || "demo",
          gateway_order_id:
            data?.gateway_order_id || null,
          key_id: data?.key_id || null,
          currency: data?.currency || "INR",
          createdAt: new Date().toISOString(),
        })
      );
    },
    [order, orderId, paymentMethod]
  );

  const createPaymentSession = useCallback(async () => {
    if (!orderId) {
      throw new Error(t("orderMissing"));
    }

    const result = await apiRequest(
      "/payments/create-order",
      {
        method: "POST",
        body: JSON.stringify({
          order_id: Number(orderId),
          method: paymentMethod,
        }),
      }
    );

    setPayment(result);

    savePendingPayment(result);

    return result;
  }, [
    orderId,
    paymentMethod,
    savePendingPayment,
    t,
  ]);

  const markSuccess = useCallback(() => {
    setPaymentState("success");
    setProcessing(false);
    setError("");

    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(
        "texverse_pending_payment"
      );
    }
  }, []);

  const verifyDemoPayment = useCallback(async () => {
    if (!orderId) {
      setError(t("orderMissing"));
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(t("invalidOtp"));
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const result = await apiRequest(
        "/payments/demo-success",
        {
          method: "POST",
          body: JSON.stringify({
            order_id: Number(orderId),
            otp,
            method: paymentMethod,
          }),
        }
      );

      setPayment(result);
      markSuccess();
    } catch (requestError) {
      setError(getFriendlyError(requestError, t));
      setPaymentState("failed");
      setProcessing(false);
    }
  }, [
    markSuccess,
    orderId,
    otp,
    paymentMethod,
    t,
  ]);

  const openRazorpay = useCallback(
    async (paymentSession) => {
      if (!paymentSession?.gateway_order_id) {
        throw new Error(t("razorpayUnavailable"));
      }

      if (!paymentSession?.key_id) {
        throw new Error(t("razorpayUnavailable"));
      }

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error(t("razorpayUnavailable"));
      }

      const checkoutOptions = {
        key: paymentSession.key_id,

        amount:
          Number(paymentSession.amount) * 100,

        currency:
          paymentSession.currency || "INR",

        name: "TEXVERSE",

        description:
          `${t("order")} #${orderId}`,

        order_id:
          paymentSession.gateway_order_id,

        prefill: {
          name:
            order?.contact_person ||
            order?.company_name ||
            "",

          email:
            order?.email || "",

          contact:
            order?.phone || "",
        },

        notes: {
          texverse_order_id:
            String(orderId),
        },

        theme: {
          color: "#06b6d4",
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },

        handler: async (response) => {
          try {
            setProcessing(true);
            setError("");

            const verification =
              await apiRequest(
                "/payments/verify",
                {
                  method: "POST",
                  body: JSON.stringify({
                    texverse_order_id:
                      Number(orderId),

                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            setPayment(verification);
            markSuccess();
          } catch (verificationError) {
            setError(
              getFriendlyError(
                verificationError,
                t
              )
            );

            setPaymentState("failed");
            setProcessing(false);
          }
        },
      };

      const razorpay =
        new window.Razorpay(checkoutOptions);

      razorpay.on(
        "payment.failed",
        (response) => {
          const description =
            response?.error?.description;

          setError(
            description ||
              t("paymentFailed")
          );

          setPaymentState("failed");
          setProcessing(false);
        }
      );

      razorpay.open();
    },
    [markSuccess, order, orderId, t]
  );

  const handleContinuePayment = async () => {
    if (!token) {
      setError(t("loginRequired"));
      return;
    }

    if (!orderId) {
      setError(t("orderMissing"));
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const session =
        await createPaymentSession();

      const mode = String(
        session?.mode || "demo"
      ).toLowerCase();

      if (
        mode === "razorpay" &&
        session?.key_id
      ) {
        await openRazorpay(session);
        return;
      }

      /*
        Demo mode:
        gateway/bank/terms all continue through
        the secure demo OTP verification flow.
      */
      setPayment(session);
      setPaymentState("otp");
      setProcessing(false);
    } catch (requestError) {
      setError(
        getFriendlyError(
          requestError,
          t
        )
      );

      setPaymentState("failed");
      setProcessing(false);
    }
  };

  const handleRetry = async () => {
    setError("");
    setProcessing(false);
    setOtp("");

    await fetchOrderAndPayment();
  };

  const amount = Number(
    payment?.amount ??
      order?.total ??
      pendingPayment?.total ??
      0
  );

  const currency =
    payment?.currency ||
    pendingPayment?.currency ||
    "INR";

  const paymentStatus = normalizeStatus(
    payment?.status
  );

  const isAlreadyVerified =
    paymentState === "success" ||
    payment?.verified === true ||
    paymentStatus === "verified";

  const methodLabel = useMemo(() => {
    const item = PAYMENT_METHODS.find(
      (method) => method.id === paymentMethod
    );

    if (!item) {
      return t("gateway");
    }

    return t(item.id);
  }, [paymentMethod, t]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#020617 0%,#07111f 100%)",
          color: "#e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
          dir={textDirection}
        >
          <Loader2
            size={38}
            style={{
              animation:
                "texverse-payment-spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />

          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            {t("loading")}
          </div>
        </div>

        <style>{`
          @keyframes texverse-payment-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!orderId || error && !order) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg,#020617 0%,#07111f 100%)",
          color: "#e2e8f0",
          padding: "32px 16px",
          fontFamily:
            "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
          }}
          dir={textDirection}
        >
          <Link
            to="/checkout"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#67e8f9",
              textDecoration: "none",
              fontWeight: 700,
              marginBottom: 32,
            }}
          >
            <ArrowLeft size={18} />
            {t("backToCheckout")}
          </Link>

          <div
            style={{
              background:
                "rgba(15,23,42,.92)",
              border:
                "1px solid rgba(148,163,184,.15)",
              borderRadius: 24,
              padding: 32,
              textAlign: "center",
              boxShadow:
                "0 25px 60px rgba(0,0,0,.25)",
            }}
          >
            <XCircle
              size={54}
              style={{
                color: "#fb7185",
                margin: "0 auto 18px",
              }}
            />

            <h1
              style={{
                margin: "0 0 10px",
                fontSize: 26,
              }}
            >
              {t("somethingWrong")}
            </h1>

            <p
              style={{
                color: "#94a3b8",
                margin: "0 0 24px",
              }}
            >
              {error || t("orderMissing")}
            </p>

            <button
              type="button"
              onClick={handleRetry}
              style={{
                border: 0,
                borderRadius: 12,
                padding: "12px 18px",
                background:
                  "linear-gradient(135deg,#06b6d4,#0891b2)",
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <RefreshCw size={17} />
              {t("retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#020617 0%,#07111f 55%,#020617 100%)",
        color: "#e2e8f0",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        direction: "ltr",
      }}
    >
      <header
        style={{
          borderBottom:
            "1px solid rgba(148,163,184,.12)",
          background:
            "rgba(2,6,23,.82)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding:
              "16px clamp(16px,3vw,28px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link
            to="/checkout"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#cbd5e1",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
              direction: textDirection,
            }}
          >
            <ArrowLeft size={18} />
            <span>{t("backToCheckout")}</span>
          </Link>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#67e8f9",
              fontWeight: 900,
              letterSpacing: ".04em",
            }}
          >
            <ShieldCheck size={21} />
            <span>TEXVERSE</span>
          </div>
        </div>
      </header>

      <main
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding:
            "34px clamp(16px,3vw,28px) 60px",
        }}
      >
        <div
          style={{
            marginBottom: 28,
            textAlign: isRTL ? "right" : "left",
            direction: textDirection,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 12px",
              borderRadius: 999,
              background:
                "rgba(6,182,212,.10)",
              border:
                "1px solid rgba(6,182,212,.22)",
              color: "#67e8f9",
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            <Lock size={14} />
            {t("securePayment")}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize:
                "clamp(28px,4vw,42px)",
              lineHeight: 1.1,
              letterSpacing: "-.03em",
            }}
          >
            {isAlreadyVerified
              ? t("paymentSuccessful")
              : t("title")}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              maxWidth: 700,
              margin:
                "12px 0 0",
              lineHeight: 1.7,
            }}
          >
            {isAlreadyVerified
              ? t("paymentVerified")
              : t("subtitle")}
          </p>
        </div>

        {error && (
          <div
            dir={textDirection}
            style={{
              marginBottom: 20,
              borderRadius: 14,
              padding: "13px 16px",
              background:
                "rgba(244,63,94,.10)",
              border:
                "1px solid rgba(244,63,94,.28)",
              color: "#fda4af",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <XCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {isAlreadyVerified ? (
          <section
            style={{
              maxWidth: 760,
              margin: "0 auto",
            }}
            dir={textDirection}
          >
            <div
              style={{
                background:
                  "linear-gradient(145deg,rgba(15,23,42,.96),rgba(6,78,59,.22))",
                border:
                  "1px solid rgba(52,211,153,.25)",
                borderRadius: 28,
                padding:
                  "clamp(28px,5vw,52px)",
                textAlign: "center",
                boxShadow:
                  "0 30px 80px rgba(0,0,0,.28)",
              }}
            >
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 22px",
                  background:
                    "rgba(16,185,129,.13)",
                  color: "#34d399",
                }}
              >
                <CheckCircle2 size={46} />
              </div>

              <h2
                style={{
                  margin: "0 0 10px",
                  fontSize: 30,
                }}
              >
                {t("paymentSuccessful")}
              </h2>

              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: 1.7,
                  margin:
                    "0 auto 28px",
                  maxWidth: 560,
                }}
              >
                {t("paymentVerified")}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                <div
                  style={{
                    background:
                      "rgba(15,23,42,.7)",
                    border:
                      "1px solid rgba(148,163,184,.12)",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      marginBottom: 7,
                    }}
                  >
                    {t("orderId")}
                  </div>

                  <strong>
                    #{orderId}
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "rgba(15,23,42,.7)",
                    border:
                      "1px solid rgba(148,163,184,.12)",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      marginBottom: 7,
                    }}
                  >
                    {t("total")}
                  </div>

                  <strong>
                    {formatMoney(
                      amount,
                      currency
                    )}
                  </strong>
                </div>

                <div
                  style={{
                    background:
                      "rgba(15,23,42,.7)",
                    border:
                      "1px solid rgba(148,163,184,.12)",
                    borderRadius: 16,
                    padding: 16,
                  }}
                >
                  <div
                    style={{
                      color: "#64748b",
                      fontSize: 12,
                      marginBottom: 7,
                    }}
                  >
                    {t("paymentMode")}
                  </div>

                  <strong
                    style={{
                      color: "#34d399",
                    }}
                  >
                    {t("verified")}
                  </strong>
                </div>
              </div>

              <Link
                to={`/order-confirmed?order=${orderId}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                  width: "100%",
                  maxWidth: 430,
                  padding:
                    "14px 20px",
                  borderRadius: 14,
                  background:
                    "linear-gradient(135deg,#06b6d4,#0891b2)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 900,
                  boxShadow:
                    "0 12px 30px rgba(6,182,212,.18)",
                  direction: textDirection,
                }}
              >
                <span>
                  {t("goToOrder")}
                </span>

                {isRTL ? (
                  <ArrowLeft size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </Link>

              <div
                style={{
                  marginTop: 14,
                }}
              >
                <Link
                  to="/buyer-dashboard"
                  style={{
                    color: "#94a3b8",
                    textDecoration:
                      "none",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {t("dashboard")}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1.5fr) minmax(300px,.8fr)",
              gap: 22,
              alignItems: "start",
            }}
          >
            <section
              style={{
                background:
                  "rgba(15,23,42,.88)",
                border:
                  "1px solid rgba(148,163,184,.14)",
                borderRadius: 24,
                padding:
                  "clamp(20px,4vw,30px)",
                boxShadow:
                  "0 25px 60px rgba(0,0,0,.18)",
              }}
              dir={textDirection}
            >
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 800,
                    textTransform:
                      "uppercase",
                    letterSpacing:
                      ".08em",
                    marginBottom: 8,
                  }}
                >
                  {t("order")}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 22,
                    }}
                  >
                    #{orderId}
                  </h2>

                  {order?.status && (
                    <span
                      style={{
                        padding:
                          "5px 10px",
                        borderRadius:
                          999,
                        background:
                          "rgba(6,182,212,.10)",
                        border:
                          "1px solid rgba(6,182,212,.18)",
                        color:
                          "#67e8f9",
                        fontSize: 11,
                        fontWeight: 800,
                      }}
                    >
                      {order.status}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    marginBottom: 12,
                  }}
                >
                  {t("paymentMethod")}
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 12,
                  }}
                >
                  {PAYMENT_METHODS.map(
                    (method) => {
                      const Icon =
                        method.icon;

                      const selected =
                        paymentMethod ===
                        method.id;

                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => {
                            if (!processing) {
                              setPaymentMethod(
                                method.id
                              );
                              setError("");
                              setPaymentState(
                                "pending"
                              );
                            }
                          }}
                          style={{
                            width: "100%",
                            textAlign:
                              isRTL
                                ? "right"
                                : "left",
                            border:
                              selected
                                ? "1px solid rgba(6,182,212,.55)"
                                : "1px solid rgba(148,163,184,.14)",
                            background:
                              selected
                                ? "rgba(6,182,212,.08)"
                                : "rgba(2,6,23,.35)",
                            borderRadius: 17,
                            padding:
                              "16px",
                            color: "#e2e8f0",
                            cursor:
                              processing
                                ? "not-allowed"
                                : "pointer",
                            opacity:
                              processing
                                ? 0.65
                                : 1,
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 14,
                            direction:
                              textDirection,
                          }}
                        >
                          <div
                            style={{
                              width: 42,
                              height: 42,
                              flex:
                                "0 0 42px",
                              display:
                                "grid",
                              placeItems:
                                "center",
                              borderRadius:
                                12,
                              background:
                                selected
                                  ? "rgba(6,182,212,.15)"
                                  : "rgba(148,163,184,.08)",
                              color:
                                selected
                                  ? "#67e8f9"
                                  : "#94a3b8",
                            }}
                          >
                            <Icon
                              size={21}
                            />
                          </div>

                          <div
                            style={{
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                fontWeight: 850,
                                marginBottom: 4,
                              }}
                            >
                              {t(
                                method.id
                              )}
                            </div>

                            <div
                              style={{
                                color:
                                  "#94a3b8",
                                fontSize: 13,
                                lineHeight:
                                  1.5,
                              }}
                            >
                              {t(
                                `${method.id}Desc`
                              )}
                            </div>
                          </div>

                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius:
                                "50%",
                              border:
                                selected
                                  ? "6px solid #06b6d4"
                                  : "2px solid #475569",
                              boxSizing:
                                "border-box",
                              flex:
                                "0 0 20px",
                            }}
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {paymentState === "otp" && (
                <div
                  style={{
                    border:
                      "1px solid rgba(6,182,212,.22)",
                    background:
                      "rgba(6,182,212,.06)",
                    borderRadius: 18,
                    padding: 18,
                    marginBottom: 22,
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <ShieldCheck
                      size={19}
                      style={{
                        color:
                          "#67e8f9",
                      }}
                    />

                    <strong>
                      {t("demoMode")}
                    </strong>
                  </div>

                  <p
                    style={{
                      margin:
                        "0 0 14px",
                      color:
                        "#94a3b8",
                      fontSize: 13,
                      lineHeight:
                        1.6,
                    }}
                  >
                    {paymentMethod ===
                    "bank"
                      ? t("bankDemo")
                      : paymentMethod ===
                        "terms"
                        ? t("termsDemo")
                        : t("demoText")}
                  </p>

                  <div
                    style={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 9,
                    }}
                  >
                    <label
                      htmlFor="payment-otp"
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {t(
                        "enterOtp"
                      )}
                    </label>

                    <input
                      id="payment-otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otp}
                      onChange={(event) => {
                        const value =
                          event.target.value
                            .replace(
                              /\D/g,
                              ""
                            )
                            .slice(
                              0,
                              6
                            );

                        setOtp(value);
                        setError("");
                      }}
                      placeholder={t(
                        "otpPlaceholder"
                      )}
                      dir="ltr"
                      style={{
                        width: "100%",
                        boxSizing:
                          "border-box",
                        border:
                          "1px solid rgba(148,163,184,.20)",
                        background:
                          "rgba(2,6,23,.65)",
                        color:
                          "#f8fafc",
                        borderRadius:
                          12,
                        padding:
                          "13px 14px",
                        outline:
                          "none",
                        fontSize: 18,
                        fontWeight: 800,
                        letterSpacing:
                          ".25em",
                      }}
                    />

                    <div
                      style={{
                        color:
                          "#67e8f9",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {t(
                        "demoOtpHint"
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={
                        processing ||
                        otp.length !==
                          6
                      }
                      onClick={
                        verifyDemoPayment
                      }
                      style={{
                        marginTop: 4,
                        border: 0,
                        borderRadius:
                          12,
                        padding:
                          "13px 16px",
                        background:
                          "linear-gradient(135deg,#06b6d4,#0891b2)",
                        color: "#fff",
                        fontWeight: 900,
                        cursor:
                          processing ||
                          otp.length !==
                            6
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          processing ||
                          otp.length !==
                            6
                            ? 0.5
                            : 1,
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        gap: 8,
                      }}
                    >
                      {processing ? (
                        <Loader2
                          size={18}
                          style={{
                            animation:
                              "texverse-payment-spin 1s linear infinite",
                          }}
                        />
                      ) : (
                        <Check
                          size={18}
                        />
                      )}

                      {processing
                        ? t(
                            "processing"
                          )
                        : t(
                            "verifyPayment"
                          )}
                    </button>
                  </div>
                </div>
              )}

              {paymentState !== "otp" && (
                <button
                  type="button"
                  disabled={processing}
                  onClick={
                    handleContinuePayment
                  }
                  style={{
                    width: "100%",
                    border: 0,
                    borderRadius: 14,
                    padding:
                      "15px 18px",
                    background:
                      "linear-gradient(135deg,#06b6d4,#0891b2)",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 15,
                    cursor:
                      processing
                        ? "not-allowed"
                        : "pointer",
                    opacity:
                      processing
                        ? 0.65
                        : 1,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    gap: 9,
                    direction:
                      textDirection,
                    boxShadow:
                      "0 14px 35px rgba(6,182,212,.15)",
                  }}
                >
                  {processing ? (
                    <Loader2
                      size={19}
                      style={{
                        animation:
                          "texverse-payment-spin 1s linear infinite",
                      }}
                    />
                  ) : (
                    <Lock size={18} />
                  )}

                  <span>
                    {processing
                      ? t("processing")
                      : paymentMethod ===
                        "gateway"
                        ? t("payNow")
                        : t(
                            "createPayment"
                          )}
                  </span>
                </button>
              )}

              <div
                style={{
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  gap: 7,
                  color:
                    "#64748b",
                  fontSize: 12,
                  marginTop: 16,
                  textAlign:
                    "center",
                  lineHeight:
                    1.5,
                }}
              >
                <Lock size={13} />
                <span>
                  {t(
                    "secureText"
                  )}
                </span>
              </div>
            </section>

            <aside
              style={{
                background:
                  "rgba(15,23,42,.72)",
                border:
                  "1px solid rgba(148,163,184,.14)",
                borderRadius: 24,
                padding: 24,
                position:
                  "sticky",
                top: 20,
              }}
              dir={textDirection}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  fontWeight: 800,
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    ".08em",
                  marginBottom: 15,
                }}
              >
                {t("order")}
              </div>

              <div
                style={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                  }}
                >
                  #{orderId}
                </span>

                <span
                  style={{
                    color:
                      "#67e8f9",
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  {order?.status ||
                    t("pending")}
                </span>
              </div>

              <div
                style={{
                  borderTop:
                    "1px solid rgba(148,163,184,.12)",
                  paddingTop: 18,
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap: 15,
                    marginBottom: 12,
                    color:
                      "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  <span>
                    {t("method")}
                  </span>

                  <strong
                    style={{
                      color:
                        "#e2e8f0",
                    }}
                  >
                    {methodLabel}
                  </strong>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    gap: 15,
                    marginTop: 18,
                    paddingTop: 18,
                    borderTop:
                      "1px solid rgba(148,163,184,.12)",
                  }}
                >
                  <span
                    style={{
                      color:
                        "#94a3b8",
                      fontSize: 14,
                    }}
                  >
                    {t("total")}
                  </span>

                  <strong
                    style={{
                      fontSize: 21,
                      color:
                        "#f8fafc",
                    }}
                  >
                    {formatMoney(
                      amount,
                      currency
                    )}
                  </strong>
                </div>
              </div>

              {order?.company_name && (
                <div
                  style={{
                    marginTop: 22,
                    paddingTop: 20,
                    borderTop:
                      "1px solid rgba(148,163,184,.12)",
                  }}
                >
                  <div
                    style={{
                      color:
                        "#64748b",
                      fontSize: 12,
                      marginBottom: 7,
                    }}
                  >
                    {order.company_name}
                  </div>

                  {order.contact_person && (
                    <div
                      style={{
                        fontSize: 13,
                        color:
                          "#cbd5e1",
                      }}
                    >
                      {
                        order.contact_person
                      }
                    </div>
                  )}

                  {order.email && (
                    <div
                      style={{
                        fontSize: 13,
                        color:
                          "#94a3b8",
                        marginTop: 4,
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {order.email}
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  marginTop: 22,
                  padding: 14,
                  borderRadius: 14,
                  background:
                    "rgba(16,185,129,.06)",
                  border:
                    "1px solid rgba(16,185,129,.15)",
                  display:
                    "flex",
                  gap: 10,
                  alignItems:
                    "flex-start",
                }}
              >
                <ShieldCheck
                  size={18}
                  style={{
                    color:
                      "#34d399",
                    flex:
                      "0 0 auto",
                  }}
                />

                <div
                  style={{
                    color:
                      "#94a3b8",
                    fontSize: 12,
                    lineHeight:
                      1.55,
                  }}
                >
                  {t(
                    "secureText"
                  )}
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  textAlign:
                    "center",
                }}
              >
                <Link
                  to="/checkout"
                  style={{
                    color:
                      "#94a3b8",
                    textDecoration:
                      "none",
                    fontSize: 13,
                    fontWeight: 700,
                    display:
                      "inline-flex",
                    alignItems:
                      "center",
                    gap: 7,
                    direction:
                      textDirection,
                  }}
                >
                  {isRTL ? (
                    <ArrowRight
                      size={15}
                    />
                  ) : (
                    <ArrowLeft
                      size={15}
                    />
                  )}

                  <span>
                    {t(
                      "backToCheckout"
                    )}
                  </span>
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>

      <style>{`
        @keyframes texverse-payment-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 860px) {
          main > div {
            grid-template-columns: 1fr !important;
          }

          main aside {
            position: static !important;
          }
        }

        @media (max-width: 520px) {
          header > div {
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
        }

        button,
        a,
        input {
          -webkit-tap-highlight-color: transparent;
        }

        input:focus {
          border-color: rgba(6,182,212,.65) !important;
          box-shadow: 0 0 0 3px rgba(6,182,212,.10);
        }
      `}</style>
    </div>
  );
}
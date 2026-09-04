import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Truck,
  Building2,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { orderApi } from "../services/api";
import { getImageUrl } from "../utils/image";

const LANGUAGE_CODES = [
  "en",
  "hi",
  "bn",
  "te",
  "mr",
  "ta",
  "gu",
  "kn",
  "ml",
  "pa",
  "ur",
  "or",
  "as",
  "ne",
  "sa",
  "kok",
  "mai",
  "ks",
  "sd",
  "doi",
  "mni",
  "brx",
  "sat",
  "es",
  "fr",
  "de",
  "ar",
  "zh",
  "ja",
  "ko",
  "pt",
  "it",
  "ru",
  "tr",
];

const RTL_LANGUAGES = new Set(["ur", "ks", "sd", "ar"]);

const TRANSLATIONS = {
  en: {
    checkout: "Checkout",
    completeOrder: "Complete your sourcing order",
    details: "Details",
    payment: "Payment",
    fulfillment: "Fulfillment",
    buyerShipping: "Buyer & shipping details",
    buyerShippingDesc:
      "Used for supplier coordination and delivery.",
    companyName: "Company Name",
    contactPerson: "Contact Person",
    businessEmail: "Business Email",
    phoneNumber: "Phone Number",
    shippingAddress: "Complete shipping address",
    paymentMethod: "Payment method",
    paymentMethodDesc:
      "Choose how you want to complete this B2B purchase.",
    onlinePayment: "Online payment",
    onlinePaymentDesc: "UPI / Card / Net Banking",
    bankTransfer: "Bank transfer",
    bankTransferDesc: "B2B purchase order",
    businessTerms: "Business terms",
    businessTermsDesc: "Net terms if approved",
    securePayment: "Secure payment",
    verifiedPayment:
      "Payment is verified server-side before confirmation.",
    orderReview: "Order review",
    qty: "Qty",
    total: "Total",
    continuePayment: "Continue to Payment",
    creatingOrder: "Creating secure order...",
    backendValidated: "Order data validated by backend",
    emptyCart: "Your cart is empty",
    browseMarketplace: "Browse Marketplace",
    noPaymentSuccess:
      "No payment is marked successful until the payment service verifies the transaction.",
    loginRequired:
      "Please sign in before continuing with checkout.",
    genericError:
      "We could not create your order. Please try again.",
    stockError:
      "One or more products are no longer available in the requested quantity.",
    invalidCart:
      "Your cart contains an invalid product. Please return to the marketplace.",
    paymentChoiceRequired:
      "Please select a payment method.",
    orderCreated:
      "Your order has been created securely.",
    continue:
      "Continue",
  },

  hi: {
    checkout: "चेकआउट",
    completeOrder: "अपना सोर्सिंग ऑर्डर पूरा करें",
    details: "विवरण",
    payment: "भुगतान",
    fulfillment: "डिलीवरी",
    buyerShipping: "खरीदार और शिपिंग विवरण",
    buyerShippingDesc:
      "इन विवरणों का उपयोग सप्लायर समन्वय और डिलीवरी के लिए किया जाएगा।",
    companyName: "कंपनी का नाम",
    contactPerson: "संपर्क व्यक्ति",
    businessEmail: "बिज़नेस ईमेल",
    phoneNumber: "फोन नंबर",
    shippingAddress: "पूरा शिपिंग पता",
    paymentMethod: "भुगतान का तरीका",
    paymentMethodDesc:
      "इस B2B खरीदारी को पूरा करने का तरीका चुनें।",
    onlinePayment: "ऑनलाइन भुगतान",
    onlinePaymentDesc: "UPI / कार्ड / नेट बैंकिंग",
    bankTransfer: "बैंक ट्रांसफर",
    bankTransferDesc: "B2B खरीद ऑर्डर",
    businessTerms: "बिज़नेस टर्म्स",
    businessTermsDesc: "अनुमोदन होने पर नेट टर्म्स",
    securePayment: "सुरक्षित भुगतान",
    verifiedPayment:
      "कन्फर्मेशन से पहले भुगतान सर्वर पर सत्यापित किया जाता है।",
    orderReview: "ऑर्डर समीक्षा",
    qty: "मात्रा",
    total: "कुल",
    continuePayment: "भुगतान पर जाएँ",
    creatingOrder: "सुरक्षित ऑर्डर बनाया जा रहा है...",
    backendValidated: "ऑर्डर डेटा बैकएंड द्वारा सत्यापित",
    emptyCart: "आपकी कार्ट खाली है",
    browseMarketplace: "मार्केटप्लेस देखें",
    noPaymentSuccess:
      "पेमेंट सेवा द्वारा सत्यापन होने तक भुगतान सफल नहीं माना जाएगा।",
    loginRequired:
      "चेकआउट जारी रखने के लिए कृपया साइन इन करें।",
    genericError:
      "ऑर्डर बनाया नहीं जा सका। कृपया दोबारा प्रयास करें।",
    stockError:
      "एक या अधिक उत्पाद मांगी गई मात्रा में उपलब्ध नहीं हैं।",
    invalidCart:
      "आपकी कार्ट में अमान्य उत्पाद है। कृपया मार्केटप्लेस पर वापस जाएँ।",
    paymentChoiceRequired:
      "कृपया भुगतान का तरीका चुनें।",
    orderCreated:
      "आपका ऑर्डर सुरक्षित रूप से बनाया गया है।",
    continue: "जारी रखें",
  },

  bn: {
    checkout: "চেকআউট",
    completeOrder: "আপনার সোর্সিং অর্ডার সম্পূর্ণ করুন",
    details: "বিবরণ",
    payment: "পেমেন্ট",
    fulfillment: "ফুলফিলমেন্ট",
    buyerShipping: "ক্রেতা ও শিপিং বিবরণ",
    buyerShippingDesc: "সরবরাহকারী সমন্বয় ও ডেলিভারির জন্য ব্যবহৃত হবে।",
    companyName: "কোম্পানির নাম",
    contactPerson: "যোগাযোগের ব্যক্তি",
    businessEmail: "ব্যবসায়িক ইমেল",
    phoneNumber: "ফোন নম্বর",
    shippingAddress: "সম্পূর্ণ শিপিং ঠিকানা",
    paymentMethod: "পেমেন্ট পদ্ধতি",
    paymentMethodDesc: "এই B2B ক্রয় সম্পূর্ণ করার পদ্ধতি নির্বাচন করুন।",
    onlinePayment: "অনলাইন পেমেন্ট",
    onlinePaymentDesc: "UPI / কার্ড / নেট ব্যাংকিং",
    bankTransfer: "ব্যাংক ট্রান্সফার",
    bankTransferDesc: "B2B ক্রয় অর্ডার",
    businessTerms: "ব্যবসায়িক শর্ত",
    businessTermsDesc: "অনুমোদিত হলে নেট টার্মস",
    securePayment: "নিরাপদ পেমেন্ট",
    verifiedPayment: "কনফার্মেশনের আগে সার্ভারে পেমেন্ট যাচাই করা হয়।",
    orderReview: "অর্ডার পর্যালোচনা",
    qty: "পরিমাণ",
    total: "মোট",
    continuePayment: "পেমেন্টে যান",
    creatingOrder: "নিরাপদ অর্ডার তৈরি হচ্ছে...",
    backendValidated: "ব্যাকএন্ড দ্বারা অর্ডার ডেটা যাচাই করা হয়েছে",
    emptyCart: "আপনার কার্ট খালি",
    browseMarketplace: "মার্কেটপ্লেস দেখুন",
    noPaymentSuccess: "পেমেন্ট যাচাই না হওয়া পর্যন্ত সফল বলে গণ্য হবে না।",
    loginRequired: "চেকআউট চালিয়ে যেতে সাইন ইন করুন।",
    genericError: "অর্ডার তৈরি করা যায়নি। আবার চেষ্টা করুন।",
    stockError: "এক বা একাধিক পণ্য অনুরোধকৃত পরিমাণে নেই।",
    invalidCart: "কার্টে অবৈধ পণ্য আছে। মার্কেটপ্লেসে ফিরে যান।",
    paymentChoiceRequired: "একটি পেমেন্ট পদ্ধতি নির্বাচন করুন।",
    orderCreated: "আপনার অর্ডার নিরাপদে তৈরি হয়েছে।",
    continue: "চালিয়ে যান",
  },

  te: {
    checkout: "చెక్‌అవుట్",
    completeOrder: "మీ సోర్సింగ్ ఆర్డర్‌ను పూర్తి చేయండి",
    details: "వివరాలు",
    payment: "చెల్లింపు",
    fulfillment: "డెలివరీ",
    buyerShipping: "కొనుగోలుదారు & షిప్పింగ్ వివరాలు",
    buyerShippingDesc: "సప్లయర్ సమన్వయం మరియు డెలివరీ కోసం ఉపయోగించబడుతుంది.",
    companyName: "కంపెనీ పేరు",
    contactPerson: "సంప్రదింపు వ్యక్తి",
    businessEmail: "బిజినెస్ ఇమెయిల్",
    phoneNumber: "ఫోన్ నంబర్",
    shippingAddress: "పూర్తి షిప్పింగ్ చిరునామా",
    paymentMethod: "చెల్లింపు విధానం",
    paymentMethodDesc: "ఈ B2B కొనుగోలును పూర్తి చేసే విధానాన్ని ఎంచుకోండి.",
    onlinePayment: "ఆన్‌లైన్ చెల్లింపు",
    onlinePaymentDesc: "UPI / కార్డ్ / నెట్ బ్యాంకింగ్",
    bankTransfer: "బ్యాంక్ ట్రాన్స్‌ఫర్",
    bankTransferDesc: "B2B కొనుగోలు ఆర్డర్",
    businessTerms: "బిజినెస్ నిబంధనలు",
    businessTermsDesc: "ఆమోదం ఉంటే నెట్ టర్మ్స్",
    securePayment: "సురక్షిత చెల్లింపు",
    verifiedPayment: "కన్ఫర్మేషన్‌కు ముందు చెల్లింపు సర్వర్‌లో ధృవీకరించబడుతుంది.",
    orderReview: "ఆర్డర్ సమీక్ష",
    qty: "పరిమాణం",
    total: "మొత్తం",
    continuePayment: "చెల్లింపుకు వెళ్లండి",
    creatingOrder: "సురక్షిత ఆర్డర్ సృష్టిస్తోంది...",
    backendValidated: "బ్యాకెండ్ ద్వారా ఆర్డర్ డేటా ధృవీకరించబడింది",
    emptyCart: "మీ కార్ట్ ఖాళీగా ఉంది",
    browseMarketplace: "మార్కెట్‌ప్లేస్ చూడండి",
    noPaymentSuccess: "చెల్లింపు ధృవీకరించబడే వరకు విజయవంతంగా పరిగణించబడదు.",
    loginRequired: "చెక్‌అవుట్ కొనసాగించడానికి సైన్ ఇన్ చేయండి.",
    genericError: "ఆర్డర్ సృష్టించలేకపోయాం. మళ్లీ ప్రయత్నించండి.",
    stockError: "ఒకటి లేదా అంతకంటే ఎక్కువ ఉత్పత్తులు కోరిన పరిమాణంలో లేవు.",
    invalidCart: "కార్ట్‌లో చెల్లని ఉత్పత్తి ఉంది. మార్కెట్‌ప్లేస్‌కు తిరిగి వెళ్లండి.",
    paymentChoiceRequired: "చెల్లింపు విధానాన్ని ఎంచుకోండి.",
    orderCreated: "మీ ఆర్డర్ సురక్షితంగా సృష్టించబడింది.",
    continue: "కొనసాగించండి",
  },

  mr: {
    checkout: "चेकआउट",
    completeOrder: "तुमची सोर्सिंग ऑर्डर पूर्ण करा",
    details: "तपशील",
    payment: "पेमेंट",
    fulfillment: "डिलिव्हरी",
    buyerShipping: "खरेदीदार आणि शिपिंग तपशील",
    buyerShippingDesc: "पुरवठादार समन्वय आणि डिलिव्हरीसाठी वापरले जाईल.",
    companyName: "कंपनीचे नाव",
    contactPerson: "संपर्क व्यक्ती",
    businessEmail: "व्यवसाय ईमेल",
    phoneNumber: "फोन नंबर",
    shippingAddress: "पूर्ण शिपिंग पत्ता",
    paymentMethod: "पेमेंट पद्धत",
    paymentMethodDesc: "ही B2B खरेदी पूर्ण करण्याची पद्धत निवडा.",
    onlinePayment: "ऑनलाइन पेमेंट",
    onlinePaymentDesc: "UPI / कार्ड / नेट बँकिंग",
    bankTransfer: "बँक ट्रान्सफर",
    bankTransferDesc: "B2B खरेदी ऑर्डर",
    businessTerms: "व्यवसाय अटी",
    businessTermsDesc: "मंजुरी असल्यास नेट टर्म्स",
    securePayment: "सुरक्षित पेमेंट",
    verifiedPayment: "कन्फर्मेशनपूर्वी पेमेंट सर्व्हरवर पडताळले जाते.",
    orderReview: "ऑर्डर पुनरावलोकन",
    qty: "प्रमाण",
    total: "एकूण",
    continuePayment: "पेमेंटकडे जा",
    creatingOrder: "सुरक्षित ऑर्डर तयार होत आहे...",
    backendValidated: "बॅकएंडद्वारे ऑर्डर डेटा पडताळला",
    emptyCart: "तुमची कार्ट रिकामी आहे",
    browseMarketplace: "मार्केटप्लेस पहा",
    noPaymentSuccess: "पेमेंट पडताळले जाईपर्यंत यशस्वी मानले जाणार नाही.",
    loginRequired: "चेकआउट सुरू ठेवण्यासाठी साइन इन करा.",
    genericError: "ऑर्डर तयार करता आली नाही. पुन्हा प्रयत्न करा.",
    stockError: "एक किंवा अधिक उत्पादने मागितलेल्या प्रमाणात उपलब्ध नाहीत.",
    invalidCart: "कार्टमध्ये अवैध उत्पादन आहे. मार्केटप्लेसवर परत जा.",
    paymentChoiceRequired: "पेमेंट पद्धत निवडा.",
    orderCreated: "तुमची ऑर्डर सुरक्षितपणे तयार झाली आहे.",
    continue: "पुढे चला",
  },

  ta: {
    checkout: "செக்அவுட்",
    completeOrder: "உங்கள் கொள்முதல் ஆர்டரை முடிக்கவும்",
    details: "விவரங்கள்",
    payment: "கட்டணம்",
    fulfillment: "டெலிவரி",
    buyerShipping: "வாங்குபவர் மற்றும் ஷிப்பிங் விவரங்கள்",
    buyerShippingDesc: "சப்ளையர் ஒருங்கிணைப்பு மற்றும் டெலிவரிக்காக பயன்படுத்தப்படும்.",
    companyName: "நிறுவனத்தின் பெயர்",
    contactPerson: "தொடர்பு நபர்",
    businessEmail: "வணிக மின்னஞ்சல்",
    phoneNumber: "தொலைபேசி எண்",
    shippingAddress: "முழு ஷிப்பிங் முகவரி",
    paymentMethod: "கட்டண முறை",
    paymentMethodDesc: "இந்த B2B கொள்முதலை முடிக்கும் முறையைத் தேர்ந்தெடுக்கவும்.",
    onlinePayment: "ஆன்லைன் கட்டணம்",
    onlinePaymentDesc: "UPI / கார்டு / நெட் பேங்கிங்",
    bankTransfer: "வங்கி பரிமாற்றம்",
    bankTransferDesc: "B2B கொள்முதல் ஆர்டர்",
    businessTerms: "வணிக விதிமுறைகள்",
    businessTermsDesc: "அனுமதி இருந்தால் நெட் டெர்ம்ஸ்",
    securePayment: "பாதுகாப்பான கட்டணம்",
    verifiedPayment: "உறுதிப்படுத்துவதற்கு முன் கட்டணம் சர்வரில் சரிபார்க்கப்படும்.",
    orderReview: "ஆர்டர் மதிப்பாய்வு",
    qty: "அளவு",
    total: "மொத்தம்",
    continuePayment: "கட்டணத்திற்குச் செல்லவும்",
    creatingOrder: "பாதுகாப்பான ஆர்டர் உருவாக்கப்படுகிறது...",
    backendValidated: "பின்புற அமைப்பால் ஆர்டர் தரவு சரிபார்க்கப்பட்டது",
    emptyCart: "உங்கள் கார்ட் காலியாக உள்ளது",
    browseMarketplace: "மார்க்கெட்பிளேஸைப் பார்க்கவும்",
    noPaymentSuccess: "கட்டணம் சரிபார்க்கப்படும் வரை வெற்றிகரமாகக் கருதப்படாது.",
    loginRequired: "செக்அவுட் தொடர உள்நுழையவும்.",
    genericError: "ஆர்டர் உருவாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    stockError: "ஒன்று அல்லது அதற்கு மேற்பட்ட பொருட்கள் தேவையான அளவில் இல்லை.",
    invalidCart: "கார்ட்டில் தவறான பொருள் உள்ளது. மார்க்கெட்பிளேஸுக்குத் திரும்பவும்.",
    paymentChoiceRequired: "கட்டண முறையைத் தேர்ந்தெடுக்கவும்.",
    orderCreated: "உங்கள் ஆர்டர் பாதுகாப்பாக உருவாக்கப்பட்டது.",
    continue: "தொடரவும்",
  },

  gu: {
    checkout: "ચેકઆઉટ",
    completeOrder: "તમારો સોર્સિંગ ઓર્ડર પૂર્ણ કરો",
    details: "વિગતો",
    payment: "ચુકવણી",
    fulfillment: "ડિલિવરી",
    buyerShipping: "ખરીદદાર અને શિપિંગ વિગતો",
    buyerShippingDesc: "સપ્લાયર સંકલન અને ડિલિવરી માટે ઉપયોગમાં આવશે.",
    companyName: "કંપનીનું નામ",
    contactPerson: "સંપર્ક વ્યક્તિ",
    businessEmail: "બિઝનેસ ઈમેલ",
    phoneNumber: "ફોન નંબર",
    shippingAddress: "પૂર્ણ શિપિંગ સરનામું",
    paymentMethod: "ચુકવણી પદ્ધતિ",
    paymentMethodDesc: "આ B2B ખરીદી પૂર્ણ કરવાની રીત પસંદ કરો.",
    onlinePayment: "ઓનલાઈન ચુકવણી",
    onlinePaymentDesc: "UPI / કાર્ડ / નેટ બેંકિંગ",
    bankTransfer: "બેંક ટ્રાન્સફર",
    bankTransferDesc: "B2B ખરીદી ઓર્ડર",
    businessTerms: "વ્યવસાયિક શરતો",
    businessTermsDesc: "મંજૂરી હોય તો નેટ ટર્મ્સ",
    securePayment: "સુરક્ષિત ચુકવણી",
    verifiedPayment: "કન્ફર્મેશન પહેલાં ચુકવણી સર્વર પર ચકાસવામાં આવે છે.",
    orderReview: "ઓર્ડર સમીક્ષા",
    qty: "જથ્થો",
    total: "કુલ",
    continuePayment: "ચુકવણી પર જાઓ",
    creatingOrder: "સુરક્ષિત ઓર્ડર બનાવાઈ રહ્યો છે...",
    backendValidated: "બેકએન્ડ દ્વારા ઓર્ડર ડેટા ચકાસાયેલ",
    emptyCart: "તમારી કાર્ટ ખાલી છે",
    browseMarketplace: "માર્કેટપ્લેસ જુઓ",
    noPaymentSuccess: "ચુકવણી ચકાસાય ત્યાં સુધી સફળ માનવામાં આવશે નહીં.",
    loginRequired: "ચેકઆઉટ ચાલુ રાખવા સાઇન ઇન કરો.",
    genericError: "ઓર્ડર બનાવી શક્યા નથી. ફરી પ્રયાસ કરો.",
    stockError: "એક અથવા વધુ ઉત્પાદનો માંગેલી માત્રામાં ઉપલબ્ધ નથી.",
    invalidCart: "કાર્ટમાં અમાન્ય ઉત્પાદન છે. માર્કેટપ્લેસ પર પાછા જાઓ.",
    paymentChoiceRequired: "ચુકવણી પદ્ધતિ પસંદ કરો.",
    orderCreated: "તમારો ઓર્ડર સુરક્ષિત રીતે બનાવવામાં આવ્યો છે.",
    continue: "ચાલુ રાખો",
  },

  kn: {
    checkout: "ಚೆಕ್‌ಔಟ್",
    completeOrder: "ನಿಮ್ಮ ಸೋರ್ಸಿಂಗ್ ಆರ್ಡರ್ ಪೂರ್ಣಗೊಳಿಸಿ",
    details: "ವಿವರಗಳು",
    payment: "ಪಾವತಿ",
    fulfillment: "ವಿತರಣೆ",
    buyerShipping: "ಖರೀದಿದಾರ ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ವಿವರಗಳು",
    buyerShippingDesc: "ಪೂರೈಕೆದಾರ ಸಮನ್ವಯ ಮತ್ತು ವಿತರಣೆಗೆ ಬಳಸಲಾಗುತ್ತದೆ.",
    companyName: "ಕಂಪನಿ ಹೆಸರು",
    contactPerson: "ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ",
    businessEmail: "ವ್ಯಾಪಾರ ಇಮೇಲ್",
    phoneNumber: "ಫೋನ್ ಸಂಖ್ಯೆ",
    shippingAddress: "ಸಂಪೂರ್ಣ ಶಿಪ್ಪಿಂಗ್ ವಿಳಾಸ",
    paymentMethod: "ಪಾವತಿ ವಿಧಾನ",
    paymentMethodDesc: "ಈ B2B ಖರೀದಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸುವ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    onlinePayment: "ಆನ್‌ಲೈನ್ ಪಾವತಿ",
    onlinePaymentDesc: "UPI / ಕಾರ್ಡ್ / ನೆಟ್ ಬ್ಯಾಂಕಿಂಗ್",
    bankTransfer: "ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ",
    bankTransferDesc: "B2B ಖರೀದಿ ಆರ್ಡರ್",
    businessTerms: "ವ್ಯಾಪಾರ ನಿಯಮಗಳು",
    businessTermsDesc: "ಅನುಮೋದನೆ ಇದ್ದರೆ ನೆಟ್ ಟರ್ಮ್ಸ್",
    securePayment: "ಸುರಕ್ಷಿತ ಪಾವತಿ",
    verifiedPayment: "ದೃಢೀಕರಣಕ್ಕೂ ಮೊದಲು ಪಾವತಿಯನ್ನು ಸರ್ವರ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
    orderReview: "ಆರ್ಡರ್ ಪರಿಶೀಲನೆ",
    qty: "ಪ್ರಮಾಣ",
    total: "ಒಟ್ಟು",
    continuePayment: "ಪಾವತಿಗೆ ಮುಂದುವರಿಯಿರಿ",
    creatingOrder: "ಸುರಕ್ಷಿತ ಆರ್ಡರ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
    backendValidated: "ಬ್ಯಾಕೆಂಡ್ ಮೂಲಕ ಆರ್ಡರ್ ಡೇಟಾ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    emptyCart: "ನಿಮ್ಮ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
    browseMarketplace: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ನೋಡಿ",
    noPaymentSuccess: "ಪಾವತಿ ಪರಿಶೀಲನೆಯಾಗುವವರೆಗೆ ಯಶಸ್ವಿಯಾಗಿದೆ ಎಂದು ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ.",
    loginRequired: "ಚೆಕ್‌ಔಟ್ ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    genericError: "ಆರ್ಡರ್ ರಚಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    stockError: "ಒಂದು ಅಥವಾ ಹೆಚ್ಚು ಉತ್ಪನ್ನಗಳು ಕೇಳಿದ ಪ್ರಮಾಣದಲ್ಲಿ ಲಭ್ಯವಿಲ್ಲ.",
    invalidCart: "ಕಾರ್ಟ್‌ನಲ್ಲಿ ಅಮಾನ್ಯ ಉತ್ಪನ್ನವಿದೆ. ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್‌ಗೆ ಹಿಂತಿರುಗಿ.",
    paymentChoiceRequired: "ಪಾವತಿ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    orderCreated: "ನಿಮ್ಮ ಆರ್ಡರ್ ಸುರಕ್ಷಿತವಾಗಿ ರಚಿಸಲಾಗಿದೆ.",
    continue: "ಮುಂದುವರಿಸಿ",
  },

  ml: {
    checkout: "ചെക്ക്ഔട്ട്",
    completeOrder: "നിങ്ങളുടെ സോഴ്‌സിംഗ് ഓർഡർ പൂർത്തിയാക്കുക",
    details: "വിശദാംശങ്ങൾ",
    payment: "പേയ്മെന്റ്",
    fulfillment: "ഡെലിവറി",
    buyerShipping: "വാങ്ങുന്നയാളുടെയും ഷിപ്പിംഗിന്റെയും വിവരങ്ങൾ",
    buyerShippingDesc: "സപ്ലയർ ഏകോപനത്തിനും ഡെലിവറിക്കും ഉപയോഗിക്കും.",
    companyName: "കമ്പനിയുടെ പേര്",
    contactPerson: "ബന്ധപ്പെടേണ്ട വ്യക്തി",
    businessEmail: "ബിസിനസ് ഇമെയിൽ",
    phoneNumber: "ഫോൺ നമ്പർ",
    shippingAddress: "പൂർണ്ണ ഷിപ്പിംഗ് വിലാസം",
    paymentMethod: "പേയ്മെന്റ് രീതി",
    paymentMethodDesc: "ഈ B2B വാങ്ങൽ പൂർത്തിയാക്കാനുള്ള രീതി തിരഞ്ഞെടുക്കുക.",
    onlinePayment: "ഓൺലൈൻ പേയ്മെന്റ്",
    onlinePaymentDesc: "UPI / കാർഡ് / നെറ്റ് ബാങ്കിംഗ്",
    bankTransfer: "ബാങ്ക് ട്രാൻസ്ഫർ",
    bankTransferDesc: "B2B വാങ്ങൽ ഓർഡർ",
    businessTerms: "ബിസിനസ് നിബന്ധനകൾ",
    businessTermsDesc: "അംഗീകാരം ലഭിച്ചാൽ നെറ്റ് ടേംസ്",
    securePayment: "സുരക്ഷിത പേയ്മെന്റ്",
    verifiedPayment: "സ്ഥിരീകരണത്തിന് മുമ്പ് പേയ്മെന്റ് സെർവറിൽ പരിശോധിക്കും.",
    orderReview: "ഓർഡർ അവലോകനം",
    qty: "അളവ്",
    total: "ആകെ",
    continuePayment: "പേയ്മെന്റിലേക്ക് പോകുക",
    creatingOrder: "സുരക്ഷിത ഓർഡർ സൃഷ്ടിക്കുന്നു...",
    backendValidated: "ബാക്കെൻഡ് ഓർഡർ ഡാറ്റ പരിശോധിച്ചു",
    emptyCart: "നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്",
    browseMarketplace: "മാർക്കറ്റ്പ്ലേസ് കാണുക",
    noPaymentSuccess: "പേയ്മെന്റ് പരിശോധിക്കുന്നതുവരെ വിജയിച്ചതായി കണക്കാക്കില്ല.",
    loginRequired: "ചെക്ക്ഔട്ട് തുടരാൻ സൈൻ ഇൻ ചെയ്യുക.",
    genericError: "ഓർഡർ സൃഷ്ടിക്കാൻ കഴിഞ്ഞില്ല. വീണ്ടും ശ്രമിക്കുക.",
    stockError: "ഒന്നോ അതിലധികമോ ഉൽപ്പന്നങ്ങൾ ആവശ്യപ്പെട്ട അളവിൽ ലഭ്യമല്ല.",
    invalidCart: "കാർട്ടിൽ അസാധുവായ ഉൽപ്പന്നമുണ്ട്. മാർക്കറ്റ്പ്ലേസിലേക്ക് മടങ്ങുക.",
    paymentChoiceRequired: "പേയ്മെന്റ് രീതി തിരഞ്ഞെടുക്കുക.",
    orderCreated: "നിങ്ങളുടെ ഓർഡർ സുരക്ഷിതമായി സൃഷ്ടിച്ചു.",
    continue: "തുടരുക",
  },

  pa: {
    checkout: "ਚੈੱਕਆਉਟ",
    completeOrder: "ਆਪਣਾ ਸੋਰਸਿੰਗ ਆਰਡਰ ਪੂਰਾ ਕਰੋ",
    details: "ਵੇਰਵੇ",
    payment: "ਭੁਗਤਾਨ",
    fulfillment: "ਡਿਲਿਵਰੀ",
    buyerShipping: "ਖਰੀਦਦਾਰ ਅਤੇ ਸ਼ਿਪਿੰਗ ਵੇਰਵੇ",
    buyerShippingDesc: "ਸਪਲਾਇਰ ਕੋਆਰਡੀਨੇਸ਼ਨ ਅਤੇ ਡਿਲਿਵਰੀ ਲਈ ਵਰਤੇ ਜਾਣਗੇ।",
    companyName: "ਕੰਪਨੀ ਦਾ ਨਾਮ",
    contactPerson: "ਸੰਪਰਕ ਵਿਅਕਤੀ",
    businessEmail: "ਕਾਰੋਬਾਰੀ ਈਮੇਲ",
    phoneNumber: "ਫੋਨ ਨੰਬਰ",
    shippingAddress: "ਪੂਰਾ ਸ਼ਿਪਿੰਗ ਪਤਾ",
    paymentMethod: "ਭੁਗਤਾਨ ਵਿਧੀ",
    paymentMethodDesc: "ਇਸ B2B ਖਰੀਦ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦਾ ਤਰੀਕਾ ਚੁਣੋ।",
    onlinePayment: "ਆਨਲਾਈਨ ਭੁਗਤਾਨ",
    onlinePaymentDesc: "UPI / ਕਾਰਡ / ਨੈੱਟ ਬੈਂਕਿੰਗ",
    bankTransfer: "ਬੈਂਕ ਟ੍ਰਾਂਸਫਰ",
    bankTransferDesc: "B2B ਖਰੀਦ ਆਰਡਰ",
    businessTerms: "ਵਪਾਰਕ ਸ਼ਰਤਾਂ",
    businessTermsDesc: "ਮਨਜ਼ੂਰੀ ਹੋਣ 'ਤੇ ਨੈੱਟ ਟਰਮਜ਼",
    securePayment: "ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ",
    verifiedPayment: "ਪੁਸ਼ਟੀ ਤੋਂ ਪਹਿਲਾਂ ਭੁਗਤਾਨ ਸਰਵਰ 'ਤੇ ਤਸਦੀਕ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    orderReview: "ਆਰਡਰ ਸਮੀਖਿਆ",
    qty: "ਮਾਤਰਾ",
    total: "ਕੁੱਲ",
    continuePayment: "ਭੁਗਤਾਨ ਲਈ ਜਾਓ",
    creatingOrder: "ਸੁਰੱਖਿਅਤ ਆਰਡਰ ਬਣਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...",
    backendValidated: "ਬੈਕਐਂਡ ਦੁਆਰਾ ਆਰਡਰ ਡਾਟਾ ਤਸਦੀਕ ਕੀਤਾ ਗਿਆ",
    emptyCart: "ਤੁਹਾਡੀ ਕਾਰਟ ਖਾਲੀ ਹੈ",
    browseMarketplace: "ਮਾਰਕੀਟਪਲੇਸ ਵੇਖੋ",
    noPaymentSuccess: "ਭੁਗਤਾਨ ਤਸਦੀਕ ਹੋਣ ਤੱਕ ਸਫਲ ਨਹੀਂ ਮੰਨਿਆ ਜਾਵੇਗਾ।",
    loginRequired: "ਚੈੱਕਆਉਟ ਜਾਰੀ ਰੱਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।",
    genericError: "ਆਰਡਰ ਨਹੀਂ ਬਣ ਸਕਿਆ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    stockError: "ਇੱਕ ਜਾਂ ਵੱਧ ਉਤਪਾਦ ਮੰਗੀ ਗਈ ਮਾਤਰਾ ਵਿੱਚ ਉਪਲਬਧ ਨਹੀਂ ਹਨ।",
    invalidCart: "ਕਾਰਟ ਵਿੱਚ ਅਵੈਧ ਉਤਪਾਦ ਹੈ। ਮਾਰਕੀਟਪਲੇਸ 'ਤੇ ਵਾਪਸ ਜਾਓ।",
    paymentChoiceRequired: "ਭੁਗਤਾਨ ਵਿਧੀ ਚੁਣੋ।",
    orderCreated: "ਤੁਹਾਡਾ ਆਰਡਰ ਸੁਰੱਖਿਅਤ ਢੰਗ ਨਾਲ ਬਣ ਗਿਆ ਹੈ।",
    continue: "ਜਾਰੀ ਰੱਖੋ",
  },

  ur: {
    checkout: "چیک آؤٹ",
    completeOrder: "اپنا سورسنگ آرڈر مکمل کریں",
    details: "تفصیلات",
    payment: "ادائیگی",
    fulfillment: "ترسیل",
    buyerShipping: "خریدار اور شپنگ کی تفصیلات",
    buyerShippingDesc: "سپلائر کوآرڈینیشن اور ڈیلیوری کے لیے استعمال ہوں گی۔",
    companyName: "کمپنی کا نام",
    contactPerson: "رابطہ شخص",
    businessEmail: "کاروباری ای میل",
    phoneNumber: "فون نمبر",
    shippingAddress: "مکمل شپنگ پتہ",
    paymentMethod: "ادائیگی کا طریقہ",
    paymentMethodDesc: "اس B2B خریداری کو مکمل کرنے کا طریقہ منتخب کریں۔",
    onlinePayment: "آن لائن ادائیگی",
    onlinePaymentDesc: "UPI / کارڈ / نیٹ بینکنگ",
    bankTransfer: "بینک ٹرانسفر",
    bankTransferDesc: "B2B خریداری آرڈر",
    businessTerms: "کاروباری شرائط",
    businessTermsDesc: "منظوری کی صورت میں نیٹ ٹرمز",
    securePayment: "محفوظ ادائیگی",
    verifiedPayment: "تصدیق سے پہلے ادائیگی سرور پر چیک کی جاتی ہے۔",
    orderReview: "آرڈر کا جائزہ",
    qty: "مقدار",
    total: "کل",
    continuePayment: "ادائیگی پر جائیں",
    creatingOrder: "محفوظ آرڈر بنایا جا رہا ہے...",
    backendValidated: "بیک اینڈ نے آرڈر ڈیٹا کی تصدیق کر دی",
    emptyCart: "آپ کی کارٹ خالی ہے",
    browseMarketplace: "مارکیٹ پلیس دیکھیں",
    noPaymentSuccess: "ادائیگی کی تصدیق ہونے تک اسے کامیاب نہیں سمجھا جائے گا۔",
    loginRequired: "چیک آؤٹ جاری رکھنے کے لیے سائن ان کریں۔",
    genericError: "آرڈر نہیں بنایا جا سکا۔ دوبارہ کوشش کریں۔",
    stockError: "ایک یا زیادہ مصنوعات مطلوبہ مقدار میں دستیاب نہیں ہیں۔",
    invalidCart: "کارٹ میں غیر معتبر پروڈکٹ ہے۔ مارکیٹ پلیس پر واپس جائیں۔",
    paymentChoiceRequired: "ادائیگی کا طریقہ منتخب کریں۔",
    orderCreated: "آپ کا آرڈر محفوظ طریقے سے بنا دیا گیا ہے۔",
    continue: "جاری رکھیں",
  },

  es: {
    checkout: "Finalizar compra",
    completeOrder: "Completa tu pedido de abastecimiento",
    details: "Detalles",
    payment: "Pago",
    fulfillment: "Entrega",
    buyerShipping: "Datos del comprador y envío",
    buyerShippingDesc: "Se utilizarán para coordinar con el proveedor y realizar la entrega.",
    companyName: "Nombre de la empresa",
    contactPerson: "Persona de contacto",
    businessEmail: "Correo empresarial",
    phoneNumber: "Número de teléfono",
    shippingAddress: "Dirección completa de envío",
    paymentMethod: "Método de pago",
    paymentMethodDesc: "Elige cómo completar esta compra B2B.",
    onlinePayment: "Pago en línea",
    onlinePaymentDesc: "UPI / Tarjeta / Banca en línea",
    bankTransfer: "Transferencia bancaria",
    bankTransferDesc: "Orden de compra B2B",
    businessTerms: "Condiciones comerciales",
    businessTermsDesc: "Condiciones netas si se aprueban",
    securePayment: "Pago seguro",
    verifiedPayment: "El pago se verifica en el servidor antes de la confirmación.",
    orderReview: "Revisión del pedido",
    qty: "Cant.",
    total: "Total",
    continuePayment: "Continuar al pago",
    creatingOrder: "Creando pedido seguro...",
    backendValidated: "Datos del pedido validados por el servidor",
    emptyCart: "Tu carrito está vacío",
    browseMarketplace: "Ver mercado",
    noPaymentSuccess: "El pago no se marcará como exitoso hasta ser verificado.",
    loginRequired: "Inicia sesión para continuar con el pago.",
    genericError: "No pudimos crear el pedido. Inténtalo de nuevo.",
    stockError: "Uno o más productos ya no están disponibles en la cantidad solicitada.",
    invalidCart: "Tu carrito contiene un producto no válido. Regresa al mercado.",
    paymentChoiceRequired: "Selecciona un método de pago.",
    orderCreated: "Tu pedido se creó de forma segura.",
    continue: "Continuar",
  },

  fr: {
    checkout: "Paiement",
    completeOrder: "Finalisez votre commande d’approvisionnement",
    details: "Détails",
    payment: "Paiement",
    fulfillment: "Livraison",
    buyerShipping: "Informations acheteur et livraison",
    buyerShippingDesc: "Utilisées pour la coordination avec le fournisseur et la livraison.",
    companyName: "Nom de l’entreprise",
    contactPerson: "Personne à contacter",
    businessEmail: "E-mail professionnel",
    phoneNumber: "Numéro de téléphone",
    shippingAddress: "Adresse complète de livraison",
    paymentMethod: "Mode de paiement",
    paymentMethodDesc: "Choisissez comment effectuer cet achat B2B.",
    onlinePayment: "Paiement en ligne",
    onlinePaymentDesc: "UPI / Carte / Banque en ligne",
    bankTransfer: "Virement bancaire",
    bankTransferDesc: "Bon de commande B2B",
    businessTerms: "Conditions commerciales",
    businessTermsDesc: "Conditions nettes si approuvées",
    securePayment: "Paiement sécurisé",
    verifiedPayment: "Le paiement est vérifié côté serveur avant confirmation.",
    orderReview: "Récapitulatif",
    qty: "Qté",
    total: "Total",
    continuePayment: "Continuer vers le paiement",
    creatingOrder: "Création de la commande sécurisée...",
    backendValidated: "Données de commande validées par le serveur",
    emptyCart: "Votre panier est vide",
    browseMarketplace: "Voir le marketplace",
    noPaymentSuccess: "Le paiement ne sera confirmé qu’après vérification.",
    loginRequired: "Connectez-vous pour continuer.",
    genericError: "Impossible de créer la commande. Réessayez.",
    stockError: "Un ou plusieurs produits ne sont plus disponibles dans la quantité demandée.",
    invalidCart: "Votre panier contient un produit invalide. Retournez au marketplace.",
    paymentChoiceRequired: "Sélectionnez un mode de paiement.",
    orderCreated: "Votre commande a été créée en toute sécurité.",
    continue: "Continuer",
  },

  de: {
    checkout: "Kasse",
    completeOrder: "Bestellung abschließen",
    details: "Details",
    payment: "Zahlung",
    fulfillment: "Lieferung",
    buyerShipping: "Käufer- und Versanddaten",
    buyerShippingDesc: "Für Lieferantenkoordination und Lieferung.",
    companyName: "Firmenname",
    contactPerson: "Kontaktperson",
    businessEmail: "Geschäftliche E-Mail",
    phoneNumber: "Telefonnummer",
    shippingAddress: "Vollständige Lieferadresse",
    paymentMethod: "Zahlungsmethode",
    paymentMethodDesc: "Wählen Sie, wie Sie diesen B2B-Kauf abschließen möchten.",
    onlinePayment: "Online-Zahlung",
    onlinePaymentDesc: "UPI / Karte / Online-Banking",
    bankTransfer: "Banküberweisung",
    bankTransferDesc: "B2B-Bestellung",
    businessTerms: "Geschäftsbedingungen",
    businessTermsDesc: "Nettozahlungsziel bei Genehmigung",
    securePayment: "Sichere Zahlung",
    verifiedPayment: "Die Zahlung wird vor der Bestätigung serverseitig geprüft.",
    orderReview: "Bestellübersicht",
    qty: "Menge",
    total: "Gesamt",
    continuePayment: "Zur Zahlung",
    creatingOrder: "Sichere Bestellung wird erstellt...",
    backendValidated: "Bestelldaten wurden serverseitig geprüft",
    emptyCart: "Ihr Warenkorb ist leer",
    browseMarketplace: "Marketplace öffnen",
    noPaymentSuccess: "Die Zahlung gilt erst nach erfolgreicher Prüfung als bestätigt.",
    loginRequired: "Bitte anmelden, um fortzufahren.",
    genericError: "Bestellung konnte nicht erstellt werden. Bitte erneut versuchen.",
    stockError: "Ein oder mehrere Produkte sind in der gewünschten Menge nicht verfügbar.",
    invalidCart: "Ihr Warenkorb enthält ein ungültiges Produkt. Gehen Sie zum Marketplace zurück.",
    paymentChoiceRequired: "Bitte Zahlungsmethode auswählen.",
    orderCreated: "Ihre Bestellung wurde sicher erstellt.",
    continue: "Weiter",
  },

  ar: {
    checkout: "إتمام الطلب",
    completeOrder: "أكمل طلب التوريد",
    details: "التفاصيل",
    payment: "الدفع",
    fulfillment: "التنفيذ",
    buyerShipping: "بيانات المشتري والشحن",
    buyerShippingDesc: "تُستخدم للتنسيق مع المورد والتوصيل.",
    companyName: "اسم الشركة",
    contactPerson: "جهة الاتصال",
    businessEmail: "البريد الإلكتروني التجاري",
    phoneNumber: "رقم الهاتف",
    shippingAddress: "عنوان الشحن الكامل",
    paymentMethod: "طريقة الدفع",
    paymentMethodDesc: "اختر طريقة إكمال عملية الشراء B2B.",
    onlinePayment: "الدفع الإلكتروني",
    onlinePaymentDesc: "UPI / بطاقة / الخدمات المصرفية",
    bankTransfer: "تحويل بنكي",
    bankTransferDesc: "أمر شراء B2B",
    businessTerms: "شروط العمل",
    businessTermsDesc: "شروط ائتمانية عند الموافقة",
    securePayment: "دفع آمن",
    verifiedPayment: "يتم التحقق من الدفع على الخادم قبل التأكيد.",
    orderReview: "مراجعة الطلب",
    qty: "الكمية",
    total: "الإجمالي",
    continuePayment: "المتابعة إلى الدفع",
    creatingOrder: "جارٍ إنشاء الطلب الآمن...",
    backendValidated: "تم التحقق من بيانات الطلب بواسطة الخادم",
    emptyCart: "سلة التسوق فارغة",
    browseMarketplace: "تصفح السوق",
    noPaymentSuccess: "لن يتم اعتبار الدفع ناجحًا حتى يتم التحقق منه.",
    loginRequired: "يرجى تسجيل الدخول للمتابعة.",
    genericError: "تعذر إنشاء الطلب. حاول مرة أخرى.",
    stockError: "منتج واحد أو أكثر غير متاح بالكمية المطلوبة.",
    invalidCart: "تحتوي السلة على منتج غير صالح. ارجع إلى السوق.",
    paymentChoiceRequired: "يرجى اختيار طريقة الدفع.",
    orderCreated: "تم إنشاء طلبك بأمان.",
    continue: "متابعة",
  },

  zh: {
    checkout: "结账",
    completeOrder: "完成您的采购订单",
    details: "详情",
    payment: "支付",
    fulfillment: "履约",
    buyerShipping: "买家和配送信息",
    buyerShippingDesc: "用于供应商协调和配送。",
    companyName: "公司名称",
    contactPerson: "联系人",
    businessEmail: "商务邮箱",
    phoneNumber: "电话号码",
    shippingAddress: "完整配送地址",
    paymentMethod: "支付方式",
    paymentMethodDesc: "选择完成此次 B2B 采购的方式。",
    onlinePayment: "在线支付",
    onlinePaymentDesc: "UPI / 银行卡 / 网银",
    bankTransfer: "银行转账",
    bankTransferDesc: "B2B 采购订单",
    businessTerms: "商务条款",
    businessTermsDesc: "获批后可使用账期",
    securePayment: "安全支付",
    verifiedPayment: "支付将在服务器端验证后确认。",
    orderReview: "订单审核",
    qty: "数量",
    total: "总计",
    continuePayment: "继续支付",
    creatingOrder: "正在创建安全订单...",
    backendValidated: "订单数据已通过服务器验证",
    emptyCart: "购物车为空",
    browseMarketplace: "浏览市场",
    noPaymentSuccess: "支付验证成功后才会标记为成功。",
    loginRequired: "请登录后继续。",
    genericError: "无法创建订单，请重试。",
    stockError: "一个或多个产品无法满足所需数量。",
    invalidCart: "购物车包含无效产品，请返回市场。",
    paymentChoiceRequired: "请选择支付方式。",
    orderCreated: "您的订单已安全创建。",
    continue: "继续",
  },

  ja: {
    checkout: "チェックアウト",
    completeOrder: "調達注文を完了してください",
    details: "詳細",
    payment: "支払い",
    fulfillment: "配送",
    buyerShipping: "購入者・配送情報",
    buyerShippingDesc: "サプライヤーとの調整と配送に使用されます。",
    companyName: "会社名",
    contactPerson: "担当者",
    businessEmail: "ビジネスメール",
    phoneNumber: "電話番号",
    shippingAddress: "完全な配送先住所",
    paymentMethod: "支払い方法",
    paymentMethodDesc: "このB2B購入を完了する方法を選択してください。",
    onlinePayment: "オンライン決済",
    onlinePaymentDesc: "UPI / カード / ネットバンキング",
    bankTransfer: "銀行振込",
    bankTransferDesc: "B2B発注書",
    businessTerms: "取引条件",
    businessTermsDesc: "承認された場合の支払条件",
    securePayment: "安全な決済",
    verifiedPayment: "確認前にサーバー側で支払いが検証されます。",
    orderReview: "注文確認",
    qty: "数量",
    total: "合計",
    continuePayment: "支払いへ進む",
    creatingOrder: "安全な注文を作成中...",
    backendValidated: "注文データはサーバーで検証済み",
    emptyCart: "カートは空です",
    browseMarketplace: "マーケットプレイスを見る",
    noPaymentSuccess: "支払いが検証されるまで成功とはみなされません。",
    loginRequired: "続行するにはサインインしてください。",
    genericError: "注文を作成できませんでした。もう一度お試しください。",
    stockError: "一部の商品が希望数量で利用できません。",
    invalidCart: "カートに無効な商品があります。マーケットプレイスへ戻ってください。",
    paymentChoiceRequired: "支払い方法を選択してください。",
    orderCreated: "注文が安全に作成されました。",
    continue: "続行",
  },

  ko: {
    checkout: "결제",
    completeOrder: "조달 주문을 완료하세요",
    details: "상세 정보",
    payment: "결제",
    fulfillment: "배송",
    buyerShipping: "구매자 및 배송 정보",
    buyerShippingDesc: "공급업체 협의 및 배송에 사용됩니다.",
    companyName: "회사명",
    contactPerson: "담당자",
    businessEmail: "비즈니스 이메일",
    phoneNumber: "전화번호",
    shippingAddress: "전체 배송 주소",
    paymentMethod: "결제 방법",
    paymentMethodDesc: "이 B2B 구매를 완료할 방법을 선택하세요.",
    onlinePayment: "온라인 결제",
    onlinePaymentDesc: "UPI / 카드 / 인터넷 뱅킹",
    bankTransfer: "은행 송금",
    bankTransferDesc: "B2B 구매 주문",
    businessTerms: "거래 조건",
    businessTermsDesc: "승인 시 후불 조건",
    securePayment: "안전한 결제",
    verifiedPayment: "확인 전에 서버에서 결제가 검증됩니다.",
    orderReview: "주문 검토",
    qty: "수량",
    total: "총액",
    continuePayment: "결제로 계속",
    creatingOrder: "안전한 주문을 생성하는 중...",
    backendValidated: "주문 데이터가 서버에서 검증되었습니다",
    emptyCart: "장바구니가 비어 있습니다",
    browseMarketplace: "마켓플레이스 보기",
    noPaymentSuccess: "결제가 검증되기 전에는 성공으로 표시되지 않습니다.",
    loginRequired: "계속하려면 로그인하세요.",
    genericError: "주문을 생성할 수 없습니다. 다시 시도하세요.",
    stockError: "하나 이상의 상품을 요청한 수량으로 이용할 수 없습니다.",
    invalidCart: "장바구니에 잘못된 상품이 있습니다. 마켓플레이스로 돌아가세요.",
    paymentChoiceRequired: "결제 방법을 선택하세요.",
    orderCreated: "주문이 안전하게 생성되었습니다.",
    continue: "계속",
  },

  pt: {
    checkout: "Finalizar compra",
    completeOrder: "Conclua seu pedido de fornecimento",
    details: "Detalhes",
    payment: "Pagamento",
    fulfillment: "Entrega",
    buyerShipping: "Dados do comprador e envio",
    buyerShippingDesc: "Usados para coordenação com o fornecedor e entrega.",
    companyName: "Nome da empresa",
    contactPerson: "Pessoa de contato",
    businessEmail: "E-mail comercial",
    phoneNumber: "Número de telefone",
    shippingAddress: "Endereço completo de entrega",
    paymentMethod: "Método de pagamento",
    paymentMethodDesc: "Escolha como concluir esta compra B2B.",
    onlinePayment: "Pagamento online",
    onlinePaymentDesc: "UPI / Cartão / Internet Banking",
    bankTransfer: "Transferência bancária",
    bankTransferDesc: "Pedido de compra B2B",
    businessTerms: "Condições comerciais",
    businessTermsDesc: "Prazo líquido se aprovado",
    securePayment: "Pagamento seguro",
    verifiedPayment: "O pagamento é verificado no servidor antes da confirmação.",
    orderReview: "Revisão do pedido",
    qty: "Qtd.",
    total: "Total",
    continuePayment: "Continuar para pagamento",
    creatingOrder: "Criando pedido seguro...",
    backendValidated: "Dados do pedido validados pelo servidor",
    emptyCart: "Seu carrinho está vazio",
    browseMarketplace: "Ver marketplace",
    noPaymentSuccess: "O pagamento só será marcado como concluído após a verificação.",
    loginRequired: "Entre para continuar.",
    genericError: "Não foi possível criar o pedido. Tente novamente.",
    stockError: "Um ou mais produtos não estão disponíveis na quantidade solicitada.",
    invalidCart: "Seu carrinho contém um produto inválido. Volte ao marketplace.",
    paymentChoiceRequired: "Selecione um método de pagamento.",
    orderCreated: "Seu pedido foi criado com segurança.",
    continue: "Continuar",
  },

  it: {
    checkout: "Checkout",
    completeOrder: "Completa il tuo ordine di approvvigionamento",
    details: "Dettagli",
    payment: "Pagamento",
    fulfillment: "Consegna",
    buyerShipping: "Dati acquirente e spedizione",
    buyerShippingDesc: "Utilizzati per il coordinamento con il fornitore e la consegna.",
    companyName: "Nome azienda",
    contactPerson: "Persona di contatto",
    businessEmail: "Email aziendale",
    phoneNumber: "Numero di telefono",
    shippingAddress: "Indirizzo completo di spedizione",
    paymentMethod: "Metodo di pagamento",
    paymentMethodDesc: "Scegli come completare questo acquisto B2B.",
    onlinePayment: "Pagamento online",
    onlinePaymentDesc: "UPI / Carta / Home Banking",
    bankTransfer: "Bonifico bancario",
    bankTransferDesc: "Ordine di acquisto B2B",
    businessTerms: "Condizioni commerciali",
    businessTermsDesc: "Pagamento a termine se approvato",
    securePayment: "Pagamento sicuro",
    verifiedPayment: "Il pagamento viene verificato sul server prima della conferma.",
    orderReview: "Riepilogo ordine",
    qty: "Qtà",
    total: "Totale",
    continuePayment: "Continua al pagamento",
    creatingOrder: "Creazione ordine sicuro...",
    backendValidated: "Dati dell'ordine verificati dal server",
    emptyCart: "Il carrello è vuoto",
    browseMarketplace: "Apri marketplace",
    noPaymentSuccess: "Il pagamento non sarà considerato completato finché non verrà verificato.",
    loginRequired: "Accedi per continuare.",
    genericError: "Impossibile creare l'ordine. Riprova.",
    stockError: "Uno o più prodotti non sono disponibili nella quantità richiesta.",
    invalidCart: "Il carrello contiene un prodotto non valido. Torna al marketplace.",
    paymentChoiceRequired: "Seleziona un metodo di pagamento.",
    orderCreated: "Il tuo ordine è stato creato in sicurezza.",
    continue: "Continua",
  },

  ru: {
    checkout: "Оформление",
    completeOrder: "Завершите заказ на закупку",
    details: "Детали",
    payment: "Оплата",
    fulfillment: "Доставка",
    buyerShipping: "Данные покупателя и доставки",
    buyerShippingDesc: "Используются для координации с поставщиком и доставки.",
    companyName: "Название компании",
    contactPerson: "Контактное лицо",
    businessEmail: "Рабочая почта",
    phoneNumber: "Номер телефона",
    shippingAddress: "Полный адрес доставки",
    paymentMethod: "Способ оплаты",
    paymentMethodDesc: "Выберите способ завершения B2B-покупки.",
    onlinePayment: "Онлайн-оплата",
    onlinePaymentDesc: "UPI / Карта / Интернет-банк",
    bankTransfer: "Банковский перевод",
    bankTransferDesc: "B2B заказ на покупку",
    businessTerms: "Условия бизнеса",
    businessTermsDesc: "Отсрочка платежа при одобрении",
    securePayment: "Безопасная оплата",
    verifiedPayment: "Перед подтверждением платеж проверяется на сервере.",
    orderReview: "Проверка заказа",
    qty: "Кол-во",
    total: "Итого",
    continuePayment: "Перейти к оплате",
    creatingOrder: "Создание защищенного заказа...",
    backendValidated: "Данные заказа проверены сервером",
    emptyCart: "Корзина пуста",
    browseMarketplace: "Открыть маркетплейс",
    noPaymentSuccess: "Платеж не будет отмечен как успешный до его проверки.",
    loginRequired: "Войдите, чтобы продолжить.",
    genericError: "Не удалось создать заказ. Попробуйте снова.",
    stockError: "Один или несколько товаров недоступны в требуемом количестве.",
    invalidCart: "В корзине есть недействительный товар. Вернитесь в маркетплейс.",
    paymentChoiceRequired: "Выберите способ оплаты.",
    orderCreated: "Ваш заказ успешно создан.",
    continue: "Продолжить",
  },

  tr: {
    checkout: "Ödeme",
    completeOrder: "Tedarik siparişinizi tamamlayın",
    details: "Detaylar",
    payment: "Ödeme",
    fulfillment: "Teslimat",
    buyerShipping: "Alıcı ve kargo bilgileri",
    buyerShippingDesc: "Tedarikçi koordinasyonu ve teslimat için kullanılır.",
    companyName: "Şirket adı",
    contactPerson: "İletişim kişisi",
    businessEmail: "İş e-postası",
    phoneNumber: "Telefon numarası",
    shippingAddress: "Tam teslimat adresi",
    paymentMethod: "Ödeme yöntemi",
    paymentMethodDesc: "Bu B2B satın alımını nasıl tamamlayacağınızı seçin.",
    onlinePayment: "Online ödeme",
    onlinePaymentDesc: "UPI / Kart / İnternet bankacılığı",
    bankTransfer: "Banka havalesi",
    bankTransferDesc: "B2B satın alma siparişi",
    businessTerms: "Ticari şartlar",
    businessTermsDesc: "Onaylanırsa vadeli ödeme",
    securePayment: "Güvenli ödeme",
    verifiedPayment: "Ödeme onaydan önce sunucu tarafında doğrulanır.",
    orderReview: "Sipariş özeti",
    qty: "Adet",
    total: "Toplam",
    continuePayment: "Ödemeye devam et",
    creatingOrder: "Güvenli sipariş oluşturuluyor...",
    backendValidated: "Sipariş verileri sunucu tarafından doğrulandı",
    emptyCart: "Sepetiniz boş",
    browseMarketplace: "Pazaryerine git",
    noPaymentSuccess: "Ödeme doğrulanana kadar başarılı olarak işaretlenmez.",
    loginRequired: "Devam etmek için giriş yapın.",
    genericError: "Sipariş oluşturulamadı. Lütfen tekrar deneyin.",
    stockError: "Bir veya daha fazla ürün istenen miktarda mevcut değil.",
    invalidCart: "Sepetinizde geçersiz bir ürün var. Pazaryerine dönün.",
    paymentChoiceRequired: "Lütfen bir ödeme yöntemi seçin.",
    orderCreated: "Siparişiniz güvenli şekilde oluşturuldu.",
    continue: "Devam",
  },
};

const BASE_LANGUAGE_FALLBACKS = {
  or: "en",
  as: "en",
  ne: "en",
  sa: "hi",
  kok: "en",
  mai: "hi",
  ks: "ur",
  sd: "ur",
  doi: "hi",
  mni: "en",
  brx: "en",
  sat: "en",
};

function normalizeLanguage(value) {
  const raw = String(value || "en").trim().toLowerCase();

  if (!raw) return "en";

  const base = raw.split("-")[0];

  if (LANGUAGE_CODES.includes(raw)) return raw;
  if (LANGUAGE_CODES.includes(base)) return base;

  return "en";
}

function getTranslation(language, key) {
  const lang = normalizeLanguage(language);

  if (TRANSLATIONS[lang]?.[key]) {
    return TRANSLATIONS[lang][key];
  }

  const fallbackLang = BASE_LANGUAGE_FALLBACKS[lang];

  if (fallbackLang && TRANSLATIONS[fallbackLang]?.[key]) {
    return TRANSLATIONS[fallbackLang][key];
  }

  return TRANSLATIONS.en[key] || key;
}

function getLanguageDirection(language) {
  return RTL_LANGUAGES.has(normalizeLanguage(language))
    ? "rtl"
    : "ltr";
}

function getSafeCart() {
  try {
    const raw = localStorage.getItem("cart");

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getUser() {
  try {
    return JSON.parse(
      localStorage.getItem("texverse_user") || "null"
    );
  } catch {
    return null;
  }
}

function formatINR(value) {
  const amount = Number(value) || 0;

  return `₹${amount.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

function getItemImage(item) {
  if (!item?.image) {
    return "/placeholder-product.png";
  }

  try {
    return getImageUrl(item.image);
  } catch {
    return item.image;
  }
}

function getFriendlyError(error, t) {
  const message = String(error?.message || "").trim();

  if (!message) {
    return t("genericError");
  }

  const lower = message.toLowerCase();

  if (
    lower.includes("stock") ||
    lower.includes("quantity") ||
    lower.includes("available")
  ) {
    return t("stockError");
  }

  if (
    lower.includes("product") &&
    (lower.includes("not found") ||
      lower.includes("invalid"))
  ) {
    return t("invalidCart");
  }

  return message;
}

export default function Checkout() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(() =>
    normalizeLanguage(document.documentElement.lang)
  );

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState("gateway");

  const [form, setForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    shipping_address: "",
  });

  const rtl = getLanguageDirection(language) === "rtl";

  const t = (key) => getTranslation(language, key);

  useEffect(() => {
    const readLanguage = () => {
      setLanguage(
        normalizeLanguage(document.documentElement.lang)
      );
    };

    readLanguage();

    const observer = new MutationObserver(readLanguage);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    window.addEventListener(
      "languagechange",
      readLanguage
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "languagechange",
        readLanguage
      );
    };
  }, []);

  useEffect(() => {
    setCart(getSafeCart());

    const user = getUser();

    if (user) {
      setForm((current) => ({
        ...current,
        email: user.email || current.email,
        company_name:
          user.company_name || current.company_name,
        contact_person:
          user.full_name || current.contact_person,
        phone: user.phone || current.phone,
      }));
    }

    const refreshCart = () => {
      setCart(getSafeCart());
    };

    window.addEventListener(
      "cart-updated",
      refreshCart
    );

    window.addEventListener(
      "storage",
      refreshCart
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        refreshCart
      );

      window.removeEventListener(
        "storage",
        refreshCart
      );
    };
  }, []);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 1;

      return sum + price * quantity;
    }, 0);
  }, [cart]);

  const updateField = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();

    setError("");

    const token = localStorage.getItem(
      "texverse_token"
    );

    if (!token) {
      setError(t("loginRequired"));
      navigate("/login");
      return;
    }

    if (!cart.length) {
      return;
    }

    if (!payment) {
      setError(t("paymentChoiceRequired"));
      return;
    }

    setLoading(true);

    try {
      /*
       * IMPORTANT:
       * Do NOT send price/total from frontend.
       * Backend calculates the authoritative order total.
       */
      const order = await orderApi.create({
        items: cart.map((item) => ({
          product_id: Number(item.id),
          quantity: Number(item.quantity) || 1,
        })),

        company_name: form.company_name.trim(),
        contact_person: form.contact_person.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        shipping_address: form.shipping_address.trim(),
      });

      if (!order?.id) {
        throw new Error(
          t("genericError")
        );
      }

      const serverTotal =
        Number(order.total) || total;

      /*
       * Keep the payment session until payment is
       * successfully verified.
       *
       * This is intentionally NOT cleared before payment.
       */
      localStorage.setItem(
        "texverse_pending_payment",
        JSON.stringify({
          orderId: Number(order.id),
          total: serverTotal,
          method: payment,
          createdAt: new Date().toISOString(),
        })
      );

      /*
       * Cart is cleared only after the backend has
       * successfully created the order.
       *
       * The order itself remains available for payment retry.
       */
      localStorage.removeItem("cart");

      window.dispatchEvent(
        new Event("cart-updated")
      );

      navigate(
        `/payment?order=${encodeURIComponent(
          order.id
        )}`
      );
    } catch (err) {
      setError(
        getFriendlyError(err, t)
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-4 w-full bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400 transition placeholder:text-slate-500";

  if (!cart.length) {
    return (
      <main
        className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6"
        style={{
          direction: "ltr",
          textAlign: rtl ? "right" : "left",
        }}
      >
        <div
          className="text-center max-w-xl"
          style={{
            direction: rtl ? "rtl" : "ltr",
            unicodeBidi: "plaintext",
          }}
        >
          <h1 className="text-3xl md:text-4xl font-black">
            {t("emptyCart")}
          </h1>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 mt-6 bg-cyan-400 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-cyan-300 transition"
          >
            {t("browseMarketplace")}
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-slate-950 text-white py-28 px-5 md:px-6"
      style={{
        /*
         * NEVER change the structural direction.
         * This prevents RTL languages from moving the
         * complete UI from left to right.
         */
        direction: "ltr",
      }}
    >
      <form
        onSubmit={submit}
        className="max-w-6xl mx-auto"
      >
        <div
          className="mb-8"
          style={{
            direction: rtl ? "rtl" : "ltr",
            unicodeBidi: "plaintext",
            textAlign: rtl ? "right" : "left",
          }}
        >
          <p className="text-cyan-400 text-xs uppercase tracking-widest font-bold">
            {t("checkout")}
          </p>

          <h1 className="text-4xl md:text-5xl font-black mt-2 leading-tight">
            {t("completeOrder")}
          </h1>

          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500 flex-wrap">
            <span className="text-cyan-300 font-semibold">
              1. {t("details")}
            </span>

            <ArrowRight size={14} />

            <span>
              2. {t("payment")}
            </span>

            <ArrowRight size={14} />

            <span>
              3. {t("fulfillment")}
            </span>
          </div>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300"
            style={{
              direction: rtl ? "rtl" : "ltr",
              unicodeBidi: "plaintext",
              textAlign: rtl ? "right" : "left",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_380px] gap-7">
          <div className="space-y-6">
            {/* =====================================================
                BUYER + SHIPPING
            ====================================================== */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7">
              <div
                className="flex items-center gap-3"
                style={{
                  direction: "ltr",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 grid place-items-center text-cyan-300 shrink-0">
                  <Truck size={19} />
                </div>

                <div
                  style={{
                    direction: rtl ? "rtl" : "ltr",
                    unicodeBidi: "plaintext",
                    textAlign: rtl ? "right" : "left",
                  }}
                >
                  <h2 className="text-2xl font-black">
                    {t("buyerShipping")}
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    {t("buyerShippingDesc")}
                  </p>
                </div>
              </div>

              <div
                style={{
                  direction: rtl ? "rtl" : "ltr",
                  unicodeBidi: "plaintext",
                }}
              >
                <input
                  required
                  name="company_name"
                  type="text"
                  value={form.company_name}
                  onChange={(e) =>
                    updateField(
                      "company_name",
                      e.target.value
                    )
                  }
                  placeholder={t("companyName")}
                  className={inputClass}
                  autoComplete="organization"
                />

                <input
                  required
                  name="contact_person"
                  type="text"
                  value={form.contact_person}
                  onChange={(e) =>
                    updateField(
                      "contact_person",
                      e.target.value
                    )
                  }
                  placeholder={t("contactPerson")}
                  className={inputClass}
                  autoComplete="name"
                />

                <input
                  required
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder={t("businessEmail")}
                  className={inputClass}
                  autoComplete="email"
                />

                <input
                  required
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField(
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder={t("phoneNumber")}
                  className={inputClass}
                  autoComplete="tel"
                />

                <textarea
                  required
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={(e) =>
                    updateField(
                      "shipping_address",
                      e.target.value
                    )
                  }
                  placeholder={t("shippingAddress")}
                  className={`${inputClass} h-32 resize-y`}
                  autoComplete="street-address"
                />
              </div>
            </section>

            {/* =====================================================
                PAYMENT METHOD
            ====================================================== */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-7">
              <div
                className="flex items-center gap-3"
                style={{
                  direction: "ltr",
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-400/10 grid place-items-center text-cyan-300 shrink-0">
                  <CreditCard size={19} />
                </div>

                <div
                  style={{
                    direction: rtl ? "rtl" : "ltr",
                    unicodeBidi: "plaintext",
                    textAlign: rtl ? "right" : "left",
                  }}
                >
                  <h2 className="text-2xl font-black">
                    {t("paymentMethod")}
                  </h2>

                  <p className="text-slate-500 text-sm mt-1">
                    {t("paymentMethodDesc")}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3 mt-6">
                {/* ONLINE */}
                <button
                  type="button"
                  onClick={() =>
                    setPayment("gateway")
                  }
                  className={`text-left rounded-2xl border p-4 transition ${
                    payment === "gateway"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                  }`}
                  aria-pressed={
                    payment === "gateway"
                  }
                >
                  <div
                    style={{
                      direction: rtl
                        ? "rtl"
                        : "ltr",
                      unicodeBidi:
                        "plaintext",
                      textAlign: rtl
                        ? "right"
                        : "left",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={17}
                        className="text-cyan-300 shrink-0"
                      />

                      <p className="font-black">
                        {t("onlinePayment")}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      {t("onlinePaymentDesc")}
                    </p>
                  </div>
                </button>

                {/* BANK */}
                <button
                  type="button"
                  onClick={() =>
                    setPayment("bank")
                  }
                  className={`text-left rounded-2xl border p-4 transition ${
                    payment === "bank"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                  }`}
                  aria-pressed={
                    payment === "bank"
                  }
                >
                  <div
                    style={{
                      direction: rtl
                        ? "rtl"
                        : "ltr",
                      unicodeBidi:
                        "plaintext",
                      textAlign: rtl
                        ? "right"
                        : "left",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Building2
                        size={17}
                        className="text-cyan-300 shrink-0"
                      />

                      <p className="font-black">
                        {t("bankTransfer")}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      {t("bankTransferDesc")}
                    </p>
                  </div>
                </button>

                {/* TERMS */}
                <button
                  type="button"
                  onClick={() =>
                    setPayment("terms")
                  }
                  className={`text-left rounded-2xl border p-4 transition ${
                    payment === "terms"
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-slate-700 bg-slate-800/50 hover:border-slate-500"
                  }`}
                  aria-pressed={
                    payment === "terms"
                  }
                >
                  <div
                    style={{
                      direction: rtl
                        ? "rtl"
                        : "ltr",
                      unicodeBidi:
                        "plaintext",
                      textAlign: rtl
                        ? "right"
                        : "left",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck2
                        size={17}
                        className="text-cyan-300 shrink-0"
                      />

                      <p className="font-black">
                        {t("businessTerms")}
                      </p>
                    </div>

                    <p className="text-xs text-slate-500 mt-2">
                      {t("businessTermsDesc")}
                    </p>
                  </div>
                </button>
              </div>

              <div
                className="flex gap-3 mt-5 text-xs text-slate-500"
                style={{
                  direction: rtl
                    ? "rtl"
                    : "ltr",
                  unicodeBidi: "plaintext",
                  textAlign: rtl
                    ? "right"
                    : "left",
                }}
              >
                <ShieldCheck
                  size={15}
                  className="text-emerald-400 shrink-0 mt-0.5"
                />

                <span>
                  {t("noPaymentSuccess")}
                </span>
              </div>
            </section>
          </div>

          {/* =======================================================
              ORDER REVIEW
          ======================================================== */}
          <aside className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit lg:sticky lg:top-24">
            <div
              style={{
                direction: rtl
                  ? "rtl"
                  : "ltr",
                unicodeBidi: "plaintext",
                textAlign: rtl
                  ? "right"
                  : "left",
              }}
            >
              <h2 className="text-2xl font-black">
                {t("orderReview")}
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {cart.map((item) => {
                const quantity =
                  Number(item?.quantity) || 1;

                const price =
                  Number(item?.price) || 0;

                const itemTotal =
                  price * quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center border-b border-slate-800 pb-4"
                    style={{
                      direction: "ltr",
                    }}
                  >
                    <img
                      src={getItemImage(item)}
                      alt={item?.name || "Product"}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-800 shrink-0"
                      onError={(event) => {
                        event.currentTarget.src =
                          "/placeholder-product.png";
                      }}
                    />

                    <div
                      className="flex-1 min-w-0"
                      style={{
                        direction: rtl
                          ? "rtl"
                          : "ltr",
                        unicodeBidi:
                          "plaintext",
                        textAlign: rtl
                          ? "right"
                          : "left",
                      }}
                    >
                      <p className="font-semibold truncate">
                        {item?.name ||
                          "Product"}
                      </p>

                      <p className="text-slate-500 text-sm mt-1">
                        {t("qty")}{" "}
                        {quantity}
                      </p>
                    </div>

                    <b className="shrink-0">
                      {formatINR(itemTotal)}
                    </b>
                  </div>
                );
              })}
            </div>

            <div
              className="flex justify-between gap-4 text-2xl font-black mt-7"
              style={{
                direction: rtl
                  ? "rtl"
                  : "ltr",
                unicodeBidi: "plaintext",
              }}
            >
              <span>{t("total")}</span>

              <span className="text-cyan-300">
                {formatINR(total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full bg-cyan-400 text-slate-950 py-4 rounded-xl font-black hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  <span>
                    {t("creatingOrder")}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {t("continuePayment")}
                  </span>

                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div
              className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"
              style={{
                direction: rtl
                  ? "rtl"
                  : "ltr",
                unicodeBidi:
                  "plaintext",
                textAlign: "center",
              }}
            >
              <CheckCircle2
                size={14}
                className="text-emerald-400 shrink-0"
              />

              <span>
                {t("backendValidated")}
              </span>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
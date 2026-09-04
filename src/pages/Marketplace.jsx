import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Package,
  Star,
  ArrowRight,
  Sparkles,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  productApi,
  getImageUrl,
} from "../services/api";

/* =========================================================
   SUPPORTED LANGUAGES
========================================================= */

const SUPPORTED_LANGUAGES = [
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

/* =========================================================
   RTL LANGUAGES / LAYOUT SAFETY
   Physical marketplace structure always stays LTR:
   Filters = LEFT, Product catalog = RIGHT.
   Text direction changes independently for RTL languages.
========================================================= */

const RTL_LANGUAGES = new Set(["ur", "ks", "sd", "ar"]);

const isRTL = (language) =>
  RTL_LANGUAGES.has(language);

/* =========================================================
   HELPERS
========================================================= */

const slug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalize = (value = "") =>
  slug(value);

const resolveProductImage = (image) => {
  if (!image) {
    return "";
  }

  const value = String(image).trim();

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

  return getImageUrl(value);
};

const formatPrice = (price) => {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "—";
  }

  return value.toLocaleString("en-IN");
};

const cleanMoq = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "—";
  }

  const raw = String(value).trim();

  const match = raw.match(
    /^([\d,]+(?:\.\d+)?)\s*(?:meters?|metres?|m)?$/i
  );

  if (match) {
    return match[1];
  }

  return raw
    .replace(
      /\s*(meters?|metres?|m)\s*$/i,
      ""
    )
    .trim();
};

/* =========================================================
   DOCUMENT LANGUAGE
========================================================= */

function useDocumentLanguage() {
  const [language, setLanguage] =
    useState(
      () =>
        document.documentElement.lang ||
        "en"
    );

  useEffect(() => {
    const root =
      document.documentElement;

    const update = () => {
      const next =
        root.lang || "en";

      setLanguage(
        SUPPORTED_LANGUAGES.includes(
          next
        )
          ? next
          : "en"
      );
    };

    update();

    const observer =
      new MutationObserver(update);

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () =>
      observer.disconnect();
  }, []);

  return language;
}

/* =========================================================
   UI TRANSLATIONS
========================================================= */

const UI = {
  eyebrow: {
    en: "TEXVERSE Marketplace",
    hi: "TEXVERSE मार्केटप्लेस",
    bn: "TEXVERSE মার্কেটপ্লেস",
    te: "TEXVERSE మార్కెట్‌ప్లేస్",
    mr: "TEXVERSE मार्केटप्लेस",
    ta: "TEXVERSE சந்தை",
    gu: "TEXVERSE માર્કેટપ્લેસ",
    kn: "TEXVERSE ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
    ml: "TEXVERSE മാർക്കറ്റ്പ്ലേസ്",
    pa: "TEXVERSE ਮਾਰਕੀਟਪਲੇਸ",
    ur: "TEXVERSE مارکیٹ پلیس",
    or: "TEXVERSE ମାର୍କେଟପ୍ଲେସ୍",
    as: "TEXVERSE মাৰ্কেটপ্লেচ",
    ne: "TEXVERSE मार्केटप्लेस",
    sa: "TEXVERSE विपणिस्थलम्",
    kok: "TEXVERSE मार्केटप्लेस",
    mai: "TEXVERSE मार्केटप्लेस",
    ks: "TEXVERSE مارکیٹ پلیس",
    sd: "TEXVERSE مارڪيٽ پلیس",
    doi: "TEXVERSE मार्केटप्लेस",
    mni: "TEXVERSE মাৰ্কেটপ্লেস",
    brx: "TEXVERSE मार्केटप्लेस",
    sat: "TEXVERSE ᱢᱟᱨᱠᱮᱴᱯᱞᱮᱥ",
    es: "Mercado TEXVERSE",
    fr: "Marché TEXVERSE",
    de: "TEXVERSE-Marktplatz",
    ar: "سوق TEXVERSE",
    zh: "TEXVERSE 纺织市场",
    ja: "TEXVERSE マーケットプレイス",
    ko: "TEXVERSE 마켓플레이스",
    pt: "Mercado TEXVERSE",
    it: "Marketplace TEXVERSE",
    ru: "Маркетплейс TEXVERSE",
    tr: "TEXVERSE Pazaryeri",
  },

  hero: {
    en: "Source textile products with confidence.",
    hi: "विश्वास के साथ टेक्सटाइल प्रोडक्ट खोजें।",
    bn: "বিশ্বাসের সঙ্গে টেক্সটাইল পণ্য খুঁজুন।",
    te: "నమ్మకంతో టెక్స్‌టైల్ ఉత్పత్తులను కనుగొనండి.",
    mr: "विश्वासाने टेक्सटाइल उत्पादने शोधा.",
    ta: "நம்பிக்கையுடன் டெக்ஸ்டைல் தயாரிப்புகளைத் தேடுங்கள்.",
    gu: "વિશ્વાસ સાથે ટેક્સટાઇલ પ્રોડક્ટ શોધો.",
    kn: "ವಿಶ್ವಾಸದಿಂದ ಟೆಕ್ಸ್ಟೈಲ್ ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ.",
    ml: "വിശ്വാസത്തോടെ ടെക്സ്റ്റൈൽ ഉൽപ്പന്നങ്ങൾ കണ്ടെത്തൂ.",
    pa: "ਭਰੋਸੇ ਨਾਲ ਟੈਕਸਟਾਈਲ ਉਤਪਾਦ ਲੱਭੋ।",
    ur: "اعتماد کے ساتھ ٹیکسٹائل مصنوعات تلاش کریں۔",
    or: "ବିଶ୍ୱାସ ସହିତ ଟେକ୍ସଟାଇଲ୍ ପ୍ରୋଡକ୍ଟ ଖୋଜନ୍ତୁ।",
    as: "বিশ্বাসেৰে টেক্সটাইল প্ৰডাক্ট বিচাৰক।",
    ne: "विश्वासका साथ टेक्सटाइल उत्पादन खोज्नुहोस्।",
    sa: "विश्वासेन वस्त्र-उत्पादान् अन्विष्यताम्।",
    kok: "विश्वासान टेक्सटायल उत्पादन सोदात.",
    mai: "विश्वास सँ टेक्सटाइल प्रोडक्ट खोजू।",
    ks: "اعتماد سان ٹیکسٹائل پراڈکٹ ڳولو۔",
    sd: "اعتماد سان ٽيڪسٽائل پراڊڪٽ ڳوليو۔",
    doi: "भरोसे कन्नै टेक्सटाइल प्रोडक्ट लब्भो।",
    mni: "ꯅꯨꯡꯁꯤ ꯂꯩꯅ ꯇꯦꯛꯁꯇꯥꯏꯜ ꯄ꯭ꯔꯣꯗꯛꯇ ꯊꯤꯕꯤꯌꯨ।",
    brx: "गोसो जानानै टेक्सटाइल प्रोडक्ट नाय।",
    sat: "ᱵᱷᱚᱨᱚᱥᱟ ᱥᱟᱶ ᱴᱮᱠᱥᱴᱟᱭᱤᱞ ᱯᱨᱚᱰᱟᱠᱴ ᱧᱟᱢᱮᱢ।",
    es: "Encuentra productos textiles con confianza.",
    fr: "Trouvez des produits textiles en toute confiance.",
    de: "Textilprodukte mit Vertrauen beziehen.",
    ar: "ابحث عن منتجات المنسوجات بثقة.",
    zh: "自信地寻找纺织产品。",
    ja: "安心してテキスタイル製品を探しましょう。",
    ko: "신뢰를 바탕으로 섬유 제품을 찾아보세요.",
    pt: "Encontre produtos têxteis com confiança.",
    it: "Trova prodotti tessili con fiducia.",
    ru: "Находите текстильную продукцию с уверенностью.",
    tr: "Tekstil ürünlerini güvenle bulun.",
  },

  heroCategory: {
    en: "Explore {category} fabrics.",
    hi: "{category} फैब्रिक देखें।",
    bn: "{category} কাপড় দেখুন।",
    te: "{category} ఫ్యాబ్రిక్‌లను చూడండి.",
    mr: "{category} फॅब्रिक पहा.",
    ta: "{category} துணிகளைப் பாருங்கள்.",
    gu: "{category} ફેબ્રિક જુઓ.",
    kn: "{category} ಫ್ಯಾಬ್ರಿಕ್‌ಗಳನ್ನು ನೋಡಿ.",
    ml: "{category} തുണിത്തരങ്ങൾ കാണുക.",
    pa: "{category} ਫੈਬਰਿਕ ਵੇਖੋ।",
    ur: "{category} فیبرک دیکھیں۔",
    or: "{category} ଫ୍ୟାବ୍ରିକ୍ ଦେଖନ୍ତୁ।",
    as: "{category} ফেব্ৰিক চাওক।",
    ne: "{category} फेब्रिक हेर्नुहोस्।",
    sa: "{category} वस्त्रं पश्यतु।",
    kok: "{category} फॅब्रिक पळयात.",
    mai: "{category} फैब्रिक देखू।",
    ks: "{category} فیبرک دِیٖکھو۔",
    sd: "{category} فيبرڪ ڏسو۔",
    doi: "{category} फैब्रिक दिक्खो।",
    mni: "{category} ꯐꯦꯕ꯭ꯔꯤꯛ ꯎꯁꯤꯕꯤꯌꯨ۔",
    brx: "{category} फैब्रिक नाय।",
    sat: "{category} ᱯᱷᱟᱵᱽᱨᱤᱠ ᱧᱮᱞᱢᱮ।",
    es: "Explora tejidos de {category}.",
    fr: "Découvrez les tissus {category}.",
    de: "{category}-Stoffe entdecken.",
    ar: "استكشف أقمشة {category}.",
    zh: "探索 {category} 面料。",
    ja: "{category} 生地を見る。",
    ko: "{category} 원단을 살펴보세요.",
    pt: "Explore tecidos de {category}.",
    it: "Esplora i tessuti {category}.",
    ru: "Изучите ткани {category}.",
    tr: "{category} kumaşlarını keşfedin.",
  },

  description: {
    en: "Discover verified suppliers, compare specifications and wholesale pricing, then move from product discovery to quote, checkout and order tracking in one flow.",
    hi: "सत्यापित सप्लायर्स खोजें, स्पेसिफिकेशन और थोक कीमतों की तुलना करें, फिर एक ही फ्लो में प्रोडक्ट खोज से कोटेशन, चेकआउट और ऑर्डर ट्रैकिंग तक जाएँ।",
    bn: "যাচাইকৃত সরবরাহকারী খুঁজুন, স্পেসিফিকেশন ও পাইকারি দাম তুলনা করুন এবং এক ফ্লোতেই কোটেশন, চেকআউট ও অর্ডার ট্র্যাকিং করুন।",
    te: "ధృవీకరించబడిన సరఫరాదారులను కనుగొని, స్పెసిఫికేషన్లు మరియు బల్క్ ధరలను పోల్చి, ఒకే ఫ్లోలో కోటేషన్, చెక్‌అవుట్ మరియు ఆర్డర్ ట్రాకింగ్‌కు వెళ్లండి.",
    mr: "सत्यापित सप्लायर्स शोधा, स्पेसिफिकेशन्स आणि घाऊक किंमतींची तुलना करा आणि एका फ्लोमध्ये कोटेशन, चेकआउट व ऑर्डर ट्रॅकिंग करा.",
    ta: "சரிபார்க்கப்பட்ட சப்ளையர்களைக் கண்டறிந்து, விவரக்குறிப்புகள் மற்றும் மொத்த விலைகளை ஒப்பிட்டு, ஒரே செயல்முறையில் மேற்கோள், செக்அவுட் மற்றும் ஆர்டர் கண்காணிப்பை மேற்கொள்ளுங்கள்.",
    gu: "ચકાસાયેલા સપ્લાયર્સ શોધો, સ્પેસિફિકેશન અને જથ્થાબંધ કિંમતોની તુલના કરો અને એક જ ફ્લોમાં કોટેશન, ચેકઆઉટ અને ઓર્ડર ટ્રેકિંગ સુધી પહોંચો.",
    kn: "ಪರಿಶೀಲಿತ ಪೂರೈಕೆದಾರರನ್ನು ಹುಡುಕಿ, ವಿಶೇಷಣಗಳು ಮತ್ತು ಬಲ್ಕ್ ಬೆಲೆಗಳನ್ನು ಹೋಲಿಸಿ, ಒಂದೇ ಫ್ಲೋನಲ್ಲಿ ಕೋಟೇಶನ್, ಚೆಕ್‌ಔಟ್ ಮತ್ತು ಆರ್ಡರ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮಾಡಿ.",
    ml: "പരിശോധിച്ച വിതരണക്കാരെ കണ്ടെത്തി, സ്പെസിഫിക്കേഷനുകളും മൊത്തവിലകളും താരതമ്യം ചെയ്ത് ഒരേ പ്രവാഹത്തിൽ ക്വട്ടേഷൻ, ചെക്ക്ഔട്ട്, ഓർഡർ ട്രാക്കിംഗ് നടത്തുക.",
    pa: "ਪ੍ਰਮਾਣਿਤ ਸਪਲਾਇਰ ਲੱਭੋ, ਸਪੈਸਿਫਿਕੇਸ਼ਨ ਅਤੇ ਥੋਕ ਕੀਮਤਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ ਅਤੇ ਇੱਕੋ ਫਲੋ ਵਿੱਚ ਕੋਟੇਸ਼ਨ, ਚੈਕਆਉਟ ਅਤੇ ਆਰਡਰ ਟ੍ਰੈਕਿੰਗ ਤੱਕ ਜਾਓ।",
    ur: "تصدیق شدہ سپلائرز تلاش کریں، تفصیلات اور تھوک قیمتوں کا موازنہ کریں، پھر ایک ہی فلو میں کوٹیشن، چیک آؤٹ اور آرڈر ٹریکنگ کریں۔",
    or: "ଯାଞ୍ଚିତ ସପ୍ଲାୟର୍ ଖୋଜନ୍ତୁ, ସ୍ପେସିଫିକେସନ୍ ଏବଂ ଥୋକ ମୂଲ୍ୟ ତୁଳନା କରନ୍ତୁ ଏବଂ ଏକ ଫ୍ଲୋରେ କୋଟେସନ୍, ଚେକଆଉଟ୍ ଓ ଅର୍ଡର୍ ଟ୍ରାକିଂ କରନ୍ତୁ।",
    as: "যাচাইকৃত যোগানকাৰী বিচাৰক, স্পেচিফিকেশ্যন আৰু পাইকাৰী মূল্য তুলনা কৰক আৰু একেটা ফ্ল’ত কোটেচন, চেকআউট আৰু অৰ্ডাৰ ট্ৰেকিং কৰক।",
    ne: "प्रमाणित आपूर्तिकर्ताहरू खोज्नुहोस्, स्पेसिफिकेसन र थोक मूल्य तुलना गर्नुहोस् अनि एउटै फ्लोमा कोटेसन, चेकआउट र अर्डर ट्र्याकिङ गर्नुहोस्।",
    sa: "सत्यापितान् आपूर्तिकर्तॄन् अन्विष्य विशिष्टतानि थोकमूल्यं च तुलयित्वा एकस्मिन् प्रवाहे मूल्यप्रस्तावं क्रयसमापनं आदेशानुसरणं च कुर्वन्तु।",
    kok: "तपासिल्लो सप्लायर सोदात, स्पेसिफिकेशन आनी होलसेल किंमत तुलना करात आनी एका फ्लो मदीं कोटेशन, चेकआउट आनी ऑर्डर ट्रॅकिंग करात.",
    mai: "सत्यापित सप्लायर खोजू, स्पेसिफिकेशन आ थोक दामक तुलना करू आ एक्के फ्लो मे कोटेशन, चेकआउट आ ऑर्डर ट्रैक करू।",
    ks: "تصدیق شدہ سپلائر تلاش کٔرِو، تفصیلات تہ تھوک قٕیمت موازنہ کٔرِو، تہ اکھ فلو منٛز کوٹیشن، چیک آؤٹ تہ آرڈر ٹریکنگ کٔرِو۔",
    sd: "تصديق ٿيل سپلائر ڳوليو، اسپيسيفڪيشن ۽ ٿوڪ قيمتن جو مقابلو ڪريو، پوءِ هڪ ئي فلو ۾ ڪوٽيشن، چيڪ آئوٽ ۽ آرڊر ٽريڪنگ ڪريو۔",
    doi: "प्रमाणित सप्लायर लब्भो, स्पेसिफिकेशन ते थोक भाव तुलना करो ते इक फ्लो च कोटेशन, चेकआउट ते ऑर्डर ट्रैकिंग करो।",
    mni: "ꯆꯥꯁꯤꯟꯅ ꯁꯄꯂꯥꯏꯌꯔꯁꯤ ꯊꯤꯕꯤꯌꯨ, ꯁ꯭ꯄꯦꯁꯤꯐꯤꯀꯦꯁꯟ ꯑꯃꯁꯨꯡ ꯊꯣꯛ ꯃꯨꯂ꯭ꯌ ꯂꯨꯅꯥ ꯌꯥꯟꯅꯥ ꯅꯣꯡꯁꯤꯅꯥ ꯆꯦꯛꯑꯥꯎꯠ ꯑꯃꯁꯨꯡ ꯑꯣꯔꯗꯔ ꯇ꯭ꯔꯥꯛ ꯇꯧꯕꯤꯌꯨ।",
    brx: "सत्यापित सप्लायर नाय, स्पेसिफिकेसन आरो थोक भाव तुलना खालामनाय, आरो मोनसे फ्लोआव कोटेसन, चेकआउट आरो अर्डार ट्रेकिंग खालामनाय।",
    sat: "ᱥᱟᱹᱵ ᱥᱟᱹᱯᱞᱟᱭᱟᱨ ᱧᱟᱢ, ᱥᱯᱮᱥᱤᱯᱷᱤᱠᱮᱥᱚᱱ ᱟᱨ ᱵᱟᱹᱰᱟ ᱫᱟᱢ ᱛᱩᱞᱟ, ᱟᱨ ᱢᱤᱫ ᱯᱷᱞᱳ ᱨᱮ ᱠᱚᱴᱮᱥᱚᱱ, ᱪᱮᱠᱚᱣᱴ ᱟᱨ ᱚᱨᱰᱟᱨ ᱴᱨᱟᱠᱤᱝ ᱠᱚᱨᱟ।",
    es: "Descubre proveedores verificados, compara especificaciones y precios mayoristas y pasa en un solo flujo del descubrimiento al presupuesto, checkout y seguimiento.",
    fr: "Découvrez des fournisseurs vérifiés, comparez les spécifications et les prix de gros, puis passez de la découverte au devis, au paiement et au suivi dans un seul parcours.",
    de: "Entdecken Sie geprüfte Lieferanten, vergleichen Sie Spezifikationen und Großhandelspreise und gehen Sie in einem Ablauf von der Produktsuche bis Angebot, Checkout und Auftragsverfolgung.",
    ar: "اكتشف الموردين الموثقين، وقارن المواصفات والأسعار بالجملة، ثم انتقل من اكتشاف المنتج إلى عرض السعر والدفع وتتبع الطلب ضمن مسار واحد.",
    zh: "查找经过验证的供应商，比较规格和批发价格，并在一个流程中完成产品发现、报价、结算和订单跟踪。",
    ja: "認証済みサプライヤーを見つけ、仕様と卸価格を比較し、製品検索から見積もり、チェックアウト、注文追跡までを一つの流れで進められます。",
    ko: "검증된 공급업체를 찾고 사양과 도매 가격을 비교한 뒤 한 번의 흐름으로 견적, 결제, 주문 추적까지 진행하세요.",
    pt: "Descubra fornecedores verificados, compare especificações e preços de atacado e passe da descoberta ao orçamento, checkout e rastreamento em um único fluxo.",
    it: "Scopri fornitori verificati, confronta specifiche e prezzi all'ingrosso e passa dalla ricerca al preventivo, checkout e tracciamento dell'ordine in un unico flusso.",
    ru: "Находите проверенных поставщиков, сравнивайте характеристики и оптовые цены, а затем переходите от поиска товара к предложению, оформлению и отслеживанию заказа в одном процессе.",
    tr: "Doğrulanmış tedarikçileri bulun, teknik özellikleri ve toptan fiyatları karşılaştırın; ürün keşfinden teklif, ödeme ve sipariş takibine tek akışta geçin.",
  },
};

/* =========================================================
   UI SMALL LABELS
========================================================= */

const SMALL_UI = {
  liveCatalog: {
    en: "Live catalog",
    hi: "लाइव कैटलॉग",
  },
  verifiedAvailable: {
    en: "verified / available products",
    hi: "सत्यापित / उपलब्ध प्रोडक्ट",
  },
  filters: {
    en: "Filters",
    hi: "फ़िल्टर",
  },
  clear: {
    en: "Clear",
    hi: "साफ़ करें",
  },
  allProducts: {
    en: "All Products",
    hi: "सभी प्रोडक्ट",
  },
  subcategories: {
    en: "Sub-categories",
    hi: "सब-कैटेगरी",
  },
  all: {
    en: "All",
    hi: "सभी",
  },
  verifiedSuppliers: {
    en: "Verified suppliers",
    hi: "सत्यापित सप्लायर्स",
  },
  maximumPrice: {
    en: "Maximum price / meter",
    hi: "अधिकतम कीमत / मीटर",
  },
  priceExample: {
    en: "e.g. 1000",
    hi: "उदाहरण: 1000",
  },
  categoryCollection: {
    en: "Category collection",
    hi: "कैटेगरी कलेक्शन",
  },
  exploreByConstruction: {
    en: "— explore by construction",
    hi: "— निर्माण के अनुसार देखें",
  },
  searchPlaceholder: {
    en: "Search fabrics, suppliers, materials, specifications...",
    hi: "फैब्रिक, सप्लायर, सामग्री या स्पेसिफिकेशन खोजें...",
  },
  recommended: {
    en: "Recommended",
    hi: "अनुशंसित",
  },
  highestRated: {
    en: "Highest rated",
    hi: "सबसे उच्च रेटिंग",
  },
  priceLow: {
    en: "Price: low to high",
    hi: "कीमत: कम से अधिक",
  },
  priceHigh: {
    en: "Price: high to low",
    hi: "कीमत: अधिक से कम",
  },
  product: {
    en: "product",
    hi: "प्रोडक्ट",
  },
  products: {
    en: "products",
    hi: "प्रोडक्ट",
  },
  matching: {
    en: "matching",
    hi: "मिलान वाले",
  },
  clearActiveFilters: {
    en: "Clear active filters",
    hi: "सक्रिय फ़िल्टर साफ़ करें",
  },
  noProducts: {
    en: "No products in this selection yet",
    hi: "इस चयन में अभी कोई प्रोडक्ट नहीं है",
  },
  tryAnother: {
    en: "Try another sub-category or clear the filters.",
    hi: "कोई दूसरी सब-कैटेगरी चुनें या फ़िल्टर साफ़ करें।",
  },
  viewAllProducts: {
    en: "View All Products",
    hi: "सभी प्रोडक्ट देखें",
  },
  noImage: {
    en: "No image",
    hi: "इमेज उपलब्ध नहीं",
  },
  verified: {
    en: "Verified",
    hi: "सत्यापित",
  },
  new: {
    en: "New",
    hi: "नया",
  },
  moq: {
    en: "MOQ",
    hi: "न्यूनतम ऑर्डर मात्रा",
  },
  inStock: {
    en: "In stock",
    hi: "स्टॉक में",
  },
  outOfStock: {
    en: "Out of stock",
    hi: "स्टॉक समाप्त",
  },
  productNumber: {
    en: "Product",
    hi: "प्रोडक्ट",
  },
  viewProduct: {
    en: "View Product",
    hi: "प्रोडक्ट देखें",
    bn: "পণ্য দেখুন",
    te: "ఉత్పత్తిని చూడండి",
    mr: "उत्पादन पहा",
    ta: "தயாரிப்பைப் பார்க்கவும்",
    gu: "પ્રોડક્ટ જુઓ",
    kn: "ಉತ್ಪನ್ನವನ್ನು ನೋಡಿ",
    ml: "ഉൽപ്പന്നം കാണുക",
    pa: "ਉਤਪਾਦ ਵੇਖੋ",
    ur: "پروڈکٹ دیکھیں",
    or: "ପ୍ରୋଡକ୍ଟ ଦେଖନ୍ତୁ",
    as: "প্ৰডাক্ট চাওক",
    ne: "उत्पादन हेर्नुहोस्",
    sa: "उत्पादनं पश्यतु",
    kok: "उत्पादन पळयात",
    mai: "प्रोडक्ट देखू",
    ks: "پروڈکٹ دِیٖکھو",
    sd: "پراڊڪٽ ڏسو",
    doi: "प्रोडक्ट दिक्खो",
    mni: "ꯄ꯭ꯔꯣꯗꯛꯇ ꯎꯁꯤꯕꯤꯌꯨ",
    brx: "प्रोडक्ट नाय",
    sat: "ᱯᱨᱚᱰᱟᱠᱴ ᱧᱮᱞᱢᱮ",
    es: "Ver producto",
    fr: "Voir le produit",
    de: "Produkt ansehen",
    ar: "عرض المنتج",
    zh: "查看产品",
    ja: "製品を見る",
    ko: "제품 보기",
    pt: "Ver produto",
    it: "Vedi prodotto",
    ru: "Посмотреть товар",
    tr: "Ürünü Görüntüle",
  },
  loadingTitle: {
    en: "Loading TEXVERSE Marketplace",
    hi: "TEXVERSE मार्केटप्लेस लोड हो रहा है",
  },
  loadingDescription: {
    en: "Fetching live products from the database...",
    hi: "डेटाबेस से लाइव प्रोडक्ट प्राप्त किए जा रहे हैं...",
  },
  marketplaceUnavailable: {
    en: "Marketplace unavailable",
    hi: "मार्केटप्लेस उपलब्ध नहीं है",
  },
  retry: {
    en: "Retry",
    hi: "फिर से प्रयास करें",
  },
};

/* =========================================================
   TERM TRANSLATIONS
========================================================= */

const TERMS = {
  Cotton: {
    hi: "कॉटन",
    bn: "কটন",
    te: "కాటన్",
    mr: "कॉटन",
    ta: "பருத்தி",
    gu: "કપાસ",
    kn: "ಹತ್ತಿ",
    ml: "പരുത്തി",
    pa: "ਕਾਟਨ",
    ur: "کاٹن",
    or: "କଟନ୍",
    as: "কটন",
    ne: "कटन",
    sa: "कर्पास",
    kok: "कॉटन",
    mai: "कॉटन",
    ks: "کاٹن",
    sd: "ڪاٽن",
    doi: "कॉटन",
    mni: "কটন",
    brx: "कटन",
    sat: "ᱠᱚᱴᱚᱱ",
    es: "Algodón",
    fr: "Coton",
    de: "Baumwolle",
    ar: "قطن",
    zh: "棉",
    ja: "コットン",
    ko: "면",
    pt: "Algodão",
    it: "Cotone",
    ru: "Хлопок",
    tr: "Pamuk",
  },

  Polyester: {
    hi: "पॉलिएस्टर",
    bn: "পলিয়েস্টার",
    te: "పాలియెస్టర్",
    mr: "पॉलिएस्टर",
    ta: "பாலியஸ்டர்",
    gu: "પોલિએસ્ટર",
    kn: "ಪಾಲಿಯೆಸ್ಟರ್",
    ml: "പോളിസ്റ്റർ",
    pa: "ਪਾਲੀਐਸਟਰ",
    ur: "پولی ایسٹر",
    or: "ପଲିଏଷ୍ଟର୍",
    as: "পলিয়েস্টাৰ",
    ne: "पोलिएस्टर",
    sa: "पोलिएस्टर",
    kok: "पॉलिएस्टर",
    mai: "पॉलिएस्टर",
    ks: "پولی ایسٹر",
    sd: "پوليئسٽر",
    doi: "पॉलिएस्टर",
    mni: "পলিয়েস্টার",
    brx: "पलियेस्टर",
    sat: "ᱯᱚᱞᱤᱭᱮᱥᱴᱟᱨ",
    es: "Poliéster",
    fr: "Polyester",
    de: "Polyester",
    ar: "بوليستر",
    zh: "聚酯",
    ja: "ポリエステル",
    ko: "폴리에스터",
    pt: "Poliéster",
    it: "Poliestere",
    ru: "Полиэстер",
    tr: "Polyester",
  },

  Rayon: {
    hi: "रेयॉन",
    bn: "রেয়ন",
    te: "రేయాన్",
    mr: "रेयॉन",
    ta: "ரேயான்",
    gu: "રેયોન",
    kn: "ರೇಯಾನ್",
    ml: "റേയോൺ",
    pa: "ਰੇਯਾਨ",
    ur: "ریون",
    or: "ରେୟନ୍",
    as: "ৰেয়ন",
    ne: "रेयोन",
    sa: "रेयोन",
    kok: "रेयॉन",
    mai: "रेयॉन",
    ks: "ریون",
    sd: "رياون",
    doi: "रेयॉन",
    mni: "রেয়ন",
    brx: "रेयोन",
    sat: "ᱨᱮᱭᱚᱱ",
    es: "Rayón",
    fr: "Rayonne",
    de: "Viskose",
    ar: "رايون",
    zh: "人造丝",
    ja: "レーヨン",
    ko: "레이온",
    pt: "Rayon",
    it: "Rayon",
    ru: "Вискоза",
    tr: "Rayon",
  },

  Viscose: {
    hi: "विस्कोस",
    bn: "ভিসকোস",
    te: "విస్కోస్",
    mr: "व्हिस्कोस",
    ta: "விஸ்கோஸ்",
    gu: "વિસ્કોઝ",
    kn: "ವಿಸ್ಕೋಸ್",
    ml: "വിസ്കോസ്",
    pa: "ਵਿਸਕੋਸ",
    ur: "ویسکوز",
    or: "ଭିସ୍କୋଜ୍",
    as: "ভিসকোজ",
    ne: "भिस्कोस",
    sa: "विस्कोस",
    kok: "व्हिस्कोस",
    mai: "विस्कोस",
    ks: "ویسکوز",
    sd: "ويسڪوز",
    doi: "विस्कोस",
    mni: "ভিসকোস",
    brx: "विस्कोस",
    sat: "ᱵᱤᱥᱠᱚᱥ",
    es: "Viscosa",
    fr: "Viscose",
    de: "Viskose",
    ar: "فيسكوز",
    zh: "粘胶",
    ja: "ビスコース",
    ko: "비스코스",
    pt: "Viscose",
    it: "Viscosa",
    ru: "Вискоза",
    tr: "Viskon",
  },

  Denim: {
    hi: "डेनिम",
    bn: "ডেনিম",
    te: "డెనిమ్",
    mr: "डेनिम",
    ta: "டெனிம்",
    gu: "ડેનિમ",
    kn: "ಡೆನಿಮ್",
    ml: "ഡെനിം",
    pa: "ਡੈਨੀਮ",
    ur: "ڈینم",
    or: "ଡେନିମ୍",
    as: "ডেনিম",
    ne: "डेनिम",
    sa: "डेनिम",
    kok: "डेनिम",
    mai: "डेनिम",
    ks: "ڈینم",
    sd: "ڊينم",
    doi: "डेनिम",
    mni: "ডেনিম",
    brx: "डेनिम",
    sat: "ᱰᱮᱱᱤᱢ",
    es: "Denim",
    fr: "Denim",
    de: "Denim",
    ar: "دينم",
    zh: "牛仔布",
    ja: "デニム",
    ko: "데님",
    pt: "Denim",
    it: "Denim",
    ru: "Деним",
    tr: "Denim",
  },

  Silk: {
    hi: "रेशम",
    bn: "রেশম",
    te: "పట్టు",
    mr: "रेशीम",
    ta: "பட்டு",
    gu: "રેશમ",
    kn: "ರೇಷ್ಮೆ",
    ml: "പട്ട്",
    pa: "ਰੇਸ਼ਮ",
    ur: "ریشم",
    or: "ରେଶମ",
    as: "ৰেশম",
    ne: "रेशम",
    sa: "रेश्म",
    kok: "रेशीम",
    mai: "रेशम",
    ks: "ریشم",
    sd: "ريشم",
    doi: "रेशम",
    mni: "রেশম",
    brx: "रेसम",
    sat: "ᱨᱮᱥᱚᱢ",
    es: "Seda",
    fr: "Soie",
    de: "Seide",
    ar: "حرير",
    zh: "丝绸",
    ja: "シルク",
    ko: "실크",
    pt: "Seda",
    it: "Seta",
    ru: "Шёлк",
    tr: "İpek",
  },

  Linen: {
    hi: "लिनन",
    bn: "লিনেন",
    te: "లినెన్",
    mr: "लिनन",
    ta: "லினன்",
    gu: "લિનન",
    kn: "ಲಿನನ್",
    ml: "ലിനൻ",
    pa: "ਲਿਨਨ",
    ur: "لینن",
    or: "ଲିନେନ୍",
    as: "লিনেন",
    ne: "लिनेन",
    sa: "लिनेन",
    kok: "लिनन",
    mai: "लिनन",
    ks: "لینن",
    sd: "لينن",
    doi: "लिनन",
    mni: "লিনেন",
    brx: "लिनेन",
    sat: "ᱞᱤᱱᱮᱱ",
    es: "Lino",
    fr: "Lin",
    de: "Leinen",
    ar: "كتان",
    zh: "亚麻",
    ja: "リネン",
    ko: "린넨",
    pt: "Linho",
    it: "Lino",
    ru: "Лён",
    tr: "Keten",
  },

  Wool: {
    hi: "वूल",
    bn: "উল",
    te: "ऊन",
    mr: "लोकर",
    ta: "கம்பளி",
    gu: "ઊન",
    kn: "ಉಣ್ಣೆ",
    ml: "കമ്പിളി",
    pa: "ਊਨ",
    ur: "اون",
    or: "ପଶମ",
    as: "উল",
    ne: "ऊन",
    sa: "ऊन",
    kok: "उर",
    mai: "ऊन",
    ks: "اون",
    sd: "اُون",
    doi: "ऊन",
    mni: "উল",
    brx: "ऊन",
    sat: "ᱩᱞ",
    es: "Lana",
    fr: "Laine",
    de: "Wolle",
    ar: "صوف",
    zh: "羊毛",
    ja: "ウール",
    ko: "울",
    pt: "Lã",
    it: "Lana",
    ru: "Шерсть",
    tr: "Yün",
  },

  Georgette: {
    hi: "जॉर्जेट",
    bn: "জর্জেট",
    te: "జార్జెట్",
    mr: "जॉर्जेट",
    ta: "ஜார்ஜெட்",
    gu: "જોર્જેટ",
    kn: "ಜಾರ್ಜೆಟ್",
    ml: "ജോർജറ്റ്",
    pa: "ਜੌਰਜੈਟ",
    ur: "جارجٹ",
    or: "ଜର୍ଜେଟ୍",
    as: "জৰ্জেট",
    ne: "जर्जेट",
    sa: "जार्जेट",
    kok: "जॉर्जेट",
    mai: "जॉर्जेट",
    ks: "جارجٹ",
    sd: "جارجيٽ",
    doi: "जॉर्जेट",
    mni: "জর্জেট",
    brx: "जॉर्जेट",
    sat: "ᱡᱚᱨᱡᱮᱴ",
    es: "Georgette",
    fr: "Georgette",
    de: "Georgette",
    ar: "جورجيت",
    zh: "乔其纱",
    ja: "ジョーゼット",
    ko: "조젯",
    pt: "Georgette",
    it: "Georgette",
    ru: "Жоржет",
    tr: "Jorjet",
  },

  Taffeta: {
    hi: "टैफेटा",
    bn: "ট্যাফেটা",
    te: "టాఫెటా",
    mr: "टॅफेटा",
    ta: "டாஃபெட்டா",
    gu: "ટાફેટા",
    kn: "ಟಾಫೆಟಾ",
    ml: "ടാഫെറ്റ",
    pa: "ਟੈਫੇਟਾ",
    ur: "ٹافٹا",
    or: "ଟାଫେଟା",
    as: "টাফেটা",
    ne: "टाफेटा",
    sa: "टाफेटा",
    kok: "टॅफेटा",
    mai: "टैफेटा",
    ks: "ٹافٹا",
    sd: "ٽافيتا",
    doi: "टैफेटा",
    mni: "ট্যাফেটা",
    brx: "टाफेटा",
    sat: "ᱴᱟᱯᱷᱮᱴᱟ",
    es: "Tafetán",
    fr: "Taffetas",
    de: "Taft",
    ar: "تفتا",
    zh: "塔夫绸",
    ja: "タフタ",
    ko: "타페타",
    pt: "Tafetá",
    it: "Taffetà",
    ru: "Тафта",
    tr: "Tafta",
  },

  Crepe: {
    hi: "क्रेप",
    bn: "ক্রেপ",
    te: "క్రేప్",
    mr: "क्रेप",
    ta: "கிரேப்",
    gu: "ક્રેપ",
    kn: "ಕ್ರೇಪ್",
    ml: "ക്രേപ്പ്",
    pa: "ਕ੍ਰੇਪ",
    ur: "کریپ",
    or: "କ୍ରେପ୍",
    as: "ক্ৰেপ",
    ne: "क्रेप",
    sa: "क्रेप",
    kok: "क्रेप",
    mai: "क्रेप",
    ks: "کریپ",
    sd: "ڪريپ",
    doi: "क्रेप",
    mni: "ক্রেপ",
    brx: "क्रेप",
    sat: "ᱠᱨᱮᱯ",
    es: "Crepé",
    fr: "Crêpe",
    de: "Krepp",
    ar: "كريب",
    zh: "绉布",
    ja: "クレープ",
    ko: "크레이프",
    pt: "Crepe",
    it: "Crepe",
    ru: "Креп",
    tr: "Krep",
  },

  Muslin: {
    hi: "मसलिन",
    bn: "মসলিন",
    te: "మస్లిన్",
    mr: "मलमल",
    ta: "மஸ்லின்",
    gu: "મસ્લિન",
    kn: "ಮಸ್ಲಿನ್",
    ml: "മസ്ലിൻ",
    pa: "ਮਸਲਿਨ",
    ur: "ململ",
    or: "ମସଲିନ୍",
    as: "মসলিন",
    ne: "मसलिन",
    sa: "मलमल",
    kok: "मलमल",
    mai: "मलमल",
    ks: "ململ",
    sd: "ململ",
    doi: "मलमल",
    mni: "মসলিন",
    brx: "मसलिन",
    sat: "ᱢᱟᱥᱞᱤᱱ",
    es: "Muselina",
    fr: "Mousseline",
    de: "Musselin",
    ar: "موسلين",
    zh: "穆斯林布",
    ja: "モスリン",
    ko: "머슬린",
    pt: "Musselina",
    it: "Mussola",
    ru: "Муслин",
    tr: "Muslin",
  },

  Poplin: {
    hi: "पॉपलिन",
    bn: "পপলিন",
    te: "పాప్లిన్",
    mr: "पॉपलिन",
    ta: "பாப்லின்",
    gu: "પોપલિન",
    kn: "ಪಾಪ್ಲಿನ್",
    ml: "പോപ്ലിൻ",
    pa: "ਪੌਪਲਿਨ",
    ur: "پاپلن",
    or: "ପପଲିନ୍",
    as: "পপলিন",
    ne: "पप्लिन",
    sa: "पॉपलिन",
    kok: "पॉपलिन",
    mai: "पॉपलिन",
    ks: "پاپلن",
    sd: "پاپلن",
    doi: "पॉपलिन",
    mni: "পপলিন",
    brx: "पापलिन",
    sat: "ᱯᱚᱯᱞᱤᱱ",
    es: "Popelina",
    fr: "Popeline",
    de: "Popeline",
    ar: "بوبلين",
    zh: "府绸",
    ja: "ポプリン",
    ko: "포플린",
    pt: "Popeline",
    it: "Popeline",
    ru: "Поплин",
    tr: "Poplin",
  },

  Jersey: {
    hi: "जर्सी",
    bn: "জার্সি",
    te: "జెర్సీ",
    mr: "जर्सी",
    ta: "ஜெர்சி",
    gu: "જર્સી",
    kn: "ಜರ್ಸಿ",
    ml: "ജേഴ്സി",
    pa: "ਜਰਸੀ",
    ur: "جرسی",
    or: "ଜର୍ସି",
    as: "জাৰ্চি",
    ne: "जर्सी",
    sa: "जर्सी",
    kok: "जर्सी",
    mai: "जर्सी",
    ks: "جرسی",
    sd: "جرسي",
    doi: "जर्सी",
    mni: "জার্সি",
    brx: "जर्सी",
    sat: "ᱡᱟᱨᱥᱤ",
    es: "Jersey",
    fr: "Jersey",
    de: "Jersey",
    ar: "جيرسي",
    zh: "针织布",
    ja: "ジャージー",
    ko: "저지",
    pt: "Jersey",
    it: "Jersey",
    ru: "Джерси",
    tr: "Jarse",
  },

  Twill: {
    hi: "ट्विल",
    bn: "টুইল",
    te: "ట్విల్",
    mr: "ट्विल",
    ta: "ட்வில்",
    gu: "ટ્વિલ",
    kn: "ಟ್ವಿಲ್",
    ml: "ട്വിൽ",
    pa: "ਟਵਿਲ",
    ur: "ٹوئل",
    or: "ଟ୍ୱିଲ୍",
    as: "টুইল",
    ne: "ट्विल",
    sa: "ट्विल",
    kok: "ट्विल",
    mai: "ट्विल",
    ks: "ٹوئل",
    sd: "ٽوئل",
    doi: "ट्विल",
    mni: "টুইল",
    brx: "ट्विल",
    sat: "ᱴᱩᱭᱤᱞ",
    es: "Sarga",
    fr: "Sergé",
    de: "Köper",
    ar: "تويل",
    zh: "斜纹",
    ja: "ツイル",
    ko: "트윌",
    pt: "Sarja",
    it: "Twill",
    ru: "Твил",
    tr: "Twill",
  },

  Satin: {
    hi: "सैटिन",
    bn: "স্যাটিন",
    te: "శాటిన్",
    mr: "सॅटिन",
    ta: "சாட்டின்",
    gu: "સેટિન",
    kn: "ಸ್ಯಾಟಿನ್",
    ml: "സാറ്റിൻ",
    pa: "ਸੈਟਿਨ",
    ur: "ساٹن",
    or: "ସାଟିନ୍",
    as: "চাটিন",
    ne: "स्याटिन",
    sa: "सैटिन",
    kok: "सॅटिन",
    mai: "सैटिन",
    ks: "ساٹن",
    sd: "ساٽين",
    doi: "सैटिन",
    mni: "স্যাটিন",
    brx: "सैटिन",
    sat: "ᱥᱟᱴᱤᱱ",
    es: "Satén",
    fr: "Satin",
    de: "Satin",
    ar: "ساتان",
    zh: "缎面",
    ja: "サテン",
    ko: "새틴",
    pt: "Cetim",
    it: "Raso",
    ru: "Атлас",
    tr: "Saten",
  },

  Spandex: {
    hi: "स्पैन्डेक्स",
    bn: "স্প্যানডেক্স",
    te: "స్పాండెక్స్",
    mr: "स्पॅन्डेक्स",
    ta: "ஸ்பாண்டெக்ஸ்",
    gu: "સ્પાન્ડેક્સ",
    kn: "ಸ್ಪ್ಯಾಂಡೆಕ್ಸ್",
    ml: "സ്പാൻഡെക്സ്",
    pa: "ਸਪੈਂਡੈਕਸ",
    ur: "اسپینڈیکس",
    or: "ସ୍ପାଣ୍ଡେକ୍ସ",
    as: "স্পাণ্ডেক্স",
    ne: "स्प्यान्डेक्स",
    sa: "स्पान्डेक्स",
    kok: "स्पॅन्डेक्स",
    mai: "स्पैन्डेक्स",
    ks: "اسپینڈیکس",
    sd: "اسپينڊيڪس",
    doi: "स्पैन्डेक्स",
    mni: "স্প্যানডেক্স",
    brx: "स्प्यान्डेक्स",
    sat: "ᱥᱯᱮᱱᱰᱮᱠᱥ",
    es: "Spandex",
    fr: "Élasthanne",
    de: "Elasthan",
    ar: "سباندكس",
    zh: "氨纶",
    ja: "スパンデックス",
    ko: "스판덱스",
    pt: "Spandex",
    it: "Spandex",
    ru: "Спандекс",
    tr: "Spandeks",
  },

  Elastane: {
    hi: "इलास्टेन",
    bn: "ইলাস্টেন",
    te: "ఎలాస్టేన్",
    mr: "इलास्टेन",
    ta: "எலாஸ்டேன்",
    gu: "ઇલાસ્ટેન",
    kn: "ಎಲಾಸ್ಟೇನ್",
    ml: "ഇലാസ്റ്റെയ്ൻ",
    pa: "ਇਲਾਸਟੇਨ",
    ur: "ایلاسٹین",
    or: "ଇଲାଷ୍ଟେନ୍",
    as: "ইলাষ্টেন",
    ne: "इलास्टेन",
    sa: "इलास्टेन",
    kok: "इलास्टेन",
    mai: "इलास्टेन",
    ks: "ایلاسٹین",
    sd: "ايلاسٽين",
    doi: "इलास्टेन",
    mni: "ইলাস্টেন",
    brx: "इलास्टेन",
    sat: "ᱤᱞᱟᱥᱴᱮᱱ",
    es: "Elastano",
    fr: "Élasthanne",
    de: "Elastan",
    ar: "إلاستان",
    zh: "弹性纤维",
    ja: "エラスタン",
    ko: "엘라스테인",
    pt: "Elastano",
    it: "Elastan",
    ru: "Эластан",
    tr: "Elastan",
  },

  Slub: {
    hi: "स्लब",
    bn: "স্লাব",
    te: "స్లబ్",
    mr: "स्लब",
    ta: "ஸ்லப்",
    gu: "સ્લબ",
    kn: "ಸ್ಲಬ್",
    ml: "സ്ലബ്",
    pa: "ਸਲੱਬ",
    ur: "سلب",
    or: "ସ୍ଲବ୍",
    as: "স্লাব",
    ne: "स्लब",
    sa: "स्लब",
    kok: "स्लब",
    mai: "स्लब",
    ks: "سلب",
    sd: "سلب",
    doi: "स्लब",
    mni: "স্লাব",
    brx: "स्लब",
    sat: "ᱥᱞᱟᱵ",
    es: "Slub",
    fr: "Slub",
    de: "Slub",
    ar: "سلوب",
    zh: "竹节纱",
    ja: "スラブ",
    ko: "슬럽",
    pt: "Slub",
    it: "Slub",
    ru: "Слаб",
    tr: "Slub",
  },

  "Micro Polyester": {
    hi: "माइक्रो पॉलिएस्टर",
    bn: "মাইক্রো পলিয়েস্টার",
    te: "మైక్రో పాలియెస్టర్",
    mr: "मायक्रो पॉलिएस्टर",
    ta: "மைக்ரோ பாலியஸ்டர்",
    gu: "માઇક્રો પોલિએસ્ટર",
    kn: "ಮೈಕ್ರೋ ಪಾಲಿಯೆಸ್ಟರ್",
    ml: "മൈക്രോ പോളിസ്റ്റർ",
    pa: "ਮਾਈਕ੍ਰੋ ਪਾਲੀਐਸਟਰ",
    ur: "مائیکرو پولی ایسٹر",
    or: "ମାଇକ୍ରୋ ପଲିଏଷ୍ଟର",
    as: "মাইক্রো পলিয়েস্টাৰ",
    ne: "माइक्रो पोलिएस्टर",
    sa: "सूक्ष्मपोलिएस्टर",
    kok: "मायक्रो पॉलिएस्टर",
    mai: "माइक्रो पॉलिएस्टर",
    ks: "مائیکرو پولی ایسٹر",
    sd: "مائڪرو پوليئسٽر",
    doi: "माइक्रो पॉलिएस्टर",
    mni: "মাইক্রো পলিয়েস্টার",
    brx: "माइक्रो पलियेस्टर",
    sat: "ᱢᱟᱭᱠᱨᱚ ᱯᱚᱞᱤᱭᱮᱥᱴᱟᱨ",
    es: "Micro poliéster",
    fr: "Micro-polyester",
    de: "Mikropolyester",
    ar: "بوليستر دقيق",
    zh: "超细聚酯",
    ja: "マイクロポリエステル",
    ko: "마이크로 폴리에스터",
    pt: "Micro poliéster",
    it: "Micro poliestere",
    ru: "Микрополиэстер",
    tr: "Mikro polyester",
  },

  "Premium": {
    hi: "प्रीमियम",
    bn: "প্রিমিয়াম",
    te: "ప్రీమియం",
    mr: "प्रीमियम",
    ta: "பிரீமியம்",
    gu: "પ્રીમિયમ",
    kn: "ಪ್ರೀಮಿಯಂ",
    ml: "പ്രീമിയം",
    pa: "ਪ੍ਰੀਮੀਅਮ",
    ur: "پریمیم",
    or: "ପ୍ରିମିୟମ୍",
    as: "প্ৰিমিয়াম",
    ne: "प्रीमियम",
    sa: "उत्कृष्ट",
    kok: "प्रीमियम",
    mai: "प्रीमियम",
    ks: "پریمیم",
    sd: "پريميئم",
    doi: "प्रीमियम",
    mni: "প্রিমিয়াম",
    brx: "प्रीमियम",
    sat: "ᱯᱨᱤᱢᱤᱭᱟᱢ",
    es: "Premium",
    fr: "Premium",
    de: "Premium",
    ar: "فاخر",
    zh: "高端",
    ja: "プレミアム",
    ko: "프리미엄",
    pt: "Premium",
    it: "Premium",
    ru: "Премиальный",
    tr: "Premium",
  },

  "Commercial Grade": {
    hi: "कमर्शियल ग्रेड",
    bn: "বাণিজ্যিক গ্রেড",
    te: "వాణిజ్య గ్రేడ్",
    mr: "कमर्शियल ग्रेड",
    ta: "வணிக தரம்",
    gu: "કોમર્શિયલ ગ્રેડ",
    kn: "ವಾಣಿಜ್ಯ ಗ್ರೇಡ್",
    ml: "കമ്മർഷ്യൽ ഗ്രേഡ്",
    pa: "ਕਮਰਸ਼ੀਅਲ ਗ੍ਰੇਡ",
    ur: "کمرشل گریڈ",
    or: "ବାଣିଜ୍ୟିକ ଗ୍ରେଡ୍",
    as: "বাণিজ্যিক গ্ৰেড",
    ne: "व्यावसायिक ग्रेड",
    sa: "वाणिज्यिकश्रेणी",
    kok: "कमर्शियल ग्रेड",
    mai: "व्यावसायिक ग्रेड",
    ks: "کمرشل گریڈ",
    sd: "ڪمرشل گريڊ",
    doi: "व्यावसायिक ग्रेड",
    mni: "বাণিজ্যিক গ্রেড",
    brx: "बानिजिय ग्रेड",
    sat: "ᱠᱚᱢᱟᱨᱥᱤᱭᱟᱞ ᱜᱨᱮᱰ",
    es: "Grado comercial",
    fr: "Qualité commerciale",
    de: "Handelsqualität",
    ar: "درجة تجارية",
    zh: "商业级",
    ja: "商用品質",
    ko: "상업용 등급",
    pt: "Grau comercial",
    it: "Grado commerciale",
    ru: "Коммерческий класс",
    tr: "Ticari kalite",
  },

  "Bulk Grade": {
    hi: "बल्क ग्रेड",
    bn: "বাল্ক গ্রেড",
    te: "బల్క్ గ్రేడ్",
    mr: "बल्क ग्रेड",
    ta: "மொத்த தரம்",
    gu: "બલ્ક ગ્રેડ",
    kn: "ಬಲ್ಕ್ ಗ್ರೇಡ್",
    ml: "ബൾക്ക് ഗ്രേഡ്",
    pa: "ਬਲਕ ਗ੍ਰੇਡ",
    ur: "بلک گریڈ",
    or: "ବଲ୍କ ଗ୍ରେଡ୍",
    as: "বাল্ক গ্ৰেড",
    ne: "थोक ग्रेड",
    sa: "बहुमात्राश्रेणी",
    kok: "बल्क ग्रेड",
    mai: "थोक ग्रेड",
    ks: "بلک گریڈ",
    sd: "بلڪ گريڊ",
    doi: "थोक ग्रेड",
    mni: "বাল্ক গ্রেড",
    brx: "थोक ग्रेड",
    sat: "ᱵᱟᱞᱠ ᱜᱨᱮᱰ",
    es: "Grado a granel",
    fr: "Qualité en gros",
    de: "Großhandelsqualität",
    ar: "درجة بالجملة",
    zh: "批量级",
    ja: "バルクグレード",
    ko: "벌크 등급",
    pt: "Grau a granel",
    it: "Grado sfuso",
    ru: "Оптовый класс",
    tr: "Toplu üretim kalitesi",
  },

  "Mill Select": {
    hi: "मिल सिलेक्ट",
    bn: "মিল সিলেক্ট",
    te: "మిల్ సెలెక్ట్",
    mr: "मिल सिलेक्ट",
    ta: "மில் தேர்வு",
    gu: "મિલ સિલેક્ટ",
    kn: "ಮಿಲ್ ಸೆಲೆಕ್ಟ್",
    ml: "മിൽ സെലക്ട്",
    pa: "ਮਿੱਲ ਸਿਲੈਕਟ",
    ur: "مل سلیکٹ",
    or: "ମିଲ୍ ସିଲେକ୍ଟ୍",
    as: "মিল ছেলেক্ট",
    ne: "मिल सिलेक्ट",
    sa: "मिल चयन",
    kok: "मिल सिलेक्ट",
    mai: "मिल सिलेक्ट",
    ks: "مل سلیکٹ",
    sd: "مل سليڪٽ",
    doi: "मिल सिलेक्ट",
    mni: "মিল সিলেক্ট",
    brx: "मिल सेलेक्ट",
    sat: "ᱢᱤᱞ ᱥᱮᱞᱮᱠᱴ",
    es: "Selección de molino",
    fr: "Sélection usine",
    de: "Mühlenauswahl",
    ar: "اختيار المصنع",
    zh: "工厂精选",
    ja: "ミルセレクト",
    ko: "밀 셀렉트",
    pt: "Seleção da fábrica",
    it: "Selezione del mulino",
    ru: "Отбор фабрики",
    tr: "Üretici seçimi",
  },

  "B2B Select": {
    hi: "B2B सिलेक्ट",
    bn: "B2B সিলেক্ট",
    te: "B2B సెలెక్ట్",
    mr: "B2B सिलेक्ट",
    ta: "B2B தேர்வு",
    gu: "B2B સિલેક્ટ",
    kn: "B2B ಸೆಲೆಕ್ಟ್",
    ml: "B2B സെലക്ട്",
    pa: "B2B ਸਿਲੈਕਟ",
    ur: "B2B سلیکٹ",
    or: "B2B ସିଲେକ୍ଟ୍",
    as: "B2B ছেলেক্ট",
    ne: "B2B सिलेक्ट",
    sa: "B2B चयन",
    kok: "B2B सिलेक्ट",
    mai: "B2B सिलेक्ट",
    ks: "B2B سلیکٹ",
    sd: "B2B سليڪٽ",
    doi: "B2B सिलेक्ट",
    mni: "B2B সিলেক্ট",
    brx: "B2B सेलेक्ट",
    sat: "B2B ᱥᱮᱞᱮᱠᱴ",
    es: "Selección B2B",
    fr: "Sélection B2B",
    de: "B2B-Auswahl",
    ar: "اختيار B2B",
    zh: "B2B精选",
    ja: "B2Bセレクト",
    ko: "B2B 셀렉트",
    pt: "Seleção B2B",
    it: "Selezione B2B",
    ru: "B2B отбор",
    tr: "B2B seçimi",
  },

  "Export Quality": {
    hi: "एक्सपोर्ट क्वालिटी",
    bn: "রপ্তানি মানের",
    te: "ఎగుమతి నాణ్యత",
    mr: "एक्सपोर्ट क्वालिटी",
    ta: "ஏற்றுமதி தரம்",
    gu: "નિકાસ ગુણવત્તા",
    kn: "ರಫ್ತು ಗುಣಮಟ್ಟ",
    ml: "കയറ്റുമതി നിലവാരം",
    pa: "ਐਕਸਪੋਰਟ ਕੁਆਲਿਟੀ",
    ur: "ایکسپورٹ کوالٹی",
    or: "ରପ୍ତାନି ଗୁଣମାନ",
    as: "ৰপ্তানি মানদণ্ড",
    ne: "निर्यात गुणस्तर",
    sa: "निर्यातगुणवत्ता",
    kok: "एक्सपोर्ट क्वालिटी",
    mai: "निर्यात गुणवत्ता",
    ks: "ایکسپورٹ کوالٹی",
    sd: "ايڪسپورٽ ڪوالٽي",
    doi: "निर्यात गुणवत्ता",
    mni: "রপ্তানি মান",
    brx: "रफतार गुनमान",
    sat: "ᱮᱠᱥᱯᱳᱨᱴ ᱠᱩᱣᱟᱞᱤᱴᱤ",
    es: "Calidad de exportación",
    fr: "Qualité export",
    de: "Exportqualität",
    ar: "جودة تصديرية",
    zh: "出口品质",
    ja: "輸出品質",
    ko: "수출 품질",
    pt: "Qualidade de exportação",
    it: "Qualità da esportazione",
    ru: "Экспортное качество",
    tr: "İhracat kalitesi",
  },

  "Soft Touch": {
    hi: "सॉफ्ट टच",
    bn: "সফট টাচ",
    te: "సాఫ్ట్ టచ్",
    mr: "सॉफ्ट टच",
    ta: "மென்மையான தொடுதல்",
    gu: "સોફ્ટ ટચ",
    kn: "ಸಾಫ್ಟ್ ಟಚ್",
    ml: "സോഫ്റ്റ് ടച്ച്",
    pa: "ਸਾਫਟ ਟਚ",
    ur: "سافٹ ٹچ",
    or: "ସଫ୍ଟ ଟଚ୍",
    as: "চফ্ট টাচ",
    ne: "सफ्ट टच",
    sa: "कोमलस्पर्श",
    kok: "सॉफ्ट टच",
    mai: "सॉफ्ट टच",
    ks: "سافٹ ٹچ",
    sd: "سافٽ ٽچ",
    doi: "सॉफ्ट टच",
    mni: "সফট টাচ",
    brx: "सफ्ट टच",
    sat: "ᱥᱚᱯᱷᱴ ᱴᱟᱪ",
    es: "Tacto suave",
    fr: "Toucher doux",
    de: "Weicher Griff",
    ar: "ملمس ناعم",
    zh: "柔软触感",
    ja: "ソフトタッチ",
    ko: "소프트 터치",
    pt: "Toque suave",
    it: "Morbido al tatto",
    ru: "Мягкая текстура",
    tr: "Yumuşak dokunuş",
  },

  "High Density": {
    hi: "हाई डेंसिटी",
    bn: "উচ্চ ঘনত্ব",
    te: "అధిక సాంద్రత",
    mr: "उच्च घनता",
    ta: "அதிக அடர்த்தி",
    gu: "ઉચ્ચ ઘનતા",
    kn: "ಹೆಚ್ಚಿನ ಸಾಂದ್ರತೆ",
    ml: "ഉയർന്ന സാന്ദ്രത",
    pa: "ਉੱਚ ਘਣਤਾ",
    ur: "اعلی کثافت",
    or: "ଉଚ୍ଚ ଘନତା",
    as: "উচ্চ ঘনত্ব",
    ne: "उच्च घनत्व",
    sa: "उच्चघनत्व",
    kok: "उच्च घनता",
    mai: "उच्च घनत्व",
    ks: "اعلی کثافت",
    sd: "اعليٰ ڪثافت",
    doi: "उच्च घनत्व",
    mni: "উচ্চ ঘনত্ব",
    brx: "उच्च घनत्व",
    sat: "ᱩᱪᱪᱚ ᱜᱷᱚᱱᱛᱚ",
    es: "Alta densidad",
    fr: "Haute densité",
    de: "Hohe Dichte",
    ar: "كثافة عالية",
    zh: "高密度",
    ja: "高密度",
    ko: "고밀도",
    pt: "Alta densidade",
    it: "Alta densità",
    ru: "Высокая плотность",
    tr: "Yüksek yoğunluk",
  },

  "Quick Dry": {
    hi: "क्विक ड्राय",
    bn: "দ্রুত শুকানো",
    te: "త్వరగా ఎండే",
    mr: "क्विक ड्राय",
    ta: "விரைவாக உலரும்",
    gu: "ઝડપી સુકાવટ",
    kn: "ವೇಗವಾಗಿ ಒಣಗುವ",
    ml: "വേഗത്തിൽ ഉണങ്ങുന്ന",
    pa: "ਜਲਦੀ ਸੁੱਕਣ ਵਾਲਾ",
    ur: "جلدی خشک ہونے والا",
    or: "ଶୀଘ୍ର ଶୁଖୁଥିବା",
    as: "দ্ৰুত শুকোৱা",
    ne: "चाँडै सुक्ने",
    sa: "शीघ्रशोषणशील",
    kok: "क्विक ड्राय",
    mai: "जल्दी सूखने वाला",
    ks: "جلدی سوکھنے والا",
    sd: "جلدي سڪندڙ",
    doi: "जल्दी सूखने वाला",
    mni: "দ্রুত শুকনো",
    brx: "जल्दी सुकाने वाला",
    sat: "ᱠᱷᱟᱴᱠᱟ ᱞᱟᱹᱴᱩ",
    es: "Secado rápido",
    fr: "Séchage rapide",
    de: "Schnelltrocknend",
    ar: "سريع الجفاف",
    zh: "速干",
    ja: "速乾",
    ko: "속건",
    pt: "Secagem rápida",
    it: "Asciugatura rapida",
    ru: "Быстросохнущий",
    tr: "Hızlı kuruyan",
  },

  Professional: {
    hi: "प्रोफेशनल",
    bn: "প্রফেশনাল",
    te: "ప్రొఫెషనల్",
    mr: "प्रोफेशनल",
    ta: "தொழில்முறை",
    gu: "પ્રોફેશનલ",
    kn: "ವೃತ್ತಿಪರ",
    ml: "പ്രൊഫഷണൽ",
    pa: "ਪ੍ਰੋਫੈਸ਼ਨਲ",
    ur: "پروفیشنل",
    or: "ପ୍ରୋଫେସନାଲ୍",
    as: "পেছাদাৰী",
    ne: "व्यावसायिक",
    sa: "व्यावसायिक",
    kok: "प्रोफेशनल",
    mai: "व्यावसायिक",
    ks: "پروفیشنل",
    sd: "پروفیشنل",
    doi: "व्यावसायिक",
    mni: "প্রফেশনাল",
    brx: "प्रोफेसनल",
    sat: "ᱯᱨᱚᱯᱷᱮᱥᱚᱱᱟᱞ",
    es: "Profesional",
    fr: "Professionnel",
    de: "Professionell",
    ar: "احترافي",
    zh: "专业",
    ja: "プロフェッショナル",
    ko: "프로페셔널",
    pt: "Profissional",
    it: "Professionale",
    ru: "Профессиональный",
    tr: "Profesyonel",
  },

  Performance: {
    hi: "परफॉर्मेंस",
    bn: "পারফরম্যান্স",
    te: "పర్ఫార్మెన్స్",
    mr: "परफॉर्मन्स",
    ta: "செயல்திறன்",
    gu: "પરફોર્મન્સ",
    kn: "ಕಾರ್ಯಕ್ಷಮತೆ",
    ml: "പെർഫോമൻസ്",
    pa: "ਪਰਫਾਰਮੈਂਸ",
    ur: "پرفارمنس",
    or: "ପରଫର୍ମାନ୍ସ",
    as: "পাৰফৰ্মেন্স",
    ne: "प्रदर्शन",
    sa: "प्रदर्शन",
    kok: "परफॉर्मन्स",
    mai: "प्रदर्शन",
    ks: "پرفارمنس",
    sd: "پرفارمنس",
    doi: "प्रदर्शन",
    mni: "পারফরম্যান্স",
    brx: "परफरमेन्स",
    sat: "ᱯᱟᱨᱯᱷᱚᱨᱢᱟᱱᱥ",
    es: "Rendimiento",
    fr: "Performance",
    de: "Performance",
    ar: "أداء",
    zh: "高性能",
    ja: "パフォーマンス",
    ko: "퍼포먼스",
    pt: "Performance",
    it: "Performance",
    ru: "Производительный",
    tr: "Performans",
  },

  "Polyester Georgette": {
    hi: "पॉलिएस्टर जॉर्जेट",
    bn: "পলিয়েস্টার জর্জেট",
    te: "పాలియెస్టర్ జార్జెట్",
    mr: "पॉलिएस्टर जॉर्जेट",
    ta: "பாலியஸ்டர் ஜார்ஜெட்",
    gu: "પોલિએસ્ટર જોર્જેટ",
    kn: "ಪಾಲಿಯೆಸ್ಟರ್ ಜಾರ್ಜೆಟ್",
    ml: "പോളിസ്റ്റർ ജോർജറ്റ്",
    pa: "ਪਾਲੀਐਸਟਰ ਜੌਰਜੈਟ",
    ur: "پولی ایسٹر جارجٹ",
    or: "ପଲିଏଷ୍ଟର୍ ଜର୍ଜେଟ୍",
    as: "পলিয়েস্টাৰ জৰ্জেট",
    ne: "पोलिएस्टर जर्जेट",
    sa: "पोलिएस्टर जार्जेट",
    kok: "पॉलिएस्टर जॉर्जेट",
    mai: "पॉलिएस्टर जॉर्जेट",
    ks: "پولی ایسٹر جارجٹ",
    sd: "پوليئسٽر جارجيٽ",
    doi: "पॉलिएस्टर जॉर्जेट",
    mni: "পলিয়েস্টার জর্জেট",
    brx: "पलियेस्टर जॉर्जेट",
    sat: "ᱯᱚᱞᱤᱭᱮᱥᱴᱟᱨ ᱡᱚᱨᱡᱮᱴ",
    es: "Georgette de poliéster",
    fr: "Georgette polyester",
    de: "Polyester-Georgette",
    ar: "جورجيت بوليستر",
    zh: "聚酯乔其纱",
    ja: "ポリエステルジョーゼット",
    ko: "폴리에스터 조젯",
    pt: "Georgette de poliéster",
    it: "Georgette di poliestere",
    ru: "Полиэстеровый жоржет",
    tr: "Polyester jorjet",
  },

  "Polyester Taffeta": {
    hi: "पॉलिएस्टर टैफेटा",
    bn: "পলিয়েস্টার ট্যাফেটা",
    te: "పాలియెస్టర్ టాఫెటా",
    mr: "पॉलिएस्टर टॅफेटा",
    ta: "பாலியஸ்டர் டாஃபெட்டா",
    gu: "પોલિએસ્ટર ટાફેટા",
    kn: "ಪಾಲಿಯೆಸ್ಟರ್ ಟಾಫೆಟಾ",
    ml: "പോളിസ്റ്റർ ടാഫെറ്റ",
    pa: "ਪਾਲੀਐਸਟਰ ਟੈਫੇਟਾ",
    ur: "پولی ایسٹر ٹافٹا",
    or: "ପଲିଏଷ୍ଟର ଟାଫେଟା",
    as: "পলিয়েস্টাৰ টাফেটা",
    ne: "पोलिएस्टर टाफेटा",
    sa: "पोलिएस्टर टाफेटा",
    kok: "पॉलिएस्टर टॅफेटा",
    mai: "पॉलिएस्टर टैफेटा",
    ks: "پولی ایسٹر ٹافٹا",
    sd: "پوليئسٽر ٽافيتا",
    doi: "पॉलिएस्टर टैफेटा",
    mni: "পলিয়েস্টার ট্যাফেটা",
    brx: "पलियेस्टर टाफेटा",
    sat: "ᱯᱚᱞᱤᱭᱮᱥᱴᱟᱨ ᱴᱟᱯᱷᱮᱴᱟ",
    es: "Tafetán de poliéster",
    fr: "Taffetas polyester",
    de: "Polyester-Taft",
    ar: "تفتا بوليستر",
    zh: "聚酯塔夫绸",
    ja: "ポリエステルタフタ",
    ko: "폴리에스터 타페타",
    pt: "Tafetá de poliéster",
    it: "Taffetà di poliestere",
    ru: "Полиэстеровая тафта",
    tr: "Polyester tafta",
  },

  "Polyester Crepe": {
    hi: "पॉलिएस्टर क्रेप",
    bn: "পলিয়েস্টার ক্রেপ",
    te: "పాలియెస్టర్ క్రేప్",
    mr: "पॉलिएस्टर क्रेप",
    ta: "பாலியஸ்டர் கிரேப்",
    gu: "પોલિએસ્ટર ક્રેપ",
    kn: "ಪಾಲಿಯೆಸ್ಟರ್ ಕ್ರೇಪ್",
    ml: "പോളിസ്റ്റർ ക്രേപ്പ്",
    pa: "ਪਾਲੀਐਸਟਰ ਕ੍ਰੇਪ",
    ur: "پولی ایسٹر کریپ",
    or: "ପଲିଏଷ୍ଟର କ୍ରେପ୍",
    as: "পলিয়েস্টাৰ ক্ৰেপ",
    ne: "पोलिएस्टर क्रेप",
    sa: "पोलिएस्टर क्रेप",
    kok: "पॉलिएस्टर क्रेप",
    mai: "पॉलिएस्टर क्रेप",
    ks: "پولی ایسٹر کریپ",
    sd: "پوليئسٽر ڪريپ",
    doi: "पॉलिएस्टर क्रेप",
    mni: "পলিয়েস্টার ক্রেপ",
    brx: "पलियेस्टर क्रेप",
    sat: "ᱯᱚᱞᱤᱭᱮᱥᱴᱟᱨ ᱠᱨᱮᱯ",
    es: "Crepé de poliéster",
    fr: "Crêpe polyester",
    de: "Polyesterkrepp",
    ar: "كريب بوليستر",
    zh: "聚酯绉布",
    ja: "ポリエステルクレープ",
    ko: "폴리에스터 크레이프",
    pt: "Crepe de poliéster",
    it: "Crepe di poliestere",
    ru: "Полиэстеровый креп",
    tr: "Polyester krep",
  },

  "Cotton Muslin": {
    hi: "कॉटन मसलिन",
    bn: "কটন মসলিন",
    te: "కాటన్ మస్లిన్",
    mr: "कॉटन मलमल",
    ta: "பருத்தி மஸ்லின்",
    gu: "કપાસ મસ્લિન",
    kn: "ಹತ್ತಿ ಮಸ್ಲಿನ್",
    ml: "പരുത്തി മസ്ലിൻ",
    pa: "ਕਾਟਨ ਮਸਲਿਨ",
    ur: "کاٹن ململ",
    or: "କଟନ୍ ମସଲିନ୍",
    as: "কটন মসলিন",
    ne: "कटन मसलिन",
    sa: "कर्पासमलमल",
    kok: "कॉटन मलमल",
    mai: "कॉटन मलमल",
    ks: "کاٹن ململ",
    sd: "ڪاٽن ململ",
    doi: "कॉटन मलमल",
    mni: "কটন মসলিন",
    brx: "कटन मसलिन",
    sat: "ᱠᱚᱴᱚᱱ ᱢᱟᱥᱞᱤᱱ",
    es: "Muselina de algodón",
    fr: "Mousseline de coton",
    de: "Baumwollmusselin",
    ar: "موسلين قطني",
    zh: "棉质穆斯林布",
    ja: "コットンモスリン",
    ko: "코튼 머슬린",
    pt: "Musselina de algodão",
    it: "Mussola di cotone",
    ru: "Хлопковый муслин",
    tr: "Pamuk muslin",
  },

  "Cotton Poplin": {
    hi: "कॉटन पॉपलिन",
    bn: "কটন পপলিন",
    te: "కాటన్ పాప్లిన్",
    mr: "कॉटन पॉपलिन",
    ta: "பருத்தி பாப்லின்",
    gu: "કપાસ પોપલિન",
    kn: "ಹತ್ತಿ ಪಾಪ್ಲಿನ್",
    ml: "പരുത്തി പോപ്ലിൻ",
    pa: "ਕਾਟਨ ਪੌਪਲਿਨ",
    ur: "کاٹن پاپلن",
    or: "କଟନ୍ ପପଲିନ୍",
    as: "কটন পপলিন",
    ne: "कटन पप्लिन",
    sa: "कर्पासपॉपलिन",
    kok: "कॉटन पॉपलिन",
    mai: "कॉटन पॉपलिन",
    ks: "کاٹن پاپلن",
    sd: "ڪاٽن پاپلن",
    doi: "कॉटन पॉपलिन",
    mni: "কটন পপলিন",
    brx: "कटन पापलिन",
    sat: "ᱠᱚᱴᱚᱱ ᱯᱚᱯᱞᱤᱱ",
    es: "Popelina de algodón",
    fr: "Popeline de coton",
    de: "Baumwollpopeline",
    ar: "بوبلين قطني",
    zh: "棉府绸",
    ja: "コットンポプリン",
    ko: "코튼 포플린",
    pt: "Popeline de algodão",
    it: "Popeline di cotone",
    ru: "Хлопковый поплин",
    tr: "Pamuk poplin",
  },

  "Cotton Jersey": {
    hi: "कॉटन जर्सी",
    bn: "কটন জার্সি",
    te: "కాటన్ జెర్సీ",
    mr: "कॉटन जर्सी",
    ta: "பருத்தி ஜெர்சி",
    gu: "કપાસ જર્સી",
    kn: "ಹತ್ತಿ ಜರ್ಸಿ",
    ml: "പരുത്തി ജേഴ്സി",
    pa: "ਕਾਟਨ ਜਰਸੀ",
    ur: "کاٹن جرسی",
    or: "କଟନ୍ ଜର୍ସି",
    as: "কটন জাৰ্চি",
    ne: "कटन जर्सी",
    sa: "कर्पासजर्सी",
    kok: "कॉटन जर्सी",
    mai: "कॉटन जर्सी",
    ks: "کاٹن جرسی",
    sd: "ڪاٽن جرسي",
    doi: "कॉटन जर्सी",
    mni: "কটন জার্সি",
    brx: "कटन जर्सी",
    sat: "ᱠᱚᱴᱚᱱ ᱡᱟᱨᱥᱤ",
    es: "Jersey de algodón",
    fr: "Jersey de coton",
    de: "Baumwolljersey",
    ar: "جيرسي قطني",
    zh: "棉针织布",
    ja: "コットンジャージー",
    ko: "코튼 저지",
    pt: "Jersey de algodão",
    it: "Jersey di cotone",
    ru: "Хлопковый джерси",
    tr: "Pamuk jarse",
  },

  "Cotton Satin": {
    hi: "कॉटन सैटिन",
    bn: "কটন স্যাটিন",
    te: "కాటన్ శాటిన్",
    mr: "कॉटन सॅटिन",
    ta: "பருத்தி சாட்டின்",
    gu: "કપાસ સેટિન",
    kn: "ಹತ್ತಿ ಸ್ಯಾಟಿನ್",
    ml: "പരുത്തി സാറ്റിൻ",
    pa: "ਕਾਟਨ ਸੈਟਿਨ",
    ur: "کاٹن ساٹن",
    or: "କଟନ୍ ସାଟିନ୍",
    as: "কটন চাটিন",
    ne: "कटन स्याटिन",
    sa: "कर्पाससैटिन",
    kok: "कॉटन सॅटिन",
    mai: "कॉटन सैटिन",
    ks: "کاٹن ساٹن",
    sd: "ڪاٽن ساٽين",
    doi: "कॉटन सैटिन",
    mni: "কটন স্যাটিন",
    brx: "कटन सैटिन",
    sat: "ᱠᱚᱴᱚᱱ ᱥᱟᱴᱤᱱ",
    es: "Satén de algodón",
    fr: "Satin de coton",
    de: "Baumwollsatin",
    ar: "ساتان قطني",
    zh: "棉缎",
    ja: "コットンサテン",
    ko: "코튼 새틴",
    pt: "Cetim de algodão",
    it: "Raso di cotone",
    ru: "Хлопковый атлас",
    tr: "Pamuk saten",
  },

  "Cotton Viscose": {
    hi: "कॉटन विस्कोस",
    bn: "কটন ভিসকোস",
    te: "కాటన్ విస్కోస్",
    mr: "कॉटन व्हिस्कोस",
    ta: "பருத்தி விஸ்கோஸ்",
    gu: "કપાસ વિસ્કોઝ",
    kn: "ಹತ್ತಿ ವಿಸ್ಕೋಸ್",
    ml: "പരുത്തി വിസ്കോസ്",
    pa: "ਕਾਟਨ ਵਿਸਕੋਸ",
    ur: "کاٹن ویسکوز",
    or: "କଟନ୍ ଭିସ୍କୋଜ୍",
    as: "কটন ভিসকোজ",
    ne: "कटन भिस्कोस",
    sa: "कर्पासविस्कोस",
    kok: "कॉटन व्हिस्कोस",
    mai: "कॉटन विस्कोस",
    ks: "کاٹن ویسکوز",
    sd: "ڪاٽن ويسڪوز",
    doi: "कॉटन विस्कोस",
    mni: "কটন ভিসকোস",
    brx: "कटन विस्कोस",
    sat: "ᱠᱚᱴᱚᱱ ᱵᱤᱥᱠᱚᱥ",
    es: "Viscosa de algodón",
    fr: "Viscose de coton",
    de: "Baumwollviskose",
    ar: "فيسكوز قطني",
    zh: "棉粘胶",
    ja: "コットンビスコース",
    ko: "코튼 비스코스",
    pt: "Viscose de algodão",
    it: "Viscosa di cotone",
    ru: "Хлопковая вискоза",
    tr: "Pamuk viskon",
  },

  "Cotton Polyester": {
    hi: "कॉटन पॉलिएस्टर",
    bn: "কটন পলিয়েস্টার",
    te: "కాటన్ పాలియెస్టర్",
    mr: "कॉटन पॉलिएस्टर",
    ta: "பருத்தி பாலியஸ்டர்",
    gu: "કપાસ પોલિએસ્ટર",
    kn: "ಹತ್ತಿ ಪಾಲಿಯೆಸ್ಟರ್",
    ml: "പരുത്തി പോളിസ്റ്റർ",
    pa: "ਕਾਟਨ ਪਾਲੀਐਸਟਰ",
    ur: "کاٹن پولی ایسٹر",
    or: "କଟନ୍ ପଲିଏଷ୍ଟର୍",
    as: "কটন পলিয়েস্টাৰ",
    ne: "कटन पोलिएस्टर",
    sa: "कर्पासपोलिएस्टर",
    kok: "कॉटन पॉलिएस्टर",
    mai: "कॉटन पॉलिएस्टर",
    ks: "کاٹن پولی ایسٹر",
    sd: "ڪاٽن پوليئسٽر",
    doi: "कॉटन पॉलिएस्टर",
    mni: "কটন পলিয়েস্টার",
    brx: "कटन पलियेस्टर",
    sat: "ᱠᱚᱴᱚᱱ ᱯᱚᱞᱤᱭᱮᱥᱴᱟᱨ",
    es: "Algodón poliéster",
    fr: "Coton polyester",
    de: "Baumwoll-Polyester",
    ar: "قطن بوليستر",
    zh: "棉涤混纺",
    ja: "コットンポリエステル",
    ko: "코튼 폴리에스터",
    pt: "Algodão poliéster",
    it: "Cotone poliestere",
    ru: "Хлопок-полиэстер",
    tr: "Pamuk polyester",
  },

  "Cotton Linen": {
    hi: "कॉटन लिनन",
    bn: "কটন লিনেন",
    te: "కాటన్ లినెన్",
    mr: "कॉटन लिनन",
    ta: "பருத்தி லினன்",
    gu: "કપાસ લિનન",
    kn: "ಹತ್ತಿ ಲಿನನ್",
    ml: "പരുത്തി ലിനൻ",
    pa: "ਕਾਟਨ ਲਿਨਨ",
    ur: "کاٹن لینن",
    or: "କଟନ୍ ଲିନେନ୍",
    as: "কটন লিনেন",
    ne: "कटन लिनेन",
    sa: "कर्पासलिनेन",
    kok: "कॉटन लिनन",
    mai: "कॉटन लिनन",
    ks: "کاٹن لینن",
    sd: "ڪاٽن لينن",
    doi: "कॉटन लिनन",
    mni: "কটন লিনেন",
    brx: "कटन लिनेन",
    sat: "ᱠᱚᱴᱚᱱ ᱞᱤᱱᱮᱱ",
    es: "Algodón lino",
    fr: "Coton lin",
    de: "Baumwolle-Leinen",
    ar: "قطن وكتان",
    zh: "棉麻",
    ja: "コットンリネン",
    ko: "코튼 리넨",
    pt: "Algodão e linho",
    it: "Cotone e lino",
    ru: "Хлопок-лён",
    tr: "Pamuk keten",
  },

  "Rayon Crepe": {
    hi: "रेयॉन क्रेप",
    bn: "রেয়ন ক্রেপ",
    te: "రేయాన్ క్రేప్",
    mr: "रेयॉन क्रेप",
    ta: "ரேயான் கிரேப்",
    gu: "રેયોન ક્રેપ",
    kn: "ರೇಯಾನ್ ಕ್ರೇಪ್",
    ml: "റേയോൺ ക്രേപ്പ്",
    pa: "ਰੇਯਾਨ ਕ੍ਰੇਪ",
    ur: "ریون کریپ",
    or: "ରେୟନ୍ କ୍ରେପ୍",
    as: "ৰেয়ন ক্ৰেপ",
    ne: "रेयोन क्रेप",
    sa: "रेयोन क्रेप",
    kok: "रेयॉन क्रेप",
    mai: "रेयॉन क्रेप",
    ks: "ریون کریپ",
    sd: "رياون ڪريپ",
    doi: "रेयॉन क्रेप",
    mni: "রেয়ন ক্রেপ",
    brx: "रेयोन क्रेप",
    sat: "ᱨᱮᱭᱚᱱ ᱠᱨᱮᱯ",
    es: "Crepé de rayón",
    fr: "Crêpe de rayonne",
    de: "Viskosekrepp",
    ar: "كريب رايون",
    zh: "人造丝绉布",
    ja: "レーヨンクレープ",
    ko: "레이온 크레이프",
    pt: "Crepe de rayon",
    it: "Crepe di rayon",
    ru: "Креп из вискозы",
    tr: "Rayon krep",
  },

  "Rayon Twill": {
    hi: "रेयॉन ट्विल",
    bn: "রেয়ন টুইল",
    te: "రేయాన్ ట్విల్",
    mr: "रेयॉन ट्विल",
    ta: "ரேயான் ட்வில்",
    gu: "રેયોન ટ્વિલ",
    kn: "ರೇಯಾನ್ ಟ್ವಿಲ್",
    ml: "റേയോൺ ട്വിൽ",
    pa: "ਰੇਯਾਨ ਟਵਿਲ",
    ur: "ریون ٹوئل",
    or: "ରେୟନ୍ ଟ୍ୱିଲ୍",
    as: "ৰেয়ন টুইল",
    ne: "रेयोन ट्विल",
    sa: "रेयोनट्विल",
    kok: "रेयॉन ट्विल",
    mai: "रेयॉन ट्विल",
    ks: "ریون ٹوئل",
    sd: "رياون ٽوئل",
    doi: "रेयॉन ट्विल",
    mni: "রেয়ন টুইল",
    brx: "रेयोन ट्विल",
    sat: "ᱨᱮᱭᱚᱱ ᱴᱩᱭᱤᱞ",
    es: "Sarga de rayón",
    fr: "Sergé de rayonne",
    de: "Viskoseköper",
    ar: "تويل رايون",
    zh: "人造丝斜纹",
    ja: "レーヨンツイル",
    ko: "레이온 트윌",
    pt: "Sarja de rayon",
    it: "Twill di rayon",
    ru: "Вискозный твил",
    tr: "Rayon twill",
  },

  "Rayon Viscose": {
    hi: "रेयॉन विस्कोस",
    bn: "রেয়ন ভিসকোস",
    te: "రేయాన్ విస్కోస్",
    mr: "रेयॉन व्हिस्कोस",
    ta: "ரேயான் விஸ்கோஸ்",
    gu: "રેયોન વિસ્કોઝ",
    kn: "ರೇಯಾನ್ ವಿಸ್ಕೋಸ್",
    ml: "റേയോൺ വിസ്കോസ്",
    pa: "ਰੇਯਾਨ ਵਿਸਕੋਸ",
    ur: "ریون ویسکوز",
    or: "ରେୟନ୍ ଭିସ୍କୋଜ୍",
    as: "ৰেয়ন ভিসকোজ",
    ne: "रेयोन भिस्कोस",
    sa: "रेयोनविस्कोस",
    kok: "रेयॉन व्हिस्कोस",
    mai: "रेयॉन विस्कोस",
    ks: "ریون ویسکوز",
    sd: "رياون ويسڪوز",
    doi: "रेयॉन विस्कोस",
    mni: "রেয়ন ভিসকোস",
    brx: "रेयोन विस्कोस",
    sat: "ᱨᱮᱭᱚᱱ ᱵᱤᱥᱠᱚᱥ",
    es: "Rayón viscosa",
    fr: "Rayonne viscose",
    de: "Viskose-Rayon",
    ar: "فيسكوز رايون",
    zh: "人造丝粘胶",
    ja: "レーヨンビスコース",
    ko: "레이온 비스코스",
    pt: "Viscose rayon",
    it: "Viscosa rayon",
    ru: "Вискозный райён",
    tr: "Rayon viskon",
  },
};

/* =========================================================
   GENERIC TOKEN TRANSLATIONS
========================================================= */

const GENERIC_TOKENS = {
  White: {
    hi: "व्हाइट",
    bn: "সাদা",
    te: "తెలుపు",
    mr: "पांढरा",
    ta: "வெள்ளை",
    gu: "સફેદ",
    kn: "ಬಿಳಿ",
    ml: "വെളുപ്പ്",
    pa: "ਚਿੱਟਾ",
    ur: "سفید",
    or: "ଧଳା",
    as: "বগা",
    ne: "सेतो",
    sa: "श्वेत",
    kok: "पांढरें",
    mai: "सफेद",
    ks: "سفید",
    sd: "اڇو",
    doi: "सफेद",
    mni: "সাদা",
    brx: "सेतो",
    sat: "ᱥᱟᱯᱷᱟ",
    es: "Blanco",
    fr: "Blanc",
    de: "Weiß",
    ar: "أبيض",
    zh: "白色",
    ja: "ホワイト",
    ko: "화이트",
    pt: "Branco",
    it: "Bianco",
    ru: "Белый",
    tr: "Beyaz",
  },

  Black: {
    hi: "ब्लैक",
    bn: "কালো",
    te: "నలుపు",
    mr: "काळा",
    ta: "கருப்பு",
    gu: "કાળો",
    kn: "ಕಪ್ಪು",
    ml: "കറുപ്പ്",
    pa: "ਕਾਲਾ",
    ur: "سیاہ",
    or: "କଳା",
    as: "ক’লা",
    ne: "कालो",
    sa: "कृष्ण",
    kok: "काळो",
    mai: "काला",
    ks: "کالا",
    sd: "ڪارو",
    doi: "काला",
    mni: "কালো",
    brx: "गोरा",
    sat: "ᱠᱟᱞᱟ",
    es: "Negro",
    fr: "Noir",
    de: "Schwarz",
    ar: "أسود",
    zh: "黑色",
    ja: "ブラック",
    ko: "블랙",
    pt: "Preto",
    it: "Nero",
    ru: "Чёрный",
    tr: "Siyah",
  },

  Blue: {
    hi: "ब्लू",
    bn: "নীল",
    te: "నీలం",
    mr: "निळा",
    ta: "நீலம்",
    gu: "વાદળી",
    kn: "ನೀಲಿ",
    ml: "നീല",
    pa: "ਨੀਲਾ",
    ur: "نیلا",
    or: "ନୀଳ",
    as: "নীলা",
    ne: "निलो",
    sa: "नील",
    kok: "निळो",
    mai: "नीला",
    ks: "نیلا",
    sd: "نيرو",
    doi: "नीला",
    mni: "নীল",
    brx: "निला",
    sat: "ᱞᱤᱞ",
    es: "Azul",
    fr: "Bleu",
    de: "Blau",
    ar: "أزرق",
    zh: "蓝色",
    ja: "ブルー",
    ko: "블루",
    pt: "Azul",
    it: "Blu",
    ru: "Синий",
    tr: "Mavi",
  },

  "Sky Blue": {
    hi: "स्काई ब्लू",
    bn: "আকাশী নীল",
    te: "ఆకాశ నీలం",
    mr: "आकाशी निळा",
    ta: "வான நீலம்",
    gu: "આકાશી વાદળી",
    kn: "ಆಕಾಶ ನೀಲಿ",
    ml: "ആകാശ നീല",
    pa: "ਆਕਾਸ਼ੀ ਨੀਲਾ",
    ur: "آسمانی نیلا",
    or: "ଆକାଶୀ ନୀଳ",
    as: "আকাশী নীলা",
    ne: "आकाशी निलो",
    sa: "आकाशनील",
    kok: "आकाशी निळो",
    mai: "आसमानी नीला",
    ks: "آسمانی نیلا",
    sd: "آسماني نيرو",
    doi: "आसमानी नीला",
    mni: "আকাশী নীল",
    brx: "आकाशी निला",
    sat: "ᱟᱠᱟᱥᱤ ᱞᱤᱞ",
    es: "Azul cielo",
    fr: "Bleu ciel",
    de: "Himmelblau",
    ar: "أزرق سماوي",
    zh: "天蓝色",
    ja: "スカイブルー",
    ko: "스카이블루",
    pt: "Azul celeste",
    it: "Azzurro cielo",
    ru: "Небесно-голубой",
    tr: "Gök mavisi",
  },

  Navy: {
    hi: "नेवी",
    bn: "নেভি",
    te: "నేవీ",
    mr: "नेव्ही",
    ta: "நேவி",
    gu: "નેવી",
    kn: "ನೇವಿ",
    ml: "നേവി",
    pa: "ਨੇਵੀ",
    ur: "نیوی",
    or: "ନେଭି",
    as: "নেভি",
    ne: "नेभी",
    sa: "नौसैनिकनील",
    kok: "नेव्ही",
    mai: "नेवी",
    ks: "نیوی",
    sd: "نيڀي",
    doi: "नेवी",
    mni: "নেভি",
    brx: "नेवी",
    sat: "ᱱᱮᱵᱷᱤ",
    es: "Azul marino",
    fr: "Bleu marine",
    de: "Marineblau",
    ar: "أزرق داكن",
    zh: "海军蓝",
    ja: "ネイビー",
    ko: "네이비",
    pt: "Azul-marinho",
    it: "Blu navy",
    ru: "Тёмно-синий",
    tr: "Lacivert",
  },

  Charcoal: {
    hi: "चारकोल",
    bn: "চারকোল",
    te: "చార్కోల్",
    mr: "चारकोल",
    ta: "கரிகல்",
    gu: "ચારકોલ",
    kn: "ಚಾರ್ಕೋಲ್",
    ml: "ചാർക്കോൾ",
    pa: "ਚਾਰਕੋਲ",
    ur: "چارکول",
    or: "ଚାରକୋଲ୍",
    as: "চাৰকোল",
    ne: "चारकोल",
    sa: "कोयलवर्ण",
    kok: "चारकोल",
    mai: "चारकोल",
    ks: "چارکول",
    sd: "چارڪول",
    doi: "चारकोल",
    mni: "চারকোল",
    brx: "चारकोल",
    sat: "ᱪᱟᱨᱠᱳᱞ",
    es: "Carbón",
    fr: "Anthracite",
    de: "Anthrazit",
    ar: "فحمي",
    zh: "炭灰色",
    ja: "チャコール",
    ko: "차콜",
    pt: "Carvão",
    it: "Antracite",
    ru: "Угольный",
    tr: "Antrasit",
  },

  Rust: {
    hi: "रस्ट",
    bn: "মরিচা",
    te: "తుప్పు రంగు",
    mr: "रस्ट",
    ta: "துரு நிறம்",
    gu: "રસ્ટ",
    kn: "ತುಕ್ಕು ಬಣ್ಣ",
    ml: "തുരുമ്പ് നിറം",
    pa: "ਰਸਟ",
    ur: "زنگی",
    or: "ଜଙ୍ଗ ବର୍ଣ୍ଣ",
    as: "মৰিচা ৰং",
    ne: "रस्ट",
    sa: "जंगवर्ण",
    kok: "रस्ट",
    mai: "रस्ट",
    ks: "زنگی",
    sd: "زنگي",
    doi: "रस्ट",
    mni: "মরচে রঙ",
    brx: "रस्ट",
    sat: "ᱨᱚᱥᱴ",
    es: "Óxido",
    fr: "Rouille",
    de: "Rost",
    ar: "صدئي",
    zh: "铁锈色",
    ja: "ラスト",
    ko: "러스트",
    pt: "Ferrugem",
    it: "Ruggine",
    ru: "Ржавый",
    tr: "Pas",
  },

  Pink: {
    hi: "पिंक",
    bn: "গোলাপি",
    te: "గులాబీ",
    mr: "गुलाबी",
    ta: "இளஞ்சிவப்பு",
    gu: "ગુલાબી",
    kn: "ಗುಲಾಬಿ",
    ml: "പിങ്ക്",
    pa: "ਗੁਲਾਬੀ",
    ur: "گلابی",
    or: "ଗୋଲାପୀ",
    as: "গোলপীয়া",
    ne: "गुलाबी",
    sa: "पाटल",
    kok: "गुलाबी",
    mai: "गुलाबी",
    ks: "گلابی",
    sd: "گلابي",
    doi: "गुलाबी",
    mni: "গোলাপী",
    brx: "गुलाबी",
    sat: "ᱜᱩᱞᱟᱵ",
    es: "Rosa",
    fr: "Rose",
    de: "Rosa",
    ar: "وردي",
    zh: "粉色",
    ja: "ピンク",
    ko: "핑크",
    pt: "Rosa",
    it: "Rosa",
    ru: "Розовый",
    tr: "Pembe",
  },

  Olive: {
    hi: "ऑलिव",
    bn: "অলিভ",
    te: "ఆలివ్",
    mr: "ऑलिव्ह",
    ta: "ஆலிவ்",
    gu: "ઓલિવ",
    kn: "ಆಲಿವ್",
    ml: "ഒലീവ്",
    pa: "ਓਲਿਵ",
    ur: "زیتونی",
    or: "ଅଲିଭ୍",
    as: "অলিভ",
    ne: "अलिभ",
    sa: "जैतूनवर्ण",
    kok: "ऑलिव्ह",
    mai: "ऑलिव",
    ks: "زیتونی",
    sd: "زيتوني",
    doi: "ऑलिव",
    mni: "অলিভ",
    brx: "आलिव",
    sat: "ᱚᱞᱤᱵᱷ",
    es: "Oliva",
    fr: "Olive",
    de: "Oliv",
    ar: "زيتوني",
    zh: "橄榄色",
    ja: "オリーブ",
    ko: "올리브",
    pt: "Oliva",
    it: "Oliva",
    ru: "Оливковый",
    tr: "Zeytin",
  },

  Cream: {
    hi: "क्रीम",
    bn: "ক্রিম",
    te: "క్రీమ్",
    mr: "क्रीम",
    ta: "கிரீம்",
    gu: "ક્રીમ",
    kn: "ಕ್ರೀಮ್",
    ml: "ക്രീം",
    pa: "ਕ੍ਰੀਮ",
    ur: "کریم",
    or: "କ୍ରିମ୍",
    as: "ক্ৰীম",
    ne: "क्रीम",
    sa: "क्षीरवर्ण",
    kok: "क्रीम",
    mai: "क्रीम",
    ks: "کریم",
    sd: "ڪريمي",
    doi: "क्रीम",
    mni: "ক্রিম",
    brx: "क्रिम",
    sat: "ᱠᱨᱤᱢ",
    es: "Crema",
    fr: "Crème",
    de: "Creme",
    ar: "كريمي",
    zh: "奶油色",
    ja: "クリーム",
    ko: "크림",
    pt: "Creme",
    it: "Crema",
    ru: "Кремовый",
    tr: "Krem",
  },

  Ivory: {
    hi: "आइवरी",
    bn: "আইভরি",
    te: "ఐవరీ",
    mr: "आयव्हरी",
    ta: "ஐவரி",
    gu: "આઇવરી",
    kn: "ಐವರಿ",
    ml: "ഐവറി",
    pa: "ਆਈਵਰੀ",
    ur: "آئیوری",
    or: "ଆଇଭରୀ",
    as: "আইভৰি",
    ne: "आइभोरी",
    sa: "हस्तिदन्तवर्ण",
    kok: "आयव्हरी",
    mai: "आइवरी",
    ks: "آئیوری",
    sd: "آئيوري",
    doi: "आइवरी",
    mni: "আইভরি",
    brx: "आइवरी",
    sat: "ᱟᱭᱵᱷᱚᱨᱤ",
    es: "Marfil",
    fr: "Ivoire",
    de: "Elfenbein",
    ar: "عاجي",
    zh: "象牙色",
    ja: "アイボリー",
    ko: "아이보리",
    pt: "Marfim",
    it: "Avorio",
    ru: "Слоновая кость",
    tr: "Fildişi",
  },

  Grey: {
    hi: "ग्रे",
    bn: "ধূসর",
    te: "బూడిద రంగు",
    mr: "राखाडी",
    ta: "சாம்பல்",
    gu: "ભૂખરો",
    kn: "ಬೂದು",
    ml: "ചാരനിറം",
    pa: "ਸਲੇਟੀ",
    ur: "سرمئی",
    or: "ଧୂସର",
    as: "ধূসৰ",
    ne: "खैरो",
    sa: "धूसर",
    kok: "राखाडी",
    mai: "धूसर",
    ks: "سرمئی",
    sd: "سرمائي",
    doi: "धूसर",
    mni: "ধূসর",
    brx: "धूसर",
    sat: "ᱜᱷᱩᱥᱨᱟ",
    es: "Gris",
    fr: "Gris",
    de: "Grau",
    ar: "رمادي",
    zh: "灰色",
    ja: "グレー",
    ko: "그레이",
    pt: "Cinza",
    it: "Grigio",
    ru: "Серый",
    tr: "Gri",
  },

  Gray: {
    hi: "ग्रे",
    bn: "ধূসর",
    te: "బూడిద రంగు",
    mr: "राखाडी",
    ta: "சாம்பல்",
    gu: "ભૂખરો",
    kn: "ಬೂದು",
    ml: "ചാരനിറം",
    pa: "ਸਲੇਟੀ",
    ur: "سرمئی",
    or: "ଧୂସର",
    as: "ধূসৰ",
    ne: "खैरो",
    sa: "धूसर",
    kok: "राखाडी",
    mai: "धूसर",
    ks: "سرمئی",
    sd: "سرمائي",
    doi: "धूसर",
    mni: "ধূসর",
    brx: "धूसर",
    sat: "ᱜᱷᱩᱥᱨᱟ",
    es: "Gris",
    fr: "Gris",
    de: "Grau",
    ar: "رمادي",
    zh: "灰色",
    ja: "グレー",
    ko: "그레이",
    pt: "Cinza",
    it: "Grigio",
    ru: "Серый",
    tr: "Gri",
  },

  Wine: {
    hi: "वाइन",
    bn: "ওয়াইন",
    te: "వైన్",
    mr: "वाइन",
    ta: "வைன்",
    gu: "વાઇન",
    kn: "ವೈನ್",
    ml: "വൈൻ",
    pa: "ਵਾਈਨ",
    ur: "وائن",
    or: "ୱାଇନ୍",
    as: "ৱাইন",
    ne: "वाइन",
    sa: "मधुवर्ण",
    kok: "वाइन",
    mai: "वाइन",
    ks: "وائن",
    sd: "وائن",
    doi: "वाइन",
    mni: "ওয়াইন",
    brx: "वाइन",
    sat: "ᱵᱟᱭᱤᱱ",
    es: "Vino",
    fr: "Vin",
    de: "Weinrot",
    ar: "نبيذي",
    zh: "酒红色",
    ja: "ワイン",
    ko: "와인",
    pt: "Vinho",
    it: "Bordeaux",
    ru: "Винный",
    tr: "Şarap",
  },

  Maroon: {
    hi: "मैरून",
    bn: "মেরুন",
    te: "మెరూన్",
    mr: "मरून",
    ta: "மெரூன்",
    gu: "મેરૂન",
    kn: "ಮರೂನ್",
    ml: "മെറൂൺ",
    pa: "ਮਰੂਨ",
    ur: "میرون",
    or: "ମେରୁନ୍",
    as: "মেৰুণ",
    ne: "मरुन",
    sa: "रक्तश्याम",
    kok: "मरून",
    mai: "मैरून",
    ks: "میرون",
    sd: "ميرون",
    doi: "मैरून",
    mni: "মেরুন",
    brx: "मरुन",
    sat: "ᱢᱮᱨᱩᱱ",
    es: "Granate",
    fr: "Bordeaux",
    de: "Maron",
    ar: "عنابي",
    zh: "栗色",
    ja: "マルーン",
    ko: "마룬",
    pt: "Marrom escuro",
    it: "Marrone rossastro",
    ru: "Бордовый",
    tr: "Bordo",
  },

  Mustard: {
    hi: "मस्टर्ड",
    bn: "সরিষা",
    te: "ఆవాలు",
    mr: "मोहरी",
    ta: "கடுகு",
    gu: "મસ્ટર્ડ",
    kn: "ಸಾಸಿವೆ",
    ml: "കടുക്",
    pa: "ਸਰੋਂ",
    ur: "سرسوں",
    or: "ସୋରିଷ",
    as: "সৰিষা",
    ne: "तोरी",
    sa: "सर्षपवर्ण",
    kok: "मोहरी",
    mai: "सरसों",
    ks: "سرسوں",
    sd: "سرنهن",
    doi: "सरसों",
    mni: "সরিষা",
    brx: "सरसों",
    sat: "ᱥᱚᱨᱥᱚ",
    es: "Mostaza",
    fr: "Moutarde",
    de: "Senf",
    ar: "خردلي",
    zh: "芥末黄",
    ja: "マスタード",
    ko: "머스타드",
    pt: "Mostarda",
    it: "Senape",
    ru: "Горчичный",
    tr: "Hardal",
  },

  Teal: {
    hi: "टील",
    bn: "টিল",
    te: "టిల్",
    mr: "टील",
    ta: "டீல்",
    gu: "ટીલ",
    kn: "ಟೀಲ್",
    ml: "ടീൽ",
    pa: "ਟੀਲ",
    ur: "ٹیل",
    or: "ଟିଲ୍",
    as: "টিল",
    ne: "टिल",
    sa: "नीलहरित",
    kok: "टील",
    mai: "टील",
    ks: "ٹیل",
    sd: "ٽيل",
    doi: "टील",
    mni: "টিল",
    brx: "टिल",
    sat: "ᱴᱤᱞ",
    es: "Verde azulado",
    fr: "Sarcelle",
    de: "Petrol",
    ar: "أزرق مخضر",
    zh: "蓝绿色",
    ja: "ティール",
    ko: "틸",
    pt: "Azul-petróleo",
    it: "Verde acqua",
    ru: "Бирюзово-зелёный",
    tr: "Petrol",
  },

  Brown: {
    hi: "ब्राउन",
    bn: "বাদামি",
    te: "గోధుమ",
    mr: "तपकिरी",
    ta: "பழுப்பு",
    gu: "ભૂરો",
    kn: "ಕಂದು",
    ml: "തവിട്ട്",
    pa: "ਭੂਰਾ",
    ur: "بھورا",
    or: "ବାଦାମୀ",
    as: "মুগা",
    ne: "खैरो",
    sa: "कपिश",
    kok: "तपकिरी",
    mai: "भूरा",
    ks: "بھورا",
    sd: "ڀورو",
    doi: "भूरा",
    mni: "বাদামী",
    brx: "भूरा",
    sat: "ᱵᱷᱩᱨᱩ",
    es: "Marrón",
    fr: "Brun",
    de: "Braun",
    ar: "بني",
    zh: "棕色",
    ja: "ブラウン",
    ko: "브라운",
    pt: "Marrom",
    it: "Marrone",
    ru: "Коричневый",
    tr: "Kahverengi",
  },

  Beige: {
    hi: "बेज",
    bn: "বেইজ",
    te: "బేజ్",
    mr: "बेज",
    ta: "பேஜ்",
    gu: "બેઝ",
    kn: "ಬೇಜ್",
    ml: "ബേജ്",
    pa: "ਬੇਜ",
    ur: "بیج",
    or: "ବେଜ୍",
    as: "বেইজ",
    ne: "बेज",
    sa: "मृत्तिकावर्ण",
    kok: "बेज",
    mai: "बेज",
    ks: "بیج",
    sd: "بيج",
    doi: "बेज",
    mni: "বেইজ",
    brx: "बेज",
    sat: "ᱵᱮᱡᱽ",
    es: "Beige",
    fr: "Beige",
    de: "Beige",
    ar: "بيج",
    zh: "米色",
    ja: "ベージュ",
    ko: "베이지",
    pt: "Bege",
    it: "Beige",
    ru: "Бежевый",
    tr: "Bej",
  },

  Royal: {
    hi: "रॉयल",
    bn: "রয়্যাল",
    te: "రాయల్",
    mr: "रॉयल",
    ta: "ராயல்",
    gu: "રોયલ",
    kn: "ರಾಯಲ್",
    ml: "റോയൽ",
    pa: "ਰੌਇਲ",
    ur: "رائل",
    or: "ରୟାଲ୍",
    as: "ৰয়েল",
    ne: "रॉयल",
    sa: "राजकीय",
    kok: "रॉयल",
    mai: "रॉयल",
    ks: "رائل",
    sd: "رائل",
    doi: "रॉयल",
    mni: "রয়্যাল",
    brx: "रायल",
    sat: "ᱨᱚᱭᱟᱞ",
    es: "Real",
    fr: "Royal",
    de: "Königlich",
    ar: "ملكي",
    zh: "皇家",
    ja: "ロイヤル",
    ko: "로열",
    pt: "Royal",
    it: "Royal",
    ru: "Королевский",
    tr: "Kraliyet",
  },

  "Bottle Green": {
    hi: "बॉटल ग्रीन",
    bn: "বোতল সবুজ",
    te: "బాటిల్ గ్రీన్",
    mr: "बॉटल ग्रीन",
    ta: "பாட்டில் பச்சை",
    gu: "બોટલ ગ્રીન",
    kn: "ಬಾಟಲ್ ಗ್ರೀನ್",
    ml: "ബോട്ടിൽ ഗ്രീൻ",
    pa: "ਬੋਤਲ ਹਰਾ",
    ur: "بوتل سبز",
    or: "ବୋତଲ ସବୁଜ",
    as: "বটল সেউজ",
    ne: "बोतल हरियो",
    sa: "हरित",
    kok: "बॉटल ग्रीन",
    mai: "बॉटल ग्रीन",
    ks: "بوتل سبز",
    sd: "بوتل سائو",
    doi: "बॉटल ग्रीन",
    mni: "বোতল সবুজ",
    brx: "बटल ग्रीन",
    sat: "ᱵᱚᱴᱚᱞ ᱥᱟᱵᱩᱡ",
    es: "Verde botella",
    fr: "Vert bouteille",
    de: "Flaschengrün",
    ar: "أخضر داكن",
    zh: "瓶绿色",
    ja: "ボトルグリーン",
    ko: "보틀 그린",
    pt: "Verde garrafa",
    it: "Verde bottiglia",
    ru: "Бутылочно-зелёный",
    tr: "Şişe yeşili",
  },

  "Organic Cotton": {
    hi: "ऑर्गेनिक कॉटन",
    bn: "জৈব কটন",
    te: "ఆర్గానిక్ కాటన్",
    mr: "ऑर्गेनिक कॉटन",
    ta: "ஆர்கானிக் பருத்தி",
    gu: "ઓર્ગેનિક કપાસ",
    kn: "ಸಾವಯವ ಹತ್ತಿ",
    ml: "ഓർഗാനിക് പരുത്തി",
    pa: "ਆਰਗੈਨਿਕ ਕਾਟਨ",
    ur: "نامیاتی کاٹن",
    or: "ଅର୍ଗାନିକ୍ କଟନ୍",
    as: "জৈৱ কটন",
    ne: "अर्गानिक कटन",
    sa: "जैविककर्पास",
    kok: "ऑर्गेनिक कॉटन",
    mai: "ऑर्गेनिक कॉटन",
    ks: "آرگینک کاٹن",
    sd: "آرگينڪ ڪاٽن",
    doi: "ऑर्गेनिक कॉटन",
    mni: "অর্গানিক কটন",
    brx: "अर्गानिक कटन",
    sat: "ᱚᱨᱜᱟᱱᱤᱠ ᱠᱚᱴᱚᱱ",
    es: "Algodón orgánico",
    fr: "Coton biologique",
    de: "Bio-Baumwolle",
    ar: "قطن عضوي",
    zh: "有机棉",
    ja: "オーガニックコットン",
    ko: "유기농 면",
    pt: "Algodão orgânico",
    it: "Cotone biologico",
    ru: "Органический хлопок",
    tr: "Organik pamuk",
  },
};

/* =========================================================
   CATEGORY TRANSLATION
========================================================= */

const CATEGORY_NAMES = {
  cotton: {
    hi: "कॉटन",
    bn: "কটন",
    te: "కాటన్",
    mr: "कॉटन",
    ta: "பருத்தி",
    gu: "કપાસ",
    kn: "ಹತ್ತಿ",
    ml: "പരുത്തി",
    pa: "ਕਾਟਨ",
    ur: "کاٹن",
    or: "କଟନ୍",
    as: "কটন",
    ne: "कटन",
    sa: "कर्पास",
    es: "Algodón",
    fr: "Coton",
    de: "Baumwolle",
    ar: "قطن",
    zh: "棉",
    ja: "コットン",
    ko: "면",
    pt: "Algodão",
    it: "Cotone",
    ru: "Хлопок",
    tr: "Pamuk",
  },
  denim: TERMS.Denim,
  silk: TERMS.Silk,
  linen: TERMS.Linen,
  polyester: TERMS.Polyester,
  rayon: TERMS.Rayon,
  viscose: TERMS.Viscose,
  wool: TERMS.Wool,
  "custom-fabric": {
    hi: "कस्टम फैब्रिक",
    es: "Tela personalizada",
    fr: "Tissu personnalisé",
    de: "Individueller Stoff",
    ar: "نسيج مخصص",
    zh: "定制面料",
    ja: "カスタム生地",
    ko: "맞춤 원단",
    pt: "Tecido personalizado",
    it: "Tessuto personalizzato",
    ru: "Индивидуальная ткань",
    tr: "Özel kumaş",
  },
};

/* =========================================================
   TERM LOOKUP
========================================================= */

const TERM_KEYS = Object.keys({
  ...TERMS,
  ...GENERIC_TOKENS,
}).sort(
  (a, b) =>
    b.length - a.length
);

function translateTerms(
  value,
  language
) {
  if (!value) {
    return "";
  }

  if (language === "en") {
    return String(value);
  }

  let result =
    String(value);

  for (const key of TERM_KEYS) {
    const dictionary =
      TERMS[key] ||
      GENERIC_TOKENS[key];

    const translated =
      dictionary?.[language];

    if (!translated) {
      continue;
    }

    const escaped =
      key.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        "\\$&"
      );

    result =
      result.replace(
        new RegExp(
          `\\b${escaped}\\b`,
          "gi"
        ),
        translated
      );
  }

  return result
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   PRODUCT NAME
========================================================= */

function getProductName(
  product,
  language
) {
  const name =
    product?.name || "Product";

  return translateTerms(
    name,
    language
  );
}

/* =========================================================
   CATEGORY
========================================================= */

function getCategoryLabel(
  value,
  language
) {
  if (!value) {
    return "";
  }

  if (language === "en") {
    return value;
  }

  const key =
    normalize(value);

  const exact =
    CATEGORY_NAMES[key];

  if (
    exact?.[language]
  ) {
    return exact[language];
  }

  return translateTerms(
    value,
    language
  );
}

/* =========================================================
   SUBCATEGORY
========================================================= */

function getSubcategoryLabel(
  value,
  language
) {
  if (!value) {
    return "";
  }

  if (language === "en") {
    return value;
  }

  const normalized =
    normalize(value);

  const exactKey =
    Object.keys(
      {
        ...TERMS,
        ...GENERIC_TOKENS,
      }
    ).find(
      (key) =>
        normalize(key) ===
        normalized
    );

  if (exactKey) {
    const dictionary =
      TERMS[exactKey] ||
      GENERIC_TOKENS[exactKey];

    if (
      dictionary?.[language]
    ) {
      return dictionary[language];
    }
  }

  return translateTerms(
    value,
    language
  );
}

/* =========================================================
   MOQ UNIT
========================================================= */

const METER_LABELS = {
  en: "meters",
  hi: "मीटर",
  bn: "মিটার",
  te: "మీటర్లు",
  mr: "मीटर",
  ta: "மீட்டர்",
  gu: "મીટર",
  kn: "ಮೀಟರ್",
  ml: "മീറ്റർ",
  pa: "ਮੀਟਰ",
  ur: "میٹر",
  or: "ମିଟର",
  as: "মিটাৰ",
  ne: "मिटर",
  sa: "मीटर",
  kok: "मीटर",
  mai: "मीटर",
  ks: "میٹر",
  sd: "ميٽر",
  doi: "मीटर",
  mni: "মিটার",
  brx: "मिटर",
  sat: "ᱢᱤᱴᱟᱨ",
  es: "metros",
  fr: "mètres",
  de: "Meter",
  ar: "متر",
  zh: "米",
  ja: "メートル",
  ko: "미터",
  pt: "metros",
  it: "metri",
  ru: "метров",
  tr: "metre",
};

function formatMOQ(
  value,
  language
) {
  const number =
    cleanMoq(value);

  if (number === "—") {
    return number;
  }

  return `${number} ${
    METER_LABELS[language] ||
    METER_LABELS.en
  }`;
}

/* =========================================================
   DESCRIPTION
========================================================= */

const DESCRIPTION_TEMPLATES = {
  en: {
    by: "supplied by",
    suitable:
      "This textile product is suitable for B2B bulk sourcing.",
    price: "priced for B2B bulk sourcing at",
    moq: "MOQ",
    stock: "meters listed in stock.",
    noStock:
      "Stock availability depends on the supplier.",
  },

  hi: {
    by: "द्वारा उपलब्ध कराया गया",
    suitable:
      "यह टेक्सटाइल प्रोडक्ट B2B थोक सोर्सिंग के लिए उपयुक्त है।",
    price:
      "B2B थोक सोर्सिंग के लिए कीमत",
    moq: "न्यूनतम ऑर्डर मात्रा",
    stock:
      "मीटर स्टॉक उपलब्ध है।",
    noStock:
      "स्टॉक की उपलब्धता सप्लायर पर निर्भर है।",
  },

  bn: {
    by: "সরবরাহ করেছে",
    suitable:
      "এই টেক্সটাইল পণ্যটি B2B পাইকারি সোর্সিংয়ের জন্য উপযুক্ত।",
    price:
      "B2B পাইকারি সোর্সিং মূল্য",
    moq: "ন্যূনতম অর্ডার পরিমাণ",
    stock:
      "মিটার স্টক উপলভ্য।",
    noStock:
      "স্টকের প্রাপ্যতা সরবরাহকারীর উপর নির্ভর করে।",
  },

  te: {
    by: "అందించినది",
    suitable:
      "ఈ టెక్స్‌టైల్ ఉత్పత్తి B2B బల్క్ సోర్సింగ్‌కు అనుకూలంగా ఉంటుంది.",
    price:
      "B2B బల్క్ సోర్సింగ్ ధర",
    moq: "కనిష్ట ఆర్డర్ పరిమాణం",
    stock:
      "మీటర్ల స్టాక్ అందుబాటులో ఉంది.",
    noStock:
      "స్టాక్ లభ్యత సరఫరాదారుపై ఆధారపడి ఉంటుంది.",
  },

  mr: {
    by: "यांनी उपलब्ध करून दिलेले",
    suitable:
      "हे टेक्सटाइल उत्पादन B2B घाऊक सोर्सिंगसाठी योग्य आहे.",
    price:
      "B2B घाऊक सोर्सिंगसाठी किंमत",
    moq: "किमान ऑर्डर प्रमाण",
    stock:
      "मीटर स्टॉक उपलब्ध आहे.",
    noStock:
      "स्टॉकची उपलब्धता सप्लायरवर अवलंबून आहे.",
  },

  ta: {
    by: "வழங்கியது",
    suitable:
      "இந்த டெக்ஸ்டைல் தயாரிப்பு B2B மொத்த கொள்முதலுக்கு ஏற்றது.",
    price:
      "B2B மொத்த கொள்முதல் விலை",
    moq: "குறைந்தபட்ச ஆர்டர் அளவு",
    stock:
      "மீட்டர் ஸ்டாக் கிடைக்கிறது.",
    noStock:
      "ஸ்டாக் கிடைப்பது சப்ளையரைப் பொறுத்தது.",
  },

  gu: {
    by: "દ્વારા ઉપલબ્ધ કરાયેલ",
    suitable:
      "આ ટેક્સટાઇલ પ્રોડક્ટ B2B જથ્થાબંધ સોર્સિંગ માટે યોગ્ય છે.",
    price:
      "B2B જથ્થાબંધ સોર્સિંગ માટે કિંમત",
    moq: "ન્યૂનતમ ઓર્ડર જથ્થો",
    stock:
      "મીટરનો સ્ટોક ઉપલબ્ધ છે.",
    noStock:
      "સ્ટોકની ઉપલબ્ધતા સપ્લાયર પર આધારિત છે.",
  },

  kn: {
    by: "ಒದಗಿಸಿದವರು",
    suitable:
      "ಈ ಟೆಕ್ಸ್ಟೈಲ್ ಉತ್ಪನ್ನವು B2B ಬಲ್ಕ್ ಸೋರ್ಸಿಂಗ್‌ಗೆ ಸೂಕ್ತವಾಗಿದೆ.",
    price:
      "B2B ಬಲ್ಕ್ ಸೋರ್ಸಿಂಗ್ ಬೆಲೆ",
    moq: "ಕನಿಷ್ಠ ಆರ್ಡರ್ ಪ್ರಮಾಣ",
    stock:
      "ಮೀಟರ್ ಸ್ಟಾಕ್ ಲಭ್ಯವಿದೆ.",
    noStock:
      "ಸ್ಟಾಕ್ ಲಭ್ಯತೆ ಪೂರೈಕೆದಾರರ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ.",
  },

  ml: {
    by: "ലഭ്യമാക്കിയത്",
    suitable:
      "ഈ ടെക്സ്റ്റൈൽ ഉൽപ്പന്നം B2B ബൾക്ക് സോഴ്സിംഗിന് അനുയോജ്യമാണ്.",
    price:
      "B2B ബൾക്ക് സോഴ്സിംഗ് വില",
    moq: "കുറഞ്ഞ ഓർഡർ അളവ്",
    stock:
      "മീറ്റർ സ്റ്റോക്ക് ലഭ്യമാണ്.",
    noStock:
      "സ്റ്റോക്ക് ലഭ്യത വിതരണക്കാരനെ ആശ്രയിച്ചിരിക്കുന്നു.",
  },

  pa: {
    by: "ਵੱਲੋਂ ਉਪਲਬਧ ਕਰਵਾਇਆ ਗਿਆ",
    suitable:
      "ਇਹ ਟੈਕਸਟਾਈਲ ਉਤਪਾਦ B2B ਥੋਕ ਸੋਰਸਿੰਗ ਲਈ ਢੁੱਕਵਾਂ ਹੈ।",
    price:
      "B2B ਥੋਕ ਸੋਰਸਿੰਗ ਕੀਮਤ",
    moq: "ਘੱਟੋ-ਘੱਟ ਆਰਡਰ ਮਾਤਰਾ",
    stock:
      "ਮੀਟਰ ਸਟਾਕ ਉਪਲਬਧ ਹੈ।",
    noStock:
      "ਸਟਾਕ ਦੀ ਉਪਲਬਧਤਾ ਸਪਲਾਇਰ 'ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
  },

  ur: {
    by: "کی طرف سے فراہم کردہ",
    suitable:
      "یہ ٹیکسٹائل پروڈکٹ B2B تھوک سورسنگ کے لیے موزوں ہے۔",
    price:
      "B2B تھوک سورسنگ کے لیے قیمت",
    moq: "کم از کم آرڈر کی مقدار",
    stock:
      "میٹر اسٹاک دستیاب ہے۔",
    noStock:
      "اسٹاک کی دستیابی سپلائر پر منحصر ہے۔",
  },

  es: {
    by: "suministrado por",
    suitable:
      "Este producto textil es adecuado para abastecimiento mayorista B2B.",
    price:
      "con un precio para abastecimiento B2B de",
    moq: "Cantidad mínima de pedido",
    stock:
      "metros disponibles en stock.",
    noStock:
      "La disponibilidad de stock depende del proveedor.",
  },

  fr: {
    by: "fourni par",
    suitable:
      "Ce produit textile convient à l'approvisionnement en gros B2B.",
    price:
      "au prix B2B de",
    moq:
      "Quantité minimale de commande",
    stock:
      "mètres en stock.",
    noStock:
      "La disponibilité du stock dépend du fournisseur.",
  },

  de: {
    by: "angeboten von",
    suitable:
      "Dieses Textilprodukt eignet sich für den B2B-Großhandel.",
    price:
      "für den B2B-Großhandel zu",
    moq:
      "Mindestbestellmenge",
    stock:
      "Meter Lagerbestand verfügbar.",
    noStock:
      "Die Lagerverfügbarkeit hängt vom Lieferanten ab.",
  },

  ar: {
    by: "مقدم من",
    suitable:
      "هذا المنتج النسيجي مناسب للتوريد بالجملة بين الشركات.",
    price:
      "بسعر مناسب للتوريد بالجملة",
    moq:
      "الحد الأدنى لكمية الطلب",
    stock:
      "متر متوفر في المخزون.",
    noStock:
      "توافر المخزون يعتمد على المورد.",
  },

  zh: {
    by: "由",
    suitable:
      "该纺织产品适用于B2B批量采购。",
    price:
      "B2B批量采购价格为",
    moq:
      "最小起订量",
    stock:
      "米库存。",
    noStock:
      "库存情况取决于供应商。",
  },

  ja: {
    by: "提供元：",
    suitable:
      "このテキスタイル製品はB2B大量調達に適しています。",
    price:
      "B2B大量調達価格",
    moq:
      "最小注文数量",
    stock:
      "メートル在庫があります。",
    noStock:
      "在庫状況はサプライヤーによって異なります。",
  },

  ko: {
    by: "제공:",
    suitable:
      "이 섬유 제품은 B2B 대량 소싱에 적합합니다.",
    price:
      "B2B 대량 소싱 가격",
    moq:
      "최소 주문 수량",
    stock:
      "미터의 재고가 있습니다.",
    noStock:
      "재고 여부는 공급업체에 따라 다릅니다.",
  },

  pt: {
    by: "fornecido por",
    suitable:
      "Este produto têxtil é adequado para fornecimento em atacado B2B.",
    price:
      "com preço para fornecimento B2B de",
    moq:
      "Quantidade mínima do pedido",
    stock:
      "metros em estoque.",
    noStock:
      "A disponibilidade de estoque depende do fornecedor.",
  },

  it: {
    by: "fornito da",
    suitable:
      "Questo prodotto tessile è adatto all'approvvigionamento all'ingrosso B2B.",
    price:
      "con prezzo per approvvigionamento B2B di",
    moq:
      "Quantità minima d'ordine",
    stock:
      "metri disponibili in magazzino.",
    noStock:
      "La disponibilità di magazzino dipende dal fornitore.",
  },

  ru: {
    by: "поставляется",
    suitable:
      "Этот текстильный продукт подходит для оптовых B2B-закупок.",
    price:
      "цена для B2B-опта",
    moq:
      "Минимальный объем заказа",
    stock:
      "метров доступно на складе.",
    noStock:
      "Наличие зависит от поставщика.",
  },

  tr: {
    by: "tedarik eden",
    suitable:
      "Bu tekstil ürünü B2B toplu tedarik için uygundur.",
    price:
      "B2B toplu tedarik fiyatı",
    moq:
      "Minimum sipariş miktarı",
    stock:
      "metre stok mevcuttur.",
    noStock:
      "Stok durumu tedarikçiye bağlıdır.",
  },
};

function getDescription(
  product,
  language
) {
  if (!product) {
    return "";
  }

  if (
    language === "en" &&
    product.description
  ) {
    return product.description;
  }

  const template =
    DESCRIPTION_TEMPLATES[
      language
    ] ||
    DESCRIPTION_TEMPLATES.en;

  const supplier =
    product.supplier ||
    "TEXVERSE";

  const name =
    getProductName(
      product,
      language
    );

  const category =
    getCategoryLabel(
      product.category,
      language
    );

  const subcategory =
    getSubcategoryLabel(
      product.subcategory,
      language
    );

  const type =
    subcategory || category;

  const color =
    product.color
      ? translateTerms(
          product.color,
          language
        )
      : "";

  const price =
    Number.isFinite(
      Number(product.price)
    )
      ? `₹${formatPrice(
          product.price
        )}`
      : "B2B";

  const moq =
    formatMOQ(
      product.moq,
      language
    );

  const stock =
    Number(product.stock);

  if (language === "zh") {
    return `${supplier}${template.by}${name}。${template.suitable}${color ? `${color}色调，` : ""}${type}面料，${template.price}${price}。${template.moq}：${moq}，${stock > 0 ? `${stock.toLocaleString("en-IN")} ${template.stock}` : template.noStock}`;
  }

  if (language === "ja") {
    return `${supplier}${template.by}${name}。${template.suitable}${color ? `${color}仕上げの` : ""}${type}素材です。${template.price} ₹${formatPrice(product.price)} / メートル。${template.moq}：${moq}。${stock > 0 ? `${stock.toLocaleString("en-IN")} ${template.stock}` : template.noStock}`;
  }

  if (language === "ko") {
    return `${supplier} ${template.by} ${name}. ${template.suitable} ${color ? `${color} 마감의 ` : ""}${type} 원단입니다. ${template.price} ₹${formatPrice(product.price)} / 미터. ${template.moq}: ${moq}. ${stock > 0 ? `${stock.toLocaleString("en-IN")} ${template.stock}` : template.noStock}`;
  }

  if (language === "ar") {
    return `${template.by} ${supplier}: ${name}. ${template.suitable} ${color ? `${type} بتشطيب ${color}` : type}. ${template.price} ₹${formatPrice(product.price)}. ${template.moq}: ${moq}. ${stock > 0 ? `${stock.toLocaleString("en-IN")} ${template.stock}` : template.noStock}`;
  }

  if (language === "ru") {
    return `${name}, ${template.by} ${supplier}. ${template.suitable} ${color ? `${type}, отделка ${color}` : type}. ${template.price} ₹${formatPrice(product.price)}. ${template.moq}: ${moq}. ${stock > 0 ? `${stock.toLocaleString("en-IN")} ${template.stock}` : template.noStock}`;
  }

  return `${template.by} ${supplier} ${name}. ${template.suitable} ${color ? `${color} ${type}` : type}. ${template.price} ${price}. ${template.moq}: ${moq}. ${stock > 0 ? `${stock.toLocaleString("en-IN")} ${template.stock}` : template.noStock}`
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   UI LABEL HELPER
========================================================= */

function ui(
  key,
  language,
  variables = {}
) {
  const source =
    UI[key] ||
    SMALL_UI[key];

  if (!source) {
    return key;
  }

  let value =
    source[language] ||
    source.en ||
    key;

  for (const variable of Object.keys(
    variables
  )) {
    value =
      value.replaceAll(
        `{${variable}}`,
        String(
          variables[variable]
        )
      );
  }

  return value;
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  language,
}) {
  const image =
    resolveProductImage(
      product?.image
    );

  const category =
    getCategoryLabel(
      product?.category,
      language
    );

  const subcategory =
    getSubcategoryLabel(
      product?.subcategory ||
        product?.category,
      language
    );

  const name =
    getProductName(
      product,
      language
    );

  const description =
    getDescription(
      product,
      language
    );

  const supplier =
    product?.supplier ||
    "TEXVERSE";

  const stock =
    Number(product?.stock);

  return (
    <article dir={isRTL(language) ? "rtl" : "ltr"} className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-cyan-400/5">
      <Link
        to={`/product/${product.id}`}
        className="relative block h-60 overflow-hidden bg-slate-800"
      >
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            {ui(
              "noImage",
              language
            )}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-slate-950/90 to-transparent" />

        {product?.verified && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-extrabold text-slate-950">
            <ShieldCheck
              size={14}
            />
            {ui(
              "verified",
              language
            )}
          </span>
        )}

        {subcategory && (
          <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {subcategory}
          </span>
        )}
      </Link>

      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {subcategory ||
              category}
          </p>

          <span className="flex items-center gap-1 text-xs text-yellow-400">
            <Star
              size={14}
              fill="currentColor"
            />

            {product?.rating ||
              ui(
                "new",
                language
              )}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="mt-2 block text-xl font-black transition hover:text-cyan-300"
        >
          {name}
        </Link>

        <p className="mt-2 text-sm text-slate-400">
          {supplier}
        </p>

        <p className="mt-3 line-clamp-3 text-sm text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <span className="text-2xl font-black">
              ₹
              {formatPrice(
                product?.price
              )}
            </span>

            <span className="text-sm text-slate-500">
              /
              {METER_LABELS[
                language
              ] ||
                product?.unit ||
                METER_LABELS.en}
            </span>
          </div>

          <div className="text-right">
            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              {ui(
                "moq",
                language
              )}
            </p>

            <span className="inline-flex items-center gap-1 text-xs text-slate-300">
              <Package
                size={14}
              />

              {formatMOQ(
                product?.moq,
                language
              )}
            </span>
          </div>
        </div>

        <div dir="ltr" className="mt-4 flex items-center justify-between text-xs">
          <span
            className={
              stock > 0
                ? "text-emerald-400"
                : "text-red-400"
            }
          >
            {stock > 0
              ? `${ui(
                  "inStock",
                  language
                )}: ${stock.toLocaleString(
                  "en-IN"
                )}`
              : ui(
                  "outOfStock",
                  language
                )}
          </span>

          <span className="text-slate-500">
            {ui(
              "productNumber",
              language
            )}{" "}
            #{product?.id}
          </span>
        </div>

        <Link
          to={`/product/${product.id}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
        >
          {ui(
            "viewProduct",
            language
          )}

          <ArrowRight
            size={16}
          />
        </Link>
      </div>
    </article>
  );
}

/* =========================================================
   MARKETPLACE
========================================================= */

export default function Marketplace() {
  const [
    params,
  ] = useSearchParams();

  const language =
    useDocumentLanguage();

  const initialCategory =
    params.get("category") ||
    "all";

  const initialSubcategory =
    params.get("subcategory") ||
    "all";

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState(
      initialCategory
    );

  const [
    subcategory,
    setSubcategory,
  ] = useState(
    initialSubcategory
  );

  const [sort, setSort] =
    useState("featured");

  const [
    verifiedOnly,
    setVerifiedOnly,
  ] = useState(false);

  const [maxPrice, setMaxPrice] =
    useState("");

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadCatalog =
    async () => {
      setLoading(true);
      setError("");

      try {
        const [
          productResult,
          categoryResult,
        ] = await Promise.all([
          productApi.list(),
          productApi.categories(),
        ]);

        setProducts(
          Array.isArray(
            productResult
          )
            ? productResult
            : []
        );

        setCategories(
          Array.isArray(
            categoryResult
          )
            ? categoryResult
            : []
        );
      } catch (err) {
        console.error(
          "TEXVERSE Marketplace catalog error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load TEXVERSE catalog."
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadCatalog();
  }, []);

  /* =======================================================
     ACTIVE CATEGORY
  ======================================================= */

  const activeCategory =
    useMemo(
      () =>
        categories.find(
          (item) =>
            normalize(
              item?.id
            ) ===
            normalize(
              category
            )
        ),
      [
        categories,
        category,
      ]
    );

  /* =======================================================
     SUBCATEGORIES
  ======================================================= */

  const subcategoryOptions =
    useMemo(() => {
      if (!activeCategory) {
        return [];
      }

      const categoryId =
        normalize(
          activeCategory.id
        );

      const fromApi =
        Array.isArray(
          activeCategory.subcategories
        )
          ? activeCategory.subcategories
          : [];

      const fromProducts =
        products
          .filter(
            (product) =>
              normalize(
                product.category
              ) === categoryId &&
              product.subcategory
          )
          .map(
            (product) =>
              product.subcategory
          );

      const result = [];
      const seen =
        new Set();

      [
        ...fromApi,
        ...fromProducts,
      ].forEach((item) => {
        const value =
          String(item).trim();

        if (!value) {
          return;
        }

        const key =
          normalize(value);

        if (seen.has(key)) {
          return;
        }

        seen.add(key);
        result.push(value);
      });

      return result.sort(
        (a, b) =>
          a.localeCompare(
            b,
            undefined,
            {
              sensitivity:
                "base",
            }
          )
      );
    }, [
      activeCategory,
      products,
    ]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filtered =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const result =
        products.filter(
          (product) => {
            const haystack = [
              product?.name,
              product?.category,
              product?.subcategory,
              product?.supplier,
              product?.description,
              product?.color,
              product?.pattern,
              product?.material,
              product?.composition,
              ...(Array.isArray(
                product?.bestFor
              )
                ? product.bestFor
                : []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            const searchMatch =
              !query ||
              haystack.includes(
                query
              );

            const categoryMatch =
              category ===
                "all" ||
              normalize(
                product?.category
              ) ===
                normalize(
                  category
                );

            const subcategoryMatch =
              subcategory ===
                "all" ||
              normalize(
                product?.subcategory
              ) ===
                normalize(
                  subcategory
                );

            const verifiedMatch =
              !verifiedOnly ||
              Boolean(
                product?.verified
              );

            const price =
              Number(
                product?.price
              );

            const max =
              Number(maxPrice);

            const priceMatch =
              !maxPrice ||
              (Number.isFinite(
                price
              ) &&
                Number.isFinite(
                  max
                ) &&
                price <= max);

            return (
              searchMatch &&
              categoryMatch &&
              subcategoryMatch &&
              verifiedMatch &&
              priceMatch
            );
          }
        );

      return [
        ...result,
      ].sort((a, b) => {
        if (
          sort ===
          "price-low"
        ) {
          return (
            Number(
              a?.price || 0
            ) -
            Number(
              b?.price || 0
            )
          );
        }

        if (
          sort ===
          "price-high"
        ) {
          return (
            Number(
              b?.price || 0
            ) -
            Number(
              a?.price || 0
            )
          );
        }

        if (
          sort ===
          "rating"
        ) {
          return (
            Number(
              b?.rating || 0
            ) -
            Number(
              a?.rating || 0
            )
          );
        }

        return (
          Number(
            Boolean(
              b?.verified
            )
          ) -
            Number(
              Boolean(
                a?.verified
              )
            ) ||
          Number(
            b?.rating || 0
          ) -
            Number(
              a?.rating || 0
            ) ||
          Number(
            a?.price || 0
          ) -
            Number(
              b?.price || 0
            )
        );
      });
    }, [
      products,
      search,
      category,
      subcategory,
      sort,
      verifiedOnly,
      maxPrice,
    ]);

  /* =======================================================
     FILTER ACTIONS
  ======================================================= */

  const chooseCategory = (
    id
  ) => {
    setCategory(id);
    setSubcategory("all");
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSubcategory("all");
    setVerifiedOnly(false);
    setMaxPrice("");
    setSort("featured");
  };

  const hasActiveFilters =
    Boolean(search) ||
    category !== "all" ||
    subcategory !==
      "all" ||
    verifiedOnly ||
    Boolean(maxPrice);

  /* =======================================================
     CATEGORY LABEL
  ======================================================= */

  const activeCategoryName =
    activeCategory
      ? getCategoryLabel(
          activeCategory.name ||
            activeCategory.id,
          language
        )
      : "";

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main dir={isRTL(language) ? "rtl" : "ltr"} className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <div className="text-center">
            <Loader2
              size={42}
              className="mx-auto animate-spin text-cyan-400"
            />

            <h2 className="mt-5 text-2xl font-black">
              {ui(
                "loadingTitle",
                language
              )}
            </h2>

            <p className="mt-2 text-slate-500">
              {ui(
                "loadingDescription",
                language
              )}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <main dir={isRTL(language) ? "rtl" : "ltr"} className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white md:px-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-slate-900 p-10 text-center">
          <h1 className="text-3xl font-black text-red-300">
            {ui(
              "marketplaceUnavailable",
              language
            )}
          </h1>

          <p className="mt-3 text-slate-400">
            {error}
          </p>

          <button
            onClick={
              loadCatalog
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300"
          >
            <RefreshCw
              size={17}
            />

            {ui(
              "retry",
              language
            )}
          </button>
        </div>
      </main>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main dir={isRTL(language) ? "rtl" : "ltr"} className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white md:px-6">
      <div className="mx-auto max-w-7xl">

        {/* HERO */}

        <section className="relative mb-8 overflow-hidden rounded-4xl border border-cyan-400/15 bg-linear-to-br from-cyan-400/10 via-slate-900 to-slate-950 p-7 md:p-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-300">
              <Sparkles size={16} />

              {ui(
                "eyebrow",
                language
              )}
            </div>

            <div dir="ltr" className="mt-3 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                  {activeCategory
                    ? ui(
                        "heroCategory",
                        language,
                        {
                          category:
                            activeCategoryName,
                        }
                      )
                    : ui(
                        "hero",
                        language
                      )}
                </h1>

                <p className="mt-4 max-w-3xl leading-7 text-slate-400">
                  {ui(
                    "description",
                    language
                  )}
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-cyan-400/10 bg-slate-950/60 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {ui(
                    "liveCatalog",
                    language
                  )}
                </p>

                <p className="mt-1 text-3xl font-black text-cyan-300">
                  {products.length.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <p className="text-xs text-slate-500">
                  {ui(
                    "verifiedAvailable",
                    language
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN */}

        <div dir="ltr" className="grid gap-7 lg:grid-cols-[250px_1fr]">

          {/* SIDEBAR */}

          <aside dir={isRTL(language) ? "rtl" : "ltr"} className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-5 lg:sticky lg:top-24">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold">
                <SlidersHorizontal
                  size={18}
                  className="text-cyan-400"
                />

                {ui(
                  "filters",
                  language
                )}
              </div>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-xs text-slate-500 transition hover:text-cyan-300"
              >
                {ui(
                  "clear",
                  language
                )}
              </button>
            </div>

            {/* CATEGORIES */}

            <div className="mt-5 space-y-1.5">
              <button
                type="button"
                onClick={() =>
                  chooseCategory(
                    "all"
                  )
                }
                className={`w-full rounded-xl px-4 py-3 ${isRTL(language) ? "text-right" : "text-left"} transition ${
                  category === "all"
                    ? "bg-cyan-400 font-bold text-slate-950"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {ui(
                  "allProducts",
                  language
                )}
              </button>

              {categories.map(
                (item) => (
                  <button
                    type="button"
                    key={
                      item.id
                    }
                    onClick={() =>
                      chooseCategory(
                        item.id
                      )
                    }
                    className={`w-full rounded-xl px-4 py-3 ${isRTL(language) ? "text-right" : "text-left"} transition ${
                      normalize(
                        category
                      ) ===
                      normalize(
                        item.id
                      )
                        ? "bg-cyan-400 font-bold text-slate-950"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    {getCategoryLabel(
                      item.name ||
                        item.id,
                      language
                    )}
                  </button>
                )
              )}
            </div>

            {/* SUBCATEGORIES */}

            {activeCategory && (
              <div className="mt-7 border-t border-slate-800 pt-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                  {ui(
                    "subcategories",
                    language
                  )}
                </p>

                <div className="space-y-1">

                  <button
                    type="button"
                    onClick={() =>
                      setSubcategory(
                        "all"
                      )
                    }
                    className={`w-full rounded-lg px-3 py-2.5 ${isRTL(language) ? "text-right" : "text-left"} text-sm ${
                      subcategory ===
                      "all"
                        ? "bg-slate-800 font-bold text-cyan-300"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {ui(
                      "all",
                      language
                    )}{" "}
                    {getCategoryLabel(
                      activeCategory.name ||
                        activeCategory.id,
                      language
                    )}
                  </button>

                  {subcategoryOptions.map(
                    (item) => (
                      <button
                        type="button"
                        key={normalize(
                          item
                        )}
                        onClick={() =>
                          setSubcategory(
                            item
                          )
                        }
                        className={`w-full rounded-lg px-3 py-2.5 ${isRTL(language) ? "text-right" : "text-left"} text-sm ${
                          normalize(
                            subcategory
                          ) ===
                          normalize(
                            item
                          )
                            ? "bg-slate-800 font-bold text-cyan-300"
                            : "text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {getSubcategoryLabel(
                          item,
                          language
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* VERIFIED + MAX PRICE */}

            <div className="mt-7 border-t border-slate-800 pt-6">

              <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-300">
                <span>
                  {ui(
                    "verifiedSuppliers",
                    language
                  )}
                </span>

                <input
                  type="checkbox"
                  checked={
                    verifiedOnly
                  }
                  onChange={(
                    event
                  ) =>
                    setVerifiedOnly(
                      event.target
                        .checked
                    )
                  }
                  className="h-4 w-4 accent-cyan-400"
                />
              </label>

              <label className="mt-5 block text-xs font-bold uppercase tracking-widest text-slate-500">
                {ui(
                  "maximumPrice",
                  language
                )}
              </label>

              <input
                type="number"
                min="0"
                value={
                  maxPrice
                }
                onChange={(
                  event
                ) =>
                  setMaxPrice(
                    event.target
                      .value
                  )
                }
                placeholder={ui(
                  "priceExample",
                  language
                )}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-3 outline-none transition focus:border-cyan-400"
              />
            </div>
          </aside>

          {/* PRODUCTS */}

          <section>

            {activeCategory && (
              <div className="mb-6 rounded-3xl border border-slate-800 bg-slate-900 p-5">
                <div dir="ltr" className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                      {ui(
                        "categoryCollection",
                        language
                      )}
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      {activeCategoryName}{" "}
                      {ui(
                        "exploreByConstruction",
                        language
                      )}
                    </h2>

                    {activeCategory.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                        {language ===
                        "en"
                          ? activeCategory.description
                          : translateTerms(
                              activeCategory.description,
                              language
                            )}
                      </p>
                    )}
                  </div>

                  <div className="text-sm text-slate-400">
                    {
                      subcategoryOptions.length
                    }{" "}
                    {subcategoryOptions.length ===
                    1
                      ? "subcategory"
                      : "subcategories"}
                  </div>
                </div>

                <div dir="ltr" className="mt-5 flex gap-2 overflow-x-auto pb-1">
                  {subcategoryOptions.map(
                    (item) => (
                      <button
                        type="button"
                        key={normalize(
                          item
                        )}
                        onClick={() =>
                          setSubcategory(
                            item
                          )
                        }
                        className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                          normalize(
                            subcategory
                          ) ===
                          normalize(
                            item
                          )
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                            : "border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {getSubcategoryLabel(
                          item,
                          language
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* SEARCH */}

            <div dir="ltr" className="mb-6 flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={
                    search
                  }
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder={ui(
                    "searchPlaceholder",
                    language
                  )}
                  dir={isRTL(language) ? "rtl" : "ltr"} className="w-full rounded-2xl border border-slate-700 bg-slate-900 py-4 pl-12 pr-5 outline-none transition focus:border-cyan-400"
                />
              </div>

              <select
                value={sort}
                onChange={(
                  event
                ) =>
                  setSort(
                    event.target
                      .value
                  )
                }
                className="rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 outline-none"
              >
                <option value="featured">
                  {ui(
                    "recommended",
                    language
                  )}
                </option>

                <option value="rating">
                  {ui(
                    "highestRated",
                    language
                  )}
                </option>

                <option value="price-low">
                  {ui(
                    "priceLow",
                    language
                  )}
                </option>

                <option value="price-high">
                  {ui(
                    "priceHigh",
                    language
                  )}
                </option>
              </select>
            </div>

            {/* COUNT */}

            <div dir="ltr" className="mb-5 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                <strong className="text-white">
                  {filtered.length.toLocaleString(
                    "en-IN"
                  )}
                </strong>{" "}
                {ui(
                  "matching",
                  language
                )}{" "}
                {filtered.length ===
                1
                  ? ui(
                      "product",
                      language
                    )
                  : ui(
                      "products",
                      language
                    )}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="flex items-center gap-1 text-sm text-cyan-300"
                >
                  <X size={14} />

                  {ui(
                    "clearActiveFilters",
                    language
                  )}
                </button>
              )}
            </div>

            {/* EMPTY */}

            {filtered.length ===
            0 ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-900 p-12 text-center">
                <h3 className="text-xl font-black">
                  {ui(
                    "noProducts",
                    language
                  )}
                </h3>

                <p className="mt-2 text-slate-500">
                  {ui(
                    "tryAnother",
                    language
                  )}
                </p>

                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                >
                  {ui(
                    "viewAllProducts",
                    language
                  )}
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map(
                  (product) => (
                    <ProductCard
                      key={
                        product.id
                      }
                      product={
                        product
                      }
                      language={
                        language
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
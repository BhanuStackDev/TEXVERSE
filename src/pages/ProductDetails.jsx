import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Droplets,
  Flame,
  Wind,
  Ban,
  Shirt,
  PackageCheck,
  Send,
  ShieldCheck,
  ShoppingCart,
  Minus,
  Plus,
  ChevronRight,
  Sparkles,
  Loader2,
  RefreshCw,
  Star,
} from "lucide-react";

import { productApi, getImageUrl } from "../services/api";

/* =========================================================
   TEXVERSE PRODUCT DETAILS
   34 LANGUAGES
   RTL SAFE
   ---------------------------------------------------------
   IMPORTANT:
   1. Structural layout ALWAYS remains LTR.
   2. Only text/content gets RTL for:
      ur, ks, sd, ar
   3. Image/details columns never swap.
========================================================= */

const LANGUAGES = [
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

const RTL_LANGUAGES = new Set([
  "ur",
  "ks",
  "sd",
  "ar",
]);

const isRTL = (language) =>
  RTL_LANGUAGES.has(language);

const getCurrentLanguage = () => {
  if (typeof document === "undefined") {
    return "en";
  }

  const lang = String(
    document.documentElement.lang || "en"
  )
    .toLowerCase()
    .split("-")[0];

  return LANGUAGES.includes(lang)
    ? lang
    : "en";
};

function useDocumentLanguage() {
  const [language, setLanguage] = useState(
    getCurrentLanguage
  );

  useEffect(() => {
    const root = document.documentElement;

    const updateLanguage = () => {
      const next = String(
        root.lang || "en"
      )
        .toLowerCase()
        .split("-")[0];

      setLanguage(
        LANGUAGES.includes(next)
          ? next
          : "en"
      );
    };

    updateLanguage();

    const observer =
      new MutationObserver(
        updateLanguage
      );

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return language;
}

/* =========================================================
   HELPERS
========================================================= */

const text = (
  dictionary,
  language,
  fallback = ""
) =>
  dictionary?.[language] ||
  dictionary?.en ||
  fallback;

const replaceVars = (
  value,
  variables = {}
) =>
  String(value || "").replace(
    /\{(\w+)\}/g,
    (_, key) =>
      variables[key] == null
        ? `{${key}}`
        : String(variables[key])
  );

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

const formatNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return number.toLocaleString("en-IN");
};

const getNumericMoq = (value) => {
  const match = String(
    value ?? ""
  )
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/);

  const number = match
    ? Number(match[0])
    : 1;

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    return 1;
  }

  return Math.ceil(number);
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
   UI TRANSLATIONS
========================================================= */

const UI = {
  categories: {
    en: "Categories",
    hi: "कैटेगरी",
    bn: "ক্যাটেগরি",
    te: "కేటగిరీలు",
    mr: "कॅटेगरीज",
    ta: "வகைகள்",
    gu: "કેટેગરીઝ",
    kn: "ವರ್ಗಗಳು",
    ml: "വിഭാഗങ്ങൾ",
    pa: "ਸ਼੍ਰੇਣੀਆਂ",
    ur: "زمرے",
    or: "ବର୍ଗ",
    as: "শ্ৰেণী",
    ne: "श्रेणीहरू",
    sa: "वर्गाः",
    kok: "वर्ग",
    mai: "श्रेणी",
    ks: "زمرٕ",
    sd: "زمرا",
    doi: "श्रेणियां",
    mni: "ꯈꯟꯅ",
    brx: "श्रेणी",
    sat: "ᱵᱚᱨᱜᱚ",
    es: "Categorías",
    fr: "Catégories",
    de: "Kategorien",
    ar: "الفئات",
    zh: "分类",
    ja: "カテゴリー",
    ko: "카테고리",
    pt: "Categorias",
    it: "Categorie",
    ru: "Категории",
    tr: "Kategoriler",
  },

  marketplace: {
    en: "Marketplace",
    hi: "मार्केटप्लेस",
    bn: "মার্কেটপ্লেস",
    te: "మార్కెట్‌ప్లేస్",
    mr: "मार्केटप्लेस",
    ta: "சந்தை",
    gu: "માર્કેટપ્લેસ",
    kn: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
    ml: "മാർക്കറ്റ്പ്ലേസ്",
    pa: "ਮਾਰਕੀਟਪਲੇਸ",
    ur: "مارکیٹ پلیس",
    or: "ମାର୍କେଟପ୍ଲେସ୍",
    as: "মাৰ্কেটপ্লেচ",
    ne: "मार्केटप्लेस",
    sa: "विपणिस्थलम्",
    kok: "मार्केटप्लेस",
    mai: "मार्केटप्लेस",
    ks: "مارکیٹ پلیس",
    sd: "مارڪيٽ پلیس",
    doi: "मार्केटप्लेस",
    mni: "ꯃꯥꯔꯀꯦꯠꯄ꯭ꯂꯦꯁ",
    brx: "मार्केटप्लेस",
    sat: "ᱢᱟᱨᱠᱮᱴᱯᱞᱮᱥ",
    es: "Marketplace",
    fr: "Marketplace",
    de: "Marktplatz",
    ar: "السوق",
    zh: "市场",
    ja: "マーケットプレイス",
    ko: "마켓플레이스",
    pt: "Marketplace",
    it: "Marketplace",
    ru: "Маркетплейс",
    tr: "Pazaryeri",
  },

  loading: {
    en: "Loading Product",
    hi: "प्रोडक्ट लोड हो रहा है",
    bn: "পণ্য লোড হচ্ছে",
    te: "ఉత్పత్తి లోడ్ అవుతోంది",
    mr: "उत्पादन लोड होत आहे",
    ta: "தயாரிப்பு ஏற்றப்படுகிறது",
    gu: "પ્રોડક્ટ લોડ થઈ રહ્યું છે",
    kn: "ಉತ್ಪನ್ನ ಲೋಡ್ ಆಗುತ್ತಿದೆ",
    ml: "ഉൽപ്പന്നം ലോഡ് ചെയ്യുന്നു",
    pa: "ਉਤਪਾਦ ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ",
    ur: "پروڈکٹ لوڈ ہو رہا ہے",
    or: "ପ୍ରୋଡକ୍ଟ ଲୋଡ୍ ହେଉଛି",
    as: "প্ৰডাক্ট লোড হৈ আছে",
    ne: "उत्पादन लोड हुँदैछ",
    sa: "उत्पादं लोड् भवति",
    kok: "उत्पादन लोड जाता",
    mai: "प्रोडक्ट लोड भ रहल अछि",
    ks: "پروڈکٹ لوڈ گژھان",
    sd: "پراڊڪٽ لوڊ ٿي رهيو آهي",
    doi: "प्रोडक्ट लोड होआ करदा",
    mni: "ꯄ꯭ꯔꯣꯗꯛꯇ ꯂꯣꯗ ꯇꯧꯔꯤ",
    brx: "प्रोडक्ट लोड जादों",
    sat: "ᱯᱨᱚᱰᱟᱠᱴ ᱞᱳᱰ ᱦᱚᱪᱚᱜ",
    es: "Cargando producto",
    fr: "Chargement du produit",
    de: "Produkt wird geladen",
    ar: "جارٍ تحميل المنتج",
    zh: "正在加载产品",
    ja: "製品を読み込んでいます",
    ko: "제품을 불러오는 중",
    pt: "Carregando produto",
    it: "Caricamento prodotto",
    ru: "Загрузка товара",
    tr: "Ürün yükleniyor",
  },

  loadingDescription: {
    en: "Fetching the latest product data from TEXVERSE...",
    hi: "TEXVERSE से नवीनतम प्रोडक्ट डेटा प्राप्त किया जा रहा है...",
    bn: "TEXVERSE থেকে সর্বশেষ পণ্যের তথ্য আনা হচ্ছে...",
    te: "TEXVERSE నుండి తాజా ఉత్పత్తి డేటాను పొందుతోంది...",
    mr: "TEXVERSE वरून नवीनतम उत्पादन डेटा घेतला जात आहे...",
    ta: "TEXVERSE இலிருந்து சமீபத்திய தயாரிப்பு தரவு பெறப்படுகிறது...",
    gu: "TEXVERSE પરથી નવીનતમ પ્રોડક્ટ ડેટા મેળવવામાં આવી રહ્યો છે...",
    kn: "TEXVERSE ನಿಂದ ಇತ್ತೀಚಿನ ಉತ್ಪನ್ನ ಡೇಟಾವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
    ml: "TEXVERSE-ൽ നിന്ന് ഏറ്റവും പുതിയ ഉൽപ്പന്ന ഡാറ്റ ലഭ്യമാക്കുന്നു...",
    pa: "TEXVERSE ਤੋਂ ਨਵੀਨਤਮ ਉਤਪਾਦ ਡਾਟਾ ਲਿਆ ਜਾ ਰਿਹਾ ਹੈ...",
    ur: "TEXVERSE سے تازہ ترین پروڈکٹ ڈیٹا حاصل کیا جا رہا ہے...",
    or: "TEXVERSE ରୁ ସର୍ବଶେଷ ପ୍ରୋଡକ୍ଟ ଡାଟା ଆଣାଯାଉଛି...",
    as: "TEXVERSE-ৰ পৰা শেহতীয়া প্ৰডাক্ট ডাটা অনা হৈছে...",
    ne: "TEXVERSE बाट पछिल्लो उत्पादन डेटा ल्याइँदैछ...",
    sa: "TEXVERSE तः नवीनतमं उत्पाददत्तांशं प्राप्यते...",
    kok: "TEXVERSE थावन नवी उत्पाद डेटा मेळयतात...",
    mai: "TEXVERSE सँ नवीन प्रोडक्ट डेटा अनल जा रहल अछि...",
    ks: "TEXVERSE پٮ۪ٹھ تازٕ پروڈکٹ ڈیٹا حٲصل کٔرِو...",
    sd: "TEXVERSE کان تازو پراڊڪٽ ڊيٽا حاصل ڪيو پيو وڃي...",
    doi: "TEXVERSE थमां ताजा प्रोडक्ट डेटा लैता जा रदा ऐ...",
    mni: "TEXVERSE ꯗꯒꯤ ꯑꯅꯧꯕ ꯄ꯭ꯔꯣꯗꯛꯇ ꯗꯦꯇꯥ ꯐꯪꯂꯤ...",
    brx: "TEXVERSE निफ्राय गोदान प्रोडक्ट डेटा लानाय जाबाय...",
    sat: "TEXVERSE ᱠᱷᱚᱱ ᱱᱟᱣᱟ ᱯᱨᱚᱰᱟᱠᱴ ᱰᱟᱴᱟ ᱟᱱᱟᱜ ᱠᱟᱱᱟ...",
    es: "Obteniendo los datos más recientes del producto desde TEXVERSE...",
    fr: "Récupération des dernières données du produit depuis TEXVERSE...",
    de: "Aktuelle Produktdaten werden von TEXVERSE abgerufen...",
    ar: "يتم جلب أحدث بيانات المنتج من TEXVERSE...",
    zh: "正在从 TEXVERSE 获取最新产品数据……",
    ja: "TEXVERSE から最新の商品データを取得しています…",
    ko: "TEXVERSE에서 최신 제품 데이터를 가져오는 중입니다...",
    pt: "Buscando os dados mais recentes do produto no TEXVERSE...",
    it: "Recupero dei dati più recenti del prodotto da TEXVERSE...",
    ru: "Получаем последние данные о товаре из TEXVERSE...",
    tr: "TEXVERSE'den en güncel ürün verileri getiriliyor...",
  },

  notFound: {
    en: "Product Not Found",
    hi: "प्रोडक्ट नहीं मिला",
    bn: "পণ্য পাওয়া যায়নি",
    te: "ఉత్పత్తి కనుగొనబడలేదు",
    mr: "उत्पादन सापडला नाही",
    ta: "தயாரிப்பு கிடைக்கவில்லை",
    gu: "પ્રોડક્ટ મળ્યું નથી",
    kn: "ಉತ್ಪನ್ನ ಕಂಡುಬಂದಿಲ್ಲ",
    ml: "ഉൽപ്പന്നം കണ്ടെത്തിയില്ല",
    pa: "ਉਤਪਾਦ ਨਹੀਂ ਮਿਲਿਆ",
    ur: "پروڈکٹ نہیں ملا",
    or: "ପ୍ରୋଡକ୍ଟ ମିଳିଲା ନାହିଁ",
    as: "প্ৰডাক্ট পোৱা নগ'ল",
    ne: "उत्पादन भेटिएन",
    sa: "उत्पादं न लब्धम्",
    kok: "उत्पादन मेळूंक ना",
    mai: "प्रोडक्ट नहि भेटल",
    ks: "پروڈکٹ نہٕ لَبھ",
    sd: "پراڊڪٽ نه مليو",
    doi: "प्रोडक्ट नेईं लब्भेया",
    mni: "ꯄ꯭ꯔꯣꯗꯛꯇ ꯐꯪꯗꯦ",
    brx: "प्रोडक्ट मोननाय नङा",
    sat: "ᱯᱨᱚᱰᱟᱠᱴ ᱵᱟᱝ ᱧᱟᱢ ᱠᱟᱱᱟ",
    es: "Producto no encontrado",
    fr: "Produit introuvable",
    de: "Produkt nicht gefunden",
    ar: "المنتج غير موجود",
    zh: "未找到产品",
    ja: "製品が見つかりません",
    ko: "제품을 찾을 수 없습니다",
    pt: "Produto não encontrado",
    it: "Prodotto non trovato",
    ru: "Товар не найден",
    tr: "Ürün bulunamadı",
  },

  retry: {
    en: "Retry",
    hi: "फिर से प्रयास करें",
    bn: "আবার চেষ্টা করুন",
    te: "మళ్లీ ప్రయత్నించండి",
    mr: "पुन्हा प्रयत्न करा",
    ta: "மீண்டும் முயற்சிக்கவும்",
    gu: "ફરી પ્રયાસ કરો",
    kn: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    ml: "വീണ്ടും ശ്രമിക്കുക",
    pa: "ਮੁੜ ਕੋਸ਼ਿਸ਼ ਕਰੋ",
    ur: "دوبارہ کوشش کریں",
    or: "ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ",
    as: "পুনৰ চেষ্টা কৰক",
    ne: "फेरि प्रयास गर्नुहोस्",
    sa: "पुनः प्रयतताम्",
    kok: "परत यत्न करात",
    mai: "फेर कोशिश करू",
    ks: "دوبارہ کوشش کٔرِو",
    sd: "وري ڪوشش ڪريو",
    doi: "दोआरा कोशश करो",
    mni: "ꯑꯃꯨꯛ ꯏꯅꯧ",
    brx: "फिन थाखाय नाय",
    sat: "ᱫᱚᱦᱨᱟ ᱪᱮᱥᱴᱟ",
    es: "Reintentar",
    fr: "Réessayer",
    de: "Erneut versuchen",
    ar: "إعادة المحاولة",
    zh: "重试",
    ja: "再試行",
    ko: "다시 시도",
    pt: "Tentar novamente",
    it: "Riprova",
    ru: "Повторить",
    tr: "Yeniden Dene",
  },

  backMarketplace: {
    en: "Back to Marketplace",
    hi: "मार्केटप्लेस पर वापस जाएँ",
    bn: "মার্কেটপ্লেসে ফিরে যান",
    te: "మార్కెట్‌ప్లేస్‌కు తిరిగి వెళ్లండి",
    mr: "मार्केटप्लेसवर परत जा",
    ta: "சந்தைக்குத் திரும்பவும்",
    gu: "માર્કેટપ્લેસ પર પાછા જાઓ",
    kn: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್‌ಗೆ ಹಿಂತಿರುಗಿ",
    ml: "മാർക്കറ്റ്പ്ലേസിലേക്ക് മടങ്ങുക",
    pa: "ਮਾਰਕੀਟਪਲੇਸ ਤੇ ਵਾਪਸ ਜਾਓ",
    ur: "مارکیٹ پلیس پر واپس جائیں",
    or: "ମାର୍କେଟପ୍ଲେସ୍‌କୁ ଫେରନ୍ତୁ",
    as: "মাৰ্কেটপ্লেচলৈ উভতি যাওক",
    ne: "मार्केटप्लेसमा फर्कनुहोस्",
    sa: "विपणिस्थलं प्रति पुनः गच्छतु",
    kok: "मार्केटप्लेसाचेर परत वतात",
    mai: "मार्केटप्लेस पर वापस जाउ",
    ks: "مارکیٹ پلیس پٮ۪ٹھ واپس گژھو",
    sd: "مارڪيٽ پلیس ڏانهن واپس وڃو",
    doi: "मार्केटप्लेस च वापस जाओ",
    mni: "ꯃꯥꯔꯀꯦꯠꯄ꯭ꯂꯦꯁ ꯗꯥ ꯍꯟꯊꯕ",
    brx: "मार्केटप्लेस आव फिन खालाम",
    sat: "ᱢᱟᱨᱠᱮᱴᱯᱞᱮᱥ ᱨᱮ ᱫᱚᱦᱨᱟ ᱦᱚᱪᱚ",
    es: "Volver al Marketplace",
    fr: "Retour au Marketplace",
    de: "Zurück zum Marktplatz",
    ar: "العودة إلى السوق",
    zh: "返回市场",
    ja: "マーケットプレイスに戻る",
    ko: "마켓플레이스로 돌아가기",
    pt: "Voltar ao Marketplace",
    it: "Torna al Marketplace",
    ru: "Вернуться на маркетплейс",
    tr: "Pazaryerine Dön",
  },

  verifiedSupplier: {
    en: "Verified supplier",
    hi: "सत्यापित सप्लायर",
    bn: "যাচাইকৃত সরবরাহকারী",
    te: "ధృవీకరించబడిన సరఫరాదారు",
    mr: "सत्यापित सप्लायर",
    ta: "சரிபார்க்கப்பட்ட சப்ளையர்",
    gu: "ચકાસાયેલ સપ્લાયર",
    kn: "ಪರಿಶೀಲಿತ ಪೂರೈಕೆದಾರ",
    ml: "പരിശോധിച്ച വിതരണക്കാരൻ",
    pa: "ਪ੍ਰਮਾਣਿਤ ਸਪਲਾਇਰ",
    ur: "تصدیق شدہ سپلائر",
    or: "ଯାଞ୍ଚିତ ସପ୍ଲାୟର୍",
    as: "যাচাইকৃত যোগানকাৰী",
    ne: "प्रमाणित आपूर्तिकर्ता",
    sa: "सत्यापित आपूर्तिकर्ता",
    kok: "तपासिल्लो सप्लायर",
    mai: "सत्यापित सप्लायर",
    ks: "تصدیق شُدٕ سپلائر",
    sd: "تصديق ٿيل سپلائر",
    doi: "प्रमाणित सप्लायर",
    mni: "ꯆꯥꯁꯤꯟꯅ ꯁꯄꯂꯥꯏꯌꯔ",
    brx: "सत्यापित सप्लायर",
    sat: "ᱥᱟᱹᱵ ᱥᱟᱹᱯᱞᱟᱭᱟᱨ",
    es: "Proveedor verificado",
    fr: "Fournisseur vérifié",
    de: "Verifizierter Lieferant",
    ar: "مورد موثوق",
    zh: "已验证供应商",
    ja: "認証済みサプライヤー",
    ko: "검증된 공급업체",
    pt: "Fornecedor verificado",
    it: "Fornitore verificato",
    ru: "Проверенный поставщик",
    tr: "Doğrulanmış tedarikçi",
  },

  suppliedBy: {
    en: "Supplied by",
    hi: "सप्लायर",
    bn: "সরবরাহকারী",
    te: "సరఫరాదారు",
    mr: "पुरवठादार",
    ta: "வழங்குபவர்",
    gu: "પુરવઠો આપનાર",
    kn: "ಪೂರೈಕೆದಾರ",
    ml: "വിതരണക്കാരൻ",
    pa: "ਸਪਲਾਇਰ",
    ur: "فراہم کنندہ",
    or: "ଯୋଗାଣକାରୀ",
    as: "যোগানকাৰী",
    ne: "आपूर्तिकर्ता",
    sa: "आपूर्तिकर्ता",
    kok: "सप्लायर",
    mai: "सप्लायर",
    ks: "فراہم کار",
    sd: "فراهم ڪندڙ",
    doi: "सप्लायर",
    mni: "ꯁꯄꯂꯥꯏꯌꯔ",
    brx: "सप्लायर",
    sat: "ᱥᱟᱯᱞᱟᱭᱟᱨ",
    es: "Suministrado por",
    fr: "Fourni par",
    de: "Geliefert von",
    ar: "مورد من",
    zh: "供应商",
    ja: "供給元",
    ko: "공급업체",
    pt: "Fornecido por",
    it: "Fornito da",
    ru: "Поставщик:",
    tr: "Tedarikçi",
  },

  startingPrice: {
    en: "Wholesale starting price",
    hi: "थोक शुरुआती कीमत",
    bn: "পাইকারি শুরুর দাম",
    te: "హోల్‌సేల్ ప్రారంభ ధర",
    mr: "घाऊक सुरुवातीची किंमत",
    ta: "மொத்த ஆரம்ப விலை",
    gu: "હોલસેલ શરૂઆતની કિંમત",
    kn: "ಸಗಟು ಆರಂಭಿಕ ಬೆಲೆ",
    ml: "മൊത്തവിലയുടെ ആരംഭ വില",
    pa: "ਥੋਕ ਸ਼ੁਰੂਆਤੀ ਕੀਮਤ",
    ur: "تھوک ابتدائی قیمت",
    or: "ଥୋକ ଆରମ୍ଭିକ ମୂଲ୍ୟ",
    as: "পাইকাৰী আৰম্ভণিৰ মূল্য",
    ne: "थोक सुरुवाती मूल्य",
    sa: "थोकप्रारम्भिकमूल्यम्",
    kok: "होलसेल सुरूवातीची किंमत",
    mai: "थोक शुरुआती दाम",
    ks: "تھوک شروعاتی قٕیمت",
    sd: "ٿوڪ شروعاتي قيمت",
    doi: "थोक सुरुआती भाव",
    mni: "ꯊꯣꯛ ꯃꯨꯂ꯭ꯌ",
    brx: "थोक सुरुआती भाव",
    sat: "ᱵᱟᱹᱲᱟ ᱮᱢᱫᱟᱹ ᱫᱟᱢ",
    es: "Precio mayorista inicial",
    fr: "Prix de gros à partir de",
    de: "Ab-Preis im Großhandel",
    ar: "سعر الجملة الابتدائي",
    zh: "批发起始价格",
    ja: "卸価格の開始価格",
    ko: "도매 시작 가격",
    pt: "Preço inicial de atacado",
    it: "Prezzo iniziale all'ingrosso",
    ru: "Начальная оптовая цена",
    tr: "Toptan başlangıç fiyatı",
  },

  orderQuantity: {
    en: "Order quantity",
    hi: "ऑर्डर मात्रा",
    bn: "অর্ডারের পরিমাণ",
    te: "ఆర్డర్ పరిమాణం",
    mr: "ऑर्डरचे प्रमाण",
    ta: "ஆர்டர் அளவு",
    gu: "ઓર્ડર જથ્થો",
    kn: "ಆರ್ಡರ್ ಪ್ರಮಾಣ",
    ml: "ഓർഡർ അളവ്",
    pa: "ਆਰਡਰ ਮਾਤਰਾ",
    ur: "آرڈر کی مقدار",
    or: "ଅର୍ଡର ପରିମାଣ",
    as: "অৰ্ডাৰৰ পৰিমাণ",
    ne: "अर्डर मात्रा",
    sa: "आदेशपरिमाणम्",
    kok: "ऑर्डर प्रमाण",
    mai: "ऑर्डरक मात्रा",
    ks: "آرڈر مقدار",
    sd: "آرڊر جو مقدار",
    doi: "आर्डर मात्रा",
    mni: "ꯑꯣꯔꯗꯔ ꯑꯃꯥ",
    brx: "अर्डार मुरा",
    sat: "ᱚᱨᱰᱟᱨ ᱯᱚᱨᱤᱢᱟᱱ",
    es: "Cantidad del pedido",
    fr: "Quantité de commande",
    de: "Bestellmenge",
    ar: "كمية الطلب",
    zh: "订购数量",
    ja: "注文数量",
    ko: "주문 수량",
    pt: "Quantidade do pedido",
    it: "Quantità dell'ordine",
    ru: "Количество заказа",
    tr: "Sipariş miktarı",
  },

  quantityHelp: {
    en: "Final quantity will be validated against MOQ during checkout.",
    hi: "चेकआउट के दौरान अंतिम मात्रा MOQ के अनुसार सत्यापित होगी।",
    bn: "চেকআউটের সময় চূড়ান্ত পরিমাণ MOQ অনুযায়ী যাচাই হবে।",
    te: "చెక్‌అవుట్ సమయంలో తుది పరిమాణం MOQ ప్రకారం ధృవీకరించబడుతుంది.",
    mr: "चेकआउटदरम्यान अंतिम प्रमाण MOQ नुसार तपासले जाईल.",
    ta: "செக்அவுட் நேரத்தில் இறுதி அளவு MOQ அடிப்படையில் சரிபார்க்கப்படும்.",
    gu: "ચેકઆઉટ દરમિયાન અંતિમ જથ્થો MOQ મુજબ ચકાસવામાં આવશે.",
    kn: "ಚೆಕ್‌ಔಟ್ ಸಮಯದಲ್ಲಿ ಅಂತಿಮ ಪ್ರಮಾಣವನ್ನು MOQ ಆಧರಿಸಿ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.",
    ml: "ചെക്ക്ഔട്ടിൽ അന്തിമ അളവ് MOQ അനുസരിച്ച് പരിശോധിക്കും.",
    pa: "ਚੈਕਆਉਟ ਵੇਲੇ ਅੰਤਿਮ ਮਾਤਰਾ MOQ ਅਨੁਸਾਰ ਜਾਂਚੀ ਜਾਵੇਗੀ।",
    ur: "چیک آؤٹ کے دوران حتمی مقدار MOQ کے مطابق تصدیق کی جائے گی۔",
    or: "ଚେକଆଉଟ୍ ସମୟରେ ଶେଷ ପରିମାଣ MOQ ଅନୁସାରେ ଯାଞ୍ଚ ହେବ।",
    as: "চেকআউটৰ সময়ত চূড়ান্ত পৰিমাণ MOQ অনুসৰি যাচাই কৰা হ'ব।",
    ne: "चेकआउटको समयमा अन्तिम मात्रा MOQ अनुसार प्रमाणित गरिनेछ।",
    sa: "क्रयसमापनसमये अन्तिमं परिमाणं MOQ अनुसारं परीक्ष्यते।",
    kok: "चेकआउट वेळार निमाण प्रमाण MOQ प्रमाणे तपासात.",
    mai: "चेकआउट काल मे अंतिम मात्रा MOQ अनुसार जाँचल जायत।",
    ks: "چیک آؤٹ دوران آخری مقدار MOQ مُطٲبق تصدیق کٔرِ گژھِ۔",
    sd: "چيڪ آئوٽ دوران آخري مقدار MOQ مطابق تصديق ڪئي ويندي.",
    doi: "चेकआउट दौरान आखरी मात्रा MOQ मताबक जांची जाग।",
    mni: "ꯆꯦꯛꯑꯥꯎꯠ ꯃꯇꯝꯗ ꯑꯣꯐꯁꯤ ꯃꯐꯃ ꯃꯣꯀꯁꯤ ꯅꯣꯡꯁꯤꯅ ꯑꯃꯗꯥ।",
    brx: "चेकआउट समाव मुरा MOQ निफ्राय बांसथि जाबाय।",
    sat: "ᱪᱮᱠᱚᱣᱴ ᱥᱟᱢᱟᱭ ᱨᱮ ᱪᱮᱛᱟᱱ ᱯᱚᱨᱤᱢᱟᱱ MOQ ᱛᱮ ᱵᱟᱹᱰᱟᱣᱟᱜᱟ।",
    es: "La cantidad final se validará contra el MOQ durante el checkout.",
    fr: "La quantité finale sera validée par rapport au MOQ lors du paiement.",
    de: "Die endgültige Menge wird beim Checkout gegen die MOQ geprüft.",
    ar: "سيتم التحقق من الكمية النهائية مقابل الحد الأدنى للطلب عند الدفع.",
    zh: "结算时将根据 MOQ 验证最终数量。",
    ja: "チェックアウト時に最終数量をMOQに照らして確認します。",
    ko: "결제 시 최종 수량은 MOQ에 따라 검증됩니다.",
    pt: "A quantidade final será validada em relação ao MOQ no checkout.",
    it: "La quantità finale sarà verificata rispetto al MOQ al checkout.",
    ru: "Итоговое количество будет проверено на соответствие MOQ при оформлении.",
    tr: "Son miktar ödeme sırasında MOQ'a göre doğrulanacaktır.",
  },

  addToCart: {
    en: "Add to Quote Cart",
    hi: "कोटेशन कार्ट में जोड़ें",
    bn: "কোটেশন কার্টে যোগ করুন",
    te: "కోటేషన్ కార్ట్‌కి జోడించండి",
    mr: "कोटेशन कार्टमध्ये जोडा",
    ta: "மேற்கோள் கார்டில் சேர்க்கவும்",
    gu: "કોટેશન કાર્ટમાં ઉમેરો",
    kn: "ಕೋಟೇಶನ್ ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ",
    ml: "ക്വട്ടേഷൻ കാർട്ടിൽ ചേർക്കുക",
    pa: "ਕੋਟੇਸ਼ਨ ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ",
    ur: "کوٹیشن کارٹ میں شامل کریں",
    or: "କୋଟେସନ୍ କାର୍ଟରେ ଯୋଡନ୍ତୁ",
    as: "কোটেচন কাৰ্টত যোগ কৰক",
    ne: "कोटेसन कार्टमा थप्नुहोस्",
    sa: "मूल्यप्रस्ताव-पेटिकायां योजयतु",
    kok: "कोटेशन कार्टांत घालात",
    mai: "कोटेशन कार्ट मे जोड़ू",
    ks: "کوٹیشن کارٹ منٛز شٲمل کٔرِو",
    sd: "ڪوٽيشن ڪارٽ ۾ شامل ڪريو",
    doi: "कोटेशन कार्ट च पाओ",
    mni: "ꯀꯣꯇꯦꯁꯟ ꯀꯥꯔꯠꯇꯥ ꯍꯥꯞꯄꯤꯌꯨ",
    brx: "कोटेसन कार्टाव संजाबो",
    sat: "ᱠᱚᱴᱮᱥᱚᱱ ᱠᱟᱨᱴ ᱨᱮ ᱦᱟᱵᱽᱞᱟᱣ",
    es: "Añadir al carrito de cotización",
    fr: "Ajouter au panier de devis",
    de: "Zum Angebotswagen hinzufügen",
    ar: "أضف إلى سلة عرض السعر",
    zh: "加入报价购物车",
    ja: "見積カートに追加",
    ko: "견적 카트에 추가",
    pt: "Adicionar ao carrinho de cotação",
    it: "Aggiungi al carrello preventivi",
    ru: "Добавить в корзину для расчёта",
    tr: "Teklif Sepetine Ekle",
  },

  buyCheckout: {
    en: "Buy / Checkout",
    hi: "खरीदें / चेकआउट",
    bn: "কিনুন / চেকআউট",
    te: "కొనండి / చెక్‌అవుట్",
    mr: "खरेदी / चेकआउट",
    ta: "வாங்க / செக்அவுட்",
    gu: "ખરીદો / ચેકઆઉટ",
    kn: "ಖರೀದಿ / ಚೆಕ್‌ಔಟ್",
    ml: "വാങ്ങുക / ചെക്ക്ഔട്ട്",
    pa: "ਖਰੀਦੋ / ਚੈਕਆਉਟ",
    ur: "خریدیں / چیک آؤٹ",
    or: "କିଣନ୍ତୁ / ଚେକଆଉଟ୍",
    as: "কিনক / চেকআউট",
    ne: "किन्नुहोस् / चेकआउट",
    sa: "क्रय / क्रयसमापन",
    kok: "विकत घेवप / चेकआउट",
    mai: "किनू / चेकआउट",
    ks: "خریدٕ / چیک آؤٹ",
    sd: "خريد ڪريو / چيڪ آئوٽ",
    doi: "खरीदो / चेकआउट",
    mni: "ꯂꯣꯏꯔꯤ / ꯆꯦꯛꯑꯥꯎꯠ",
    brx: "बिकाय / चेकआउट",
    sat: "ᱠᱟᱹᱢᱤ / ᱪᱮᱠᱚᱣᱴ",
    es: "Comprar / Checkout",
    fr: "Acheter / Paiement",
    de: "Kaufen / Checkout",
    ar: "شراء / الدفع",
    zh: "购买 / 结算",
    ja: "購入 / チェックアウト",
    ko: "구매 / 결제",
    pt: "Comprar / Checkout",
    it: "Acquista / Checkout",
    ru: "Купить / Оформить",
    tr: "Satın Al / Ödeme",
  },

  requestQuote: {
    en: "Request Quote",
    hi: "कोटेशन अनुरोध करें",
    bn: "কোটেশন অনুরোধ করুন",
    te: "కోటేషన్ అభ్యర్థించండి",
    mr: "कोटेशन मागवा",
    ta: "மேற்கோள் கோரவும்",
    gu: "કોટેશન માંગો",
    kn: "ಕೋಟೇಶನ್ ವಿನಂತಿಸಿ",
    ml: "ക്വട്ടേഷൻ അഭ്യർത്ഥിക്കുക",
    pa: "ਕੋਟੇਸ਼ਨ ਮੰਗੋ",
    ur: "کوٹیشن کی درخواست کریں",
    or: "କୋଟେସନ୍ ଅନୁରୋଧ କରନ୍ତୁ",
    as: "কোটেচন অনুৰোধ কৰক",
    ne: "कोटेसन अनुरोध गर्नुहोस्",
    sa: "मूल्यप्रस्तावं याचताम्",
    kok: "कोटेशन मागात",
    mai: "कोटेशन माँगू",
    ks: "کوٹیشن یَژھِو",
    sd: "ڪوٽيشن جي درخواست ڪريو",
    doi: "कोटेशन मंगो",
    mni: "ꯀꯣꯇꯦꯁꯟ ꯍꯥꯏꯖꯕ",
    brx: "कोटेसन मागो",
    sat: "ᱠᱚᱴᱮᱥᱚᱱ ᱞᱟᱹᱜᱤᱫ",
    es: "Solicitar cotización",
    fr: "Demander un devis",
    de: "Angebot anfordern",
    ar: "طلب عرض سعر",
    zh: "申请报价",
    ja: "見積を依頼",
    ko: "견적 요청",
    pt: "Solicitar cotação",
    it: "Richiedi preventivo",
    ru: "Запросить расчёт",
    tr: "Teklif İste",
  },

  technicalSpecs: {
    en: "Technical specifications",
    hi: "तकनीकी स्पेसिफिकेशन",
    bn: "প্রযুক্তিগত স্পেসিফিকেশন",
    te: "సాంకేతిక స్పెసిఫికేషన్లు",
    mr: "तांत्रिक स्पेसिफिकेशन्स",
    ta: "தொழில்நுட்ப விவரக்குறிப்புகள்",
    gu: "ટેક્નિકલ સ્પેસિફિકેશન",
    kn: "ತಾಂತ್ರಿಕ ವಿಶೇಷಣಗಳು",
    ml: "സാങ്കേതിക സ്പെസിഫിക്കേഷനുകൾ",
    pa: "ਤਕਨੀਕੀ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ",
    ur: "تکنیکی تفصیلات",
    or: "ବୈଷୟିକ ସ୍ପେସିଫିକେସନ୍",
    as: "কাৰিকৰী স্পেচিফিকেশ্যন",
    ne: "प्राविधिक स्पेसिफिकेसन",
    sa: "तान्त्रिकविशेषताः",
    kok: "तांत्रीक स्पेसिफिकेशन्स",
    mai: "तकनीकी स्पेसिफिकेशन",
    ks: "تکنیکی تفصیلات",
    sd: "ٽيڪنيڪل اسپيسيفڪيشن",
    doi: "तकनीकी स्पेसिफिकेशन",
    mni: "ꯇꯦꯛꯅꯤꯀꯦꯜ ꯁ꯭ꯄꯦꯁꯤꯐꯤꯀꯦꯁꯟ",
    brx: "थांखिया स्पेसिफिकेसन",
    sat: "ᱴᱮᱠᱱᱤᱠᱟᱞ ᱵᱤᱵᱚᱨᱚᱱ",
    es: "Especificaciones técnicas",
    fr: "Spécifications techniques",
    de: "Technische Spezifikationen",
    ar: "المواصفات الفنية",
    zh: "技术规格",
    ja: "技術仕様",
    ko: "기술 사양",
    pt: "Especificações técnicas",
    it: "Specifiche tecniche",
    ru: "Технические характеристики",
    tr: "Teknik özellikler",
  },

  composition: {
    en: "Composition",
    hi: "संरचना",
    bn: "গঠন",
    te: "కూర్పు",
    mr: "घटक रचना",
    ta: "கலவை",
    gu: "રચના",
    kn: "ಸಂಯೋಜನೆ",
    ml: "ഘടന",
    pa: "ਰਚਨਾ",
    ur: "ترکیب",
    or: "ରଚନା",
    as: "গঠন",
    ne: "संरचना",
    sa: "संघटनम्",
    kok: "रचण",
    mai: "संरचना",
    ks: "ترکیب",
    sd: "ترڪيب",
    doi: "संरचना",
    mni: "ꯃꯁꯤꯒꯤ",
    brx: "बेसादन",
    sat: "ᱥᱚᱞᱮ",
    es: "Composición",
    fr: "Composition",
    de: "Zusammensetzung",
    ar: "التركيب",
    zh: "成分",
    ja: "組成",
    ko: "구성",
    pt: "Composição",
    it: "Composizione",
    ru: "Состав",
    tr: "İçerik",
  },

  gsm: {
    en: "GSM / Weight",
    hi: "GSM / वजन",
    bn: "GSM / ওজন",
    te: "GSM / బరువు",
    mr: "GSM / वजन",
    ta: "GSM / எடை",
    gu: "GSM / વજન",
    kn: "GSM / ತೂಕ",
    ml: "GSM / ഭാരം",
    pa: "GSM / ਭਾਰ",
    ur: "GSM / وزن",
    or: "GSM / ଓଜନ",
    as: "GSM / ওজন",
    ne: "GSM / तौल",
    sa: "GSM / भार",
    kok: "GSM / वजन",
    mai: "GSM / वजन",
    ks: "GSM / وزن",
    sd: "GSM / وزن",
    doi: "GSM / भार",
    mni: "GSM / ꯆꯥꯛ",
    brx: "GSM / ओजन",
    sat: "GSM / ᱚᱠᱛᱚ",
    es: "GSM / Peso",
    fr: "GSM / Poids",
    de: "GSM / Gewicht",
    ar: "GSM / الوزن",
    zh: "GSM / 重量",
    ja: "GSM / 重量",
    ko: "GSM / 중량",
    pt: "GSM / Peso",
    it: "GSM / Peso",
    ru: "GSM / Вес",
    tr: "GSM / Ağırlık",
  },

  width: {
    en: "Width",
    hi: "चौड़ाई",
    bn: "প্রস্থ",
    te: "వెడల్పు",
    mr: "रुंदी",
    ta: "அகலம்",
    gu: "પહોળાઈ",
    kn: "ಅಗಲ",
    ml: "വീതി",
    pa: "ਚੌੜਾਈ",
    ur: "چوڑائی",
    or: "ପ୍ରସ୍ଥ",
    as: "প্ৰস্থ",
    ne: "चौडाइ",
    sa: "विस्तारः",
    kok: "रुंदाय",
    mai: "चौड़ाई",
    ks: "چوڑٲی",
    sd: "ويڪر",
    doi: "चौड़ाई",
    mni: "ꯏꯃꯥ",
    brx: "फिदा",
    sat: "ᱥᱟᱠᱟᱢ",
    es: "Ancho",
    fr: "Largeur",
    de: "Breite",
    ar: "العرض",
    zh: "幅宽",
    ja: "幅",
    ko: "폭",
    pt: "Largura",
    it: "Larghezza",
    ru: "Ширина",
    tr: "Genişlik",
  },

  color: {
    en: "Color",
    hi: "रंग",
    bn: "রঙ",
    te: "రంగు",
    mr: "रंग",
    ta: "நிறம்",
    gu: "રંગ",
    kn: "ಬಣ್ಣ",
    ml: "നിറം",
    pa: "ਰੰਗ",
    ur: "رنگ",
    or: "ରଙ୍ଗ",
    as: "ৰং",
    ne: "रङ",
    sa: "वर्णः",
    kok: "रंग",
    mai: "रंग",
    ks: "رَنگ",
    sd: "رنگ",
    doi: "रंग",
    mni: "ꯁꯨꯄꯨꯅ",
    brx: "रोङ",
    sat: "ᱨᱚᱝ",
    es: "Color",
    fr: "Couleur",
    de: "Farbe",
    ar: "اللون",
    zh: "颜色",
    ja: "色",
    ko: "색상",
    pt: "Cor",
    it: "Colore",
    ru: "Цвет",
    tr: "Renk",
  },

  pattern: {
    en: "Pattern",
    hi: "पैटर्न",
    bn: "প্যাটার্ন",
    te: "నమూనా",
    mr: "पॅटर्न",
    ta: "வடிவம்",
    gu: "પેટર્ન",
    kn: "ವಿನ್ಯಾಸ",
    ml: "പാറ്റേൺ",
    pa: "ਪੈਟਰਨ",
    ur: "پیٹرن",
    or: "ପ୍ୟାଟର୍ନ",
    as: "পেটাৰ্ন",
    ne: "ढाँचा",
    sa: "आकृतिः",
    kok: "पॅटर्न",
    mai: "पैटर्न",
    ks: "پیٹرن",
    sd: "پيٽرن",
    doi: "पैटर्न",
    mni: "ꯃ꯭ꯌꯥꯡ",
    brx: "पैटर्न",
    sat: "ᱯᱮᱴᱟᱨᱱ",
    es: "Patrón",
    fr: "Motif",
    de: "Muster",
    ar: "النمط",
    zh: "图案",
    ja: "パターン",
    ko: "패턴",
    pt: "Padrão",
    it: "Motivo",
    ru: "Узор",
    tr: "Desen",
  },

  stock: {
    en: "Available stock",
    hi: "उपलब्ध स्टॉक",
    bn: "উপলব্ধ স্টক",
    te: "అందుబాటులోని స్టాక్",
    mr: "उपलब्ध साठा",
    ta: "கிடைக்கும் இருப்பு",
    gu: "ઉપલબ્ધ સ્ટોક",
    kn: "ಲಭ್ಯವಿರುವ ಸ್ಟಾಕ್",
    ml: "ലഭ്യമായ സ്റ്റോക്ക്",
    pa: "ਉਪਲਬਧ ਸਟਾਕ",
    ur: "دستیاب اسٹاک",
    or: "ଉପଲବ୍ଧ ଷ୍ଟକ୍",
    as: "উপলব্ধ ষ্টক",
    ne: "उपलब्ध स्टक",
    sa: "उपलब्धसञ्चयः",
    kok: "उपलब्ध स्टॉक",
    mai: "उपलब्ध स्टॉक",
    ks: "دستیاب سٹاک",
    sd: "دستياب اسٽاڪ",
    doi: "उपलब्ध स्टॉक",
    mni: "ꯐꯪꯕ ꯁ꯭ꯇꯣꯛ",
    brx: "मोननाय स्टक",
    sat: "ᱧᱟᱢᱤᱧ ᱥᱴᱚᱠ",
    es: "Stock disponible",
    fr: "Stock disponible",
    de: "Verfügbarer Bestand",
    ar: "المخزون المتاح",
    zh: "可用库存",
    ja: "在庫",
    ko: "재고",
    pt: "Estoque disponível",
    it: "Disponibilità",
    ru: "Доступный запас",
    tr: "Mevcut stok",
  },

  washingCare: {
    en: "Washing & Care",
    hi: "धुलाई और देखभाल",
    bn: "ধোয়া ও যত্ন",
    te: "వాషింగ్ & కేర్",
    mr: "धुलाई व काळजी",
    ta: "துவைப்பு & பராமரிப்பு",
    gu: "ધોવા અને કાળજી",
    kn: "ತೊಳೆಯುವುದು ಮತ್ತು ಆರೈಕೆ",
    ml: "വൃത്തിയും പരിപാലനവും",
    pa: "ਧੋਣ ਅਤੇ ਦੇਖਭਾਲ",
    ur: "دھلائی اور دیکھ بھال",
    or: "ଧୋଇବା ଏବଂ ଯତ୍ନ",
    as: "ধোৱা আৰু যত্ন",
    ne: "धुने र हेरचाह",
    sa: "प्रक्षालनं पालनं च",
    kok: "धोवप आनी निगा",
    mai: "धुलाई आ देखभाल",
    ks: "دُلہٲی تہ نِگہداشت",
    sd: "ڌوئڻ ۽ سنڀال",
    doi: "धोना ते संभाल",
    mni: "ꯍꯥꯏꯅ ꯅꯨꯡꯁꯤꯕ",
    brx: "धोवन आरो जोगायनाय",
    sat: "ᱫᱷᱚᱣᱟ ᱟᱨ ᱡᱚᱜᱟᱣ",
    es: "Lavado y cuidado",
    fr: "Lavage et entretien",
    de: "Waschen & Pflege",
    ar: "الغسيل والعناية",
    zh: "洗涤与护理",
    ja: "洗濯・お手入れ",
    ko: "세탁 및 관리",
    pt: "Lavagem e cuidados",
    it: "Lavaggio e cura",
    ru: "Стирка и уход",
    tr: "Yıkama ve Bakım",
  },

  keepExploring: {
    en: "Keep exploring",
    hi: "और खोजें",
    bn: "আরও খুঁজুন",
    te: "మరింత అన్వేషించండి",
    mr: "आणखी शोधा",
    ta: "மேலும் ஆராயுங்கள்",
    gu: "વધુ શોધો",
    kn: "ಇನ್ನಷ್ಟು ಅನ್ವೇಷಿಸಿ",
    ml: "കൂടുതൽ കാണുക",
    pa: "ਹੋਰ ਖੋਜੋ",
    ur: "مزید دریافت کریں",
    or: "ଆହୁରି ଦେଖନ୍ତୁ",
    as: "আৰু বিচাৰক",
    ne: "थप खोज्नुहोस्",
    sa: "अधिकं अन्विष्यताम्",
    kok: "आनीक सोदात",
    mai: "आओर खोजू",
    ks: "مزید ژٕور",
    sd: "وڌيڪ ڳوليو",
    doi: "होर खोजो",
    mni: "ꯑꯃꯨꯛ ꯊꯤꯕ",
    brx: "खिन्थि नाय",
    sat: "ᱟᱨ ᱧᱮᱞ",
    es: "Sigue explorando",
    fr: "Continuez à explorer",
    de: "Mehr entdecken",
    ar: "اكتشف المزيد",
    zh: "继续探索",
    ja: "さらに探す",
    ko: "더 탐색하기",
    pt: "Continue explorando",
    it: "Continua a esplorare",
    ru: "Продолжить поиск",
    tr: "Keşfetmeye Devam Et",
  },

  moreFabrics: {
    en: "More {category} fabrics",
    hi: "और {category} फैब्रिक",
    bn: "আরও {category} কাপড়",
    te: "మరిన్ని {category} ఫ్యాబ్రిక్‌లు",
    mr: "अधिक {category} फॅब्रिक",
    ta: "மேலும் {category} துணிகள்",
    gu: "વધુ {category} ફેબ્રિક",
    kn: "ಇನ್ನಷ್ಟು {category} ಫ್ಯಾಬ್ರಿಕ್‌ಗಳು",
    ml: "കൂടുതൽ {category} തുണിത്തരങ്ങൾ",
    pa: "ਹੋਰ {category} ਫੈਬਰਿਕ",
    ur: "مزید {category} فیبرکس",
    or: "ଆହୁରି {category} ଫ୍ୟାବ୍ରିକ୍",
    as: "আৰু {category} ফেব্ৰিক",
    ne: "थप {category} फेब्रिक",
    sa: "अधिक {category} वस्त्राणि",
    kok: "आनीक {category} फॅब्रिक",
    mai: "आओर {category} फैब्रिक",
    ks: "مزید {category} فیبرک",
    sd: "وڌيڪ {category} فيبرڪ",
    doi: "होर {category} फैब्रिक",
    mni: "ꯑꯃꯨꯛ {category} ꯐꯦꯕ꯭ꯔꯤꯛ",
    brx: "गोबां {category} फैब्रिक",
    sat: "ᱟᱨ {category} ᱯᱷᱟᱵᱽᱨᱤᱠ",
    es: "Más tejidos de {category}",
    fr: "Plus de tissus {category}",
    de: "Weitere {category}-Stoffe",
    ar: "المزيد من أقمشة {category}",
    zh: "更多 {category} 面料",
    ja: "その他の{category}生地",
    ko: "더 많은 {category} 원단",
    pt: "Mais tecidos de {category}",
    it: "Altri tessuti {category}",
    ru: "Другие ткани {category}",
    tr: "Daha fazla {category} kumaş",
  },

  viewAll: {
    en: "View all",
    hi: "सभी देखें",
    bn: "সব দেখুন",
    te: "అన్నీ చూడండి",
    mr: "सर्व पहा",
    ta: "அனைத்தையும் பார்க்கவும்",
    gu: "બધું જુઓ",
    kn: "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
    ml: "എല്ലാം കാണുക",
    pa: "ਸਭ ਵੇਖੋ",
    ur: "سب دیکھیں",
    or: "ସବୁ ଦେଖନ୍ତୁ",
    as: "সকলো চাওক",
    ne: "सबै हेर्नुहोस्",
    sa: "सर्वं पश्यतु",
    kok: "सगळें पळयात",
    mai: "सभ देखू",
    ks: "سٲری دِیٖکھو",
    sd: "سڀ ڏسو",
    doi: "सब दिक्खो",
    mni: "ꯑꯄꯣꯟꯕ ꯎꯁꯤꯕꯤꯌꯨ",
    brx: "सोलो नाय",
    sat: "ᱥᱟᱵ ᱧᱮᱞ",
    es: "Ver todo",
    fr: "Tout voir",
    de: "Alle anzeigen",
    ar: "عرض الكل",
    zh: "查看全部",
    ja: "すべて見る",
    ko: "모두 보기",
    pt: "Ver tudo",
    it: "Vedi tutto",
    ru: "Смотреть всё",
    tr: "Tümünü Gör",
  },

  readyTitle: {
    en: "Ready to source this fabric?",
    hi: "यह फैब्रिक सोर्स करने के लिए तैयार हैं?",
    bn: "এই কাপড়টি সোর্স করতে প্রস্তুত?",
    te: "ఈ ఫ్యాబ్రిక్‌ను సోర్స్ చేయడానికి సిద్ధంగా ఉన్నారా?",
    mr: "हा फॅब्रिक सोर्स करण्यासाठी तयार आहात?",
    ta: "இந்த துணியைப் பெற தயாரா?",
    gu: "આ ફેબ્રિક સોર્સ કરવા તૈયાર છો?",
    kn: "ಈ ಫ್ಯಾಬ್ರಿಕ್ ಅನ್ನು ಸೋರ್ಸ್ ಮಾಡಲು ಸಿದ್ಧರಿದ್ದೀರಾ?",
    ml: "ഈ തുണി സോഴ്‌സ് ചെയ്യാൻ തയ്യാറാണോ?",
    pa: "ਇਹ ਫੈਬਰਿਕ ਸੋਰਸ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?",
    ur: "اس فیبرک کو سورس کرنے کے لیے تیار ہیں؟",
    or: "ଏହି ଫ୍ୟାବ୍ରିକ୍ ସୋର୍ସ କରିବାକୁ ପ୍ରସ୍ତୁତ?",
    as: "এই ফেব্ৰিকটো সোর্স কৰিবলৈ সাজু?",
    ne: "यो फेब्रिक सोर्स गर्न तयार हुनुहुन्छ?",
    sa: "एतत् वस्त्रं स्रोतुं सज्जाः वा?",
    kok: "हो फॅब्रिक सोर्स करपाक तयार आसात?",
    mai: "ई फैब्रिक सोर्स करबाक लेल तैयार छी?",
    ks: "یہِ فیبرک سورس کرٕنۍ خٲطرٕ تیار چھِو؟",
    sd: "هن فيبرڪ کي سورس ڪرڻ لاءِ تيار آهيو؟",
    doi: "एह् फैब्रिक सोर्स करने आस्तै तैयार ओ?",
    mni: "ꯃꯁꯤꯒꯤ ꯐꯦꯕ꯭ꯔꯤꯛ ꯐꯪꯕꯥ ꯌꯥꯔꯦ?",
    brx: "बे फैब्रिक सौर्स खालामनाय थाखाय थियार नामा?",
    sat: "ᱱᱚᱣᱟ ᱯᱷᱟᱵᱽᱨᱤᱠ ᱥᱚᱨᱥ ᱞᱟᱹᱜᱤᱫ ᱛᱮᱭᱟᱨ ᱢᱮ?",
    es: "¿Listo para abastecerte de este tejido?",
    fr: "Prêt à vous approvisionner en ce tissu ?",
    de: "Bereit, diesen Stoff zu beschaffen?",
    ar: "هل أنت مستعد لتوريد هذا القماش؟",
    zh: "准备采购这款面料了吗？",
    ja: "この生地を仕入れる準備はできましたか？",
    ko: "이 원단을 소싱할 준비가 되셨나요?",
    pt: "Pronto para adquirir este tecido?",
    it: "Pronto a rifornirti di questo tessuto?",
    ru: "Готовы закупить эту ткань?",
    tr: "Bu kumaşı tedarik etmeye hazır mısınız?",
  },

  readyDescription: {
    en: "Add it to your quote cart, complete buyer details and continue toward order payment and fulfillment.",
    hi: "इसे कोटेशन कार्ट में जोड़ें, खरीदार विवरण भरें और पेमेंट व फुलफिलमेंट की ओर बढ़ें।",
    bn: "এটি কোটেশন কার্টে যোগ করুন, ক্রেতার তথ্য পূরণ করুন এবং পেমেন্ট ও ফুলফিলমেন্টে এগিয়ে যান।",
    te: "దీన్ని కోటేషన్ కార్ట్‌కి జోడించి, కొనుగోలుదారు వివరాలు పూర్తి చేసి, చెల్లింపు మరియు ఫుల్‌ఫిల్‌మెంట్‌కి వెళ్లండి.",
    mr: "हे कोटेशन कार्टमध्ये जोडा, खरेदीदार तपशील भरा आणि पेमेंट व फुलफिलमेंटकडे जा.",
    ta: "மேற்கோள் கார்டில் சேர்த்து, வாங்குபவர் விவரங்களை நிரப்பி, கட்டணம் மற்றும் நிறைவேற்றலுக்குச் செல்லுங்கள்.",
    gu: "તેને કોટેશન કાર્ટમાં ઉમેરો, ખરીદદાર વિગતો પૂર્ણ કરો અને ચુકવણી તથા ફુલફિલમેન્ટ તરફ આગળ વધો.",
    kn: "ಇದನ್ನು ಕೋಟೇಶನ್ ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ, ಖರೀದಿದಾರರ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ಪಾವತಿ ಹಾಗೂ ಫುಲ್ಫಿಲ್‌ಮೆಂಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ.",
    ml: "ഇത് ക്വട്ടേഷൻ കാർട്ടിൽ ചേർത്ത് വാങ്ങുന്നയാളുടെ വിവരങ്ങൾ പൂർത്തിയാക്കി പേയ്മെന്റിലേക്കും ഫുൾഫിൽമെന്റിലേക്കും തുടരുക.",
    pa: "ਇਸਨੂੰ ਕੋਟੇਸ਼ਨ ਕਾਰਟ ਵਿੱਚ ਸ਼ਾਮਲ ਕਰੋ, ਖਰੀਦਦਾਰ ਵੇਰਵੇ ਪੂਰੇ ਕਰੋ ਅਤੇ ਭੁਗਤਾਨ ਤੇ ਫੁਲਫਿਲਮੈਂਟ ਵੱਲ ਵਧੋ।",
    ur: "اسے کوٹیشن کارٹ میں شامل کریں، خریدار کی تفصیلات مکمل کریں اور ادائیگی و تکمیل کی طرف بڑھیں۔",
    or: "ଏହାକୁ କୋଟେସନ୍ କାର୍ଟରେ ଯୋଡନ୍ତୁ, କ୍ରେତା ବିବରଣୀ ପୂରଣ କରନ୍ତୁ ଏବଂ ପେମେଣ୍ଟ ଓ ଫୁଲଫିଲମେଣ୍ଟକୁ ଯାଆନ୍ତୁ।",
    as: "ইয়াক কোটেচন কাৰ্টত যোগ কৰক, ক্ৰেতাৰ তথ্য পূৰণ কৰক আৰু পেমেণ্ট আৰু ফূলফিলমেণ্টলৈ আগবাঢ়ক।",
    ne: "यसलाई कोटेसन कार्टमा थप्नुहोस्, खरिदकर्ता विवरण पूरा गर्नुहोस् र भुक्तानी तथा फुलफिलमेन्टतर्फ अघि बढ्नुहोस्।",
    sa: "एतत् मूल्यप्रस्तावपेटिकायां स्थापयित्वा क्रेतृविवरणानि पूरयित्वा भुगतानपूर्तिप्रक्रियायां गच्छन्तु।",
    kok: "हें कोटेशन कार्टांत घालात, खरेदीदाराची माहिती पुरयात आनी पेमेंट फुलफिलमेंट कडेन वचात.",
    mai: "एकरा कोटेशन कार्ट मे जोड़ू, खरीदारक विवरण पूरा करू आ भुगतान आ पूर्ति दिस आगाँ बढ़ू।",
    ks: "یہِ کوٹیشن کارٹ منٛز شٲمل کٔرِو، خریدار تفصیل پوری کٔرِو تہ ادایگی و تکمیل طرف گژھو۔",
    sd: "ان کي ڪوٽيشن ڪارٽ ۾ شامل ڪريو، خريد ڪندڙ جا تفصيل ڀريو ۽ ادائيگي ۽ مڪمل ٿيڻ ڏانهن وڌو.",
    doi: "एह् कोटेशन कार्ट च पाओ, खरीदार दी जानकारी पूरी करो ते भुगतान ते पूर्ति आह् वधो।",
    mni: "ꯃꯁꯤ ꯀꯣꯇꯦꯁꯟ ꯀꯥꯔꯠꯇꯥ ꯍꯥꯞꯄꯤꯌꯨ, ꯂꯦꯉꯨꯔꯕ ꯃꯁꯤ ꯂꯩꯅ ꯆꯦꯛꯑꯥꯎꯠ ꯃꯇꯝꯗ ꯊꯥꯒꯠꯄꯤꯌꯨ।",
    brx: "बेको कोटेसन कार्टाव सानजो, बायरनि बिबुंफोर पूराय खालाम आरो पेमेन्ट आरो फुलफिलमेन्ट आव जाथोन।",
    sat: "ᱱᱚᱣᱟ ᱠᱚᱴᱮᱥᱚᱱ ᱠᱟᱨᱴ ᱨᱮ ᱥᱟᱡᱟᱣ ᱢᱮ, ᱠᱨᱮᱛᱟ ᱵᱤᱵᱚᱨᱚᱱ ᱯᱩᱨᱟᱹ ᱢᱮ ᱟᱨ ᱯᱟᱣᱢᱮᱱᱴ ᱟᱨ ᱯᱩᱨᱟᱹ ᱛᱷᱟᱠ ᱧᱤᱭᱟᱹ ᱢᱮᱱᱟᱜᱟ。",
    es: "Añádelo al carrito de cotización, completa los datos del comprador y continúa con el pago y el cumplimiento.",
    fr: "Ajoutez-le au panier de devis, complétez les informations de l'acheteur et poursuivez vers le paiement et l'exécution.",
    de: "In den Angebotswagen legen, Käuferdaten ergänzen und mit Zahlung und Fulfillment fortfahren.",
    ar: "أضفه إلى سلة عرض السعر، وأكمل بيانات المشتري، ثم تابع إلى الدفع والتنفيذ.",
    zh: "将其加入报价购物车，完善买家信息，然后继续付款和履约。",
    ja: "見積カートに追加し、購入者情報を入力して支払いとフルフィルメントへ進みます。",
    ko: "견적 카트에 추가하고 구매자 정보를 완료한 뒤 결제 및 이행 단계로 진행하세요.",
    pt: "Adicione ao carrinho de cotação, preencha os dados do comprador e prossiga para pagamento e fulfillment.",
    it: "Aggiungilo al carrello preventivi, completa i dati dell'acquirente e procedi a pagamento e fulfillment.",
    ru: "Добавьте в корзину для расчёта, заполните данные покупателя и перейдите к оплате и выполнению заказа.",
    tr: "Teklif sepetine ekleyin, alıcı bilgilerini tamamlayın ve ödeme ile sipariş gerçekleştirmeye geçin.",
  },
};

/* =========================================================
   CARE LABELS
========================================================= */

const CARE_LABELS = {
  washing: {
    en: "Washing",
    hi: "धुलाई",
    bn: "ধোয়া",
    te: "వాషింగ్",
    mr: "धुलाई",
    ta: "துவைப்பு",
    gu: "ધોવું",
    kn: "ತೊಳೆಯುವುದು",
    ml: "വൃത്തിയാക്കൽ",
    pa: "ਧੋਣਾ",
    ur: "دھلائی",
    or: "ଧୋଇବା",
    as: "ধোৱা",
    ne: "धुने",
    sa: "प्रक्षालनम्",
    kok: "धोवप",
    mai: "धुलाई",
    ks: "دُلہٲی",
    sd: "ڌوئڻ",
    doi: "धोना",
    mni: "ꯍꯥꯏꯅ ꯅꯨꯡꯁꯤ",
    brx: "धोवन",
    sat: "ᱫᱷᱚᱣᱟ",
    es: "Lavado",
    fr: "Lavage",
    de: "Waschen",
    ar: "الغسيل",
    zh: "洗涤",
    ja: "洗濯",
    ko: "세탁",
    pt: "Lavagem",
    it: "Lavaggio",
    ru: "Стирка",
    tr: "Yıkama",
  },

  temperature: {
    en: "Temperature",
    hi: "तापमान",
    bn: "তাপমাত্রা",
    te: "ఉష్ణోగ్రత",
    mr: "तापमान",
    ta: "வெப்பநிலை",
    gu: "તાપમાન",
    kn: "ತಾಪಮಾನ",
    ml: "താപനില",
    pa: "ਤਾਪਮਾਨ",
    ur: "درجہ حرارت",
    or: "ତାପମାତ୍ରା",
    as: "তাপমাত্ৰা",
    ne: "तापक्रम",
    sa: "तापमानम्",
    kok: "तापमान",
    mai: "तापमान",
    ks: "درجہ حرارت",
    sd: "گرمي پد",
    doi: "तापमान",
    mni: "ꯅꯨꯡꯁꯤꯒꯤ ꯆꯥꯛ",
    brx: "तापमाना",
    sat: "ᱛᱟᱯᱢᱟᱱ",
    es: "Temperatura",
    fr: "Température",
    de: "Temperatur",
    ar: "درجة الحرارة",
    zh: "温度",
    ja: "温度",
    ko: "온도",
    pt: "Temperatura",
    it: "Temperatura",
    ru: "Температура",
    tr: "Sıcaklık",
  },

  cycle: {
    en: "Cycle",
    hi: "साइकिल",
    bn: "সাইকেল",
    te: "సైకిల్",
    mr: "सायकल",
    ta: "சுழற்சி",
    gu: "સાયકલ",
    kn: "ಸೈಕಲ್",
    ml: "സൈക്കിൾ",
    pa: "ਚੱਕਰ",
    ur: "سائیکل",
    or: "ଚକ୍ର",
    as: "চক্ৰ",
    ne: "चक्र",
    sa: "चक्रम्",
    kok: "चक्र",
    mai: "साइकिल",
    ks: "سائیکل",
    sd: "چڪر",
    doi: "चक्र",
    mni: "ꯆꯛ",
    brx: "चक्र",
    sat: "ᱪᱟᱠᱨ",
    es: "Ciclo",
    fr: "Cycle",
    de: "Zyklus",
    ar: "الدورة",
    zh: "洗涤程序",
    ja: "洗濯コース",
    ko: "세탁 코스",
    pt: "Ciclo",
    it: "Ciclo",
    ru: "Цикл",
    tr: "Program",
  },

  detergent: {
    en: "Detergent",
    hi: "डिटर्जेंट",
    bn: "ডিটারজেন্ট",
    te: "డిటర్జెంట్",
    mr: "डिटर्जंट",
    ta: "சோப்பு",
    gu: "ડિટર્જન્ટ",
    kn: "ಡಿಟರ್ಜೆಂಟ್",
    ml: "ഡിറ്റർജന്റ്",
    pa: "ਡਿਟਰਜੈਂਟ",
    ur: "ڈٹرجنٹ",
    or: "ଡିଟରଜେଣ୍ଟ",
    as: "ডিটাৰজেণ্ট",
    ne: "डिटर्जेन्ट",
    sa: "प्रक्षालकः",
    kok: "डिटर्जंट",
    mai: "डिटर्जेंट",
    ks: "ڈٹرجنٹ",
    sd: "ڊيٽرجنٽ",
    doi: "डिटर्जेंट",
    mni: "ꯗꯤꯇꯔꯖꯦꯟꯇ",
    brx: "डिटारजेनट",
    sat: "ᱰᱤᱴᱟᱨᱡᱮᱱᱴ",
    es: "Detergente",
    fr: "Détergent",
    de: "Waschmittel",
    ar: "المنظف",
    zh: "洗涤剂",
    ja: "洗剤",
    ko: "세제",
    pt: "Detergente",
    it: "Detergente",
    ru: "Моющее средство",
    tr: "Deterjan",
  },

  bleach: {
    en: "Bleach",
    hi: "ब्लीच",
    bn: "ব্লিচ",
    te: "బ్లీచ్",
    mr: "ब्लीच",
    ta: "ப்ளீச்",
    gu: "બ્લીચ",
    kn: "ಬ್ಲೀಚ್",
    ml: "ബ്ലീച്ച്",
    pa: "ਬਲੀਚ",
    ur: "بلیچ",
    or: "ବ୍ଲିଚ୍",
    as: "ব্লিচ",
    ne: "ब्लीच",
    sa: "विरञ्जकः",
    kok: "ब्लीच",
    mai: "ब्लीच",
    ks: "بلیچ",
    sd: "بليچ",
    doi: "ब्लीच",
    mni: "ꯕ꯭ꯂꯤꯆ",
    brx: "ब्लीच",
    sat: "ᱵᱽᱞᱤᱪ",
    es: "Lejía",
    fr: "Javel",
    de: "Bleichmittel",
    ar: "المبيض",
    zh: "漂白剂",
    ja: "漂白剤",
    ko: "표백제",
    pt: "Alvejante",
    it: "Candeggina",
    ru: "Отбеливатель",
    tr: "Çamaşır suyu",
  },

  ironing: {
    en: "Ironing",
    hi: "इस्त्री",
    bn: "ইস্ত্রি",
    te: "ఇస్త్రీ",
    mr: "इस्त्री",
    ta: "இஸ்திரி",
    gu: "ઇસ્ત્રી",
    kn: "ಇಸ್ತ್ರಿ",
    ml: "ഇസ്തിരിയിടൽ",
    pa: "ਇਸਤਰੀ",
    ur: "استری",
    or: "ଇସ୍ତ୍ରି",
    as: "ইষ্ট্ৰী",
    ne: "इस्त्री",
    sa: "आयसनम्",
    kok: "इस्त्री",
    mai: "इस्त्री",
    ks: "استری",
    sd: "استري",
    doi: "प्रेस",
    mni: "ꯏꯁꯇ꯭ꯔꯤ",
    brx: "इस्तरी",
    sat: "ᱤᱥᱴᱨᱤ",
    es: "Planchado",
    fr: "Repassage",
    de: "Bügeln",
    ar: "الكي",
    zh: "熨烫",
    ja: "アイロン",
    ko: "다림질",
    pt: "Passar",
    it: "Stiratura",
    ru: "Глажка",
    tr: "Ütüleme",
  },

  drying: {
    en: "Drying",
    hi: "सुखाना",
    bn: "শুকানো",
    te: "ఆరబెట్టడం",
    mr: "वाळवणे",
    ta: "உலர்த்தல்",
    gu: "સુકવવું",
    kn: "ಒಣಗಿಸುವುದು",
    ml: "ഉണക്കൽ",
    pa: "ਸੁਕਾਉਣਾ",
    ur: "خشک کرنا",
    or: "ଶୁଖାଇବା",
    as: "শুকোৱা",
    ne: "सुकाउने",
    sa: "शोषणम्",
    kok: "सुकयात",
    mai: "सुखेनाइ",
    ks: "خشک کٔرُن",
    sd: "سڪائڻ",
    doi: "सुकाना",
    mni: "ꯅꯤꯡꯁꯤ",
    brx: "सुखावनाय",
    sat: "ᱥᱩᱠᱟᱹᱣ",
    es: "Secado",
    fr: "Séchage",
    de: "Trocknen",
    ar: "التجفيف",
    zh: "干燥",
    ja: "乾燥",
    ko: "건조",
    pt: "Secagem",
    it: "Asciugatura",
    ru: "Сушка",
    tr: "Kurutma",
  },

  sun: {
    en: "Sun Exposure",
    hi: "धूप में रखना",
    bn: "রোদে রাখা",
    te: "సూర్యరశ్మి",
    mr: "सूर्यप्रकाश",
    ta: "சூரிய ஒளி",
    gu: "સૂર્યપ્રકાશ",
    kn: "ಸೂರ್ಯರಶ್ಮಿ",
    ml: "സൂര്യപ്രകാശം",
    pa: "ਧੁੱਪ ਵਿੱਚ ਰੱਖਣਾ",
    ur: "دھوپ میں رکھنا",
    or: "ସୂର୍ଯ୍ୟାଲୋକ",
    as: "ৰ'দৰ সংস্পৰ্শ",
    ne: "घाममा राख्ने",
    sa: "सूर्यप्रकाशः",
    kok: "सुर्य प्रकाश",
    mai: "धूप",
    ks: "دھوپ",
    sd: "سج جي روشني",
    doi: "धुप्प",
    mni: "ꯆꯨꯁꯤꯡꯂꯥ",
    brx: "अनथाइ",
    sat: "ᱥᱩᱨᱭᱟ ᱟᱞᱚ",
    es: "Exposición al sol",
    fr: "Exposition au soleil",
    de: "Sonneneinstrahlung",
    ar: "التعرض للشمس",
    zh: "日晒",
    ja: "日光",
    ko: "햇빛 노출",
    pt: "Exposição ao sol",
    it: "Esposizione al sole",
    ru: "Воздействие солнца",
    tr: "Güneş Maruziyeti",
  },

  dryClean: {
    en: "Dry Cleaning",
    hi: "ड्राई क्लीनिंग",
    bn: "ড্রাই ক্লিনিং",
    te: "డ్రై క్లీనింగ్",
    mr: "ड्राय क्लीनिंग",
    ta: "ட்ரை கிளீனிங்",
    gu: "ડ્રાય ક્લીનિંગ",
    kn: "ಡ್ರೈ ಕ್ಲೀನಿಂಗ್",
    ml: "ഡ്രൈ ക്ലീനിംഗ്",
    pa: "ਡ੍ਰਾਈ ਕਲੀਨਿੰਗ",
    ur: "ڈرائی کلیننگ",
    or: "ଡ୍ରାଇ କ୍ଲିନିଂ",
    as: "ড্ৰাই ক্লিনিং",
    ne: "ड्राई क्लिनिङ",
    sa: "शुष्कप्रक्षालनम्",
    kok: "ड्राय क्लिनींग",
    mai: "ड्राई क्लीनिंग",
    ks: "ڈرٛاے کلیننگ",
    sd: "ڊرائي ڪليننگ",
    doi: "ड्राई क्लीनिंग",
    mni: "ꯗ꯭ꯔꯥꯏ ꯀ꯭ꯂꯤꯅꯤꯡ",
    brx: "ड्राय क्लिनिङ",
    sat: "ᱰᱨᱟᱭ ᱠᱞᱤᱱᱤᱝ",
    es: "Limpieza en seco",
    fr: "Nettoyage à sec",
    de: "Chemische Reinigung",
    ar: "التنظيف الجاف",
    zh: "干洗",
    ja: "ドライクリーニング",
    ko: "드라이클리닝",
    pt: "Lavagem a seco",
    it: "Lavaggio a secco",
    ru: "Химчистка",
    tr: "Kuru Temizleme",
  },

  shrinkage: {
    en: "Shrinkage",
    hi: "सिकुड़न",
    bn: "সঙ্কোচন",
    te: "కుంచితం",
    mr: "आकसणे",
    ta: "சுருக்கம்",
    gu: "સંકોચન",
    kn: "ಕುಗ್ಗುವಿಕೆ",
    ml: "ചുരുക്കം",
    pa: "ਸਿਕੁੜਨ",
    ur: "سکڑاؤ",
    or: "ସଙ୍କୋଚନ",
    as: "সঙ্কোচন",
    ne: "सुकुचन",
    sa: "सङ्कोचः",
    kok: "आकसप",
    mai: "सिकुड़न",
    ks: "سکڑاؤ",
    sd: "سڪڻ",
    doi: "सिकुड़न",
    mni: "ꯆꯥꯅꯅ",
    brx: "सिकुड़न",
    sat: "ᱥᱟᱹᱝᱠᱚᱪ",
    es: "Encogimiento",
    fr: "Rétrécissement",
    de: "Schrumpfung",
    ar: "الانكماش",
    zh: "缩水",
    ja: "収縮",
    ko: "수축",
    pt: "Encolhimento",
    it: "Restringimento",
    ru: "Усадка",
    tr: "Çekme",
  },
};

const CARE_ITEMS = [
  ["washing", Droplets],
  ["temperature", Droplets],
  ["cycle", Droplets],
  ["detergent", Droplets],
  ["bleach", Ban],
  ["ironing", Flame],
  ["drying", Wind],
  ["sun", Wind],
  ["dryClean", Shirt],
  ["shrinkage", PackageCheck],
];

/* =========================================================
   PRODUCT TERM TRANSLATIONS
========================================================= */

const TERM_MAP = {
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
};

const translateTerms = (
  value,
  language
) => {
  if (!value) {
    return "";
  }

  if (language === "en") {
    return String(value);
  }

  let output = String(value);

  const terms = Object.keys(
    TERM_MAP
  ).sort(
    (a, b) => b.length - a.length
  );

  for (const source of terms) {
    const translated =
      TERM_MAP[source]?.[language];

    if (!translated) {
      continue;
    }

    const escaped =
      source.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    output = output.replace(
      new RegExp(
        `\\b${escaped}\\b`,
        "gi"
      ),
      translated
    );
  }

  return output;
};

const getProductName = (
  product,
  language
) =>
  translateTerms(
    product?.name ||
      "TEXVERSE Product",
    language
  );

const getCategoryName = (
  product,
  language
) =>
  translateTerms(
    product?.category ||
      "Textiles",
    language
  );

const getSubcategoryName = (
  product,
  language
) =>
  translateTerms(
    product?.subcategory || "",
    language
  );

/* =========================================================
   DESCRIPTION
========================================================= */

const getLocalizedDescription = (
  product,
  language
) => {
  if (!product) {
    return "";
  }

  if (language === "en") {
    return (
      product.description ||
      "Premium textile product supplied for B2B bulk sourcing."
    );
  }

  const name = getProductName(
    product,
    language
  );

  const category =
    getCategoryName(
      product,
      language
    );

  const subcategory =
    getSubcategoryName(
      product,
      language
    );

  const supplier =
    product.supplier ||
    "Verified textile supplier";

  const price =
    `₹${formatPrice(
      product.price
    )}`;

  const moq = cleanMoq(
    product.moq
  );

  const stock =
    formatNumber(
      product.stock
    );

  const templates = {
    hi: `यह ${name} B2B बल्क सोर्सिंग के लिए ${supplier} द्वारा उपलब्ध कराया गया ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल प्रोडक्ट है। कीमत ${price}/मीटर से शुरू होती है। MOQ ${moq} मीटर है और उपलब्ध स्टॉक ${stock} मीटर है।`,

    bn: `এটি ${supplier} দ্বারা সরবরাহ করা B2B বাল্ক সোর্সিংয়ের জন্য ${category}${subcategory ? ` ${subcategory}` : ""} টেক্সটাইল পণ্য। মূল্য ${price}/মিটার থেকে শুরু এবং MOQ ${moq} মিটার। উপলব্ধ স্টক ${stock} মিটার।`,

    te: `ఇది ${supplier} అందించే B2B బల్క్ సోర్సింగ్ కోసం ${category}${subcategory ? ` ${subcategory}` : ""} టెక్స్‌టైల్ ఉత్పత్తి. ధర ${price}/మీటర్ నుండి ప్రారంభమవుతుంది. MOQ ${moq} మీటర్లు మరియు అందుబాటులో ఉన్న స్టాక్ ${stock} మీటర్లు.`,

    mr: `हे ${supplier} कडून पुरवले जाणारे B2B बल्क सोर्सिंगसाठीचे ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल उत्पादन आहे. किंमत ${price}/मीटरपासून सुरू होते. MOQ ${moq} मीटर आणि उपलब्ध साठा ${stock} मीटर आहे.`,

    ta: `இது ${supplier} வழங்கும் B2B மொத்த கொள்முதலுக்கான ${category}${subcategory ? ` ${subcategory}` : ""} டெக்ஸ்டைல் தயாரிப்பு. விலை ${price}/மீட்டரில் தொடங்குகிறது. MOQ ${moq} மீட்டர் மற்றும் இருப்பு ${stock} மீட்டர்.`,

    gu: `આ ${supplier} દ્વારા આપવામાં આવતું B2B બલ્ક સોર્સિંગ માટેનું ${category}${subcategory ? ` ${subcategory}` : ""} ટેક્સટાઇલ પ્રોડક્ટ છે. કિંમત ${price}/મીટરથી શરૂ થાય છે. MOQ ${moq} મીટર અને ઉપલબ્ધ સ્ટોક ${stock} મીટર છે.`,

    kn: `ಇದು ${supplier} ಒದಗಿಸುವ B2B ಬಲ್ಕ್ ಸೋರ್ಸಿಂಗ್‌ಗಾಗಿ ${category}${subcategory ? ` ${subcategory}` : ""} ಟೆಕ್ಸ್ಟೈಲ್ ಉತ್ಪನ್ನವಾಗಿದೆ. ಬೆಲೆ ${price}/ಮೀಟರ್‌ನಿಂದ ಆರಂಭವಾಗುತ್ತದೆ. MOQ ${moq} ಮೀಟರ್ ಮತ್ತು ಲಭ್ಯವಿರುವ ಸ್ಟಾಕ್ ${stock} ಮೀಟರ್.`,

    ml: `ഇത് ${supplier} നൽകുന്ന B2B ബൾക്ക് സോഴ്‌സിംഗിനുള്ള ${category}${subcategory ? ` ${subcategory}` : ""} ടെക്സ്റ്റൈൽ ഉൽപ്പന്നമാണ്. വില ${price}/മീറ്ററിൽ ആരംഭിക്കുന്നു. MOQ ${moq} മീറ്ററും ലഭ്യമായ സ്റ്റോക്ക് ${stock} മീറ്ററുമാണ്.`,

    pa: `ਇਹ ${supplier} ਵੱਲੋਂ ਦਿੱਤਾ ਜਾਣ ਵਾਲਾ B2B ਬਲਕ ਸੋਰਸਿੰਗ ਲਈ ${category}${subcategory ? ` ${subcategory}` : ""} ਟੈਕਸਟਾਈਲ ਉਤਪਾਦ ਹੈ। ਕੀਮਤ ${price}/ਮੀਟਰ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ। MOQ ${moq} ਮੀਟਰ ਅਤੇ ਉਪਲਬਧ ਸਟਾਕ ${stock} ਮੀਟਰ ਹੈ।`,

    ur: `یہ ${supplier} کی طرف سے B2B بلک سورسنگ کے لیے فراہم کردہ ${category}${subcategory ? ` ${subcategory}` : ""} ٹیکسٹائل پروڈکٹ ہے۔ قیمت ${price}/میٹر سے شروع ہوتی ہے۔ MOQ ${moq} میٹر اور دستیاب اسٹاک ${stock} میٹر ہے۔`,

    or: `ଏହା ${supplier} ଦ୍ୱାରା ଯୋଗାଇଦିଆଯାଉଥିବା B2B ବଲ୍କ ସୋର୍ସିଂ ପାଇଁ ${category}${subcategory ? ` ${subcategory}` : ""} ଟେକ୍ସଟାଇଲ୍ ପ୍ରୋଡକ୍ଟ। ମୂଲ୍ୟ ${price}/ମିଟରରୁ ଆରମ୍ଭ ହୁଏ। MOQ ${moq} ମିଟର ଏବଂ ଉପଲବ୍ଧ ଷ୍ଟକ୍ ${stock} ମିଟର।`,

    as: `এইটো ${supplier}-ৰ দ্বাৰা যোগান ধৰা B2B বাল্ক সোর্সিঙৰ বাবে ${category}${subcategory ? ` ${subcategory}` : ""} টেক্সটাইল প্ৰডাক্ট। মূল্য ${price}/মিটাৰৰ পৰা আৰম্ভ হয়। MOQ ${moq} মিটাৰ আৰু উপলব্ধ ষ্টক ${stock} মিটাৰ।`,

    ne: `यो ${supplier} द्वारा उपलब्ध गराइएको B2B बल्क सोर्सिङका लागि ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल उत्पादन हो। मूल्य ${price}/मिटरबाट सुरु हुन्छ। MOQ ${moq} मिटर र उपलब्ध स्टक ${stock} मिटर छ।`,

    sa: `इदं ${supplier} इत्यनेन प्रदत्तं B2B थोकस्रोतणाय ${category}${subcategory ? ` ${subcategory}` : ""} वस्त्रोत्पादम् अस्ति। मूल्यं ${price}/मीटरतः आरभते। MOQ ${moq} मीटर, उपलब्धसञ्चयः ${stock} मीटर।`,

    kok: `हें ${supplier} कडल्यान दिवपी B2B बल्क सोर्सिंग खातीर ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटायल उत्पादन आसा. किंमत ${price}/मीटर सावन सुरू जाता. MOQ ${moq} मीटर आनी उपलब्ध स्टॉक ${stock} मीटर आसा.`,

    mai: `ई ${supplier} द्वारा देल गेल B2B बल्क सोर्सिंग लेल ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल प्रोडक्ट अछि। दाम ${price}/मीटर सँ शुरू होइत अछि। MOQ ${moq} मीटर आ उपलब्ध स्टॉक ${stock} मीटर अछि।`,

    ks: `یہِ ${supplier} پٮ۪ٹھ B2B بلک سورسنگ خٲطرٕ دِوان ${category}${subcategory ? ` ${subcategory}` : ""} ٹیکسٹائل پروڈکٹ چھُ۔ قٕیمت ${price}/میٹر پٮ۪ٹھ شروعات گژھان چھِ۔ MOQ ${moq} میٹر تہ دستیاب سٹاک ${stock} میٹر چھُ۔`,

    sd: `هي ${supplier} پاران B2B ٿوڪ سورسنگ لاءِ فراهم ڪيل ${category}${subcategory ? ` ${subcategory}` : ""} ٽيڪسٽائل پراڊڪٽ آهي۔ قيمت ${price}/ميٽر کان شروع ٿئي ٿي۔ MOQ ${moq} ميٽر ۽ دستياب اسٽاڪ ${stock} ميٽر آهي۔`,

    doi: `एह् ${supplier} आसेआं B2B थोक सोर्सिंग आस्तै दित्ता गेदा ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल प्रोडक्ट ऐ। भाव ${price}/मीटर थमां शुरू होंदा ऐ। MOQ ${moq} मीटर ते उपलब्ध स्टॉक ${stock} मीटर ऐ।`,

    mni: `ꯃꯁꯤ ${supplier} ꯅ ꯄꯤꯔꯤꯕ B2B ꯊꯣꯛ ꯁꯣꯔꯁꯤꯡ ꯑꯣꯏꯅ ${category}${subcategory ? ` ${subcategory}` : ""} ꯇꯦꯛꯁꯇꯥꯏꯜ ꯄ꯭ꯔꯣꯗꯛꯇ ꯑꯃꯅꯤ। ꯃꯨꯂ꯭ꯌ ${price}/ꯃꯤꯇꯔꯒꯤ ꯃꯊꯧꯗ ꯍꯥꯏ। MOQ ${moq} ꯃꯤꯇꯔ ꯑꯃꯁꯨꯡ ꯂꯩꯕ ꯁ꯭ꯇꯣꯛ ${stock} ꯃꯤꯇꯔ ꯑꯃꯅꯤ।`,

    brx: `बे ${supplier} नि B2B बल्क सौर्सिङनि थाखाय होनाय ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल प्रोडक्ट। बेयो ${price}/मिटर निफ्राय जाबाय। MOQ ${moq} मिटर आरो मोननाय स्टक ${stock} मिटर।`,

    sat: `नोवा ${supplier} तेत् B2B बाड़ा सोर्सिंग ला़गित् एम होन ${category}${subcategory ? ` ${subcategory}` : ""} टेक्सटाइल प्रोडाक्ट काना। दाम ${price}/मीटर खोन एहोबोक् आ। MOQ ${moq} मीटर आर जोगाव स्टोक ${stock} मीटर काना।`,

    es: `Este producto textil ${category}${subcategory ? ` ${subcategory}` : ""}, suministrado por ${supplier}, está pensado para abastecimiento B2B al por mayor. Precio desde ${price}/metro. MOQ ${moq} metros y stock disponible ${stock} metros.`,

    fr: `Ce produit textile ${category}${subcategory ? ` ${subcategory}` : ""}, fourni par ${supplier}, est destiné à l'approvisionnement B2B en gros. Prix à partir de ${price}/mètre. MOQ ${moq} mètres et stock disponible ${stock} mètres.`,

    de: `Dieses ${category}${subcategory ? ` ${subcategory}` : ""}-Textilprodukt von ${supplier} ist für die B2B-Großbeschaffung bestimmt. Preis ab ${price}/Meter. MOQ ${moq} Meter und verfügbarer Bestand ${stock} Meter.`,

    ar: `هذا المنتج النسيجي من ${category}${subcategory ? ` ${subcategory}` : ""} والمقدم من ${supplier} مخصص للتوريد بالجملة B2B. يبدأ السعر من ${price}/متر. الحد الأدنى للطلب ${moq} متر والمخزون المتاح ${stock} متر.`,

    zh: `这款${category}${subcategory ? ` ${subcategory}` : ""}纺织产品由 ${supplier} 供应，适用于B2B批量采购。起始价格为 ${price}/米。MOQ 为 ${moq} 米，现有库存 ${stock} 米。`,

    ja: `この${category}${subcategory ? ` ${subcategory}` : ""}テキスタイル製品は${supplier}が供給し、B2Bの大量調達向けです。価格は${price}/メートルから。MOQは${moq}メートル、在庫は${stock}メートルです。`,

    ko: `이 ${category}${subcategory ? ` ${subcategory}` : ""} 섬유 제품은 ${supplier}가 공급하며 B2B 대량 조달에 적합합니다. 가격은 ${price}/미터부터 시작합니다. MOQ는 ${moq}미터이고 재고는 ${stock}미터입니다.`,

    pt: `Este produto têxtil de ${category}${subcategory ? ` ${subcategory}` : ""}, fornecido por ${supplier}, é indicado para fornecimento B2B em grande volume. Preço a partir de ${price}/metro. MOQ de ${moq} metros e estoque disponível de ${stock} metros.`,

    it: `Questo prodotto tessile ${category}${subcategory ? ` ${subcategory}` : ""}, fornito da ${supplier}, è pensato per la fornitura B2B all'ingrosso. Prezzo da ${price}/metro. MOQ ${moq} metri e stock disponibile ${stock} metri.`,

    ru: `Этот текстильный товар категории ${category}${subcategory ? ` ${subcategory}` : ""}, поставляемый ${supplier}, предназначен для оптовых закупок B2B. Цена от ${price}/метр. MOQ ${moq} метров, доступный запас ${stock} метров.`,

    tr: `Bu ${category}${subcategory ? ` ${subcategory}` : ""} tekstil ürünü ${supplier} tarafından tedarik edilir ve B2B toplu alıma uygundur. Fiyat ${price}/metreden başlar. MOQ ${moq} metre ve mevcut stok ${stock} metredir.`,
  };

  return (
    templates[language] ||
    templates.en
  );
};

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const language =
    useDocumentLanguage();

  const rtl = isRTL(language);

  const structuralStyle = {
    direction: "ltr",
  };

  const textStyle = {
    direction: rtl
      ? "rtl"
      : "ltr",
    unicodeBidi:
      "plaintext",
  };

  const [product, setProduct] =
    useState(null);

  const [relatedProducts, setRelatedProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  /* =======================================================
     LOAD PRODUCT
  ======================================================= */

  const loadProduct = async () => {
    setLoading(true);
    setError("");
    setProduct(null);

    try {
      const productId =
        Number(id);

      if (
        !Number.isInteger(
          productId
        ) ||
        productId <= 0
      ) {
        throw new Error(
          "Invalid product ID."
        );
      }

      const result =
        await productApi.get(
          productId
        );

      if (
        !result ||
        !result.id
      ) {
        throw new Error(
          "Product not found."
        );
      }

      setProduct(result);

      const minimum =
        getNumericMoq(
          result.moq
        );

      setQuantity(
        minimum
      );

      /* RELATED PRODUCTS */

      try {
        const allProducts =
          await productApi.list();

        if (
          Array.isArray(
            allProducts
          )
        ) {
          const related =
            allProducts
              .filter(
                (item) =>
                  String(
                    item.id
                  ) !==
                    String(
                      result.id
                    ) &&
                  String(
                    item.category ||
                      ""
                  ).toLowerCase() ===
                    String(
                      result.category ||
                        ""
                    ).toLowerCase()
              )
              .slice(0, 3);

          setRelatedProducts(
            related
          );
        } else {
          setRelatedProducts(
            []
          );
        }
      } catch (
        relatedError
      ) {
        console.warn(
          "Unable to load related products:",
          relatedError
        );

        setRelatedProducts(
          []
        );
      }
    } catch (err) {
      console.error(
        "TEXVERSE Product Details error:",
        err
      );

      setError(
        err?.message ||
          "Unable to load this product."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  /* =======================================================
     DERIVED DATA
  ======================================================= */

  const productImage =
    useMemo(
      () =>
        resolveProductImage(
          product?.image
        ),
      [product]
    );

  const minimumQuantity =
    useMemo(
      () =>
        getNumericMoq(
          product?.moq
        ),
      [product]
    );

  const maximumQuantity =
    useMemo(() => {
      const stock =
        Number(
          product?.stock
        );

      if (
        !Number.isFinite(
          stock
        ) ||
        stock <= 0
      ) {
        return null;
      }

      return Math.floor(
        stock
      );
    }, [product]);

  const productName =
    getProductName(
      product,
      language
    );

  const productCategory =
    getCategoryName(
      product,
      language
    );

  const productSubcategory =
    getSubcategoryName(
      product,
      language
    );

  const productDescription =
    getLocalizedDescription(
      product,
      language
    );

  const supplierName =
    product?.supplier ||
    "Verified textile supplier";

  /* =======================================================
     CART
  ======================================================= */

  const addToCart = (
    goToCart = true
  ) => {
    if (!product) {
      return;
    }

    let cart = [];

    try {
      const stored =
        localStorage.getItem(
          "cart"
        );

      const parsed =
        JSON.parse(
          stored || "[]"
        );

      cart = Array.isArray(
        parsed
      )
        ? parsed
        : [];
    } catch {
      cart = [];
    }

    let safeQuantity =
      Math.max(
        minimumQuantity,
        Number(quantity) || 1
      );

    if (
      maximumQuantity
    ) {
      safeQuantity =
        Math.min(
          safeQuantity,
          maximumQuantity
        );
    }

    const existing =
      cart.find(
        (item) =>
          String(
            item.id
          ) ===
          String(
            product.id
          )
      );

    if (existing) {
      const nextQuantity =
        Number(
          existing.quantity || 0
        ) +
        safeQuantity;

      existing.quantity =
        maximumQuantity
          ? Math.min(
              nextQuantity,
              maximumQuantity
            )
          : nextQuantity;
    } else {
      cart.push({
        ...product,
        quantity:
          safeQuantity,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    window.dispatchEvent(
      new Event(
        "cart-updated"
      )
    );

    if (goToCart) {
      navigate("/cart");
    }
  };

  const buyNow = () => {
    addToCart(false);
    navigate("/checkout");
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <main
        className="min-h-screen bg-slate-950 px-5 pt-28 text-white md:px-6"
        style={structuralStyle}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center py-40">
          <div
            className="text-center"
            style={textStyle}
          >
            <Loader2
              size={44}
              className="mx-auto animate-spin text-cyan-400"
            />

            <h1 className="mt-5 text-2xl font-black">
              {text(
                UI.loading,
                language
              )}
            </h1>

            <p className="mt-2 text-slate-500">
              {text(
                UI.loadingDescription,
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

  if (
    error ||
    !product
  ) {
    return (
      <main
        className="min-h-screen bg-slate-950 px-5 pt-28 text-white md:px-6"
        style={structuralStyle}
      >
        <div
          className="mx-auto max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center"
          style={textStyle}
        >
          <h1 className="text-4xl font-black">
            {text(
              UI.notFound,
              language
            )}
          </h1>

          <p className="mt-4 text-slate-400">
            {error ||
              `${text(
                UI.notFound,
                language
              )} #${id}`}
          </p>

          <div
            className="mt-7 flex flex-wrap justify-center gap-3"
            style={{
              direction:
                "ltr",
            }}
          >
            <button
              type="button"
              onClick={
                loadProduct
              }
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 hover:bg-cyan-300"
            >
              <RefreshCw
                size={17}
              />

              <span
                style={
                  textStyle
                }
              >
                {text(
                  UI.retry,
                  language
                )}
              </span>
            </button>

            <Link
              to="/marketplace"
              className="rounded-xl border border-slate-700 px-5 py-3 font-bold text-slate-300 hover:bg-slate-800"
            >
              <span
                style={
                  textStyle
                }
              >
                {text(
                  UI.backMarketplace,
                  language
                )}
              </span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     PRODUCT PAGE
  ======================================================= */

  return (
    <main
      className="min-h-screen bg-slate-950 px-5 pb-20 pt-28 text-white md:px-6"
      style={structuralStyle}
    >
      <div
        className="mx-auto max-w-7xl"
        style={structuralStyle}
      >

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-slate-500"
          style={structuralStyle}
        >
          <Link
            to="/categories"
            className="hover:text-cyan-300"
          >
            <span
              style={textStyle}
            >
              {text(
                UI.categories,
                language
              )}
            </span>
          </Link>

          <ChevronRight
            size={14}
          />

          <Link
            to={`/marketplace?category=${encodeURIComponent(
              product.category ||
                ""
            )}`}
            className="hover:text-cyan-300"
          >
            <span
              style={textStyle}
            >
              {productCategory}
            </span>
          </Link>

          <ChevronRight
            size={14}
          />

          <span
            className="text-slate-300"
            style={textStyle}
          >
            {productName}
          </span>
        </div>

        {/* =================================================
            MAIN PRODUCT
            ALWAYS IMAGE LEFT / INFO RIGHT
        ================================================= */}

        <div
          className="grid items-start gap-10 lg:grid-cols-[1.05fr_.95fr]"
          style={structuralStyle}
        >

          {/* =================================================
              IMAGE — ALWAYS LEFT
          ================================================= */}

          <div
            className="lg:sticky lg:top-24"
            style={{
              direction:
                "ltr",
            }}
          >
            <div className="rounded-4xl border border-slate-800 bg-slate-900 p-3 shadow-2xl">
              <div className="relative overflow-hidden rounded-3xl bg-slate-800">

                {productImage ? (
                  <img
                    src={
                      productImage
                    }
                    alt={
                      productName
                    }
                    className="h-107.5 w-full object-cover md:h-145"
                    onError={(
                      event
                    ) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <div
                    className="flex h-107.5 items-center justify-center text-slate-500 md:h-145"
                    style={
                      textStyle
                    }
                  >
                    {language ===
                    "en"
                      ? "No image available"
                      : "Image unavailable"}
                  </div>
                )}

                {product.verified && (
                  <span
                    className={`absolute top-5 ${
                      rtl
                        ? "right-5"
                        : "left-5"
                    } inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-black text-slate-950`}
                    style={{
                      direction:
                        "ltr",
                    }}
                  >
                    <ShieldCheck
                      size={17}
                    />

                    <span
                      style={
                        textStyle
                      }
                    >
                      {text(
                        UI.verifiedSupplier,
                        language
                      )}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {/* QUICK STATS */}

            <div
              className="mt-3 grid grid-cols-3 gap-3"
              style={{
                direction:
                  "ltr",
              }}
            >
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
                <p className="text-xl font-black text-cyan-300">
                  {product.rating ||
                    "—"}
                </p>

                <p
                  className="mt-1 text-xs text-slate-500"
                  style={
                    textStyle
                  }
                >
                  {language ===
                  "en"
                    ? "Supplier rating"
                    : language ===
                        "hi"
                      ? "सप्लायर रेटिंग"
                      : language ===
                          "ur"
                        ? "سپلائر ریٹنگ"
                        : language ===
                            "ar"
                          ? "تقييم المورد"
                          : "Supplier rating"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
                <p className="text-xl font-black">
                  {cleanMoq(
                    product.moq
                  )}
                </p>

                <p
                  className="mt-1 text-xs text-slate-500"
                  style={
                    textStyle
                  }
                >
                  MOQ
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 text-center">
                <p className="text-xl font-black">
                  {formatNumber(
                    product.stock
                  )}
                </p>

                <p
                  className="mt-1 text-xs text-slate-500"
                  style={
                    textStyle
                  }
                >
                  {text(
                    UI.stock,
                    language
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              PRODUCT INFORMATION — ALWAYS RIGHT
          ================================================= */}

          <div
            style={
              textStyle
            }
          >
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
              <ShieldCheck
                size={17}
              />

              <span>
                {product.verified
                  ? text(
                      UI.verifiedSupplier,
                      language
                    )
                  : text(
                      UI.marketplace,
                      language
                    )}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles
                size={14}
              />

              <span>
                {productCategory}
              </span>

              {productSubcategory && (
                <>
                  <span>
                    /
                  </span>

                  <span>
                    {
                      productSubcategory
                    }
                  </span>
                </>
              )}
            </div>

            <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
              {productName}
            </h1>

            <p className="mt-5 text-lg leading-7 text-slate-400">
              {productDescription}
            </p>

            <p className="mt-5 text-slate-300">
              {text(
                UI.suppliedBy,
                language
              )}{" "}
              <strong className="text-white">
                {supplierName}
              </strong>
            </p>

            {/* =================================================
                PRICE
            ================================================= */}

            <div className="mt-8 rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {text(
                  UI.startingPrice,
                  language
                )}
              </p>

              <div
                className="mt-1 flex items-end gap-2"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <span className="text-4xl font-black text-cyan-300">
                  ₹
                  {formatPrice(
                    product.price
                  )}
                </span>

                <span className="text-slate-500">
                  /
                  {product.unit ||
                    "meter"}
                </span>
              </div>

              <div
                className="mt-5 flex flex-wrap gap-2"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <span className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
                  MOQ{" "}
                  <strong>
                    {cleanMoq(
                      product.moq
                    )}
                  </strong>
                </span>

                <span className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm">
                  <span
                    style={
                      textStyle
                    }
                  >
                    {language ===
                    "en"
                      ? "Sample"
                      : language ===
                          "hi"
                        ? "सैंपल"
                        : language ===
                            "ur"
                          ? "نمونہ"
                          : language ===
                              "ar"
                            ? "عينة"
                            : "Sample"}
                  </span>{" "}
                  <strong
                    style={
                      textStyle
                    }
                  >
                    {product.sample ||
                      (language ===
                      "en"
                        ? "On Request"
                        : "On Request")}
                  </strong>
                </span>
              </div>
            </div>

            {/* =================================================
                QUANTITY / CART
            ================================================= */}

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900 p-6">

              <div
                className="flex items-center justify-between gap-4"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <div
                  style={
                    textStyle
                  }
                >
                  <p className="font-bold">
                    {text(
                      UI.orderQuantity,
                      language
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {text(
                      UI.quantityHelp,
                      language
                    )}
                  </p>
                </div>

                <div
                  className="flex shrink-0 items-center overflow-hidden rounded-xl border border-slate-700"
                  style={{
                    direction:
                      "ltr",
                  }}
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity(
                        (
                          current
                        ) =>
                          Math.max(
                            minimumQuantity,
                            current - 1
                          )
                      )
                    }
                    className="p-3 hover:bg-slate-800"
                  >
                    <Minus
                      size={16}
                    />
                  </button>

                  <span className="w-16 text-center font-black">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity(
                        (
                          current
                        ) =>
                          maximumQuantity
                            ? Math.min(
                                maximumQuantity,
                                current + 1
                              )
                            : current + 1
                      )
                    }
                    className="p-3 hover:bg-slate-800"
                  >
                    <Plus
                      size={16}
                    />
                  </button>
                </div>
              </div>

              <div
                className="mt-5 grid gap-3 sm:grid-cols-2"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    addToCart(true)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 py-3.5 font-black text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
                >
                  <ShoppingCart
                    size={18}
                  />

                  <span
                    style={
                      textStyle
                    }
                  >
                    {text(
                      UI.addToCart,
                      language
                    )}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={
                    buyNow
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 font-black text-slate-950 transition hover:bg-cyan-300"
                >
                  <span
                    style={
                      textStyle
                    }
                  >
                    {text(
                      UI.buyCheckout,
                      language
                    )}
                  </span>

                  <ChevronRight
                    size={18}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            SPECIFICATIONS + CARE
            STRUCTURAL LTR
        ================================================= */}

        <section
          className="mt-12 grid gap-7 lg:grid-cols-2"
          style={structuralStyle}
        >

          {/* SPECIFICATIONS — LEFT */}

          <div
            className="rounded-3xl border border-slate-800 bg-slate-900 p-7"
            style={
              textStyle
            }
          >
            <h2 className="text-2xl font-black">
              {text(
                UI.technicalSpecs,
                language
              )}
            </h2>

            <div className="mt-5 grid sm:grid-cols-2">
              {[
                [
                  text(
                    UI.composition,
                    language
                  ),
                  product.composition,
                ],

                [
                  text(
                    UI.gsm,
                    language
                  ),
                  product.gsm,
                ],

                [
                  text(
                    UI.width,
                    language
                  ),
                  product.width,
                ],

                [
                  text(
                    UI.color,
                    language
                  ),
                  translateTerms(
                    product.color,
                    language
                  ),
                ],

                [
                  text(
                    UI.pattern,
                    language
                  ),
                  translateTerms(
                    product.pattern,
                    language
                  ),
                ],

                [
                  text(
                    UI.stock,
                    language
                  ),
                  formatNumber(
                    product.stock
                  ),
                ],
              ].map(
                ([
                  label,
                  value,
                ]) => (
                  <div
                    key={label}
                    className="border-t border-slate-800 py-4"
                  >
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      {label}
                    </p>

                    <p className="mt-1 font-semibold">
                      {translateTerms(
                        value ||
                          "",
                        language
                      ) ||
                        (language ===
                        "en"
                          ? "Supplier specified"
                          : "Supplier specified")}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* CARE — RIGHT */}

          <div
            className="rounded-3xl border border-cyan-400/20 bg-linear-to-br from-cyan-400/10 to-slate-900 p-7"
            style={
              textStyle
            }
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <Droplets />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  {text(
                    UI.washingCare,
                    language
                  )}
                </p>

                <h2 className="text-2xl font-black">
                  {text(
                    UI.washingCare,
                    language
                  )}
                </h2>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CARE_ITEMS.map(
                ([
                  key,
                  Icon,
                ]) => (
                  <div
                    key={key}
                    className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Icon
                        size={15}
                        className="text-cyan-400"
                      />

                      <span>
                        {text(
                          CARE_LABELS[
                            key
                          ],
                          language,
                          key
                        )}
                      </span>
                    </div>

                    <p className="mt-2 font-semibold">
                      {translateTerms(
                        product
                          .care?.[
                          key
                        ] ||
                          "",
                        language
                      ) ||
                        (language ===
                        "en"
                          ? "Supplier specified"
                          : "Supplier specified")}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* =================================================
            RELATED PRODUCTS
            ALWAYS LTR
        ================================================= */}

        {relatedProducts.length >
          0 && (
          <section
            className="mt-12"
            style={
              structuralStyle
            }
          >
            <div
              className="mb-5 flex items-end justify-between gap-4"
              style={{
                direction:
                  "ltr",
              }}
            >
              <div
                style={
                  textStyle
                }
              >
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  {text(
                    UI.keepExploring,
                    language
                  )}
                </p>

                <h2 className="mt-1 text-3xl font-black">
                  {replaceVars(
                    text(
                      UI.moreFabrics,
                      language
                    ),
                    {
                      category:
                        productCategory,
                    }
                  )}
                </h2>
              </div>

              <Link
                to={`/marketplace?category=${encodeURIComponent(
                  product.category ||
                    ""
                )}`}
                className="shrink-0 text-sm font-bold text-cyan-300"
                style={
                  textStyle
                }
              >
                {text(
                  UI.viewAll,
                  language
                )}{" "}
                →
              </Link>
            </div>

            <div
              className="grid gap-5 md:grid-cols-3"
              style={
                structuralStyle
              }
            >
              {relatedProducts.map(
                (item) => {
                  const image =
                    resolveProductImage(
                      item.image
                    );

                  const name =
                    getProductName(
                      item,
                      language
                    );

                  const subcategory =
                    getSubcategoryName(
                      item,
                      language
                    );

                  return (
                    <Link
                      key={
                        item.id
                      }
                      to={`/product/${item.id}`}
                      className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 transition hover:border-cyan-400/40"
                      style={{
                        direction:
                          "ltr",
                      }}
                    >
                      <div className="h-44 overflow-hidden bg-slate-800">
                        {image ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              name
                            }
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-500">
                            No image
                          </div>
                        )}
                      </div>

                      <div
                        className="p-5"
                        style={
                          textStyle
                        }
                      >
                        <p className="text-xs font-bold uppercase text-cyan-400">
                          {subcategory ||
                            getCategoryName(
                              item,
                              language
                            )}
                        </p>

                        <h3 className="mt-1 text-lg font-black">
                          {name}
                        </h3>

                        <div
                          className="mt-2 flex items-center gap-2 text-sm text-slate-500"
                          style={{
                            direction:
                              "ltr",
                          }}
                        >
                          <span>
                            ₹
                            {formatPrice(
                              item.price
                            )}
                            /
                            {item.unit ||
                              "m"}
                          </span>

                          {item.rating && (
                            <>
                              <span>
                                •
                              </span>

                              <Star
                                size={13}
                                className="fill-current text-yellow-400"
                              />

                              <span>
                                {
                                  item.rating
                                }
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </section>
        )}

        {/* =================================================
            FINAL CTA
        ================================================= */}

        <section
          className="mt-12 rounded-4xl border border-cyan-400/15 bg-linear-to-r from-cyan-400/10 to-slate-900 p-7 md:p-9"
          style={
            textStyle
          }
        >
          <div
            className="flex flex-col justify-between gap-5 md:flex-row md:items-center"
            style={{
              direction:
                "ltr",
            }}
          >
            <div
              style={
                textStyle
              }
            >
              <h2 className="text-2xl font-black md:text-3xl">
                {text(
                  UI.readyTitle,
                  language
                )}
              </h2>

              <p className="mt-2 text-slate-400">
                {text(
                  UI.readyDescription,
                  language
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                addToCart(true)
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950"
            >
              <Send
                size={17}
              />

              <span
                style={
                  textStyle
                }
              >
                {text(
                  UI.requestQuote,
                  language
                )}
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  Trash2,
  ShoppingBag,
} from "lucide-react";

import { getImageUrl } from "../services/api";

/* =========================================================
   TEXVERSE CART
   ---------------------------------------------------------
   34 LANGUAGE SUPPORT
   RTL SAFE
   ---------------------------------------------------------
   IMPORTANT:
   Structural layout always stays LTR.
   Only text direction changes.
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
  if (
    typeof document ===
    "undefined"
  ) {
    return "en";
  }

  const lang = String(
    document.documentElement.lang ||
      "en"
  )
    .toLowerCase()
    .split("-")[0];

  return LANGUAGES.includes(
    lang
  )
    ? lang
    : "en";
};

function useDocumentLanguage() {
  const [language, setLanguage] =
    useState(
      getCurrentLanguage
    );

  useEffect(() => {
    if (
      typeof document ===
      "undefined"
    ) {
      return undefined;
    }

    const root =
      document.documentElement;

    const update = () => {
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

    update();

    const observer =
      new MutationObserver(
        update
      );

    observer.observe(root, {
      attributes: true,
      attributeFilter: [
        "lang",
      ],
    });

    return () =>
      observer.disconnect();
  }, []);

  return language;
}

/* =========================================================
   TRANSLATIONS
========================================================= */

const UI = {
  sourcingCart: {
    en: "Sourcing cart",
    hi: "सोर्सिंग कार्ट",
    bn: "সোর্সিং কার্ট",
    te: "సోర్సింగ్ కార్ట్",
    mr: "सोर्सिंग कार्ट",
    ta: "சோர்சிங் கார்ட்",
    gu: "સોર્સિંગ કાર્ટ",
    kn: "ಸೋರ್ಸಿಂಗ್ ಕಾರ್ಟ್",
    ml: "സോഴ്‌സിംഗ് കാർട്ട്",
    pa: "ਸੋਰਸਿੰਗ ਕਾਰਟ",
    ur: "سورسنگ کارٹ",
    or: "ସୋର୍ସିଂ କାର୍ଟ",
    as: "সোর্সিং কাৰ্ট",
    ne: "सोर्सिङ कार्ट",
    sa: "स्रोत-पेटिका",
    kok: "सोर्सिंग कार्ट",
    mai: "सोर्सिंग कार्ट",
    ks: "سورسنگ کارٹ",
    sd: "سورسنگ ڪارٽ",
    doi: "सोर्सिंग कार्ट",
    mni: "ꯁꯣꯔꯁꯤꯡ ꯀꯥꯔꯠ",
    brx: "सौर्सिङ कार्ट",
    sat: "ᱥᱚᱨᱥᱤᱝ ᱠᱟᱨᱴ",
    es: "Carrito de abastecimiento",
    fr: "Panier d'approvisionnement",
    de: "Beschaffungswagen",
    ar: "سلة التوريد",
    zh: "采购购物车",
    ja: "調達カート",
    ko: "소싱 카트",
    pt: "Carrinho de sourcing",
    it: "Carrello di approvvigionamento",
    ru: "Корзина закупок",
    tr: "Tedarik Sepeti",
  },

  review: {
    en: "Review your fabrics",
    hi: "अपने फैब्रिक की समीक्षा करें",
    bn: "আপনার কাপড় পর্যালোচনা করুন",
    te: "మీ ఫ్యాబ్రిక్‌లను పరిశీలించండి",
    mr: "तुमच्या फॅब्रिकची पाहणी करा",
    ta: "உங்கள் துணிகளை மதிப்பாய்வு செய்யவும்",
    gu: "તમારા ફેબ્રિકની સમીક્ષા કરો",
    kn: "ನಿಮ್ಮ ಫ್ಯಾಬ್ರಿಕ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    ml: "നിങ്ങളുടെ തുണിത്തരങ്ങൾ പരിശോധിക്കുക",
    pa: "ਆਪਣੇ ਫੈਬਰਿਕ ਦੀ ਸਮੀਖਿਆ ਕਰੋ",
    ur: "اپنے فیبرکس کا جائزہ لیں",
    or: "ଆପଣଙ୍କ ଫ୍ୟାବ୍ରିକ୍ ସମୀକ୍ଷା କରନ୍ତୁ",
    as: "আপোনাৰ ফেব্ৰিকসমূহ পৰ্যালোচনা কৰক",
    ne: "तपाईंका फेब्रिकहरू समीक्षा गर्नुहोस्",
    sa: "स्ववस्त्राणां समीक्षां कुर्वन्तु",
    kok: "आपल्या फॅब्रिकाचो आढावो घेवचो",
    mai: "अपन फैब्रिकक समीक्षा करू",
    ks: "پنٛنٕن فیبرکس ہٕ جائزٕ لیو",
    sd: "پنهنجي فيبرڪس جو جائزو وٺو",
    doi: "अपने फैब्रिक दी समीक्षा करो",
    mni: "ꯅꯈꯣꯏꯒꯤ ꯐꯦꯕ꯭ꯔꯤꯛ ꯌꯦꯡꯉꯨ",
    brx: "नोंनि फैब्रिकखौ नायगिर",
    sat: "ᱟᱢ ᱯᱷᱟᱵᱽᱨᱤᱠ ᱵᱤᱵᱨᱚᱱ ᱧᱮᱞ",
    es: "Revisa tus tejidos",
    fr: "Vérifiez vos tissus",
    de: "Prüfen Sie Ihre Stoffe",
    ar: "راجع أقمشتك",
    zh: "查看您的面料",
    ja: "生地を確認",
    ko: "원단 검토",
    pt: "Revise seus tecidos",
    it: "Rivedi i tuoi tessuti",
    ru: "Проверьте выбранные ткани",
    tr: "Kumaşlarınızı İnceleyin",
  },

  product: {
    en: "product",
    hi: "प्रोडक्ट",
    bn: "পণ্য",
    te: "ఉత్పత్తి",
    mr: "उत्पादन",
    ta: "தயாரிப்பு",
    gu: "પ્રોડક્ટ",
    kn: "ಉತ್ಪನ್ನ",
    ml: "ഉൽപ്പന്നം",
    pa: "ਉਤਪਾਦ",
    ur: "پروڈکٹ",
    or: "ପ୍ରୋଡକ୍ଟ",
    as: "প্ৰডাক্ট",
    ne: "उत्पादन",
    sa: "उत्पादः",
    kok: "उत्पादन",
    mai: "प्रोडक्ट",
    ks: "پروڈکٹ",
    sd: "پراڊڪٽ",
    doi: "प्रोडक्ट",
    mni: "ꯄ꯭ꯔꯣꯗꯛꯇ",
    brx: "प्रोडक्ट",
    sat: "ᱯᱨᱚᱰᱟᱠᱴ",
    es: "producto",
    fr: "produit",
    de: "Produkt",
    ar: "منتج",
    zh: "产品",
    ja: "製品",
    ko: "제품",
    pt: "produto",
    it: "prodotto",
    ru: "товар",
    tr: "ürün",
  },

  products: {
    en: "products",
    hi: "प्रोडक्ट",
    bn: "পণ্য",
    te: "ఉత్పత్తులు",
    mr: "उत्पादने",
    ta: "தயாரிப்புகள்",
    gu: "પ્રોડક્ટ્સ",
    kn: "ಉತ್ಪನ್ನಗಳು",
    ml: "ഉൽപ്പന്നങ്ങൾ",
    pa: "ਉਤਪਾਦ",
    ur: "پروڈکٹس",
    or: "ପ୍ରୋଡକ୍ଟଗୁଡିକ",
    as: "প্ৰডাক্টসমূহ",
    ne: "उत्पादनहरू",
    sa: "उत्पादाः",
    kok: "उत्पादनां",
    mai: "प्रोडक्ट",
    ks: "پروڈکٹس",
    sd: "پراڊڪٽس",
    doi: "प्रोडक्ट",
    mni: "ꯄ꯭ꯔꯣꯗꯛꯇꯁ",
    brx: "प्रोडक्टफोर",
    sat: "ᱯᱨᱚᱰᱟᱠᱴ ᱠᱚ",
    es: "productos",
    fr: "produits",
    de: "Produkte",
    ar: "منتجات",
    zh: "产品",
    ja: "製品",
    ko: "제품",
    pt: "produtos",
    it: "prodotti",
    ru: "товаров",
    tr: "ürün",
  },

  emptyTitle: {
    en: "Your sourcing cart is empty",
    hi: "आपकी सोर्सिंग कार्ट खाली है",
    bn: "আপনার সোর্সিং কার্ট খালি",
    te: "మీ సోర్సింగ్ కార్ట్ ఖాళీగా ఉంది",
    mr: "तुमची सोर्सिंग कार्ट रिकामी आहे",
    ta: "உங்கள் சோர்சிங் கார்ட் காலியாக உள்ளது",
    gu: "તમારી સોર્સિંગ કાર્ટ ખાલી છે",
    kn: "ನಿಮ್ಮ ಸೋರ್ಸಿಂಗ್ ಕಾರ್ಟ್ ಖಾಲಿಯಾಗಿದೆ",
    ml: "നിങ്ങളുടെ സോഴ്‌സിംഗ് കാർട്ട് ശൂന്യമാണ്",
    pa: "ਤੁਹਾਡੀ ਸੋਰਸਿੰਗ ਕਾਰਟ ਖਾਲੀ ਹੈ",
    ur: "آپ کی سورسنگ کارٹ خالی ہے",
    or: "ଆପଣଙ୍କ ସୋର୍ସିଂ କାର୍ଟ ଖାଲି ଅଛି",
    as: "আপোনাৰ সোর্সিং কাৰ্ট খালী",
    ne: "तपाईंको सोर्सिङ कार्ट खाली छ",
    sa: "भवतः स्रोत-पेटिका रिक्ता अस्ति",
    kok: "तुमचें सोर्सिंग कार्ट रितें आसा",
    mai: "अहाँक सोर्सिंग कार्ट खाली अछि",
    ks: "تُہۍ سورسنگ کارٹ خٲلی چھِ",
    sd: "توهان جي سورسنگ ڪارٽ خالي آهي",
    doi: "तुआं दी सोर्सिंग कार्ट खाल्ली ऐ",
    mni: "ꯅꯈꯣꯏꯒꯤ ꯁꯣꯔꯁꯤꯡ ꯀꯥꯔꯠ ꯂꯥꯏꯕꯥ",
    brx: "नोंनि सोर्सिङ कार्ट खालि",
    sat: "ᱟᱢᱟᱜ ᱥᱚᱨᱥᱤᱝ ᱠᱟᱨᱴ ᱠᱷᱟᱞᱤ",
    es: "Tu carrito de abastecimiento está vacío",
    fr: "Votre panier d'approvisionnement est vide",
    de: "Ihr Beschaffungswagen ist leer",
    ar: "سلة التوريد فارغة",
    zh: "您的采购购物车为空",
    ja: "調達カートは空です",
    ko: "소싱 카트가 비어 있습니다",
    pt: "Seu carrinho de sourcing está vazio",
    it: "Il carrello di approvvigionamento è vuoto",
    ru: "Корзина закупок пуста",
    tr: "Tedarik sepetiniz boş",
  },

  emptyDescription: {
    en: "Explore categories and add fabrics you want to source.",
    hi: "कैटेगरी देखें और उन फैब्रिक को कार्ट में जोड़ें जिन्हें आप सोर्स करना चाहते हैं।",
    bn: "ক্যাটেগরি দেখুন এবং যেসব কাপড় সোর্স করতে চান সেগুলো যোগ করুন।",
    te: "కేటగిరీలను చూడండి మరియు మీరు సోర్స్ చేయాలనుకునే ఫ్యాబ్రిక్‌లను జోడించండి.",
    mr: "कॅटेगरीज पहा आणि तुम्हाला सोर्स करायचे फॅब्रिक जोडा.",
    ta: "வகைகளைப் பார்த்து, நீங்கள் பெற விரும்பும் துணிகளைச் சேர்க்கவும்.",
    gu: "કેટેગરી જુઓ અને જે ફેબ્રિક સોર્સ કરવું હોય તે ઉમેરો.",
    kn: "ವರ್ಗಗಳನ್ನು ನೋಡಿ ಮತ್ತು ನೀವು ಸೋರ್ಸ್ ಮಾಡಲು ಬಯಸುವ ಫ್ಯಾಬ್ರಿಕ್‌ಗಳನ್ನು ಸೇರಿಸಿ.",
    ml: "വിഭാഗങ്ങൾ പരിശോധിച്ച് സോഴ്‌സ് ചെയ്യേണ്ട തുണിത്തരങ്ങൾ ചേർക്കുക.",
    pa: "ਸ਼੍ਰੇਣੀਆਂ ਵੇਖੋ ਅਤੇ ਜਿਹੜੇ ਫੈਬਰਿਕ ਸੋਰਸ ਕਰਨੇ ਹਨ ਉਹ ਸ਼ਾਮਲ ਕਰੋ।",
    ur: "کیٹیگریز دیکھیں اور وہ فیبرکس شامل کریں جنہیں آپ سورس کرنا چاہتے ہیں۔",
    or: "ବର୍ଗଗୁଡିକ ଦେଖନ୍ତୁ ଏବଂ ଯେଉଁ ଫ୍ୟାବ୍ରିକ୍ ସୋର୍ସ କରିବାକୁ ଚାହୁଁଛନ୍ତି ସେଗୁଡିକ ଯୋଡନ୍ତୁ।",
    as: "শ্ৰেণীসমূহ চাওক আৰু আপুনি সোর্স কৰিব বিচৰা ফেব্ৰিক যোগ কৰক।",
    ne: "श्रेणीहरू हेर्नुहोस् र तपाईंले सोर्स गर्न चाहनुभएको फेब्रिक थप्नुहोस्।",
    sa: "वर्गान् निरीक्ष्य स्रोतव्यानि वस्त्राणि योजयन्तु।",
    kok: "वर्ग पळयात आनी तुमका सोर्स करपाचे फॅब्रिक घालात.",
    mai: "श्रेणी देखू आ जे फैब्रिक सोर्स करबाक अछि से जोड़ू।",
    ks: "زمرٕ دِیٖکھِو تہ یِم فیبرک سورس کرٕنۍ چھِ تِم شٲمل کٔرِو۔",
    sd: "زمرا ڏسو ۽ جيڪي فيبرڪس توهان سورس ڪرڻ چاهيو ٿا اهي شامل ڪريو.",
    doi: "श्रेणियां दिक्खो ते जेडे फैब्रिक सोर्स करने न ते जोड़ा।",
    mni: "ꯈꯟꯅ ꯎꯁꯤꯕꯤꯌꯨ ꯑꯃꯁꯨꯡ ꯅꯈꯣꯏꯅ ꯁꯣꯔꯁ ꯇꯧꯅꯕ ꯐꯦꯕ꯭ꯔꯤꯛ ꯍꯥꯞꯄꯤꯌꯨꯕ",
    brx: "सोरेखो नाय आरो जाय फैब्रिक सौर्स खालामनो गोनां थानायखौ हो।",
    sat: "ᱵᱚᱨᱜᱚ ᱧᱮᱞ ᱟᱨ ᱡᱟᱦᱟᱱ ᱯᱷᱟᱵᱽᱨᱤᱠ ᱥᱚᱨᱥ ᱠᱚᱨᱚᱜ ᱢᱮ ᱥᱮᱞᱮᱠᱴ ᱢᱮ",
    es: "Explora las categorías y añade los tejidos que quieras abastecer.",
    fr: "Explorez les catégories et ajoutez les tissus que vous souhaitez approvisionner.",
    de: "Entdecken Sie Kategorien und fügen Sie Stoffe hinzu, die Sie beschaffen möchten.",
    ar: "استكشف الفئات وأضف الأقمشة التي تريد توريدها.",
    zh: "浏览分类并添加您希望采购的面料。",
    ja: "カテゴリーから仕入れたい生地を追加してください。",
    ko: "카테고리를 탐색하고 소싱할 원단을 추가하세요.",
    pt: "Explore as categorias e adicione os tecidos que deseja adquirir.",
    it: "Esplora le categorie e aggiungi i tessuti che vuoi approvvigionare.",
    ru: "Изучите категории и добавьте ткани, которые хотите закупить.",
    tr: "Kategorileri keşfedin ve tedarik etmek istediğiniz kumaşları ekleyin.",
  },

  exploreMarketplace: {
    en: "Explore Marketplace",
    hi: "मार्केटप्लेस देखें",
    bn: "মার্কেটপ্লেস দেখুন",
    te: "మార్కెట్‌ప్లేస్ చూడండి",
    mr: "मार्केटप्लेस पहा",
    ta: "சந்தையைப் பார்வையிடவும்",
    gu: "માર્કેટપ્લેસ જુઓ",
    kn: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ನೋಡಿ",
    ml: "മാർക്കറ്റ്പ്ലേസ് കാണുക",
    pa: "ਮਾਰਕੀਟਪਲੇਸ ਵੇਖੋ",
    ur: "مارکیٹ پلیس دیکھیں",
    or: "ମାର୍କେଟପ୍ଲେସ୍ ଦେଖନ୍ତୁ",
    as: "মাৰ্কেটপ্লেচ চাওক",
    ne: "मार्केटप्लेस हेर्नुहोस्",
    sa: "विपणिस्थलं पश्यतु",
    kok: "मार्केटप्लेस पळयात",
    mai: "मार्केटप्लेस देखू",
    ks: "مارکیٹ پلیس دِیٖکھو",
    sd: "مارڪيٽ پلیس ڏسو",
    doi: "मार्केटप्लेस दिक्खो",
    mni: "ꯃꯥꯔꯀꯦꯠꯄ꯭ꯂꯦꯁ ꯎꯁꯤꯕꯤꯌꯨ",
    brx: "मार्केटप्लेस नाय",
    sat: "ᱢᱟᱨᱠᱮᱴᱯᱞᱮᱥ ᱧᱮᱞ",
    es: "Explorar Marketplace",
    fr: "Explorer le Marketplace",
    de: "Marktplatz erkunden",
    ar: "استكشف السوق",
    zh: "探索市场",
    ja: "マーケットプレイスを見る",
    ko: "마켓플레이스 탐색",
    pt: "Explorar Marketplace",
    it: "Esplora Marketplace",
    ru: "Перейти на маркетплейс",
    tr: "Pazaryerini Keşfet",
  },

  subtotal: {
    en: "Subtotal",
    hi: "सबटोटल",
    bn: "সাবটোটাল",
    te: "ఉపమొత్తం",
    mr: "उपएकूण",
    ta: "கூட்டுத்தொகை",
    gu: "ઉપકુલ",
    kn: "ಉಪಮೊತ್ತ",
    ml: "ഉപമൊത്തം",
    pa: "ਉਪ-ਕੁੱਲ",
    ur: "ذیلی کل",
    or: "ଉପମୋଟ",
    as: "উপমুঠ",
    ne: "उपकुल",
    sa: "उपयोगः",
    kok: "उपजोड",
    mai: "उपयोग",
    ks: "ذیلی کُل",
    sd: "ذيلي ڪل",
    doi: "उपकुल",
    mni: "ꯁ꯭ꯕꯇꯣꯇꯜ",
    brx: "उपकुल",
    sat: "ᱩᱯᱚᱢᱚᱴ",
    es: "Subtotal",
    fr: "Sous-total",
    de: "Zwischensumme",
    ar: "المجموع الفرعي",
    zh: "小计",
    ja: "小計",
    ko: "소계",
    pt: "Subtotal",
    it: "Subtotale",
    ru: "Промежуточный итог",
    tr: "Ara Toplam",
  },

  productsLabel: {
    en: "Products",
    hi: "प्रोडक्ट",
    bn: "পণ্য",
    te: "ఉత్పత్తులు",
    mr: "उत्पादने",
    ta: "தயாரிப்புகள்",
    gu: "પ્રોડક્ટ્સ",
    kn: "ಉತ್ಪನ್ನಗಳು",
    ml: "ഉൽപ്പന്നങ്ങൾ",
    pa: "ਉਤਪਾਦ",
    ur: "پروڈکٹس",
    or: "ପ୍ରୋଡକ୍ଟଗୁଡିକ",
    as: "প্ৰডাক্টসমূহ",
    ne: "उत्पादनहरू",
    sa: "उत्पादाः",
    kok: "उत्पादनां",
    mai: "प्रोडक्ट",
    ks: "پروڈکٹس",
    sd: "پراڊڪٽس",
    doi: "प्रोडक्ट",
    mni: "ꯄ꯭ꯔꯣꯗꯛꯇꯁ",
    brx: "प्रोडक्टफोर",
    sat: "ᱯᱨᱚᱰᱟᱠᱴ ᱠᱚ",
    es: "Productos",
    fr: "Produits",
    de: "Produkte",
    ar: "المنتجات",
    zh: "产品",
    ja: "商品",
    ko: "제품",
    pt: "Produtos",
    it: "Prodotti",
    ru: "Товары",
    tr: "Ürünler",
  },

  shipping: {
    en: "Shipping",
    hi: "शिपिंग",
    bn: "শিপিং",
    te: "షిప్పింగ్",
    mr: "शिपिंग",
    ta: "ஷிப்பிங்",
    gu: "શિપિંગ",
    kn: "ಶಿಪ್ಪಿಂಗ್",
    ml: "ഷിപ്പിംഗ്",
    pa: "ਸ਼ਿਪਿੰਗ",
    ur: "شپنگ",
    or: "ଶିପିଂ",
    as: "শ্বিপিং",
    ne: "शिपिङ",
    sa: "प्रेषणम्",
    kok: "शिपिंग",
    mai: "शिपिंग",
    ks: "شپنگ",
    sd: "شپنگ",
    doi: "शिपिंग",
    mni: "ꯁꯤꯄꯤꯡ",
    brx: "शिपिङ",
    sat: "ᱥᱤᱯᱤᱝ",
    es: "Envío",
    fr: "Livraison",
    de: "Versand",
    ar: "الشحن",
    zh: "运输",
    ja: "配送",
    ko: "배송",
    pt: "Envio",
    it: "Spedizione",
    ru: "Доставка",
    tr: "Kargo",
  },

  calculatedLater: {
    en: "Calculated later",
    hi: "बाद में गणना होगी",
    bn: "পরে গণনা করা হবে",
    te: "తర్వాత లెక్కించబడుతుంది",
    mr: "नंतर गणना केली जाईल",
    ta: "பின்னர் கணக்கிடப்படும்",
    gu: "પછી ગણતરી થશે",
    kn: "ನಂತರ ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತದೆ",
    ml: "പിന്നീട് കണക്കാക്കും",
    pa: "ਬਾਅਦ ਵਿੱਚ ਗਿਣਿਆ ਜਾਵੇਗਾ",
    ur: "بعد میں حساب کیا جائے گا",
    or: "ପରେ ଗଣନା କରାଯିବ",
    as: "পিছত গণনা কৰা হ'ব",
    ne: "पछि गणना गरिनेछ",
    sa: "अनन्तरं गणना भविष्यति",
    kok: "उपरांत गणना जातली",
    mai: "बाद मे गणना होयत",
    ks: "پتہٕ حِساب گژھِ",
    sd: "بعد ۾ حساب ڪيو ويندو",
    doi: "बाद च गणना होग",
    mni: "ꯑꯃꯨꯛ ꯃꯇꯝꯗ ꯁꯤꯡꯁꯤꯅ",
    brx: "उनाव हिसाब जाबाय",
    sat: "ᱛᱟᱭᱚᱢ ᱦᱤᱥᱟᱵ ᱦᱚᱪᱚᱜ ᱟ",
    es: "Se calculará después",
    fr: "Calculé ultérieurement",
    de: "Wird später berechnet",
    ar: "سيتم حسابها لاحقًا",
    zh: "稍后计算",
    ja: "後で計算",
    ko: "나중에 계산됩니다",
    pt: "Calculado posteriormente",
    it: "Calcolato in seguito",
    ru: "Будет рассчитана позже",
    tr: "Daha sonra hesaplanır",
  },

  estimatedTotal: {
    en: "Estimated total",
    hi: "अनुमानित कुल",
    bn: "আনুমানিক মোট",
    te: "అంచనా మొత్తం",
    mr: "अंदाजे एकूण",
    ta: "மதிப்பிடப்பட்ட மொத்தம்",
    gu: "અંદાજિત કુલ",
    kn: "ಅಂದಾಜು ಒಟ್ಟು",
    ml: "അനുമാനിച്ച മൊത്തം",
    pa: "ਅੰਦਾਜ਼ਿਤ ਕੁੱਲ",
    ur: "تخمینی کل",
    or: "ଆନୁମାନିକ ମୋଟ",
    as: "আনুমানিক মুঠ",
    ne: "अनुमानित कुल",
    sa: "अनुमितसमग्रः",
    kok: "अंदाजी एकूण",
    mai: "अनुमानित कुल",
    ks: "تخمینی کُل",
    sd: "تخميني ڪل",
    doi: "अनुमानित कुल",
    mni: "ꯑꯅꯨꯃꯥꯅ ꯃꯇꯨꯡ",
    brx: "अनुमानित कुल",
    sat: "ᱟᱹᱱᱩᱢᱟᱱ ᱢᱚᱴ",
    es: "Total estimado",
    fr: "Total estimé",
    de: "Geschätzte Gesamtsumme",
    ar: "الإجمالي التقديري",
    zh: "预计总计",
    ja: "見積合計",
    ko: "예상 총액",
    pt: "Total estimado",
    it: "Totale stimato",
    ru: "Ориентировочная сумма",
    tr: "Tahmini Toplam",
  },

  orderSummary: {
    en: "Order summary",
    hi: "ऑर्डर सारांश",
    bn: "অর্ডার সারাংশ",
    te: "ఆర్డర్ సారాంశం",
    mr: "ऑर्डर सारांश",
    ta: "ஆர்டர் சுருக்கம்",
    gu: "ઓર્ડર સારાંશ",
    kn: "ಆರ್ಡರ್ ಸಾರಾಂಶ",
    ml: "ഓർഡർ സംഗ്രഹം",
    pa: "ਆਰਡਰ ਸੰਖੇਪ",
    ur: "آرڈر کا خلاصہ",
    or: "ଅର୍ଡର ସାରାଂଶ",
    as: "অৰ্ডাৰৰ সাৰাংশ",
    ne: "अर्डर सारांश",
    sa: "आदेशसारांशः",
    kok: "ऑर्डर सारांश",
    mai: "ऑर्डर सारांश",
    ks: "آرڈر خلاصٕ",
    sd: "آرڊر جو خلاصو",
    doi: "आर्डर सार",
    mni: "ꯑꯣꯔꯗꯔ ꯁꯥꯔꯥꯡꯁ",
    brx: "अर्डार सार",
    sat: "ᱚᱨᱰᱟᱨ ᱥᱟᱨᱟᱝᱥ",
    es: "Resumen del pedido",
    fr: "Récapitulatif de la commande",
    de: "Bestellübersicht",
    ar: "ملخص الطلب",
    zh: "订单摘要",
    ja: "注文概要",
    ko: "주문 요약",
    pt: "Resumo do pedido",
    it: "Riepilogo ordine",
    ru: "Сводка заказа",
    tr: "Sipariş Özeti",
  },

  checkout: {
    en: "Continue to Checkout",
    hi: "चेकआउट पर जाएँ",
    bn: "চেকআউটে যান",
    te: "చెక్‌అవుట్‌కు కొనసాగండి",
    mr: "चेकआउटकडे पुढे जा",
    ta: "செக்அவுட்டுக்குத் தொடரவும்",
    gu: "ચેકઆઉટ પર આગળ વધો",
    kn: "ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ",
    ml: "ചെക്ക്ഔട്ടിലേക്ക് തുടരുക",
    pa: "ਚੈਕਆਉਟ ਵੱਲ ਜਾਓ",
    ur: "چیک آؤٹ پر جائیں",
    or: "ଚେକଆଉଟକୁ ଯାଆନ୍ତୁ",
    as: "চেকআউটলৈ আগবাঢ়ক",
    ne: "चेकआउटमा जारी राख्नुहोस्",
    sa: "क्रयसमापनं प्रति गच्छतु",
    kok: "चेकआउट कडेन वचात",
    mai: "चेकआउट दिस जाउ",
    ks: "چیک آؤٹ طرف گژھو",
    sd: "چيڪ آئوٽ ڏانهن وڃو",
    doi: "चेकआउट च जाओ",
    mni: "ꯆꯦꯛꯑꯥꯎꯠꯇꯥ ꯆꯠꯂꯨ",
    brx: "चेकआउट आव जाथोन",
    sat: "ᱪᱮᱠᱚᱣᱴ ᱨᱮ ᱥᱮᱛᱮᱨ",
    es: "Continuar al checkout",
    fr: "Continuer vers le paiement",
    de: "Zum Checkout",
    ar: "المتابعة إلى الدفع",
    zh: "继续结算",
    ja: "チェックアウトへ進む",
    ko: "결제로 계속",
    pt: "Continuar para o checkout",
    it: "Continua al checkout",
    ru: "Перейти к оформлению",
    tr: "Ödemeye Devam Et",
  },

  continueSourcing: {
    en: "Continue sourcing",
    hi: "सोर्सिंग जारी रखें",
    bn: "সোর্সিং চালিয়ে যান",
    te: "సోర్సింగ్ కొనసాగించండి",
    mr: "सोर्सिंग सुरू ठेवा",
    ta: "சோர்சிங்கைத் தொடரவும்",
    gu: "સોર્સિંગ ચાલુ રાખો",
    kn: "ಸೋರ್ಸಿಂಗ್ ಮುಂದುವರಿಸಿ",
    ml: "സോഴ്‌സിംഗ് തുടരുക",
    pa: "ਸੋਰਸਿੰਗ ਜਾਰੀ ਰੱਖੋ",
    ur: "سورسنگ جاری رکھیں",
    or: "ସୋର୍ସିଂ ଜାରି ରଖନ୍ତୁ",
    as: "সোর্সিং অব্যাহত ৰাখক",
    ne: "सोर्सिङ जारी राख्नुहोस्",
    sa: "स्रोतणं निरन्तरं कुर्वन्तु",
    kok: "सोर्सिंग सुरू दवरात",
    mai: "सोर्सिंग जारी राखू",
    ks: "سورسنگ جاری رٔکھِو",
    sd: "سورسنگ جاري رکو",
    doi: "सोर्सिंग जारी रक्खो",
    mni: "ꯁꯣꯔꯁꯤꯡ ꯆꯠꯊꯕ",
    brx: "सौर्सिङखौ जारी राख",
    sat: "ᱥᱚᱨᱥᱤᱝ ᱮᱢᱫᱟᱜ",
    es: "Seguir abasteciendo",
    fr: "Continuer l'approvisionnement",
    de: "Beschaffung fortsetzen",
    ar: "متابعة التوريد",
    zh: "继续采购",
    ja: "調達を続ける",
    ko: "소싱 계속하기",
    pt: "Continuar sourcing",
    it: "Continua approvvigionamento",
    ru: "Продолжить закупки",
    tr: "Tedarike Devam Et",
  },

  validation: {
    en: "Supplier verification and stock/MOQ validation will be rechecked by the backend before an order is accepted.",
    hi: "ऑर्डर स्वीकार होने से पहले बैकएंड सप्लायर सत्यापन और स्टॉक/MOQ की फिर से जाँच करेगा।",
    bn: "অর্ডার গ্রহণের আগে ব্যাকএন্ড সরবরাহকারী যাচাই এবং স্টক/MOQ পুনরায় পরীক্ষা করবে।",
    te: "ఆర్డర్ ఆమోదించే ముందు బ్యాకెండ్ సరఫరాదారు ధృవీకరణ మరియు స్టాక్/MOQ ను మళ్లీ తనిఖీ చేస్తుంది.",
    mr: "ऑर्डर स्वीकारण्यापूर्वी बॅकएंड सप्लायर पडताळणी आणि स्टॉक/MOQ पुन्हा तपासेल.",
    ta: "ஆர்டர் ஏற்கப்படுவதற்கு முன் பின்புற அமைப்பு சப்ளையர் சரிபார்ப்பு மற்றும் ஸ்டாக்/MOQ ஆகியவற்றை மீண்டும் சரிபார்க்கும்.",
    gu: "ઓર્ડર સ્વીકારવામાં આવે તે પહેલાં બેકએન્ડ સપ્લાયર ચકાસણી અને સ્ટોક/MOQ ફરી તપાસશે.",
    kn: "ಆರ್ಡರ್ ಸ್ವೀಕರಿಸುವ ಮೊದಲು ಬ್ಯಾಕೆಂಡ್ ಪೂರೈಕೆದಾರ ಪರಿಶೀಲನೆ ಮತ್ತು ಸ್ಟಾಕ್/MOQ ಅನ್ನು ಮರುಪರಿಶೀಲಿಸುತ್ತದೆ.",
    ml: "ഓർഡർ സ്വീകരിക്കുന്നതിന് മുമ്പ് ബാക്കെൻഡ് വിതരണക്കാരന്റെ പരിശോധനയും സ്റ്റോക്ക്/MOQയും വീണ്ടും പരിശോധിക്കും.",
    pa: "ਆਰਡਰ ਸਵੀਕਾਰ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਬੈਕਐਂਡ ਸਪਲਾਇਰ ਤਸਦੀਕ ਅਤੇ ਸਟਾਕ/MOQ ਦੀ ਮੁੜ ਜਾਂਚ ਕਰੇਗਾ।",
    ur: "آرڈر قبول کرنے سے پہلے بیک اینڈ سپلائر کی تصدیق اور اسٹاک/MOQ کی دوبارہ جانچ کرے گا۔",
    or: "ଅର୍ଡର ଗ୍ରହଣ ପୂର୍ବରୁ ବ୍ୟାକଏଣ୍ଡ ସପ୍ଲାୟର୍ ଯାଞ୍ଚ ଏବଂ ଷ୍ଟକ୍/MOQ କୁ ପୁନଃ ଯାଞ୍ଚ କରିବ।",
    as: "অৰ্ডাৰ গ্ৰহণ কৰাৰ আগতে বেকএণ্ডে যোগানকাৰী যাচাই আৰু ষ্টক/MOQ পুনৰ পৰীক্ষা কৰিব।",
    ne: "अर्डर स्वीकार गर्नु अघि ब्याकएन्डले आपूर्तिकर्ता प्रमाणीकरण र स्टक/MOQ पुनः जाँच गर्नेछ।",
    sa: "आदेशस्य स्वीकृतेः पूर्वं पृष्ठतन्त्रं आपूर्तिकर्तृसत्यापनं तथा सञ्चय/MOQ पुनः परीक्षिष्यते।",
    kok: "ऑर्डर मान्य जावच्या आदी बॅकएंड सप्लायर पडताळणी आनी स्टॉक/MOQ परत तपासतलो.",
    mai: "ऑर्डर स्वीकार होय सँ पहिने बैकएंड सप्लायर सत्यापन आ स्टॉक/MOQ फेर जाँच करत।",
    ks: "آرڈر قبول کرنہٕ پٮ۪ٹھ بیک اینڈ سپلائر تصدیق تہ سٹاک/MOQ دوبارہ جانچ کٔرِ۔",
    sd: "آرڊر قبول ٿيڻ کان اڳ بيڪ اينڊ سپلائر جي تصديق ۽ اسٽاڪ/MOQ ٻيهر جانچيندو.",
    doi: "आर्डर मंजूर करने थमां पैह्लें बैकएंड सप्लायर तसदीक ते स्टॉक/MOQ दोबारा जांचसी।",
    mni: "ꯑꯣꯔꯗꯔ ꯐꯪꯕꯗꯥ ꯃꯅꯨꯡꯗ ꯕꯦꯛꯑꯦꯟꯗ ꯁꯄꯂꯥꯏꯌꯔ ꯑꯃꯁꯨꯡ ꯁ꯭ꯇꯣꯛ/MOQ ꯑꯃꯨꯛ ꯌꯦꯡꯉꯤ꯫",
    brx: "अर्डार आदाय जाया सिगां ब्याकएन्ड नि सप्लायर थिकासनाय आरो स्टक/MOQ नाजाबाय।",
    sat: "ᱚᱨᱰᱟᱨ ᱟᱹᱞᱤ ᱟᱜ ᱢᱤᱫ ᱥᱟᱵ ᱵᱟᱠᱮᱱᱰ ᱥᱟᱯᱞᱟᱭᱟᱨ ᱯᱚᱨᱤᱠᱷᱟ ᱟᱨ ᱥᱴᱚᱠ/MOQ ᱨᱮ ᱫᱚᱦᱨᱟ ᱧᱮᱞ ᱦᱚᱪᱚᱜ ᱟ。",
    es: "El backend volverá a comprobar el proveedor y el stock/MOQ antes de aceptar el pedido.",
    fr: "Le backend revérifiera le fournisseur et le stock/MOQ avant d'accepter la commande.",
    de: "Das Backend prüft Lieferant und Bestand/MOQ erneut, bevor eine Bestellung angenommen wird.",
    ar: "سيعيد النظام التحقق من المورد والمخزون وMOQ قبل قبول الطلب.",
    zh: "订单接受前，后端将再次验证供应商以及库存/MOQ。",
    ja: "注文受付前にバックエンドでサプライヤーと在庫/MOQを再確認します。",
    ko: "주문이 승인되기 전에 백엔드에서 공급업체와 재고/MOQ를 다시 확인합니다.",
    pt: "O backend verificará novamente o fornecedor e o estoque/MOQ antes de aceitar o pedido.",
    it: "Il backend ricontrollerà fornitore e stock/MOQ prima di accettare l'ordine.",
    ru: "Перед принятием заказа backend повторно проверит поставщика и запас/MOQ.",
    tr: "Sipariş kabul edilmeden önce backend tedarikçiyi ve stok/MOQ'yu yeniden doğrular.",
  },

  moq: {
    en: "MOQ",
    hi: "MOQ",
    bn: "MOQ",
    te: "MOQ",
    mr: "MOQ",
    ta: "MOQ",
    gu: "MOQ",
    kn: "MOQ",
    ml: "MOQ",
    pa: "MOQ",
    ur: "MOQ",
    or: "MOQ",
    as: "MOQ",
    ne: "MOQ",
    sa: "MOQ",
    kok: "MOQ",
    mai: "MOQ",
    ks: "MOQ",
    sd: "MOQ",
    doi: "MOQ",
    mni: "MOQ",
    brx: "MOQ",
    sat: "MOQ",
    es: "MOQ",
    fr: "MOQ",
    de: "MOQ",
    ar: "MOQ",
    zh: "MOQ",
    ja: "MOQ",
    ko: "MOQ",
    pt: "MOQ",
    it: "MOQ",
    ru: "MOQ",
    tr: "MOQ",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const tr = (
  dictionary,
  language,
  fallback = ""
) =>
  dictionary?.[language] ||
  dictionary?.en ||
  fallback;

const resolveImage = (
  image
) => {
  if (!image) {
    return "";
  }

  const value =
    String(image).trim();

  if (!value) {
    return "";
  }

  if (
    value.startsWith(
      "http://"
    ) ||
    value.startsWith(
      "https://"
    ) ||
    value.startsWith(
      "data:"
    ) ||
    value.startsWith(
      "blob:"
    )
  ) {
    return value;
  }

  return getImageUrl(value);
};

const formatPrice = (
  price
) => {
  const value =
    Number(price);

  if (!Number.isFinite(value)) {
    return "0";
  }

  return value.toLocaleString(
    "en-IN"
  );
};

const getMoq = (
  value
) => {
  const match = String(
    value ?? ""
  )
    .replace(/,/g, "")
    .match(/\d+(?:\.\d+)?/);

  const number =
    match
      ? Number(match[0])
      : 1;

  if (
    !Number.isFinite(
      number
    ) ||
    number <= 0
  ) {
    return 1;
  }

  return Math.ceil(
    number
  );
};

const getStock = (
  value
) => {
  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    ) ||
    number < 0
  ) {
    return null;
  }

  return Math.floor(
    number
  );
};

const safeReadCart = () => {
  try {
    const raw =
      localStorage.getItem(
        "cart"
      );

    if (!raw) {
      return [];
    }

    const parsed =
      JSON.parse(raw);

    if (
      !Array.isArray(
        parsed
      )
    ) {
      return [];
    }

    return parsed.filter(
      (item) =>
        item &&
        item.id !==
          undefined &&
        item.id !== null
    );
  } catch {
    return [];
  }
};

/* =========================================================
   COMPONENT
========================================================= */

export default function Cart() {
  const language =
    useDocumentLanguage();

  const rtl =
    isRTL(language);

  const [
    cart,
    setCart,
  ] = useState(
    safeReadCart
  );

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

  /* =======================================================
     LISTEN FOR CART UPDATES
  ======================================================= */

  useEffect(() => {
    const handleCartUpdate =
      () => {
        setCart(
          safeReadCart()
        );
      };

    window.addEventListener(
      "cart-updated",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );
    };
  }, []);

  /* =======================================================
     PERSIST
  ======================================================= */

  const persist = (
    updated
  ) => {
    const safe =
      Array.isArray(updated)
        ? updated
        : [];

    setCart(safe);

    localStorage.setItem(
      "cart",
      JSON.stringify(safe)
    );

    window.dispatchEvent(
      new Event(
        "cart-updated"
      )
    );
  };

  /* =======================================================
     UPDATE QUANTITY
     MOQ + STOCK SAFE
  ======================================================= */

  const updateQty = (
    id,
    delta
  ) => {
    const updated =
      cart.map(
        (item) => {
          if (
            String(
              item.id
            ) !==
            String(id)
          ) {
            return item;
          }

          const moq =
            getMoq(
              item.moq
            );

          const stock =
            getStock(
              item.stock
            );

          const current =
            Number(
              item.quantity ||
                moq
            );

          let next =
            current + delta;

          next =
            Math.max(
              moq,
              next
            );

          if (
            stock !== null &&
            stock > 0
          ) {
            next =
              Math.min(
                stock,
                next
              );
          }

          return {
            ...item,
            quantity:
              next,
          };
        }
      );

    persist(
      updated
    );
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const removeItem = (
    id
  ) => {
    persist(
      cart.filter(
        (item) =>
          String(
            item.id
          ) !==
          String(id)
      )
    );
  };

  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal =
    useMemo(
      () =>
        cart.reduce(
          (
            sum,
            item
          ) => {
            const price =
              Number(
                item.price
              ) || 0;

            const quantity =
              Number(
                item.quantity
              ) || 0;

            return (
              sum +
              price *
                quantity
            );
          },
          0
        ),
      [cart]
    );

  const totalItems =
    useMemo(
      () =>
        cart.reduce(
          (
            count,
            item
          ) =>
            count +
            1,
          0
        ),
      [cart]
    );

  /* =======================================================
     EMPTY CART
======================================================= */

  if (!cart.length) {
    return (
      <main
        className="min-h-screen bg-slate-950 px-5 py-28 text-white md:px-6"
        style={
          structuralStyle
        }
      >
        <div
          className="mx-auto max-w-6xl"
          style={
            structuralStyle
          }
        >
          <div
            className="rounded-4xl border border-slate-800 bg-slate-900 p-12 text-center"
            style={textStyle}
          >
            <ShoppingBag
              className="mx-auto text-cyan-400"
              size={42}
            />

            <h1 className="mt-5 text-2xl font-black">
              {tr(
                UI.emptyTitle,
                language
              )}
            </h1>

            <p className="mt-2 text-slate-500">
              {tr(
                UI.emptyDescription,
                language
              )}
            </p>

            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 hover:bg-cyan-300"
              style={{
                direction:
                  "ltr",
              }}
            >
              <span
                style={
                  textStyle
                }
              >
                {tr(
                  UI.exploreMarketplace,
                  language
                )}
              </span>

              <ArrowRight
                size={17}
              />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     MAIN CART
======================================================= */

  return (
    <main
      className="min-h-screen bg-slate-950 px-5 py-28 text-white md:px-6"
      style={
        structuralStyle
      }
    >
      <div
        className="mx-auto max-w-6xl"
        style={
          structuralStyle
        }
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="mb-8 flex items-end justify-between gap-4"
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
              {tr(
                UI.sourcingCart,
                language
              )}
            </p>

            <h1 className="mt-2 text-4xl font-black md:text-5xl">
              {tr(
                UI.review,
                language
              )}
            </h1>
          </div>

          <span
            className="shrink-0 text-sm text-slate-500"
            style={
              textStyle
            }
          >
            {totalItems}{" "}
            {totalItems ===
            1
              ? tr(
                  UI.product,
                  language
                )
              : tr(
                  UI.products,
                  language
                )}
          </span>
        </div>

        {/* =================================================
            MAIN GRID
            CART LEFT
            SUMMARY RIGHT
        ================================================= */}

        <div
          className="grid gap-7 lg:grid-cols-[1fr_360px]"
          style={
            structuralStyle
          }
        >

          {/* =================================================
              CART ITEMS — LEFT
          ================================================= */}

          <div className="space-y-4">

            {cart.map(
              (item) => {
                const image =
                  resolveImage(
                    item.image
                  );

                const moq =
                  getMoq(
                    item.moq
                  );

                const stock =
                  getStock(
                    item.stock
                  );

                const qty =
                  Math.max(
                    moq,
                    Number(
                      item.quantity ||
                        moq
                    )
                  );

                const price =
                  Number(
                    item.price
                  ) || 0;

                const lineTotal =
                  price * qty;

                const canDecrease =
                  qty >
                  moq;

                const canIncrease =
                  stock ===
                  null ||
                  stock <=
                    0 ||
                  qty <
                    stock;

                return (
                  <div
                    key={
                      item.id
                    }
                    className="rounded-3xl border border-slate-800 bg-slate-900 p-5"
                    style={
                      structuralStyle
                    }
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">

                      {/* IMAGE */}

                      <div
                        className="shrink-0"
                        style={{
                          direction:
                            "ltr",
                        }}
                      >
                        {image ? (
                          <img
                            src={
                              image
                            }
                            alt={
                              item.name ||
                              "Product"
                            }
                            className="h-32 w-full rounded-2xl object-cover sm:w-32"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-slate-800 text-xs text-slate-500 sm:w-32">
                            No image
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}

                      <div
                        className="min-w-0 flex-1"
                        style={
                          textStyle
                        }
                      >

                        {/* TITLE ROW */}

                        <div
                          className="flex justify-between gap-4"
                          style={{
                            direction:
                              "ltr",
                          }}
                        >
                          <div
                            className="min-w-0"
                            style={
                              textStyle
                            }
                          >
                            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                              {item.subcategory ||
                                item.category ||
                                tr(
                                  UI.product,
                                  language
                                )}
                            </p>

                            <h2 className="mt-1 wrap-break-words text-xl font-black">
                              {item.name ||
                                tr(
                                  UI.product,
                                  language
                                )}
                            </h2>

                            {item.supplier && (
                              <p className="mt-1 wrap-break-words text-sm text-slate-500">
                                {item.supplier}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            aria-label="Remove product"
                            onClick={() =>
                              removeItem(
                                item.id
                              )
                            }
                            className="shrink-0 self-start text-slate-500 transition hover:text-red-400"
                          >
                            <Trash2
                              size={
                                18
                              }
                            />
                          </button>
                        </div>

                        {/* PRICE + QTY */}

                        <div
                          className="mt-5 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"
                          style={{
                            direction:
                              "ltr",
                          }}
                        >

                          {/* PRICE */}

                          <div
                            style={
                              textStyle
                            }
                          >
                            <p className="font-black">
                              ₹
                              {formatPrice(
                                price
                              )}{" "}
                              <span className="text-xs text-slate-500">
                                /
                                {item.unit ||
                                  "m"}
                              </span>
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {tr(
                                UI.moq,
                                language
                              )}:{" "}
                              {moq}{" "}
                              {item.unit ||
                                "meters"}
                            </p>
                          </div>

                          {/* QUANTITY */}

                          <div
                            className="flex items-center overflow-hidden rounded-xl border border-slate-700"
                            style={{
                              direction:
                                "ltr",
                            }}
                          >
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={
                                !canDecrease
                              }
                              onClick={() =>
                                updateQty(
                                  item.id,
                                  -1
                                )
                              }
                              className="p-2.5 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus
                                size={
                                  15
                                }
                              />
                            </button>

                            <span className="w-14 text-center font-bold">
                              {qty}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={
                                !canIncrease
                              }
                              onClick={() =>
                                updateQty(
                                  item.id,
                                  1
                                )
                              }
                              className="p-2.5 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus
                                size={
                                  15
                                }
                              />
                            </button>
                          </div>

                          {/* LINE TOTAL */}

                          <p
                            className="text-lg font-black"
                            style={
                              textStyle
                            }
                          >
                            ₹
                            {formatPrice(
                              lineTotal
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}

            {/* =================================================
                VALIDATION NOTICE
            ================================================= */}

            <div
              className="flex gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-4 text-sm text-slate-300"
              style={
                textStyle
              }
            >
              <ShieldCheck
                className="shrink-0 text-emerald-400"
                size={
                  18
                }
              />

              <span>
                {tr(
                  UI.validation,
                  language
                )}
              </span>
            </div>
          </div>

          {/* =================================================
              SUMMARY — RIGHT
          ================================================= */}

          <aside
            className="h-fit rounded-3xl border border-slate-800 bg-slate-900 p-6 lg:sticky lg:top-24"
            style={
              textStyle
            }
          >
            <h2 className="text-2xl font-black">
              {tr(
                UI.orderSummary,
                language
              )}
            </h2>

            <div className="mt-6 space-y-4">

              <div
                className="flex justify-between gap-4 text-slate-400"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <span
                  style={
                    textStyle
                  }
                >
                  {tr(
                    UI.productsLabel,
                    language
                  )}
                </span>

                <span>
                  {cart.length}
                </span>
              </div>

              <div
                className="flex justify-between gap-4 text-slate-400"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <span
                  style={
                    textStyle
                  }
                >
                  {tr(
                    UI.subtotal,
                    language
                  )}
                </span>

                <span>
                  ₹
                  {formatPrice(
                    subtotal
                  )}
                </span>
              </div>

              <div
                className="flex justify-between gap-4 text-slate-400"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <span
                  style={
                    textStyle
                  }
                >
                  {tr(
                    UI.shipping,
                    language
                  )}
                </span>

                <span
                  className="text-right"
                  style={
                    textStyle
                  }
                >
                  {tr(
                    UI.calculatedLater,
                    language
                  )}
                </span>
              </div>

              <hr className="border-slate-800" />

              <div
                className="flex justify-between gap-4 text-xl font-black"
                style={{
                  direction:
                    "ltr",
                }}
              >
                <span
                  style={
                    textStyle
                  }
                >
                  {tr(
                    UI.estimatedTotal,
                    language
                  )}
                </span>

                <span className="text-cyan-300">
                  ₹
                  {formatPrice(
                    subtotal
                  )}
                </span>
              </div>
            </div>

            {/* CHECKOUT */}

            <Link
              to="/checkout"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
              style={{
                direction:
                  "ltr",
              }}
            >
              <span
                style={
                  textStyle
                }
              >
                {tr(
                  UI.checkout,
                  language
                )}
              </span>

              <ArrowRight
                size={
                  18
                }
              />
            </Link>

            {/* CONTINUE SOURCING */}

            <Link
              to="/marketplace"
              className="mt-4 block text-center text-sm text-slate-500 transition hover:text-cyan-300"
              style={
                textStyle
              }
            >
              {tr(
                UI.continueSourcing,
                language
              )}
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
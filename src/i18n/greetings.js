const COUNTRY_INFO = {
  IN: {
    code: "IN",
    name: "India",
    style: "namaste",
    emoji: "🙏",
  },

  NP: {
    code: "NP",
    name: "Nepal",
    style: "namaste",
    emoji: "🙏",
  },

  CN: {
    code: "CN",
    name: "China",
    style: "wave",
    emoji: "👋",
  },

  JP: {
    code: "JP",
    name: "Japan",
    style: "bow",
    emoji: "🙇",
  },

  KR: {
    code: "KR",
    name: "South Korea",
    style: "bow",
    emoji: "🙇",
  },

  BD: {
    code: "BD",
    name: "Bangladesh",
    style: "wave",
    emoji: "👋",
  },

  LK: {
    code: "LK",
    name: "Sri Lanka",
    style: "respect",
    emoji: "🙏",
  },

  BT: {
    code: "BT",
    name: "Bhutan",
    style: "respect",
    emoji: "🙏",
  },

  PK: {
    code: "PK",
    name: "Pakistan",
    style: "wave",
    emoji: "👋",
  },

  US: {
    code: "US",
    name: "United States",
    style: "wave",
    emoji: "👋",
  },

  CA: {
    code: "CA",
    name: "Canada",
    style: "wave",
    emoji: "👋",
  },

  GB: {
    code: "GB",
    name: "United Kingdom",
    style: "wave",
    emoji: "👋",
  },

  AU: {
    code: "AU",
    name: "Australia",
    style: "wave",
    emoji: "👋",
  },

  NZ: {
    code: "NZ",
    name: "New Zealand",
    style: "wave",
    emoji: "👋",
  },

  FR: {
    code: "FR",
    name: "France",
    style: "wave",
    emoji: "👋",
  },

  DE: {
    code: "DE",
    name: "Germany",
    style: "wave",
    emoji: "👋",
  },

  ES: {
    code: "ES",
    name: "Spain",
    style: "wave",
    emoji: "👋",
  },

  IT: {
    code: "IT",
    name: "Italy",
    style: "wave",
    emoji: "👋",
  },

  PT: {
    code: "PT",
    name: "Portugal",
    style: "wave",
    emoji: "👋",
  },

  RU: {
    code: "RU",
    name: "Russia",
    style: "wave",
    emoji: "👋",
  },

  TR: {
    code: "TR",
    name: "Turkey",
    style: "wave",
    emoji: "👋",
  },

  AE: {
    code: "AE",
    name: "United Arab Emirates",
    style: "wave",
    emoji: "👋",
  },

  SA: {
    code: "SA",
    name: "Saudi Arabia",
    style: "wave",
    emoji: "👋",
  },

  SG: {
    code: "SG",
    name: "Singapore",
    style: "wave",
    emoji: "👋",
  },

  MY: {
    code: "MY",
    name: "Malaysia",
    style: "wave",
    emoji: "👋",
  },

  ID: {
    code: "ID",
    name: "Indonesia",
    style: "wave",
    emoji: "👋",
  },

  TH: {
    code: "TH",
    name: "Thailand",
    style: "respect",
    emoji: "🙏",
  },
};

const TIME_RANGES = [
  {
    key: "morning",
    start: 5,
    end: 11,
  },
  {
    key: "afternoon",
    start: 12,
    end: 16,
  },
  {
    key: "evening",
    start: 17,
    end: 20,
  },
  {
    key: "night",
    start: 21,
    end: 23,
  },
  {
    key: "night",
    start: 0,
    end: 4,
  },
];

function getCurrentHour() {
  try {
    const formatter =
      new Intl.DateTimeFormat(
        undefined,
        {
          hour: "numeric",
          hour12: false,
        }
      );

    const parts =
      formatter.formatToParts(
        new Date()
      );

    const hourPart =
      parts.find(
        (part) =>
          part.type === "hour"
      );

    const hour = Number(
      hourPart?.value
    );

    return Number.isFinite(hour)
      ? hour
      : new Date().getHours();
  } catch {
    return new Date().getHours();
  }
}

export function getTimePeriod(
  hour = getCurrentHour()
) {
  const match =
    TIME_RANGES.find(
      (range) =>
        hour >= range.start &&
        hour <= range.end
    );

  return match?.key || "morning";
}

function getBrowserLocale() {
  try {
    return (
      navigator.language ||
      navigator.languages?.[0] ||
      ""
    );
  } catch {
    return "";
  }
}

function detectCountryFromTimezone(
  timezone
) {
  const timezoneMap = {
    "Asia/Kolkata": "IN",
    "Asia/Calcutta": "IN",

    "Asia/Kathmandu": "NP",

    "Asia/Shanghai": "CN",
    "Asia/Chongqing": "CN",
    "Asia/Harbin": "CN",
    "Asia/Urumqi": "CN",

    "Asia/Tokyo": "JP",

    "Asia/Seoul": "KR",

    "Asia/Dhaka": "BD",

    "Asia/Colombo": "LK",

    "Asia/Thimphu": "BT",

    "Asia/Karachi": "PK",

    "America/New_York": "US",
    "America/Chicago": "US",
    "America/Denver": "US",
    "America/Los_Angeles": "US",
    "America/Phoenix": "US",
    "Pacific/Honolulu": "US",
    "America/Anchorage": "US",

    "America/Toronto": "CA",
    "America/Vancouver": "CA",
    "America/Edmonton": "CA",
    "America/Winnipeg": "CA",
    "America/Halifax": "CA",
    "America/St_Johns": "CA",

    "Europe/London": "GB",

    "Australia/Sydney": "AU",
    "Australia/Melbourne": "AU",
    "Australia/Brisbane": "AU",
    "Australia/Perth": "AU",
    "Australia/Adelaide": "AU",

    "Pacific/Auckland": "NZ",

    "Europe/Paris": "FR",

    "Europe/Berlin": "DE",

    "Europe/Madrid": "ES",

    "Europe/Rome": "IT",

    "Europe/Lisbon": "PT",

    "Europe/Moscow": "RU",

    "Europe/Istanbul": "TR",

    "Asia/Dubai": "AE",

    "Asia/Riyadh": "SA",

    "Asia/Singapore": "SG",

    "Asia/Kuala_Lumpur": "MY",

    "Asia/Jakarta": "ID",

    "Asia/Bangkok": "TH",
  };

  return (
    timezoneMap[
      timezone
    ] || null
  );
}

function detectCountryFromLocale(
  locale
) {
  if (!locale) {
    return null;
  }

  const parts =
    locale.split("-");

  if (
    parts.length >= 2
  ) {
    const region =
      parts[1].toUpperCase();

    if (
      COUNTRY_INFO[region]
    ) {
      return region;
    }
  }

  const language =
    parts[0].toLowerCase();

  const languageMap = {
    hi: "IN",
    bn: "IN",
    te: "IN",
    mr: "IN",
    ta: "IN",
    gu: "IN",
    kn: "IN",
    ml: "IN",
    pa: "IN",
    ur: "IN",
    or: "IN",
    as: "IN",
    sa: "IN",
    ne: "NP",
    zh: "CN",
    ja: "JP",
    ko: "KR",
    fr: "FR",
    de: "DE",
    es: "ES",
    it: "IT",
    pt: "PT",
    ru: "RU",
    tr: "TR",
    ar: "SA",
  };

  return (
    languageMap[language] ||
    null
  );
}

export function detectCountry() {
  try {
    const timezone =
      Intl.DateTimeFormat().resolvedOptions()
        .timeZone;

    const timezoneCountry =
      detectCountryFromTimezone(
        timezone
      );

    if (timezoneCountry) {
      return timezoneCountry;
    }

    const locale =
      getBrowserLocale();

    const localeCountry =
      detectCountryFromLocale(
        locale
      );

    if (localeCountry) {
      return localeCountry;
    }
  } catch {
    // Fall through.
  }

  return null;
}

export function getCountryInfo(
  countryCode
) {
  return (
    COUNTRY_INFO[
      countryCode
    ] || {
      code: null,
      name: "International",
      style: "wave",
      emoji: "👋",
    }
  );
}

const GREETING_TEXT = {
  en: {
    morning: "Good Morning",
    afternoon: "Good Afternoon",
    evening: "Good Evening",
    night: "Good Night",

    hello: "Hello",
    hi: "Hi",

    welcome:
      "Welcome to TEXVERSE",

    welcomeBack:
      "Welcome back to TEXVERSE",

    goodbye:
      "Bye-bye, see you again",
  },

  hi: {
    morning: "शुभ प्रभात",
    afternoon: "शुभ अपराह्न",
    evening: "शुभ संध्या",
    night: "शुभ रात्रि",

    hello: "नमस्ते",
    hi: "नमस्ते",

    welcome:
      "TEXVERSE में आपका स्वागत है",

    welcomeBack:
      "TEXVERSE में आपका पुनः स्वागत है",

    goodbye:
      "फिर मिलेंगे",
  },

  bn: {
    morning: "সুপ্রভাত",
    afternoon: "শুভ অপরাহ্ণ",
    evening: "শুভ সন্ধ্যা",
    night: "শুভ রাত্রি",

    hello: "নমস্কার",
    hi: "হ্যালো",

    welcome:
      "TEXVERSE-এ স্বাগতম",

    welcomeBack:
      "TEXVERSE-এ আপনাকে আবার স্বাগতম",

    goodbye:
      "আবার দেখা হবে",
  },

  te: {
    morning: "శుభోదయం",
    afternoon: "శుభ మధ్యాహ్నం",
    evening: "శుభ సాయంత్రం",
    night: "శుభ రాత్రి",

    hello: "నమస్కారం",
    hi: "హలో",

    welcome:
      "TEXVERSE కి స్వాగతం",

    welcomeBack:
      "TEXVERSE కి తిరిగి స్వాగతం",

    goodbye:
      "మళ్లీ కలుద్దాం",
  },

  mr: {
    morning: "शुभ प्रभात",
    afternoon: "शुभ दुपार",
    evening: "शुभ संध्याकाळ",
    night: "शुभ रात्री",

    hello: "नमस्कार",
    hi: "हॅलो",

    welcome:
      "TEXVERSE मध्ये आपले स्वागत आहे",

    welcomeBack:
      "TEXVERSE मध्ये आपले पुन्हा स्वागत आहे",

    goodbye:
      "पुन्हा भेटूया",
  },

  ta: {
    morning: "காலை வணக்கம்",
    afternoon: "மதிய வணக்கம்",
    evening: "மாலை வணக்கம்",
    night: "இனிய இரவு",

    hello: "வணக்கம்",
    hi: "ஹலோ",

    welcome:
      "TEXVERSE-க்கு வரவேற்கிறோம்",

    welcomeBack:
      "TEXVERSE-க்கு மீண்டும் வரவேற்கிறோம்",

    goodbye:
      "மீண்டும் சந்திப்போம்",
  },

  gu: {
    morning: "સુપ્રભાત",
    afternoon: "શુભ બપોર",
    evening: "શુભ સાંજ",
    night: "શુભ રાત્રિ",

    hello: "નમસ્તે",
    hi: "હેલો",

    welcome:
      "TEXVERSE માં આપનું સ્વાગત છે",

    welcomeBack:
      "TEXVERSE માં આપનું ફરી સ્વાગત છે",

    goodbye:
      "ફરી મળીશું",
  },

  kn: {
    morning: "ಶುಭೋದಯ",
    afternoon: "ಶುಭ ಮಧ್ಯಾಹ್ನ",
    evening: "ಶುಭ ಸಂಜೆ",
    night: "ಶುಭ ರಾತ್ರಿ",

    hello: "ನಮಸ್ಕಾರ",
    hi: "ಹಲೋ",

    welcome:
      "TEXVERSE ಗೆ ಸ್ವಾಗತ",

    welcomeBack:
      "TEXVERSE ಗೆ ಮತ್ತೆ ಸ್ವಾಗತ",

    goodbye:
      "ಮತ್ತೆ ಭೇಟಿಯಾಗೋಣ",
  },

  ml: {
    morning: "സുപ്രഭാതം",
    afternoon: "ശുഭ ഉച്ചതിരിഞ്ഞ്",
    evening: "ശുഭ സായാഹ്നം",
    night: "ശുഭ രാത്രി",

    hello: "നമസ്കാരം",
    hi: "ഹലോ",

    welcome:
      "TEXVERSE-ലേക്ക് സ്വാഗതം",

    welcomeBack:
      "TEXVERSE-ലേക്ക് വീണ്ടും സ്വാഗതം",

    goodbye:
      "വീണ്ടും കാണാം",
  },

  pa: {
    morning: "ਸ਼ੁਭ ਸਵੇਰ",
    afternoon: "ਸ਼ੁਭ ਦੁਪਹਿਰ",
    evening: "ਸ਼ੁਭ ਸ਼ਾਮ",
    night: "ਸ਼ੁਭ ਰਾਤ",

    hello: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ",
    hi: "ਹੈਲੋ",

    welcome:
      "TEXVERSE ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",

    welcomeBack:
      "TEXVERSE ਵਿੱਚ ਤੁਹਾਡਾ ਦੁਬਾਰਾ ਸਵਾਗਤ ਹੈ",

    goodbye:
      "ਫਿਰ ਮਿਲਾਂਗੇ",
  },

  ur: {
    morning: "صبح بخیر",
    afternoon: "شام سے پہلے کا وقت بخیر",
    evening: "شام بخیر",
    night: "شب بخیر",

    hello: "السلام علیکم",
    hi: "ہیلو",

    welcome:
      "TEXVERSE میں خوش آمدید",

    welcomeBack:
      "TEXVERSE میں دوبارہ خوش آمدید",

    goodbye:
      "پھر ملاقات ہوگی",
  },

  ar: {
    morning: "صباح الخير",
    afternoon: "مساء الخير",
    evening: "مساء الخير",
    night: "تصبح على خير",

    hello: "مرحباً",
    hi: "أهلاً",

    welcome:
      "مرحباً بك في TEXVERSE",

    welcomeBack:
      "مرحباً بعودتك إلى TEXVERSE",

    goodbye:
      "إلى اللقاء",
  },

  zh: {
    morning: "早上好",
    afternoon: "下午好",
    evening: "晚上好",
    night: "晚安",

    hello: "你好",
    hi: "嗨",

    welcome:
      "欢迎来到 TEXVERSE",

    welcomeBack:
      "欢迎回到 TEXVERSE",

    goodbye:
      "再见，期待再次见到你",
  },

  ja: {
    morning: "おはようございます",
    afternoon: "こんにちは",
    evening: "こんばんは",
    night: "おやすみなさい",

    hello: "こんにちは",
    hi: "こんにちは",

    welcome:
      "TEXVERSEへようこそ",

    welcomeBack:
      "TEXVERSEへおかえりなさい",

    goodbye:
      "またお会いしましょう",
  },

  ko: {
    morning: "좋은 아침입니다",
    afternoon: "좋은 오후입니다",
    evening: "좋은 저녁입니다",
    night: "안녕히 주무세요",

    hello: "안녕하세요",
    hi: "안녕하세요",

    welcome:
      "TEXVERSE에 오신 것을 환영합니다",

    welcomeBack:
      "TEXVERSE에 다시 오신 것을 환영합니다",

    goodbye:
      "다시 만나요",
  },

  es: {
    morning: "Buenos días",
    afternoon: "Buenas tardes",
    evening: "Buenas tardes",
    night: "Buenas noches",

    hello: "Hola",
    hi: "Hola",

    welcome:
      "Bienvenido a TEXVERSE",

    welcomeBack:
      "Bienvenido de nuevo a TEXVERSE",

    goodbye:
      "Hasta luego",
  },

  fr: {
    morning: "Bonjour",
    afternoon: "Bon après-midi",
    evening: "Bonsoir",
    night: "Bonne nuit",

    hello: "Bonjour",
    hi: "Salut",

    welcome:
      "Bienvenue sur TEXVERSE",

    welcomeBack:
      "Bon retour sur TEXVERSE",

    goodbye:
      "À bientôt",
  },

  de: {
    morning: "Guten Morgen",
    afternoon: "Guten Tag",
    evening: "Guten Abend",
    night: "Gute Nacht",

    hello: "Hallo",
    hi: "Hallo",

    welcome:
      "Willkommen bei TEXVERSE",

    welcomeBack:
      "Willkommen zurück bei TEXVERSE",

    goodbye:
      "Bis bald",
  },

  tr: {
    morning: "Günaydın",
    afternoon: "Tünaydın",
    evening: "İyi akşamlar",
    night: "İyi geceler",

    hello: "Merhaba",
    hi: "Merhaba",

    welcome:
      "TEXVERSE'e hoş geldiniz",

    welcomeBack:
      "TEXVERSE'e tekrar hoş geldiniz",

    goodbye:
      "Görüşmek üzere",
  },

  ru: {
    morning: "Доброе утро",
    afternoon: "Добрый день",
    evening: "Добрый вечер",
    night: "Доброй ночи",

    hello: "Здравствуйте",
    hi: "Привет",

    welcome:
      "Добро пожаловать в TEXVERSE",

    welcomeBack:
      "С возвращением в TEXVERSE",

    goodbye:
      "До свидания",
  },

  it: {
    morning: "Buongiorno",
    afternoon: "Buon pomeriggio",
    evening: "Buonasera",
    night: "Buonanotte",

    hello: "Ciao",
    hi: "Ciao",

    welcome:
      "Benvenuto su TEXVERSE",

    welcomeBack:
      "Bentornato su TEXVERSE",

    goodbye:
      "A presto",
  },

  pt: {
    morning: "Bom dia",
    afternoon: "Boa tarde",
    evening: "Boa noite",
    night: "Boa noite",

    hello: "Olá",
    hi: "Olá",

    welcome:
      "Bem-vindo à TEXVERSE",

    welcomeBack:
      "Bem-vindo de volta à TEXVERSE",

    goodbye:
      "Até logo",
  },
  or: {
    morning: "ସୁପ୍ରଭାତ", afternoon: "ଶୁଭ ଅପରାହ୍ନ", evening: "ଶୁଭ ସନ୍ଧ୍ୟା", night: "ଶୁଭ ରାତ୍ରି",
    hello: "ନମସ୍କାର", hi: "ନମସ୍କାର", welcome: "TEXVERSE କୁ ସ୍ୱାଗତ", welcomeBack: "TEXVERSE କୁ ପୁନଃ ସ୍ୱାଗତ", goodbye: "ପୁଣି ଦେଖା ହେବ",
  },

  as: {
    morning: "সুপ্ৰভাত", afternoon: "শুভ অপৰাহ্ন", evening: "শুভ সন্ধিয়া", night: "শুভ ৰাত্ৰি",
    hello: "নমস্কাৰ", hi: "নমস্কাৰ", welcome: "TEXVERSEলৈ স্বাগতম", welcomeBack: "TEXVERSEলৈ পুনৰ স্বাগতম", goodbye: "আকৌ লগ পাম",
  },

  sa: {
    morning: "सुप्रभातम्", afternoon: "शुभापराह्णम्", evening: "शुभसन्ध्या", night: "शुभरात्रिः",
    hello: "नमस्ते", hi: "नमस्ते", welcome: "TEXVERSE मध्ये स्वागतम्", welcomeBack: "TEXVERSE मध्ये पुनः स्वागतम्", goodbye: "पुनर्मिलामः",
  },

  ne: {
    morning: "शुभ प्रभात", afternoon: "शुभ दिउँसो", evening: "शुभ साँझ", night: "शुभ रात्री",
    hello: "नमस्कार", hi: "नमस्कार", welcome: "TEXVERSE मा स्वागत छ", welcomeBack: "TEXVERSE मा पुनः स्वागत छ", goodbye: "फेरि भेटौँला",
  },

  kok: {
    morning: "शुभ प्रभात", afternoon: "शुभ दुपार", evening: "शुभ सांज", night: "शुभ रात",
    hello: "नमस्कार", hi: "नमस्कार", welcome: "TEXVERSE त तुमचें स्वागत", welcomeBack: "TEXVERSE त तुमचें परतून स्वागत", goodbye: "परत मेळचें",
  },

  mai: {
    morning: "शुभ प्रभात", afternoon: "शुभ दुपहर", evening: "शुभ साँझ", night: "शुभ रात्रि",
    hello: "प्रणाम", hi: "प्रणाम", welcome: "TEXVERSE में स्वागत अछि", welcomeBack: "TEXVERSE में फेर स्वागत अछि", goodbye: "फेर भेट होयत",
  },

  ks: {
    morning: "صُبح بخیر", afternoon: "دوپہر بخیر", evening: "شام بخیر", night: "شب بخیر",
    hello: "سلام", hi: "سلام", welcome: "TEXVERSE منز خوش آمدید", welcomeBack: "TEXVERSE منز دوبارہ خوش آمدید", goodbye: "پھر ملاقات",
  },

  sd: {
    morning: "صبح جو سلام", afternoon: "منجهند جو سلام", evening: "شام جو سلام", night: "رات جو سلام",
    hello: "سلام", hi: "سلام", welcome: "TEXVERSE ۾ ڀليڪار", welcomeBack: "TEXVERSE ۾ ٻيهر ڀليڪار", goodbye: "وري ملنداسين",
  },

  doi: {
    morning: "शुभ प्रभात", afternoon: "शुभ दोपहर", evening: "शुभ संझा", night: "शुभ रात",
    hello: "नमस्कार", hi: "नमस्कार", welcome: "TEXVERSE च तुआड़ा स्वागत ऐ", welcomeBack: "TEXVERSE च तुआड़ा दोबारा स्वागत ऐ", goodbye: "फेर मिलांगे",
  },

  mni: {
    morning: "শুভ নুমিদাং", afternoon: "শুভ নুমাংলুপ", evening: "শুভ হাইরিবা", night: "শুভ নিশা",
    hello: "খুরুমজারি", hi: "খুরুমজারি", welcome: "TEXVERSE-দা তরাম্না ওকচরি", welcomeBack: "TEXVERSE-দা অমুক্কা ওকচরি", goodbye: "অমুক্কা ফংনগনু",
  },

  brx: {
    morning: "सुबुं फुं", afternoon: "सुबुं हर", evening: "सुबुं सां", night: "सुबुं हर",
    hello: "खुलुमबाय", hi: "खुलुमबाय", welcome: "TEXVERSE आव बिदां", welcomeBack: "TEXVERSE आव फिन बिदां", goodbye: "फिन नुबाय",
  },

  sat: {
    morning: "जोहार", afternoon: "जोहार", evening: "जोहार", night: "जोहार",
    hello: "जोहार", hi: "जोहार", welcome: "TEXVERSE रे जोहार", welcomeBack: "TEXVERSE रे दोबारा जोहार", goodbye: "आबार भेटा",
  },
};

export function getGreetingText(
  language = "en",
  period = getTimePeriod()
) {
  const dictionary =
    GREETING_TEXT[
      language
    ] ||
    GREETING_TEXT.en;

  return {
    timeGreeting:
      dictionary[period] ||
      dictionary.morning,

    hello:
      dictionary.hello,

    hi:
      dictionary.hi,

    welcome:
      dictionary.welcome,

    welcomeBack:
      dictionary.welcomeBack,

    goodbye:
      dictionary.goodbye,
  };
}

export function getLoginGreeting({
  language = "en",
  countryCode = detectCountry(),
  returningUser = true,
} = {}) {
  const country =
    getCountryInfo(
      countryCode
    );

  const period =
    getTimePeriod();

  const text =
    getGreetingText(
      language,
      period
    );

  const indianStyle =
    country.style ===
      "namaste" ||
    country.style ===
      "respect";

  return {
    country,
    period,
    style:
      indianStyle
        ? "namaste"
        : country.style,

    emoji:
      indianStyle
        ? "🙏"
        : country.emoji,

    primary:
      indianStyle
        ? text.hello
        : text.hello,

    timeGreeting:
      text.timeGreeting,

    welcome: returningUser
      ? text.welcomeBack
      : text.welcome,
  };
}

export function getLogoutGreeting(
  language = "en"
) {
  const period =
    getTimePeriod();

  const text =
    getGreetingText(
      language,
      period
    );

  return {
    period,
    goodbye: text.goodbye,
  };
}
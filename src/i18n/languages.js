export const LANGUAGES = [
  // Indian languages
  { code: "en", name: "English", nativeName: "English", rtl: false },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", rtl: false },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", rtl: false },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", rtl: false },
  { code: "mr", name: "Marathi", nativeName: "मराठी", rtl: false },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", rtl: false },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", rtl: false },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", rtl: false },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", rtl: false },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", rtl: false },
  { code: "ur", name: "Urdu", nativeName: "اردو", rtl: true },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", rtl: false },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", rtl: false },
  { code: "sa", name: "Sanskrit", nativeName: "संस्कृतम्", rtl: false },
  { code: "ne", name: "Nepali", nativeName: "नेपाली", rtl: false },
  { code: "kok", name: "Konkani", nativeName: "कोंकणी", rtl: false },
  { code: "mai", name: "Maithili", nativeName: "मैथिली", rtl: false },
  { code: "ks", name: "Kashmiri", nativeName: "کٲشُر", rtl: true },
  { code: "sd", name: "Sindhi", nativeName: "سنڌي", rtl: true },
  { code: "doi", name: "Dogri", nativeName: "डोगरी", rtl: false },
  { code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্", rtl: false },
  { code: "brx", name: "Bodo", nativeName: "बड़ो", rtl: false },
  { code: "sat", name: "Santali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ", rtl: false },

  // International languages
  { code: "es", name: "Spanish", nativeName: "Español", rtl: false },
  { code: "fr", name: "French", nativeName: "Français", rtl: false },
  { code: "de", name: "German", nativeName: "Deutsch", rtl: false },
  { code: "ar", name: "Arabic", nativeName: "العربية", rtl: true },
  { code: "zh", name: "Chinese", nativeName: "中文", rtl: false },
  { code: "ja", name: "Japanese", nativeName: "日本語", rtl: false },
  { code: "ko", name: "Korean", nativeName: "한국어", rtl: false },
  { code: "pt", name: "Portuguese", nativeName: "Português", rtl: false },
  { code: "it", name: "Italian", nativeName: "Italiano", rtl: false },
  { code: "ru", name: "Russian", nativeName: "Русский", rtl: false },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", rtl: false },
];

export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_STORAGE_KEY = "texverse_language";

export function getLanguage(code) {
  return (
    LANGUAGES.find(
      (language) => language.code === code
    ) || LANGUAGES[0]
  );
}

export function isSupportedLanguage(code) {
  return LANGUAGES.some(
    (language) => language.code === code
  );
}

export function normalizeLanguage(code) {
  if (!code) {
    return DEFAULT_LANGUAGE;
  }

  const normalized = String(code)
    .trim()
    .toLowerCase();

  if (isSupportedLanguage(normalized)) {
    return normalized;
  }

  const base = normalized.split("-")[0];

  if (isSupportedLanguage(base)) {
    return base;
  }

  return DEFAULT_LANGUAGE;
}


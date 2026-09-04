import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import translations from "./translations";
import { corePacks } from "./corePacks";

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  LANGUAGES,
  getLanguage,
  normalizeLanguage,
} from "./languages";

const I18nContext = createContext(null);

/* =========================================================
   HELPERS
========================================================= */

function getNestedValue(object, path) {
  if (!object || !path) {
    return undefined;
  }

  return String(path)
    .split(".")
    .reduce(
      (current, key) =>
        current?.[key],
      object
    );
}

function getSavedLanguage() {
  try {
    const stored = localStorage.getItem(
      LANGUAGE_STORAGE_KEY
    );

    return normalizeLanguage(
      stored || DEFAULT_LANGUAGE
    );
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function updateDocumentLanguage(
  language,
  languageInfo
) {
  if (
    typeof document === "undefined"
  ) {
    return;
  }

  document.documentElement.lang =
    language;

  document.documentElement.dir =
    languageInfo.rtl
      ? "rtl"
      : "ltr";

  document.documentElement.dataset.language =
    language;

  document.documentElement.dataset.direction =
    languageInfo.rtl
      ? "rtl"
      : "ltr";

  if (document.body) {
    document.body.dir =
      languageInfo.rtl
        ? "rtl"
        : "ltr";

    document.body.dataset.language =
      language;

    document.body.dataset.direction =
      languageInfo.rtl
        ? "rtl"
        : "ltr";
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function I18nProvider({
  children,
}) {
  const [language, setLanguageState] =
    useState(getSavedLanguage);

  const languageInfo = useMemo(
    () => getLanguage(language),
    [language]
  );

  const baseDictionary =
    translations[language] ||
    translations[DEFAULT_LANGUAGE];

  const coreDictionary =
    corePacks[language] ||
    corePacks[DEFAULT_LANGUAGE] ||
    {};

  const dictionary = {
    ...baseDictionary,
    common: {
      ...(baseDictionary?.common || {}),
      ...(coreDictionary?.common || {}),
    },
    home: {
      ...(baseDictionary?.home || {}),
      ...(coreDictionary?.home || {}),
    },
  };

  const fallback =
    translations[DEFAULT_LANGUAGE];

  /* =======================================================
     LANGUAGE DOCUMENT SYNC
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        language
      );
    } catch {
      // Ignore localStorage errors.
    }

    updateDocumentLanguage(
      language,
      languageInfo
    );
  }, [language, languageInfo]);

  /* =======================================================
     CHANGE LANGUAGE
  ======================================================= */

  const setLanguage = useCallback(
    (nextLanguage) => {
      const normalized =
        normalizeLanguage(
          nextLanguage
        );

      setLanguageState(normalized);

      try {
        localStorage.setItem(
          LANGUAGE_STORAGE_KEY,
          normalized
        );
      } catch {
        // Ignore storage errors.
      }

      updateDocumentLanguage(
        normalized,
        getLanguage(normalized)
      );

      if (
        typeof window !== "undefined"
      ) {
        window.dispatchEvent(
          new CustomEvent(
            "texverse-language-change",
            {
              detail: normalized,
            }
          )
        );
      }
    },
    []
  );

  /* =======================================================
     TRANSLATION FUNCTION
  ======================================================= */

  const t = useCallback(
    (key, variables = {}) => {
      const options =
        variables &&
        typeof variables ===
          "object" &&
        !Array.isArray(variables)
          ? variables
          : {};

      const defaultValue =
        options.defaultValue;

      let value = getNestedValue(
        dictionary,
        key
      );

      /*
       * If selected language doesn't have
       * the key, use English.
       */
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        value = getNestedValue(
          fallback,
          key
        );
      }

      /*
       * If neither selected language nor
       * English contains the key, use
       * component-provided defaultValue.
       */
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        if (
          defaultValue !== undefined &&
          defaultValue !== null
        ) {
          value = defaultValue;
        } else {
          return key;
        }
      }

      /*
       * Non-string values can be useful
       * for structured translation data.
       */
      if (
        typeof value !== "string"
      ) {
        return value;
      }

      /*
       * Never substitute defaultValue
       * into translation variables.
       */
      const replacements = {
        ...options,
      };

      delete replacements.defaultValue;

      return Object.entries(
        replacements
      ).reduce(
        (result, [name, replacement]) =>
          result.replace(
            new RegExp(
              `\\{${name}\\}`,
              "g"
            ),
            String(replacement)
          ),
        value
      );
    },
    [
      dictionary,
      fallback,
    ]
  );

  const value = useMemo(
    () => ({
      language,
      languageInfo,
      languages: LANGUAGES,
      isRTL: Boolean(
        languageInfo?.rtl
      ),
      setLanguage,
      t,
    }),
    [
      language,
      languageInfo,
      setLanguage,
      t,
    ]
  );

  return (
    <I18nContext.Provider
      value={value}
    >
      {children}
    </I18nContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useI18n() {
  const context =
    useContext(I18nContext);

  if (!context) {
    throw new Error(
      "useI18n must be used inside I18nProvider."
    );
  }

  return context;
}

export default I18nContext;


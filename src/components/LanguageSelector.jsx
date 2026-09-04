import { Languages } from "lucide-react";
import { useI18n } from "../i18n/i18n";

export default function LanguageSelector({
  mobile = false,
}) {
  const {
    language,
    languages,
    setLanguage,
    t,
  } = useI18n();

  return (
    <div
      className={
        mobile
          ? "language-selector mobile-language-selector"
          : "language-selector"
      }
    >
      <Languages size={16} />

      <select
        value={language}
        onChange={(event) =>
          setLanguage(
            event.target.value
          )
        }
        aria-label={t(
          "common.language"
        )}
        className="language-select"
      >
        {languages.map(
          (item) => (
            <option
              key={item.code}
              value={item.code}
            >
              {item.nativeName}
            </option>
          )
        )}
      </select>
    </div>
  );
}


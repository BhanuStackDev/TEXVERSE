import { useI18n } from "../i18n/i18n";

export default function LanguageContext({
  children,
}) {
  return children;
}

export function useLanguage() {
  return useI18n();
}
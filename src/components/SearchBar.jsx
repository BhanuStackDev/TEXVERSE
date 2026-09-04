import { Search } from "lucide-react";
import { useI18n } from "../i18n/i18n";

export default function SearchBar({ search, setSearch }) {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-3">
      <Search className="text-cyan-400" size={20} />

      <input
        type="text"
        placeholder={t("home.searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-transparent outline-none text-white placeholder:text-slate-500"
        aria-label={t("home.searchTextiles")}
      />
    </div>
  );
}


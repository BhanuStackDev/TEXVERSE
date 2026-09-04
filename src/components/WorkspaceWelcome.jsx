import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getLoginGreeting } from "../i18n/greetings";
import { useI18n } from "../i18n/i18n";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("texverse_user") || "null");
  } catch {
    return null;
  }
}

export default function WorkspaceWelcome({ role }) {
  const { language } = useI18n();
  const user = useMemo(readUser, []);
  const greeting = useMemo(() => getLoginGreeting({ language, returningUser: true }), [language]);
  const name = user?.full_name || user?.name || user?.company_name || "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl border border-cyan-400/15 bg-linear-to-r from-cyan-400/8 via-slate-900 to-slate-900 p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.5 }}
          className="text-3xl"
          aria-hidden="true"
        >
          {greeting.emoji}
        </motion.span>
        <div>
          <p className="text-sm font-black text-cyan-300">{greeting.primary} {name}</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-slate-500">{greeting.timeGreeting} · {role} Workspace</p>
        </div>
        <Sparkles size={16} className="ml-auto text-cyan-400" />
      </div>
    </motion.div>
  );
}

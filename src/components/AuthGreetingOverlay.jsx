import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Hand,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useI18n } from "../i18n/i18n";
import {
  detectCountry,
  getCountryInfo,
  getGreetingText,
  getTimePeriod,
} from "../i18n/greetings";

const WELCOME_SESSION_KEY =
  "texverse_initial_welcome_shown";

function getName(user) {
  const value =
    user?.full_name ||
    user?.name ||
    user?.company_name ||
    "User";

  return String(value).trim() || "User";
}

function greetingFor(language, user) {
  const rawCountry = String(
    user?.country_code ||
      user?.country ||
      ""
  ).trim();

  const countryCode =
    rawCountry.length === 2
      ? rawCountry.toUpperCase()
      : detectCountry();

  const country = getCountryInfo(countryCode);
  const period = getTimePeriod();

  const text = getGreetingText(
    language,
    period
  );

  const respectful =
    country.style === "namaste" ||
    country.style === "respect";

  return {
    emoji: respectful ? "🙏" : "👋",
    primary: text.hello,
    time: text.timeGreeting,
    welcome: text.welcomeBack,
    goodbye: text.goodbye,
    name: getName(user),
    bow: respectful,
  };
}

function getInitialWelcome(language) {
  const normalized = String(
    language || "en"
  ).toLowerCase();

  if (
    normalized === "hi" ||
    normalized.startsWith("hi-")
  ) {
    return {
      title: "TEXVERSE में आपका स्वागत है",
      subtitle:
        "AI-powered textile commerce का नया अनुभव",
      description:
        "Verified suppliers खोजें, textile products explore करें और smarter business करें।",
      ready: "आपका marketplace तैयार है",
    };
  }

  if (
    normalized === "ur" ||
    normalized.startsWith("ur-")
  ) {
    return {
      title: "TEXVERSE میں خوش آمدید",
      subtitle:
        "AI-powered textile commerce کا نیا تجربہ",
      description:
        "Verified suppliers تلاش کریں، textile products explore کریں اور بہتر business کریں۔",
      ready: "آپ کا marketplace تیار ہے",
    };
  }

  if (
    normalized === "it" ||
    normalized.startsWith("it-")
  ) {
    return {
      title: "Benvenuto in TEXVERSE",
      subtitle:
        "Una nuova esperienza di commercio tessile basata sull'AI",
      description:
        "Scopri fornitori verificati, esplora prodotti tessili e fai business in modo più intelligente.",
      ready: "Il tuo marketplace è pronto",
    };
  }

  return {
    title: "Welcome to TEXVERSE",
    subtitle:
      "AI-powered textile commerce",
    description:
      "Discover verified suppliers, explore textile products and trade smarter.",
    ready:
      "Your textile marketplace is ready",
  };
}

export default function AuthGreetingOverlay() {
  const { language } = useI18n();

  const [event, setEvent] =
    useState(null);

  /*
   * Show the initial TEXVERSE welcome
   * only once per browser session.
   *
   * This is intentionally sessionStorage,
   * not localStorage:
   *
   * - First URL open in a new session:
   *   Welcome appears.
   * - Refresh:
   *   Welcome does not repeat.
   * - Login/logout:
   *   Existing auth greeting still works.
   */
  useEffect(() => {
    try {
      const alreadyShown =
        sessionStorage.getItem(
          WELCOME_SESSION_KEY
        );

      if (alreadyShown === "1") {
        return;
      }

      sessionStorage.setItem(
        WELCOME_SESSION_KEY,
        "1"
      );

      setEvent({
        type: "welcome",
        nonce: Date.now(),
      });
    } catch {
      /*
       * If sessionStorage is unavailable,
       * still show the welcome message.
       */
      setEvent({
        type: "welcome",
        nonce: Date.now(),
      });
    }
  }, []);

  /*
   * Existing login/logout greeting events.
   */
  useEffect(() => {
    const onAuth = (customEvent) => {
      const detail =
        customEvent?.detail;

      if (
        !detail ||
        !["login", "logout"].includes(
          detail.type
        )
      ) {
        return;
      }

      setEvent({
        ...detail,
        nonce: Date.now(),
      });
    };

    window.addEventListener(
      "texverse-auth-greeting",
      onAuth
    );

    return () =>
      window.removeEventListener(
        "texverse-auth-greeting",
        onAuth
      );
  }, []);

  /*
   * Timing:
   * Welcome = 3200ms
   * Login   = 2600ms
   * Logout  = 3000ms
   */
  useEffect(() => {
    if (!event) {
      return undefined;
    }

    let duration = 2600;

    if (event.type === "welcome") {
      duration = 3200;
    }

    if (event.type === "logout") {
      duration = 3000;
    }

    const timer =
      window.setTimeout(
        () => setEvent(null),
        duration
      );

    return () =>
      window.clearTimeout(timer);
  }, [event]);

  const isWelcome =
    event?.type === "welcome";

  const isLogout =
    event?.type === "logout";

  const greeting = greetingFor(
    language,
    event?.user
  );

  const welcome =
    getInitialWelcome(language);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.nonce}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="fixed inset-0 z-100 grid place-items-center bg-slate-950/96 px-6 backdrop-blur-xl"
          role="status"
          aria-live="polite"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.88,
              y: 24,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.94,
              y: -12,
            }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
            }}
            className="w-full max-w-2xl text-center"
          >
            {/* Animated icon */}
            <div className="mx-auto mb-7 grid h-28 w-28 place-items-center rounded-4xl border border-cyan-400/25 bg-cyan-400/10 shadow-2xl shadow-cyan-500/10">
              <motion.span
                animate={
                  isWelcome
                    ? {
                        scale: [
                          1,
                          1.08,
                          1,
                        ],
                        rotate: [
                          0,
                          -5,
                          5,
                          0,
                        ],
                      }
                    : isLogout
                    ? {
                        rotate: [
                          0,
                          -14,
                          14,
                          -10,
                          10,
                          0,
                        ],
                        x: [
                          0,
                          -3,
                          3,
                          -2,
                          2,
                          0,
                        ],
                      }
                    : greeting.bow
                    ? {
                        y: [
                          0,
                          10,
                          0,
                        ],
                        rotateX: [
                          0,
                          12,
                          0,
                        ],
                      }
                    : {
                        rotate: [
                          0,
                          -12,
                          12,
                          -9,
                          9,
                          0,
                        ],
                        x: [
                          0,
                          -3,
                          3,
                          -2,
                          2,
                          0,
                        ],
                      }
                }
                transition={{
                  duration: isWelcome
                    ? 1.5
                    : isLogout
                    ? 1.1
                    : 1.35,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
                className="text-6xl"
              >
                {isWelcome
                  ? "👋"
                  : isLogout
                  ? "👋"
                  : greeting.emoji}
              </motion.span>
            </div>

            {/* TEXVERSE label */}
            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              {isLogout ? (
                <LogOut size={14} />
              ) : (
                <Sparkles size={14} />
              )}

              TEXVERSE
            </div>

            {/* Initial welcome */}
            {isWelcome && (
              <>
                <motion.h2
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.12,
                  }}
                  className="mt-5 text-4xl font-black text-white sm:text-6xl"
                >
                  {welcome.title}
                </motion.h2>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.22,
                  }}
                  className="mt-4 text-xl font-semibold text-cyan-300"
                >
                  {welcome.subtitle}
                </motion.p>

                <motion.p
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.32,
                  }}
                  className="mx-auto mt-3 max-w-xl text-slate-400"
                >
                  {welcome.description}
                </motion.p>
              </>
            )}

            {/* Logout greeting */}
            {isLogout && (
              <>
                <h2 className="mt-5 text-4xl font-black text-white sm:text-6xl">
                  {greeting.goodbye}
                </h2>

                <p className="mt-4 text-xl font-semibold text-slate-300">
                  {greeting.name},{" "}
                  {greeting.time}
                </p>

                <p className="mt-3 text-slate-500">
                  {greeting.welcome}
                </p>
              </>
            )}

            {/* Login greeting */}
            {!isWelcome &&
              !isLogout && (
                <>
                  <h2 className="mt-5 text-4xl font-black text-white sm:text-6xl">
                    {greeting.primary}{" "}
                    {greeting.name}
                  </h2>

                  <p className="mt-4 text-xl font-semibold text-cyan-300">
                    {greeting.time}
                  </p>

                  <p className="mt-3 text-slate-400">
                    {greeting.welcome}
                  </p>
                </>
              )}

            {/* Bottom status */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-2 text-sm text-slate-400">
              {isLogout ? (
                <Hand size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}

              {isWelcome
                ? welcome.ready
                : isLogout
                ? "See you again on TEXVERSE"
                : "Your workspace is ready"}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


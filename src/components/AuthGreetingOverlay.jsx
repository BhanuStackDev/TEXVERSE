import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Hand,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useLocation } from "react-router-dom";
import { useI18n } from "../i18n/i18n";
import {
  detectCountry,
  getCountryInfo,
  getGreetingText,
  getTimePeriod,
} from "../i18n/greetings";

/* =========================================================
   USER NAME
========================================================= */

function getName(user) {
  const value =
    user?.full_name ||
    user?.name ||
    user?.company_name ||
    "User";

  return String(value).trim() || "User";
}


/* =========================================================
   LOGIN / LOGOUT GREETING
========================================================= */

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


/* =========================================================
   HOME WELCOME
========================================================= */

function getInitialWelcome(language) {
  const normalized = String(
    language || "en"
  ).toLowerCase();

  const welcomeMap = {
    en: {
      title: "Welcome to TEXVERSE",
      subtitle: "AI-powered textile commerce",
      description:
        "Discover verified suppliers, explore textile products and trade smarter.",
      ready:
        "Your textile marketplace is ready",
    },

    hi: {
      title: "TEXVERSE में आपका स्वागत है",
      subtitle:
        "AI-powered textile commerce का नया अनुभव",
      description:
        "Verified suppliers खोजें, textile products explore करें और smarter business करें।",
      ready:
        "आपका marketplace तैयार है",
    },

    bn: {
      title: "TEXVERSE-এ স্বাগতম",
      subtitle:
        "AI-powered textile commerce-এর নতুন অভিজ্ঞতা",
      description:
        "Verified suppliers খুঁজুন, textile products explore করুন এবং আরও স্মার্টভাবে ব্যবসা করুন।",
      ready:
        "আপনার marketplace প্রস্তুত",
    },

    te: {
      title: "TEXVERSEకు స్వాగతం",
      subtitle:
        "AI-powered textile commerce యొక్క కొత్త అనుభవం",
      description:
        "Verified suppliers ను కనుగొనండి, textile products ను explore చేయండి మరియు మరింత స్మార్ట్‌గా వ్యాపారం చేయండి.",
      ready:
        "మీ marketplace సిద్ధంగా ఉంది",
    },

    mr: {
      title: "TEXVERSE मध्ये आपले स्वागत आहे",
      subtitle:
        "AI-powered textile commerce चा नवीन अनुभव",
      description:
        "Verified suppliers शोधा, textile products explore करा आणि अधिक हुशारीने व्यवसाय करा.",
      ready:
        "तुमचे marketplace तयार आहे",
    },

    ta: {
      title: "TEXVERSEக்கு வரவேற்கிறோம்",
      subtitle:
        "AI-powered textile commerce-ன் புதிய அனுபவம்",
      description:
        "Verified suppliers-ஐ கண்டறிந்து, textile products-ஐ explore செய்து, மேலும் புத்திசாலித்தனமாக வர்த்தகம் செய்யுங்கள்.",
      ready:
        "உங்கள் marketplace தயாராக உள்ளது",
    },

    gu: {
      title: "TEXVERSE માં આપનું સ્વાગત છે",
      subtitle:
        "AI-powered textile commerce નો નવો અનુભવ",
      description:
        "Verified suppliers શોધો, textile products explore કરો અને વધુ સ્માર્ટ રીતે બિઝનેસ કરો.",
      ready:
        "તમારું marketplace તૈયાર છે",
    },

    kn: {
      title: "TEXVERSE ಗೆ ಸ್ವಾಗತ",
      subtitle:
        "AI-powered textile commerce ನ ಹೊಸ ಅನುಭವ",
      description:
        "Verified suppliers ಹುಡುಕಿ, textile products explore ಮಾಡಿ ಮತ್ತು ಇನ್ನಷ್ಟು ಸ್ಮಾರ್ಟ್ ಆಗಿ ವ್ಯಾಪಾರ ಮಾಡಿ.",
      ready:
        "ನಿಮ್ಮ marketplace ಸಿದ್ಧವಾಗಿದೆ",
    },

    ml: {
      title: "TEXVERSE-ലേക്ക് സ്വാഗതം",
      subtitle:
        "AI-powered textile commerce-ന്റെ പുതിയ അനുഭവം",
      description:
        "Verified suppliers കണ്ടെത്തുക, textile products explore ചെയ്യുക, കൂടുതൽ സ്മാർട്ടായി ബിസിനസ് നടത്തുക.",
      ready:
        "നിങ്ങളുടെ marketplace തയ്യാറാണ്",
    },

    pa: {
      title: "TEXVERSE ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ",
      subtitle:
        "AI-powered textile commerce ਦਾ ਨਵਾਂ ਅਨੁਭਵ",
      description:
        "Verified suppliers ਲੱਭੋ, textile products explore ਕਰੋ ਅਤੇ ਹੋਰ ਸਮਾਰਟ ਤਰੀਕੇ ਨਾਲ ਕਾਰੋਬਾਰ ਕਰੋ।",
      ready:
        "ਤੁਹਾਡਾ marketplace ਤਿਆਰ ਹੈ",
    },

    ur: {
      title: "TEXVERSE میں خوش آمدید",
      subtitle:
        "AI-powered textile commerce کا نیا تجربہ",
      description:
        "Verified suppliers تلاش کریں، textile products explore کریں اور بہتر business کریں۔",
      ready:
        "آپ کا marketplace تیار ہے",
    },

    as: {
      title: "TEXVERSE লৈ স্বাগতম",
      subtitle:
        "AI-powered textile commerce ৰ নতুন অভিজ্ঞতা",
      description:
        "Verified suppliers বিচাৰি উলিয়াওক, textile products explore কৰক আৰু অধিক স্মাৰ্টভাৱে ব্যৱসায় কৰক।",
      ready:
        "আপোনাৰ marketplace সাজু",
    },

    or: {
      title: "TEXVERSE କୁ ସ୍ୱାଗତ",
      subtitle:
        "AI-powered textile commerce ର ନୂଆ ଅନୁଭବ",
      description:
        "Verified suppliers ଖୋଜନ୍ତୁ, textile products explore କରନ୍ତୁ ଏବଂ ଅଧିକ ସ୍ମାର୍ଟ ଭାବେ ବ୍ୟବସାୟ କରନ୍ତୁ।",
      ready:
        "ଆପଣଙ୍କ marketplace ପ୍ରସ୍ତୁତ",
    },

    ne: {
      title: "TEXVERSE मा स्वागत छ",
      subtitle:
        "AI-powered textile commerce को नयाँ अनुभव",
      description:
        "Verified suppliers खोज्नुहोस्, textile products explore गर्नुहोस् र अझ स्मार्ट रूपमा व्यापार गर्नुहोस्।",
      ready:
        "तपाईंको marketplace तयार छ",
    },

    si: {
      title: "TEXVERSE වෙත සාදරයෙන් පිළිගනිමු",
      subtitle:
        "AI-powered textile commerce හි නව අත්දැකීම",
      description:
        "Verified suppliers සොයන්න, textile products explore කරන්න සහ වඩාත් බුද්ධිමත්ව ව්‍යාපාර කරන්න.",
      ready:
        "ඔබගේ marketplace සූදානම්",
    },

    ar: {
      title: "مرحبًا بك في TEXVERSE",
      subtitle:
        "تجربة جديدة للتجارة النسيجية المدعومة بالذكاء الاصطناعي",
      description:
        "اكتشف الموردين الموثوقين واستكشف منتجات المنسوجات وتاجر بذكاء أكبر.",
      ready:
        "سوق المنسوجات الخاص بك جاهز",
    },

    fr: {
      title: "Bienvenue sur TEXVERSE",
      subtitle:
        "Une nouvelle expérience de commerce textile propulsée par l’IA",
      description:
        "Découvrez des fournisseurs vérifiés, explorez les produits textiles et développez votre activité plus intelligemment.",
      ready:
        "Votre marketplace textile est prête",
    },

    de: {
      title: "Willkommen bei TEXVERSE",
      subtitle:
        "Eine neue KI-gestützte Erfahrung im Textilhandel",
      description:
        "Entdecken Sie verifizierte Lieferanten, erkunden Sie Textilprodukte und handeln Sie intelligenter.",
      ready:
        "Ihr Textil-Marktplatz ist bereit",
    },

    es: {
      title: "Bienvenido a TEXVERSE",
      subtitle:
        "Una nueva experiencia de comercio textil impulsada por IA",
      description:
        "Descubre proveedores verificados, explora productos textiles y comercia de forma más inteligente.",
      ready:
        "Tu marketplace textil está listo",
    },

    pt: {
      title: "Bem-vindo ao TEXVERSE",
      subtitle:
        "Uma nova experiência de comércio têxtil com IA",
      description:
        "Descubra fornecedores verificados, explore produtos têxteis e faça negócios de forma mais inteligente.",
      ready:
        "Seu marketplace têxtil está pronto",
    },

    it: {
      title: "Benvenuto in TEXVERSE",
      subtitle:
        "Una nuova esperienza di commercio tessile basata sull'AI",
      description:
        "Scopri fornitori verificati, esplora prodotti tessili e fai business in modo più intelligente.",
      ready:
        "Il tuo marketplace è pronto",
    },

    nl: {
      title: "Welkom bij TEXVERSE",
      subtitle:
        "Een nieuwe AI-aangedreven ervaring voor textielhandel",
      description:
        "Ontdek geverifieerde leveranciers, verken textielproducten en handel slimmer.",
      ready:
        "Je textielmarktplaats is klaar",
    },

    tr: {
      title: "TEXVERSE'e Hoş Geldiniz",
      subtitle:
        "Yapay zekâ destekli tekstil ticaretinde yeni deneyim",
      description:
        "Doğrulanmış tedarikçileri keşfedin, tekstil ürünlerini inceleyin ve daha akıllı ticaret yapın.",
      ready:
        "Tekstil pazaryeriniz hazır",
    },

    ru: {
      title: "Добро пожаловать в TEXVERSE",
      subtitle:
        "Новый опыт торговли текстилем с поддержкой ИИ",
      description:
        "Находите проверенных поставщиков, изучайте текстильную продукцию и ведите бизнес эффективнее.",
      ready:
        "Ваш текстильный маркетплейс готов",
    },

    uk: {
      title: "Ласкаво просимо до TEXVERSE",
      subtitle:
        "Новий досвід текстильної торгівлі на основі ШІ",
      description:
        "Знаходьте перевірених постачальників, переглядайте текстильні товари та торгуйте розумніше.",
      ready:
        "Ваш текстильний маркетплейс готовий",
    },

    ja: {
      title: "TEXVERSEへようこそ",
      subtitle:
        "AIを活用した新しいテキスタイルコマース体験",
      description:
        "認証済みサプライヤーを見つけ、テキスタイル製品を探し、よりスマートに取引しましょう。",
      ready:
        "あなたのテキスタイルマーケットプレイスの準備ができました",
    },

    ko: {
      title: "TEXVERSE에 오신 것을 환영합니다",
      subtitle:
        "AI 기반의 새로운 섬유 상거래 경험",
      description:
        "검증된 공급업체를 찾고 섬유 제품을 탐색하며 더 스마트하게 거래하세요.",
      ready:
        "텍스타일 마켓플레이스가 준비되었습니다",
    },

    zh: {
      title: "欢迎来到 TEXVERSE",
      subtitle:
        "全新的 AI 智能纺织品交易体验",
      description:
        "发现经过验证的供应商，探索纺织产品，更智能地开展贸易。",
      ready:
        "您的纺织品市场已经准备就绪",
    },

    id: {
      title: "Selamat datang di TEXVERSE",
      subtitle:
        "Pengalaman baru perdagangan tekstil berbasis AI",
      description:
        "Temukan pemasok terverifikasi, jelajahi produk tekstil, dan berdagang dengan lebih cerdas.",
      ready:
        "Marketplace tekstil Anda siap",
    },

    ms: {
      title: "Selamat datang ke TEXVERSE",
      subtitle:
        "Pengalaman baharu perdagangan tekstil berkuasa AI",
      description:
        "Temui pembekal yang disahkan, terokai produk tekstil dan berdagang dengan lebih pintar.",
      ready:
        "Marketplace tekstil anda sudah sedia",
    },

    th: {
      title: "ยินดีต้อนรับสู่ TEXVERSE",
      subtitle:
        "ประสบการณ์การค้าโทรคมนาคมสิ่งทอรูปแบบใหม่ด้วย AI",
      description:
        "ค้นหาซัพพลายเออร์ที่ได้รับการตรวจสอบ สำรวจผลิตภัณฑ์สิ่งทอ และทำธุรกิจได้อย่างชาญฉลาดยิ่งขึ้น",
      ready:
        "มาร์เก็ตเพลสสิ่งทอของคุณพร้อมแล้ว",
    },

    vi: {
      title: "Chào mừng đến với TEXVERSE",
      subtitle:
        "Trải nghiệm thương mại dệt may mới được hỗ trợ bởi AI",
      description:
        "Khám phá các nhà cung cấp đã được xác minh, tìm hiểu sản phẩm dệt may và giao dịch thông minh hơn.",
      ready:
        "Thị trường dệt may của bạn đã sẵn sàng",
    },

    fa: {
      title: "به TEXVERSE خوش آمدید",
      subtitle:
        "تجربه‌ای جدید از تجارت نساجی مبتنی بر هوش مصنوعی",
      description:
        "تأمین‌کنندگان تأییدشده را پیدا کنید، محصولات نساجی را بررسی کنید و هوشمندانه‌تر تجارت کنید.",
      ready:
        "بازار نساجی شما آماده است",
    },

    he: {
      title: "ברוכים הבאים ל-TEXVERSE",
      subtitle:
        "חוויית מסחר טקסטיל חדשה המופעלת באמצעות בינה מלאכותית",
      description:
        "גלו ספקים מאומתים, חקרו מוצרי טקסטיל וסחרו בצורה חכמה יותר.",
      ready:
        "שוק הטקסטיל שלכם מוכן",
    },
  };

  const baseCode =
    normalized.split("-")[0];

  return (
    welcomeMap[normalized] ||
    welcomeMap[baseCode] ||
    welcomeMap.en
  );
}


/* =========================================================
   MAIN OVERLAY
========================================================= */

export default function AuthGreetingOverlay() {
  const { language } = useI18n();
  const location = useLocation();

  const [event, setEvent] = useState(null);

  /* =======================================================
     HOME WELCOME
     Show every time Home route is entered.
  ======================================================= */

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    setEvent({
      type: "welcome",
      nonce: Date.now(),
    });
  }, [location.pathname]);

  /* =======================================================
     LOGIN / LOGOUT EVENTS
  ======================================================= */

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

  /* =======================================================
     TIMING
  ======================================================= */

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

            {/* =================================================
                ANIMATED ICON
            ================================================= */}

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


            {/* =================================================
                TEXVERSE LABEL
            ================================================= */}

            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
              {isLogout ? (
                <LogOut size={14} />
              ) : (
                <Sparkles size={14} />
              )}

              TEXVERSE
            </div>


            {/* =================================================
                INITIAL WELCOME
            ================================================= */}

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


            {/* =================================================
                LOGOUT GREETING
            ================================================= */}

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


            {/* =================================================
                LOGIN GREETING
            ================================================= */}

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


            {/* =================================================
                BOTTOM STATUS
            ================================================= */}

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


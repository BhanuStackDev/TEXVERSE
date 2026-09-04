import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaGithub,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">
              TEXVERSE
            </h2>

            <p className="text-slate-400 leading-7">
              {t("footer.description", {
                defaultValue:
                  "AI-संचालित B2B टेक्सटाइल मार्केटप्लेस जो पूरे भारत में सत्यापित मिल्स, निर्माताओं और खरीदारों को जोड़ता है।",
              })}
            </p>

            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="bg-slate-800 hover:bg-blue-600 transition p-3 rounded-full"
              >
                <FaFacebookF />
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="bg-slate-800 hover:bg-pink-600 transition p-3 rounded-full"
              >
                <FaInstagram />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="bg-slate-800 hover:bg-blue-500 transition p-3 rounded-full"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="bg-slate-800 hover:bg-red-600 transition p-3 rounded-full"
              >
                <FaYoutube />
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="bg-slate-800 hover:bg-white hover:text-black transition p-3 rounded-full"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              {t("footer.marketplace", {
                defaultValue: "मार्केटप्लेस",
              })}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/marketplace"
                  className="hover:text-cyan-400 transition"
                >
                  {t("footer.browseFabrics", {
                    defaultValue: "फैब्रिक देखें",
                  })}
                </Link>
              </li>

              <li>
                <Link
                  to="/categories"
                  className="hover:text-cyan-400 transition"
                >
                  {t("common.categories", {
                    defaultValue: "श्रेणियाँ",
                  })}
                </Link>
              </li>

              <li>
                <Link
                  to="/suppliers"
                  className="hover:text-cyan-400 transition"
                >
                  {t("footer.verifiedSuppliers", {
                    defaultValue: "सत्यापित सप्लायर्स",
                  })}
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-cyan-400 transition"
                >
                  {t("common.dashboard", {
                    defaultValue: "डैशबोर्ड",
                  })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              {t("footer.company", {
                defaultValue: "कंपनी",
              })}
            </h3>

            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="hover:text-cyan-400 transition"
                >
                  {t("footer.aboutUs", {
                    defaultValue: "हमारे बारे में",
                  })}
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy"
                  className="hover:text-cyan-400 transition"
                >
                  {t("footer.privacyPolicy", {
                    defaultValue: "प्राइवेसी पॉलिसी",
                  })}
                </Link>
              </li>

              <li>
                <Link
                  to="/terms"
                  className="hover:text-cyan-400 transition"
                >
                  {t("footer.termsConditions", {
                    defaultValue: "नियम और शर्तें",
                  })}
                </Link>
              </li>

              <li>
                <Link
                  to="/support"
                  className="hover:text-cyan-400 transition"
                >
                  {t("footer.support", {
                    defaultValue: "सहायता",
                  })}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-5">
              {t("footer.contact", {
                defaultValue: "संपर्क",
              })}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-cyan-400 shrink-0" />
                <span>support@texverse.in</span>
              </div>

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-cyan-400 shrink-0" />
                <span>+91 9876543210</span>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-cyan-400 mt-1 shrink-0" />
                <span>
                  {t("footer.india", {
                    defaultValue: "भारत",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-800 my-10" />

        {/* Copyright + Tech */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-slate-500 text-sm">
            {t("footer.copyright", {
              defaultValue:
                "© 2026 TEXVERSE. सर्वाधिकार सुरक्षित।",
            })}
          </p>

          <p className="text-slate-500 text-sm">
            {t("footer.builtWith", {
              defaultValue:
                "React • Vite • Tailwind CSS • AI-संचालित मार्केटप्लेस के साथ बनाया गया",
            })}
          </p>
        </div>

        {/* Developer Credit */}
        <div className="mt-6 text-center">
          <p className="text-[10px] sm:text-[11px] text-slate-600 tracking-wide">
            {t("footer.developedBy", {
              defaultValue: "द्वारा विकसित",
            })}{" "}
            <span className="text-slate-500">
              Bhanuday Urmaliya
            </span>{" "}
            <span className="text-slate-700">•</span>{" "}
            {t("footer.fullStackDeveloper", {
              defaultValue: "फुल स्टैक डेवलपर",
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}


import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import marketplaceMockup from "../assets/marketplace-dashboard.webp";
import { useI18n } from "../i18n/i18n";

export default function Hero() {
  const { t } = useI18n();

  const metrics = [
    ["500+", t("home.metrics.supplierListings")],
    ["25K+", t("home.metrics.fabricListings")],
    ["15K+", t("home.metrics.buyerProfiles")],
    ["98%", t("home.metrics.aiMatchTarget")],
  ];

  return (
    <section className="hero-section">
      <div className="hero-grid-lines" />
      <div className="hero-glow glow-one" />
      <div className="hero-glow glow-two" />

      <div className="hero-shell">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="eyebrow">
            <span className="status-dot" />
            {t("home.verifiedNetwork")}
          </div>

          <h1>
            {t("home.sourceSmarter")}
            <br />
            <span>{t("home.tradeBetter")}</span>
          </h1>

          <p className="hero-lead">{t("home.description")}</p>

          <div className="hero-search">
            <Search size={20} />

            <input
              placeholder={t("home.heroSearchPlaceholder")}
              aria-label={t("home.searchTextiles")}
            />

            <Link to="/marketplace" className="search-submit">
              {t("common.search")}
            </Link>
          </div>

          <div className="hero-actions">
            <Link
              to="/marketplace"
              className="primary-button large"
            >
              {t("home.exploreMarketplace")}
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/register"
              className="secondary-button large"
            >
              {t("home.joinAsSupplier")}
            </Link>
          </div>

          <div className="hero-proof">
            <div>
              <ShieldCheck size={17} />
              {t("home.verifiedSuppliers")}
            </div>

            <div>
              <Sparkles size={17} />
              {t("home.aiAssistedSourcing")}
            </div>

            <div>
              <CheckCircle2 size={17} />
              {t("home.quoteReadyProcurement")}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <div className="visual-window">
            <div className="window-bar">
              <span />
              <span />
              <span />

              <b>{t("home.marketplaceIntelligence")}</b>

              <i>{t("home.live")}</i>
            </div>

            <img
              src={marketplaceMockup}
              alt={t("home.marketplaceDashboardAlt")}
            />
          </div>

          <motion.div
            className="floating-card match-card"
            animate={{ y: [0, -7, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
            }}
          >
            <span className="mini-label">
              {t("home.aiMatch")}
            </span>

            <strong>98%</strong>

            <small>{t("home.bestFit")}</small>
          </motion.div>

          <motion.div
            className="floating-card supplier-card"
            animate={{ y: [0, 7, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
            }}
          >
            <div className="supplier-icon">
              <TrendingUp size={17} />
            </div>

            <div>
              <span>
                {t("home.verifiedSupplier")}
              </span>

              <strong>Arvind Mills</strong>
            </div>

            <em>{t("home.readyQuantity")}</em>
          </motion.div>
        </motion.div>
      </div>

      <div className="metrics-shell">
        {metrics.map(([value, label]) => (
          <div className="metric" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


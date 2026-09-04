import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/i18n";

export default function CTA() {
  const { t } = useI18n();

  return (
    <section className="py-24 bg-[#081120]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-4xl overflow-hidden bg-linear-to-r from-blue-700 via-blue-600 to-cyan-500 p-16 text-center shadow-2xl"
        >
          <h2 className="text-5xl font-black text-white">
            {t("home.readyToTransformLineOne")}
            <br />
            {t("home.readyToTransformLineTwo")}
          </h2>

          <p className="mt-6 text-blue-100 max-w-2xl mx-auto text-lg leading-8">
            {t("home.ctaDescription")}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            <Link
              to="/marketplace"
              className="rounded-xl bg-white px-8 py-4 font-bold text-blue-700 hover:scale-105 transition"
            >
              {t("home.exploreMarketplace")}
            </Link>

            <Link
              to="/suppliers"
              className="flex items-center gap-2 rounded-xl border border-white px-8 py-4 font-semibold text-white hover:bg-white hover:text-blue-700 transition"
            >
              {t("home.becomeSupplier")}
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


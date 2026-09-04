import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Truck,
  BadgeDollarSign,
} from "lucide-react";
import { useI18n } from "../i18n/i18n";

export default function WhyChooseUs() {
  const { t } = useI18n();

  const features = [
    {
      icon: <ShieldCheck size={36} />,
      title: t("home.features.verifiedSuppliers.title"),
      desc: t("home.features.verifiedSuppliers.description"),
    },
    {
      icon: <Sparkles size={36} />,
      title: t("home.features.aiDiscovery.title"),
      desc: t("home.features.aiDiscovery.description"),
    },
    {
      icon: <Truck size={36} />,
      title: t("home.features.fastLogistics.title"),
      desc: t("home.features.fastLogistics.description"),
    },
    {
      icon: <BadgeDollarSign size={36} />,
      title: t("home.features.transparentPricing.title"),
      desc: t("home.features.transparentPricing.description"),
    },
  ];

  return (
    <section className="bg-[#081120] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold uppercase tracking-widest">
            {t("home.whyChoose")}
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">
            {t("home.builtForModernBusinesses")}
          </h2>

          <p className="mt-6 text-slate-400 max-w-2xl mx-auto leading-8">
            {t("home.whyChooseDescription")}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-slate-700 bg-[#111827] p-8 shadow-xl hover:border-cyan-500/50"
            >
              <div className="inline-flex rounded-2xl bg-linear-to-r from-blue-600 to-cyan-500 p-4 text-white">
                {item.icon}
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-7">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


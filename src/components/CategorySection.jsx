import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import categories from "../data/categories";
import products from "../data/products";
import { useI18n } from "../i18n/i18n";

const categoryKeyMap = {
  cotton: "categories.cotton",
  denim: "categories.denim",
  silk: "categories.silk",
  linen: "categories.linen",
  polyester: "categories.polyester",
  "custom-fabric": "categories.customFabric",
};

export default function CategorySection() {
  const { t } = useI18n();

  return (
    <section className="bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">
            {t("home.textileCollections")}
          </p>

          <h2 className="text-4xl font-black text-white mt-2">
            {t("home.browseByCategory")}
          </h2>

          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            {t("home.categoryDescription")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const productCount = products.filter(
              (product) => product.category === category.id
            ).length;

            const baseKey =
              categoryKeyMap[category.id];

            const translatedName = baseKey
              ? t(`${baseKey}.name`, {
                  defaultValue: category.name,
                })
              : category.name;

            const translatedDescription = baseKey
              ? t(`${baseKey}.description`, {
                  defaultValue: category.description,
                })
              : category.description;

            return (
              <motion.div
                key={category.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900"
              >
                <img
                  src={category.image}
                  alt={translatedName}
                  className="w-full h-44 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-2xl font-black text-white">
                    {translatedName}
                  </h3>

                  <p className="text-slate-500 text-sm mt-1">
                    {productCount}{" "}
                    {t("home.productsInCatalog")}
                  </p>

                  <p className="mt-3 text-slate-400 text-sm leading-6">
                    {translatedDescription}
                  </p>

                  <Link
                    to={`/marketplace?category=${category.id}`}
                    className="inline-block mt-5 text-cyan-400 font-bold"
                  >
                    {t("common.explore")} →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


import { Star, ShieldCheck, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-lg"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-110"
        />

        {product.verified && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
            <ShieldCheck size={14} />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-cyan-400">{product.category}</p>

        <h3 className="mt-2 text-xl font-bold text-white">
          {product.name}
        </h3>

        <p className="mt-2 text-slate-400">
          {product.supplier}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            ₹{product.price}/m
          </span>

          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={16} fill="currentColor" />
            <span>{product.rating}</span>
          </div>
        </div>

        <div className="mt-5 flex justify-between text-sm text-slate-400">
          <span>MOQ: {product.moq}m</span>
          <span className="flex items-center gap-1">
            <Package size={16} />
            {product.stock}m
          </span>
        </div>

        <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
          Request Quote
        </button>
      </div>
    </motion.div>
  );
}
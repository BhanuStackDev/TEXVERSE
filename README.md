# TEXVERSE Professional

TEXVERSE is an AI-powered textile commerce frontend with marketplace, supplier, buyer, category, cart, checkout, help and product-detail workflows.

## Included in this final build

- Centralized textile product catalog in `src/data/products.js`.
- Category catalog with direct category imagery in `src/data/categories.js`.
- 12 structured textile products with specifications, MOQ, supplier, sample status and best-for data.
- Dedicated **Washing & Care Instructions** on product pages.
- Supplier product creation with care-instruction fields.
- Marketplace search, category filtering and sorting.
- Product detail → quote/cart workflow.
- Buyer, Supplier, Shipping, Payments, Account and TEX AI Help Center pages.
- TEX AI local catalog fallback when the procurement API is unavailable.
- Optimized WebP product/category/dashboard images to reduce frontend asset weight.

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

The project keeps the existing backend, database, Render and Vercel configuration from the supplied archive.

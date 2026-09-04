TEXVERSE 479 CATALOG INTEGRATION

1) Extract this bundle into the TEXVERSE-Final project root and merge/replace the included files.
2) From project root run:

   cd backend
   python -m app.catalog_seed

3) Start FastAPI normally.
4) Verify:
   http://127.0.0.1:8000/products
   http://127.0.0.1:8000/products/categories

The importer is safe-by-default: existing Product rows are never deleted. A same-name row is updated; otherwise the catalog row is inserted. Existing supplier_id values are preserved.

The master catalog itself contains exactly 479 records and 479 image files. Existing legacy products already in the database may remain in addition to the 479 catalog records.

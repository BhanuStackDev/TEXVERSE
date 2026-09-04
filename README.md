# TEXVERSE Professional

> **AI-powered B2B Textile Marketplace**

TEXVERSE Professional is a full-stack B2B textile commerce platform designed to connect **buyers, suppliers, administrators, and logistics operations** in a unified marketplace.

The platform provides textile product discovery, supplier management, product verification, order management, payment workflows, shipment tracking, AI-powered procurement assistance, support services, and role-based dashboards.

---

## 🚀 Core Features

### 👤 Authentication & Authorization

* JWT-based authentication
* User registration and login
* Protected routes
* Role-based access control
* Buyer, Supplier, Admin, and Shipping roles
* Authenticated user profile via `/auth/me`
* Automatic token handling on the frontend
* Unauthorized-session handling

### 🛒 Buyer Marketplace

* Browse textile products
* Product categories and subcategories
* Product details
* MOQ and stock validation
* Add products to cart
* Create orders
* View personal orders
* Order details
* Payment status
* Shipment tracking
* Delivery information
* Supplier and product information
* Buyer negotiations
* AI procurement assistance

### 🏭 Supplier Management

* Supplier dashboard
* Product CRUD operations
* Add, update, and delete products
* Product categories and subcategories
* Product image upload
* Product image deletion
* Stock and MOQ management
* Supplier order management
* Order status updates
* Supplier-side workflows

### 🛡️ Administration

* Admin dashboard
* User management
* Role management
* Product management
* Product verification
* Order management
* Shipment management
* Negotiation management
* Support ticket management
* Platform overview and operational monitoring

### 🚚 Shipping & Logistics

* Shipment creation and management
* Carrier information
* Tracking number
* Shipment status
* Current shipment location
* ETA
* Pickup address
* Delivery address
* Delivery staff information
* Vehicle information
* Shipment notes
* Buyer read-only shipment tracking
* Shipping/Admin operational management

### 💳 Payments

* Server-side payment workflow
* Payment records linked to orders
* Payment status tracking
* Payment verification
* Demo payment mode
* Razorpay integration architecture

> **Demo OTP:** `123456`

Real payment processing requires valid production gateway credentials and production configuration.

### 🤖 AI Procurement Assistant

TEXVERSE includes an AI-assisted procurement workflow designed to help buyers with textile sourcing and purchasing decisions.

The AI layer is integrated with the marketplace backend and can be extended with production AI providers.

### 🎫 Support System

* Human support tickets
* AI-powered assistance
* Ticket management
* Role-based support workflows

### 🔔 Notifications

* User notifications
* Order-related notifications
* Operational notifications
* Backend API integration

### 🌐 Help Center

* Help Center
* English/Hindi language support
* User-oriented platform guidance

---

# 🏗️ Technology Stack

## Frontend

* React
* Vite
* JavaScript
* Modern responsive UI
* Browser Local Storage
* REST API integration

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Passlib
* bcrypt

## Database

* SQLite for local development
* PostgreSQL-ready architecture

## API

RESTful API architecture with role-protected endpoints.

---

# 📁 Project Structure

```text
TEXVERSE-Final/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── assets/
│   └── ...
│
├── .env
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Local Development

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd TEXVERSE-Final
```

## 2. Install frontend dependencies

```bash
npm install
```

## 3. Configure frontend environment

Create:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:8000
```

## 4. Configure backend

Move into the backend directory:

```bash
cd backend
```

Create:

```text
.env
```

Example configuration:

```env
DATABASE_URL=sqlite:///./texverse.db

SECRET_KEY=change-this-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=60

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

FRONTEND_ORIGINS=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

FRONTEND_URL=http://localhost:5173
```

> Never commit real secrets, passwords, API keys, SMTP credentials, or production database credentials to Git.

---

# ▶️ Run the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ▶️ Run the Frontend

From the project root:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔐 Security

TEXVERSE follows a role-based architecture.

### Buyer

Can:

* Browse products
* Create orders
* View own orders
* Track shipments
* Make payment through configured workflow
* Create/view negotiations
* Use AI procurement assistance
* Create support tickets

### Supplier

Can:

* Manage own products
* Upload product images
* Manage inventory
* View supplier orders
* Update order status

### Admin

Can:

* Manage users
* Manage roles
* Verify products
* Manage orders
* Manage shipments
* Manage negotiations
* Manage support operations

### Shipping

Can:

* Manage shipments
* Manage delivery information
* Manage delivery staff
* Manage vehicles
* Update shipment status
* Update tracking information

---

# 🔌 Important API Modules

The backend provides API modules for:

```text
/auth
/products
/orders
/negotiations
/ai
/support
/notifications
/payments
/shipping
/admin
```

Authentication uses:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

# 💾 Database

Development uses SQLite by default:

```env
DATABASE_URL=sqlite:///./texverse.db
```

The application is structured to support PostgreSQL for production deployment.

For production:

```env
DATABASE_URL=<POSTGRESQL_CONNECTION_STRING>
```

---

# 💳 Payment Configuration

TEXVERSE currently supports a demo payment workflow.

For production payment processing, configure:

```env
RAZORPAY_KEY_ID=<YOUR_KEY>
RAZORPAY_KEY_SECRET=<YOUR_SECRET>
```

Do not commit these credentials to GitHub.

---

# 📧 Email Configuration

The backend includes SMTP configuration support.

Example:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<YOUR_EMAIL>
SMTP_PASSWORD=<YOUR_APP_PASSWORD>
EMAIL_FROM=<YOUR_EMAIL>
```

Production email verification requires valid SMTP credentials and production configuration.

---

# 🧪 Build Verification

Frontend production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 📱 Responsive Design

TEXVERSE is designed for:

* Desktop
* Laptop
* Tablet
* Mobile devices

The interface uses responsive layouts across the marketplace, dashboards, product management, order management, and shipping workflows.

---

# 🔄 Application Workflow

```text
Visitor
   │
   ├── Browse Marketplace
   ├── View Products
   └── Login / Register
            │
            ▼
      Authentication
            │
     ┌──────┼────────┐
     ▼      ▼        ▼
   Buyer  Supplier  Admin
     │      │        │
     │      │        └── Platform Management
     │      │
     │      └────────── Product & Order Management
     │
     ├── Product Discovery
     ├── Cart
     ├── Order
     ├── Payment
     ├── Shipment Tracking
     ├── Negotiation
     ├── AI Procurement
     └── Support
            │
            ▼
       Shipping Operations
            │
            ├── Carrier
            ├── Tracking
            ├── Delivery Staff
            └── Vehicle
```

---

# 🌍 Production Deployment

Recommended production architecture:

```text
                    ┌──────────────────┐
                    │   TEXVERSE UI    │
                    │ React + Vite     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   FastAPI API    │
                    │    Backend       │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
        ┌───────────────┐        ┌────────────────┐
        │  PostgreSQL   │        │ External APIs  │
        │   Database    │        │ Payment/Email  │
        └───────────────┘        └────────────────┘
```

Typical deployment options:

* Frontend → Vercel
* Backend → Render / Railway
* Database → PostgreSQL
* Production secrets → Platform environment variables

---

# ⚠️ Production Checklist

Before production deployment:

* [ ] Replace development `SECRET_KEY`
* [ ] Configure PostgreSQL
* [ ] Configure production CORS
* [ ] Configure production frontend URL
* [ ] Configure SMTP
* [ ] Configure production payment gateway
* [ ] Disable demo payment mode
* [ ] Disable demo email verification
* [ ] Configure secure HTTPS
* [ ] Configure production file/image storage
* [ ] Verify database migrations
* [ ] Test authentication and role permissions
* [ ] Test order and payment workflows
* [ ] Test shipment tracking
* [ ] Review server logs
* [ ] Verify environment secrets are not committed

---

# 🔒 Environment & Secrets

The following files should **never** be committed:

```text
.env
backend/.env
*.db
node_modules/
dist/
```

Use `.env.example` to document required configuration without exposing secrets.

---

# 📜 License

This project is currently maintained as a proprietary/custom software project.

License terms can be added before public commercial distribution.

---

# 👨‍💻 Author

**Bhanuday Urmaliya**

**Full Stack Developer**

Developed by Bhanuday Urmaliya • Full Stack Developer

---

## TEXVERSE Professional

**AI-powered textile commerce for modern B2B sourcing.**

Built with React, FastAPI, SQLAlchemy, JWT authentication, and a scalable marketplace architecture.

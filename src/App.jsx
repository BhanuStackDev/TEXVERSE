import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import AIAssistant from "./components/AIAssistant";
import AuthGreetingOverlay from "./components/AuthGreetingOverlay";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";

import BuyerDashboard from "./pages/BuyerDashboard";
import BuyerShippingTracking from "./pages/BuyerShippingTracking";

import SupplierDashboard from "./pages/SupplierDashboard";
import ShippingDashboard from "./pages/ShippingDashboard";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";

import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";

import Categories from "./pages/Categories";
import Suppliers from "./pages/Suppliers";
import About from "./pages/About";
import Help from "./pages/Help";

import BuyerHelp from "./pages/BuyerHelp";
import SupplierHelp from "./pages/SupplierHelp";
import ShippingHelp from "./pages/ShippingHelp";
import PaymentsHelp from "./pages/PaymentsHelp";
import AccountHelp from "./pages/AccountHelp";
import AIHelp from "./pages/AIHelp";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminShipping from "./pages/admin/AdminShipping";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminNegotiationsSupport from "./pages/admin/AdminNegotiationsSupport";

import { authApi } from "./services/api";

import {
  I18nProvider,
} from "./i18n/i18n";


/* =========================================================
   AUTH GUARD
========================================================= */

function Guard({
  children,
  roles,
}) {
  const location =
    useLocation();

  const [
    checking,
    setChecking,
  ] = useState(true);

  const [
    authorized,
    setAuthorized,
  ] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const token =
        localStorage.getItem(
          "texverse_token"
        );

      if (!token) {
        if (mounted) {
          setAuthorized(false);
          setChecking(false);
        }

        return;
      }

      try {
        const user =
          await authApi.me();

        if (!mounted) {
          return;
        }

        localStorage.setItem(
          "texverse_user",
          JSON.stringify(user)
        );

        const currentRole =
          String(
            user?.role || ""
          ).toLowerCase();

        const allowedRoles = (
          roles || []
        ).map((role) =>
          String(
            role
          ).toLowerCase()
        );

        if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(
            currentRole
          )
        ) {
          setAuthorized(false);
        } else {
          setAuthorized(true);
        }
      } catch {
        if (!mounted) {
          return;
        }

        localStorage.removeItem(
          "texverse_token"
        );

        localStorage.removeItem(
          "texverse_user"
        );

        setAuthorized(false);
      } finally {
        if (mounted) {
          setChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [
    location.pathname,
    roles,
  ]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />

          <p className="mt-5 text-lg font-bold">
            Checking authentication...
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Securing TEXVERSE
          </p>

        </div>

      </div>
    );
  }

  if (!authorized) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return children;
}


/* =========================================================
   ROLE ROUTES
========================================================= */

function BuyerRoute({
  children,
}) {
  return (
    <Guard
      roles={[
        "buyer",
      ]}
    >
      {children}
    </Guard>
  );
}


function SupplierRoute({
  children,
}) {
  return (
    <Guard
      roles={[
        "supplier",
      ]}
    >
      {children}
    </Guard>
  );
}


function AdminRoute({
  children,
}) {
  return (
    <Guard
      roles={[
        "admin",
      ]}
    >
      {children}
    </Guard>
  );
}


function ShippingRoute({
  children,
}) {
  return (
    <Guard
      roles={[
        "shipping",
        "admin",
      ]}
    >
      {children}
    </Guard>
  );
}


/* =========================================================
   SHIPPING ENTRY
   Buyer = READ ONLY TRACKING
   Shipping/Admin = FULL CRUD DASHBOARD
========================================================= */

function ShippingEntry() {
  const location =
    useLocation();

  const token =
    localStorage.getItem(
      "texverse_token"
    );

  const [
    user,
    setUser,
  ] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(
          "texverse_user"
        ) || "null"
      );
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let mounted = true;

    async function refreshUser() {
      if (!token) {
        return;
      }

      try {
        const currentUser =
          await authApi.me();

        if (!mounted) {
          return;
        }

        localStorage.setItem(
          "texverse_user",
          JSON.stringify(
            currentUser
          )
        );

        setUser(
          currentUser
        );
      } catch {
        // Guard-like protection below
        // handles invalid sessions.
      }
    }

    refreshUser();

    return () => {
      mounted = false;
    };
  }, [
    token,
  ]);

  const orderId =
    new URLSearchParams(
      location.search
    ).get("order");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role =
    String(
      user?.role || ""
    ).toLowerCase();

  /*
   * Buyer gets ONLY the tracking page
   * when an order ID is supplied.
   */
  if (
    role === "buyer" &&
    orderId
  ) {
    return (
      <BuyerRoute>
        <BuyerShippingTracking />
      </BuyerRoute>
    );
  }

  /*
   * Buyer without an order ID should
   * not enter the shipping management
   * dashboard.
   */
  if (
    role === "buyer" &&
    !orderId
  ) {
    return (
      <Navigate
        to="/buyer"
        replace
      />
    );
  }

  /*
   * Shipping and Admin retain the
   * complete CRUD dashboard.
   */
  if (
    role === "shipping" ||
    role === "admin"
  ) {
    return (
      <ShippingRoute>
        <ShippingDashboard />
      </ShippingRoute>
    );
  }

  /*
   * Unknown/unauthorized role.
   */
  return (
    <Navigate
      to="/login"
      replace
    />
  );
}


/* =========================================================
   APP SHELL
========================================================= */

function AppShell() {
  const location =
    useLocation();

  const publicPages = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/marketplace",
    "/categories",
    "/suppliers",
    "/about",
    "/help",
    "/help/shipping",
    "/help/payments",
    "/help/account",
    "/help/ai",
  ];

  const hideAI =
    location.pathname.startsWith(
      "/admin"
    ) ||
    location.pathname.startsWith(
      "/shipping"
    );

  const isPublicPage =
    publicPages.includes(
      location.pathname
    ) ||
    location.pathname.startsWith(
      "/product/"
    );

  return (
    <>
      <Navbar />

      <AuthGreetingOverlay />

      <Routes>

        {/* =================================================
            PUBLIC
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/reset-password"
          element={
            <ResetPassword />
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerifyEmail />
          }
        />

        <Route
          path="/marketplace"
          element={
            <Marketplace />
          }
        />

        <Route
          path="/categories"
          element={
            <Categories />
          }
        />

        <Route
          path="/suppliers"
          element={
            <Suppliers />
          }
        />

        <Route
          path="/about"
          element={
            <About />
          }
        />

        <Route
          path="/help"
          element={
            <Help />
          }
        />

        <Route
          path="/product/:id"
          element={
            <ProductDetails />
          }
        />


        {/* =================================================
            BUYER
        ================================================= */}

        <Route
          path="/buyer"
          element={
            <BuyerRoute>
              <BuyerDashboard />
            </BuyerRoute>
          }
        />

        <Route
          path="/buyer-dashboard"
          element={
            <Navigate
              to="/buyer"
              replace
            />
          }
        />

        <Route
          path="/cart"
          element={
            <BuyerRoute>
              <Cart />
            </BuyerRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <BuyerRoute>
              <Checkout />
            </BuyerRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <BuyerRoute>
              <Payment />
            </BuyerRoute>
          }
        />

        <Route
          path="/success"
          element={
            <BuyerRoute>
              <OrderSuccess />
            </BuyerRoute>
          }
        />

        <Route
          path="/help/buyer"
          element={
            <BuyerRoute>
              <BuyerHelp />
            </BuyerRoute>
          }
        />


        {/* =================================================
            SUPPLIER
        ================================================= */}

        <Route
          path="/supplier"
          element={
            <SupplierRoute>
              <SupplierDashboard />
            </SupplierRoute>
          }
        />

        <Route
          path="/supplier-dashboard"
          element={
            <Navigate
              to="/supplier"
              replace
            />
          }
        />

        <Route
          path="/help/supplier"
          element={
            <SupplierRoute>
              <SupplierHelp />
            </SupplierRoute>
          }
        />


        {/* =================================================
            SHIPPING
        ================================================= */}

        <Route
          path="/shipping"
          element={
            <ShippingEntry />
          }
        />

        <Route
          path="/shipping-dashboard"
          element={
            <Navigate
              to="/shipping"
              replace
            />
          }
        />

        <Route
          path="/help/shipping"
          element={
            <ShippingHelp />
          }
        />


        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <Navigate
              to="/admin"
              replace
            />
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/shipping"
          element={
            <AdminRoute>
              <AdminShipping />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vehicles"
          element={
            <AdminRoute>
              <AdminVehicles />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/support"
          element={
            <AdminRoute>
              <AdminNegotiationsSupport />
            </AdminRoute>
          }
        />


        {/* =================================================
            HELP
        ================================================= */}

        <Route
          path="/help/payments"
          element={
            <PaymentsHelp />
          }
        />

        <Route
          path="/help/account"
          element={
            <AccountHelp />
          }
        />

        <Route
          path="/help/ai"
          element={
            <AIHelp />
          }
        />


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>


      {!hideAI &&
        isPublicPage && (
          <AIAssistant />
        )}

    </>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </I18nProvider>
  );
}
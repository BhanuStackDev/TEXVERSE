import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  UserPlus,
  ShoppingBag,
  Factory,
  Truck,
} from "lucide-react";

import { authApi } from "../services/api";

import LanguageSelector from "../components/LanguageSelector";

import {
  useI18n,
} from "../i18n/i18n";


export default function Register() {
  const navigate =
    useNavigate();

  const {
    language,
    t,
  } = useI18n();


  const [form, setForm] =
    useState({
      full_name: "",
      company_name: "",
      email: "",
      password: "",
      role: "buyer",
      country: "India",
    });


  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [verification, setVerification] =
    useState(null);


  function change(event) {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  }


  function selectRole(role) {
    setForm(
      (previous) => ({
        ...previous,
        role,
      })
    );

    setError("");
    setVerification(null);
  }


  async function submit(event) {
    event.preventDefault();

    setError("");
    setVerification(null);
    setLoading(true);


    try {
      const allowedRoles = [
        "buyer",
        "supplier",
        "shipping",
      ];


      if (
        !allowedRoles.includes(
          form.role
        )
      ) {
        throw new Error(
          t(
            "auth.invalidAccountType"
          )
        );
      }


      const payload = {
        full_name:
          form.full_name.trim(),

        company_name:
          form.company_name.trim(),

        email:
          form.email.trim(),

        password:
          form.password,

        role:
          form.role,

        country:
          form.country,

        language:
          language,
      };


      const data =
        await authApi.register(
          payload
        );


      /*
       * The backend now sends the
       * verification link by email.
       *
       * We intentionally do NOT display
       * verification_token or
       * verification_url here.
       */

      setVerification({
        success: true,
        message:
          data?.message ||
          t(
            "auth.checkEmail"
          ),
      });

    } catch (err) {
      setError(
        err?.message ||
          t(
            "auth.registrationFailed"
          )
      );
    } finally {
      setLoading(false);
    }
  }


  const roleOptions = [
    {
      value: "buyer",
      title: t(
        "auth.buyer"
      ),
      description: t(
        "auth.buyerDescription"
      ),
      icon: ShoppingBag,
    },

    {
      value: "supplier",
      title: t(
        "auth.supplier"
      ),
      description: t(
        "auth.supplierDescription"
      ),
      icon: Factory,
    },

    {
      value: "shipping",
      title: t(
        "auth.shipping"
      ),
      description: t(
        "auth.shippingDescription"
      ),
      icon: Truck,
    },
  ];


  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-24">

      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >

        {/* HEADER */}

        <div className="flex justify-end">
          <LanguageSelector />
        </div>


        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
          <UserPlus
            size={26}
          />
        </div>


        <h1 className="text-4xl font-bold text-center mt-5">
          {t(
            "auth.createAccount"
          )}
        </h1>


        <p className="text-slate-400 text-center mt-3">
          {t(
            "auth.joinNetwork"
          )}
        </p>


        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 p-3">
            {error}
          </div>
        )}


        {/* VERIFICATION SUCCESS */}

        {verification && (
          <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-5">

            <p className="font-bold text-cyan-300">
              {t(
                "auth.accountCreated"
              )}
            </p>


            <p className="text-sm text-slate-400 mt-2">
              {t(
                "auth.verificationRequired"
              )}
            </p>


            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              {verification.message}
            </p>


            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-cyan-500 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-400"
              >
                {t(
                  "auth.goToLogin"
                )}
              </Link>
            </div>

          </div>
        )}


        {/* BASIC DETAILS */}

        <div className="grid md:grid-cols-2 gap-4 mt-7">

          <input
            required
            name="full_name"
            value={
              form.full_name
            }
            onChange={change}
            placeholder={t(
              "auth.fullName"
            )}
            autoComplete="name"
            className="bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400"
          />


          <input
            name="company_name"
            value={
              form.company_name
            }
            onChange={change}
            placeholder={t(
              "auth.companyName"
            )}
            autoComplete="organization"
            className="bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400"
          />

        </div>


        <input
          required
          type="email"
          name="email"
          value={
            form.email
          }
          onChange={change}
          placeholder={t(
            "auth.businessEmail"
          )}
          autoComplete="email"
          className="mt-4 w-full bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400"
        />


        <input
          required
          minLength={8}
          type="password"
          name="password"
          value={
            form.password
          }
          onChange={change}
          placeholder={t(
            "auth.passwordHint"
          )}
          autoComplete="new-password"
          className="mt-4 w-full bg-slate-800 border border-slate-700 p-4 rounded-xl outline-none focus:border-cyan-400"
        />


        {/* COUNTRY */}

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-bold text-slate-300">Country</span>
          <select
            name="country"
            value={form.country}
            onChange={change}
            autoComplete="country-name"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none focus:border-cyan-400"
          >
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>United Arab Emirates</option>
            <option>Saudi Arabia</option>
            <option>Singapore</option>
            <option>Malaysia</option>
            <option>Australia</option>
            <option>Canada</option>
            <option>Germany</option>
            <option>France</option>
            <option>Italy</option>
            <option>Spain</option>
            <option>Portugal</option>
            <option>Japan</option>
            <option>South Korea</option>
            <option>China</option>
            <option>Russia</option>
            <option>Turkey</option>
            <option>Nepal</option>
            <option>Bangladesh</option>
            <option>Sri Lanka</option>
            <option>Bhutan</option>
            <option>Pakistan</option>
            <option>Indonesia</option>
            <option>Thailand</option>
            <option>Other</option>
          </select>
        </label>

        {/* ACCOUNT TYPE */}

        <div className="mt-7">

          <p className="text-sm font-bold text-slate-300 mb-3">
            {t(
              "auth.accountType"
            )}
          </p>


          <div className="grid md:grid-cols-3 gap-3">

            {roleOptions.map(
              ({
                value,
                title,
                description,
                icon: Icon,
              }) => {

                const selected =
                  form.role ===
                  value;


                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() =>
                      selectRole(
                        value
                      )
                    }
                    className={`text-left p-4 rounded-2xl border transition ${
                      selected
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-slate-700 bg-slate-800 hover:border-slate-600"
                    }`}
                  >

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selected
                          ? "bg-cyan-400/10 text-cyan-300"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      <Icon
                        size={20}
                      />
                    </div>


                    <p
                      className={`mt-3 font-bold ${
                        selected
                          ? "text-cyan-300"
                          : "text-white"
                      }`}
                    >
                      {title}
                    </p>


                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {description}
                    </p>

                  </button>
                );
              }
            )}

          </div>
        </div>


        {/* SELECTED ROLE */}

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3">

          <span className="text-xs text-slate-500">
            {t(
              "auth.selectedAccount"
            )}
            :
          </span>


          <span className="ml-2 text-sm font-bold text-cyan-300 capitalize">
            {t(
              `auth.${form.role}`
            )}
          </span>

        </div>


        {/* SUBMIT */}

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? t(
                "auth.creatingAccount"
              )
            : t(
                "auth.createAccount"
              )}
        </button>


        {/* LOGIN */}

        <p className="text-center text-slate-400 mt-6">

          {t(
            "auth.alreadyRegistered"
          )}

          <Link
            to="/login"
            className="text-cyan-400 ml-1 hover:text-cyan-300"
          >
            {t(
              "common.signIn"
            )}
          </Link>

        </p>

      </form>

    </div>
  );
}


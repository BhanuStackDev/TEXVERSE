import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useI18n,
} from "../i18n/i18n";

const navItems = [
  {
    key: "marketplace",
    path: "/marketplace",
  },
  {
    key: "categories",
    path: "/categories",
  },
  {
    key: "suppliers",
    path: "/suppliers",
  },
  {
    key: "about",
    path: "/about",
  },
  {
    key: "help",
    path: "/help",
  },
];

const dashboardConfig = {
  buyer: {
    path: "/buyer",
  },
  supplier: {
    path: "/supplier",
  },
  admin: {
    path: "/admin",
  },
  shipping: {
    path: "/shipping",
  },
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    language,
    languageInfo,
    languages,
    setLanguage,
    t,
  } = useI18n();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  const [
    languageOpen,
    setLanguageOpen,
  ] = useState(false);

  const [
    mobileLanguageOpen,
    setMobileLanguageOpen,
  ] = useState(false);

  const desktopLanguageRef =
    useRef(null);

  const mobileLanguageRef =
    useRef(null);

  const [
    token,
    setToken,
  ] = useState(() =>
    localStorage.getItem(
      "texverse_token"
    )
  );

  const [
    user,
    setUser,
  ] = useState(() => {
    try {
      const stored =
        localStorage.getItem(
          "texverse_user"
        );

      return stored
        ? JSON.parse(stored)
        : null;
    } catch {
      return null;
    }
  });

  // --------------------------------------------------
  // AUTH SYNC
  // --------------------------------------------------

  useEffect(() => {
    const syncAuth = () => {
      const nextToken =
        localStorage.getItem(
          "texverse_token"
        );

      let nextUser = null;

      try {
        const stored =
          localStorage.getItem(
            "texverse_user"
          );

        nextUser = stored
          ? JSON.parse(stored)
          : null;
      } catch {
        nextUser = null;
      }

      setToken(nextToken);
      setUser(nextUser);
    };

    window.addEventListener(
      "storage",
      syncAuth
    );

    window.addEventListener(
      "texverse-auth-change",
      syncAuth
    );

    return () => {
      window.removeEventListener(
        "storage",
        syncAuth
      );

      window.removeEventListener(
        "texverse-auth-change",
        syncAuth
      );
    };
  }, []);

  // --------------------------------------------------
  // OUTSIDE CLICK / TOUCH
  // --------------------------------------------------

  useEffect(() => {
    const handleOutsidePointer = (
      event
    ) => {
      const target =
        event.target;

      const insideDesktop =
        desktopLanguageRef.current?.contains(
          target
        );

      const insideMobile =
        mobileLanguageRef.current?.contains(
          target
        );

      if (
        !insideDesktop &&
        !insideMobile
      ) {
        setLanguageOpen(false);
        setMobileLanguageOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setMobileLanguageOpen(false);
        setMobileOpen(false);
      }
    };

    /*
     * pointerdown works for:
     * - desktop mouse
     * - mobile touch
     * - Android WebView
     *
     * React onClick handlers remain completely normal.
     * No synthetic click() is used.
     */
    document.addEventListener(
      "pointerdown",
      handleOutsidePointer
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointer
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // --------------------------------------------------
  // ROUTE CHANGE
  // --------------------------------------------------

  useEffect(() => {
    setMobileOpen(false);
    setLanguageOpen(false);
    setMobileLanguageOpen(false);
  }, [location.pathname]);

  // --------------------------------------------------
  // ROLE
  // --------------------------------------------------

  const currentRole = String(
    user?.role || ""
  ).toLowerCase();

  const dashboard =
    dashboardConfig[currentRole];

  // --------------------------------------------------
  // CURRENT LANGUAGE
  // --------------------------------------------------

  const currentLanguage =
    languages.find(
      (item) =>
        item.code === language
    ) ||
    languageInfo ||
    languages[0];

  // --------------------------------------------------
  // LANGUAGE CHANGE
  // --------------------------------------------------

  const handleLanguageChange =
    (nextLanguage) => {
      setLanguage(
        nextLanguage
      );

      setLanguageOpen(false);
      setMobileLanguageOpen(false);
    };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {
    const previousUser = user;

    window.dispatchEvent(
      new CustomEvent(
        "texverse-auth-greeting",
        {
          detail: {
            type: "logout",
            user: previousUser,
          },
        }
      )
    );

    localStorage.removeItem(
      "texverse_token"
    );

    localStorage.removeItem(
      "texverse_user"
    );

    setToken(null);
    setUser(null);

    setMobileOpen(false);
    setLanguageOpen(false);
    setMobileLanguageOpen(false);

    window.dispatchEvent(
      new Event(
        "texverse-auth-change"
      )
    );

    navigate("/", {
      replace: true,
    });
  };

  // --------------------------------------------------
  // NAV LABEL
  // --------------------------------------------------

  const getNavLabel = (key) => {
    return t(
      `common.${key}`
    );
  };

  // --------------------------------------------------
  // WEB + ANDROID TOUCH SAFETY
  // --------------------------------------------------

  const interactiveStyle = {
    touchAction: "manipulation",
    WebkitTapHighlightColor:
      "transparent",
  };

  return (
    <header
      className="relative z-9999 w-full border-b border-slate-800/80 bg-slate-950"
      style={interactiveStyle}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-18 items-center justify-between gap-4">

          {/* =================================================
              BRAND
          ================================================== */}

          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label={t(
              "navigation.home"
            )}
            style={interactiveStyle}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black tracking-tight text-cyan-300 transition group-hover:border-cyan-300/50 group-hover:bg-cyan-400/15">
              TX
            </div>

            <div className="min-w-0">
              <div className="truncate text-base font-black tracking-[0.16em] text-white sm:text-lg">
                TEXVERSE
              </div>

              <div className="hidden truncate text-[10px] font-medium tracking-wide text-slate-500 sm:block">
                {t(
                  "brand.tagline"
                )}
              </div>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label={t(
              "navigation.primary"
            )}
          >
            {navItems.map(
              (item) => {
                const active =
                  location.pathname ===
                  item.path;

                return (
                  <Link
                    key={
                      item.path
                    }
                    to={item.path}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                    style={
                      interactiveStyle
                    }
                  >
                    {getNavLabel(
                      item.key
                    )}
                  </Link>
                );
              }
            )}
          </nav>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================== */}

          <div className="hidden items-center gap-2 xl:flex">

            {/* LANGUAGE */}

            <div
              ref={
                desktopLanguageRef
              }
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setLanguageOpen(
                    (open) =>
                      !open
                  );

                  setMobileLanguageOpen(
                    false
                  );
                }}
                className="flex min-w-36.25 items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:border-slate-500 hover:bg-slate-800"
                style={
                  interactiveStyle
                }
                aria-haspopup="listbox"
                aria-expanded={
                  languageOpen
                }
                title={t(
                  "common.language"
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="text-base leading-none">
                    🌐
                  </span>

                  <span className="truncate">
                    {
                      currentLanguage?.nativeName
                    }
                  </span>
                </span>

                <svg
                  className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                    languageOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-.02 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {languageOpen && (
                <div
                  role="listbox"
                  aria-label={t(
                    "common.language"
                  )}
                  className="absolute right-0 z-10000 mt-2 max-h-105 w-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl shadow-black/50"
                >
                  {languages.map(
                    (item) => {
                      const selected =
                        item.code ===
                        language;

                      return (
                        <button
                          key={
                            item.code
                          }
                          type="button"
                          role="option"
                          aria-selected={
                            selected
                          }
                          onClick={() =>
                            handleLanguageChange(
                              item.code
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                            selected
                              ? "bg-cyan-400/10 text-cyan-300"
                              : "text-slate-200 hover:bg-white/5 hover:text-white"
                          }`}
                          style={
                            interactiveStyle
                          }
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="w-9 shrink-0 text-xs font-semibold uppercase text-slate-500">
                              {
                                item.code
                              }
                            </span>

                            <span className="truncate font-medium">
                              {
                                item.nativeName
                              }
                            </span>
                          </span>

                          {selected && (
                            <svg
                              className="h-4 w-4 shrink-0 text-cyan-300"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.414 0l-3.75-3.75a1 1 0 111.414-1.42l3.043 3.044 6.543-6.544a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* AI SEARCH */}

            <Link
              to="/marketplace"
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/5 hover:text-cyan-300"
              style={
                interactiveStyle
              }
            >
              {t(
                "common.aiSearch"
              )}
            </Link>

            {/* CART */}

            {token &&
              currentRole ===
                "buyer" && (
                <Link
                  to="/cart"
                  className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-white/5 hover:text-white"
                  style={
                    interactiveStyle
                  }
                >
                  {t(
                    "common.cart"
                  )}
                </Link>
              )}

            {/* DASHBOARD */}

            {token && dashboard && (
              <Link
                to={dashboard.path}
                className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-300/50 hover:bg-cyan-400/15"
                style={
                  interactiveStyle
                }
              >
                {t(
                  "common.openDashboard"
                )}
              </Link>
            )}

            {/* AUTH */}

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                  style={
                    interactiveStyle
                  }
                >
                  {t(
                    "common.signIn"
                  )}
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
                  style={
                    interactiveStyle
                  }
                >
                  {t(
                    "common.getStarted"
                  )}
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300"
                style={
                  interactiveStyle
                }
              >
                {t(
                  "common.signOut"
                )}
              </button>
            )}
          </div>

          {/* =================================================
              MOBILE CONTROLS
          ================================================== */}

          <div className="flex items-center gap-2 xl:hidden">

            {/* MOBILE LANGUAGE */}

            <div
              ref={
                mobileLanguageRef
              }
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setMobileLanguageOpen(
                    (open) =>
                      !open
                  );

                  setLanguageOpen(
                    false
                  );
                }}
                className="flex h-10 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm font-semibold text-white transition hover:border-slate-500"
                style={
                  interactiveStyle
                }
                aria-haspopup="listbox"
                aria-expanded={
                  mobileLanguageOpen
                }
                aria-label={t(
                  "common.language"
                )}
              >
                <span>
                  🌐
                </span>

                <span className="max-w-20 truncate">
                  {
                    currentLanguage?.nativeName
                  }
                </span>

                <svg
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    mobileLanguageOpen
                      ? "rotate-180"
                      : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-.02 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {mobileLanguageOpen && (
                <div
                  role="listbox"
                  aria-label={t(
                    "common.language"
                  )}
                  className="absolute right-0 top-12 z-10000 max-h-[70vh] w-64 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl shadow-black/50"
                >
                  {languages.map(
                    (item) => {
                      const selected =
                        item.code ===
                        language;

                      return (
                        <button
                          key={
                            item.code
                          }
                          type="button"
                          role="option"
                          aria-selected={
                            selected
                          }
                          onClick={() =>
                            handleLanguageChange(
                              item.code
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition ${
                            selected
                              ? "bg-cyan-400/10 text-cyan-300"
                              : "text-slate-200 hover:bg-white/5 hover:text-white"
                          }`}
                          style={
                            interactiveStyle
                          }
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <span className="w-9 shrink-0 text-[11px] font-bold uppercase text-slate-500">
                              {
                                item.code
                              }
                            </span>

                            <span className="truncate font-medium">
                              {
                                item.nativeName
                              }
                            </span>
                          </span>

                          {selected && (
                            <svg
                              className="h-4 w-4 shrink-0 text-cyan-300"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 5.29a1 1 0 010 1.42l-7.25 7.25a1 1 0 01-1.414 0l-3.75-3.75a1 1 0 111.414-1.42l3.043 3.044 6.543-6.544a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (open) =>
                    !open
                )
              }
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-slate-200 transition hover:border-slate-500 hover:text-white"
              style={
                interactiveStyle
              }
              aria-label={t(
                "navigation.toggleMenu"
              )}
              aria-expanded={
                mobileOpen
              }
            >
              {mobileOpen ? (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5.25A.75.75 0 013.75 4.5h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 5.25zm0 4.75a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 10zm0 4.75a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 010 1.5H3.75A.75.75 0 013 14.75z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* =================================================
            MOBILE NAVIGATION
        ================================================== */}

        {mobileOpen && (
          <div className="border-t border-slate-800 py-4 xl:hidden">
            <nav
              className="flex flex-col gap-1"
              aria-label={t(
                "navigation.primary"
              )}
            >
              {navItems.map(
                (item) => {
                  const active =
                    location.pathname ===
                    item.path;

                  return (
                    <Link
                      key={
                        item.path
                      }
                      to={item.path}
                      onClick={() =>
                        setMobileOpen(
                          false
                        )
                      }
                      className={`rounded-lg px-3 py-3 text-sm font-medium ${
                        active
                          ? "bg-white/10 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                      style={
                        interactiveStyle
                      }
                    >
                      {getNavLabel(
                        item.key
                      )}
                    </Link>
                  );
                }
              )}
            </nav>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">

              {/* AI SEARCH */}

              <Link
                to="/marketplace"
                onClick={() =>
                  setMobileOpen(
                    false
                  )
                }
                className="rounded-lg border border-slate-700 px-3 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                style={
                  interactiveStyle
                }
              >
                {t(
                  "common.aiSearch"
                )}
              </Link>

              {/* CART */}

              {token &&
                currentRole ===
                  "buyer" && (
                  <Link
                    to="/cart"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="rounded-lg border border-slate-700 px-3 py-3 text-center text-sm font-semibold text-slate-200 hover:bg-white/5 hover:text-white"
                    style={
                      interactiveStyle
                    }
                  >
                    {t(
                      "common.cart"
                    )}
                  </Link>
                )}

              {/* DASHBOARD */}

              {token &&
                dashboard && (
                  <Link
                    to={
                      dashboard.path
                    }
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-3 text-center text-sm font-semibold text-cyan-300"
                    style={
                      interactiveStyle
                    }
                  >
                    {t(
                      "common.openDashboard"
                    )}
                  </Link>
                )}

              {/* AUTH */}

              {!token ? (
                <>
                  <Link
                    to="/login"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="rounded-lg border border-slate-700 px-3 py-3 text-center text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                    style={
                      interactiveStyle
                    }
                  >
                    {t(
                      "common.signIn"
                    )}
                  </Link>

                  <Link
                    to="/register"
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-3 text-center text-sm font-bold text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-400 hover:text-slate-950"
                    style={
                      interactiveStyle
                    }
                  >
                    {t(
                      "common.getStarted"
                    )}
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-3 text-center text-sm font-semibold text-red-300 transition hover:bg-red-400/10"
                  style={
                    interactiveStyle
                  }
                >
                  {t(
                    "common.signOut"
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


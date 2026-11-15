import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import { NAV_ITEMS } from "../../data/adminNavigation";

import { ExternalLink, X, Store, LogOut } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { getSettings } from "../../../services/settingsService";

import useBodyScrollLock from "../../../hooks/useBodyScrollLock";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useBodyScrollLock(isOpen);

  // Store Identity
  const [storeInfo, setStoreInfo] = useState({
    name: "سديم",
    favicon: "",
  });

  // Fetch Store Identity
  useEffect(() => {
    let active = true;

    const loadStoreInfo = async () => {
      try {
        const settings = await getSettings();

        if (!active) return;

        setStoreInfo({
          name: settings.store.name || "سديم",
          favicon: settings.store.favicon || "",
        });
      } catch (error) {
        console.error("Sidebar store settings error:", error);
      }
    };

    loadStoreInfo();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await logout();

      onClose();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      setLogoutError("تعذر تسجيل الخروج. حاول مرة أخرى.");

      setLoggingOut(false);
    }
  };

  return (
    <aside
      className={`
        fixed right-0 top-0 z-100
        flex h-dvh
        w-67.5 flex-col
        border-l border-(--admin-border)
        bg-white
        transition-transform duration-300 ease-in-out
        md:w-57.5 lg:w-65
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* Brand */}
      <div className="flex h-18 shrink-0 items-center justify-between border-b border-(--admin-border) px-5">
        <Link to="/admin" className="flex min-w-0 items-center gap-3">
          {storeInfo.favicon ? (
            <img
              src={storeInfo.favicon}
              alt={`${storeInfo.name} icon`}
              className="h-12 w-12 shrink-0 object-contain"
            />
          ) : (
            <Store
              size={38}
              strokeWidth={1.6}
              className="shrink-0 text-(--admin-primary)"
            />
          )}

          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-bold leading-tight text-[#22252D] sm:text-[17px]">
              {storeInfo.name}
            </h2>

            <span className="mt-1 block text-[10px] leading-tight text-(--admin-text-secondary)">
              لوحة تحكم المتجر
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق القائمة"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--admin-text-secondary) transition-colors hover:bg-gray-100 max-md:flex"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-7">
        <span className="mb-4 block px-2.5 text-[11px] font-medium text-(--admin-text-muted)">
          القائمة الرئيسية
        </span>

        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) => `
                  flex h-11.5 items-center gap-3
                  rounded-xl px-3.25
                  text-xs font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-(--admin-primary-light) font-semibold text-(--admin-primary)"
                      : "text-(--admin-text-secondary) hover:bg-[#f7f8ff] hover:text-(--admin-primary)"
                  }
                `}
              >
                <Icon size={19} strokeWidth={1.8} className="shrink-0" />

                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="shrink-0 border-t border-(--admin-border) p-4">
        {/* Store Link */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2.25 rounded-xl bg-(--admin-primary-light) text-xs font-semibold text-(--admin-primary) transition-colors duration-200 hover:bg-[#e3e7ff]"
        >
          <ExternalLink size={17} />
          <span>عرض المتجر</span>
        </Link>

        {/* Logout Error */}
        {logoutError && (
          <p
            role="alert"
            className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-center text-[11px] text-red-600"
          >
            {logoutError}
          </p>
        )}

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="
            mt-2.5 flex h-11 w-full items-center justify-center gap-2.25
            rounded-xl border border-(--admin-border)
            text-xs font-semibold text-(--admin-text-secondary)
            transition-all duration-200
            hover:border-red-200 hover:bg-red-50 hover:text-red-600
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          {loggingOut ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
              <span>جاري تسجيل الخروج...</span>
            </>
          ) : (
            <>
              <LogOut size={17} />
              <span>تسجيل الخروج</span>
            </>
          )}
        </button>

        {/* System Info */}
        <div className="mt-4.25 flex items-center gap-1.75 text-[10px] text-(--admin-text-muted)">
          <span className="h-1.75 w-1.75 shrink-0 rounded-full bg-(--admin-success)" />

          <span>نظام إدارة {storeInfo.name}</span>

          <span className="font-english mr-auto">v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

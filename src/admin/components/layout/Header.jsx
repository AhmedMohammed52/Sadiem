
import { Menu, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex h-18 shrink-0 items-center justify-between border-b border-(--admin-border) bg-white px-4 md:px-7">
      {/* Right Side */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="فتح القائمة"
          className="hidden h-9.5 w-9.5 items-center justify-center rounded-lg border border-(--admin-border) bg-white text-(--admin-text-primary) transition-colors hover:bg-gray-50 max-md:flex"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-(--admin-text-primary)">
            لوحة التحكم
          </h1>

          <p className="mt-px text-[10px] text-(--admin-text-secondary)">
            إدارة متجر سديم
          </p>
        </div>
      </div>

      {/* Left Side */}
      <div className="flex items-center gap-3.5">
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9.25 items-center justify-center gap-2 rounded-lg border border-(--admin-border) px-3 text-[11px] font-medium text-(--admin-text-secondary) transition-all duration-200 hover:border-(--admin-primary) hover:bg-(--admin-primary-light) hover:text-(--admin-primary) max-[380px]:w-9.25 max-[380px]:px-0"
        >
          <ExternalLink size={16} />
          <span className="max-[380px]:hidden">عرض المتجر</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;

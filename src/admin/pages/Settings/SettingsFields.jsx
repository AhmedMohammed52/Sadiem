export function SettingField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
  dir,
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-xs font-semibold text-[#22252D]">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        dir={dir}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 text-xs text-[#22252D] outline-none transition duration-200 placeholder:text-[#A0A5B1] focus:border-[#4059E8] focus:ring-2 focus:ring-[#EEF0FF]"
      />

      {hint && <p className="text-[10px] leading-5 text-[#777D8A]">{hint}</p>}
    </div>
  );
}

export function SettingTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  dir,
}) {
  return (
    <div className="min-w-0 space-y-1.5">
      <label className="block text-xs font-semibold text-[#22252D]">
        {label}
      </label>

      <textarea
        value={value ?? ""}
        dir={dir}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-[#E9EBF0] bg-white px-3 py-2.5 text-xs leading-6 text-[#22252D] outline-none transition duration-200 placeholder:text-[#A0A5B1] focus:border-[#4059E8] focus:ring-2 focus:ring-[#EEF0FF]"
      />

      {hint && <p className="text-[10px] leading-5 text-[#777D8A]">{hint}</p>}
    </div>
  );
}

export function SettingToggle({ label, description, checked, onChange }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[#E9EBF0] bg-white p-3 transition-colors duration-200 hover:border-[#D8DDF8]">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#22252D]">{label}</p>

        {description && (
          <p className="mt-1 text-[10px] leading-5 text-[#777D8A]">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? "bg-[#4059E8]" : "bg-[#D9DCE5]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
            checked ? "right-4.5" : "right-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsCard({ title, description, children }) {
  return (
    <section className="min-w-0 rounded-xl border border-[#E9EBF0] bg-white p-4 sm:p-5">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-[#22252D]">{title}</h3>

        {description && (
          <p className="mt-1 text-[11px] leading-5 text-[#777D8A]">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

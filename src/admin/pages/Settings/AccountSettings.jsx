import { useState } from "react";
import { LockKeyhole, Eye, EyeOff, UserRound, Mail } from "lucide-react";
import { SettingsCard } from "./SettingsFields";

export default function AccountSettings({ settings, onPasswordSave }) {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const resetPasswordForm = () => {
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
    setPasswordOpen(false);
  };

  const handlePasswordSave = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("كلمة المرور يجب ألا تقل عن 8 أحرف.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      return;
    }

    try {
      setSaving(true);
      await onPasswordSave(password);

      setMessage("تم تغيير كلمة المرور بنجاح.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      setError(err.message || "تعذر تغيير كلمة المرور.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <SettingsCard
        title="بيانات حساب المدير"
        description="بيانات حسابك المسجل في لوحة التحكم."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#22252D]">
              <UserRound size={15} className="text-[#4059E8]" />
              اسم المدير
            </label>
            <div className="flex h-10 items-center rounded-lg border border-[#E9EBF0] bg-[#F8F9FB] px-3 text-sm text-[#777D8A]">
              {settings.account.name || "غير محدد"}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#22252D]">
              <Mail size={15} className="text-[#4059E8]" />
              البريد الإلكتروني
            </label>
            <div
              dir="ltr"
              className="flex h-10 items-center rounded-lg border border-[#E9EBF0] bg-[#F8F9FB] px-3 text-sm text-[#777D8A]"
            >
              {settings.account.email || "غير محدد"}
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-5 text-[#A0A5B1]">
          بيانات الحساب تُقرأ من حساب المصادقة وجدول المديرين، ولا يتم تعديلها
          من إعدادات المتجر.
        </p>
      </SettingsCard>

      <SettingsCard
        title="الأمان وكلمة المرور"
        description="حافظ على أمان لوحة التحكم بتحديث كلمة المرور."
      >
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#E9EBF0] bg-[#FAFAFC] p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF0FF] text-[#4059E8]">
              <LockKeyhole size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#22252D]">
                كلمة المرور
              </p>
              <p className="mt-1 text-[11px] text-[#777D8A]">
                تحديث كلمة مرور حساب المدير
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordOpen((value) => !value);
              setError("");
              setMessage("");
            }}
            className="rounded-lg bg-[#EEF0FF] px-3 py-2 text-xs font-semibold text-[#4059E8] transition hover:bg-[#E1E5FF]"
          >
            {passwordOpen ? "إلغاء" : "تغيير كلمة المرور"}
          </button>
        </div>

        {passwordOpen && (
          <form onSubmit={handlePasswordSave} className="mt-4 space-y-3">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#22252D]">
                كلمة المرور الجديدة
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="8 أحرف على الأقل"
                  className="h-10 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 pl-10 text-sm outline-none transition focus:border-[#4059E8]"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A5B1]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#22252D]">
                تأكيد كلمة المرور
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  placeholder="أعد كتابة كلمة المرور"
                  className="h-10 w-full rounded-lg border border-[#E9EBF0] bg-white px-3 pl-10 text-sm outline-none transition focus:border-[#4059E8]"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A5B1]"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-[#FDECEC] px-3 py-2 text-xs text-[#E05252]">
                {error}
              </p>
            )}

            {message && (
              <p className="rounded-lg bg-[#E8F7F0] px-3 py-2 text-xs text-[#16865B]">
                {message}
              </p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={resetPasswordForm}
                className="rounded-lg border border-[#E9EBF0] px-4 py-2 text-xs font-semibold text-[#777D8A] hover:bg-[#F8F9FB]"
              >
                إغلاق
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#4059E8] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#334BD0] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
              </button>
            </div>
          </form>
        )}
      </SettingsCard>
    </div>
  );
}

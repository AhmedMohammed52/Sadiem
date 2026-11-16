import { useEffect, useState } from "react";

import { defaultSettings } from "../../data/setting";

import {
  getSettings,
  saveSettings,
  getAdminAccount,
  updateAdminPassword,
} from "../../../services/settingsService";

import { getAdminErrorMessage } from "../../utils/errorHandler";
import { useAdminToast } from "../../../context/AdminToastContext";

import SettingsNavigation from "./SettingsNavigation";
import SettingsContent from "./SettingsContent";
import SettingsContentSkeleton from "./SettingsContentSkeleton";
import SettingsActions from "./SettingsActions";
import PageHeader from "../../components/common/PageHeader";

function cloneData(value) {
  return structuredClone(value);
}

function getComparableValue(value) {
  if (typeof File !== "undefined" && value instanceof File) {
    return {
      file: value.name,
      size: value.size,
      modified: value.lastModified,
    };
  }

  if (Array.isArray(value)) {
    return value.map(getComparableValue);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        getComparableValue(item),
      ]),
    );
  }

  return value;
}

export default function Settings() {
  const { showToast } = useAdminToast();

  const [settings, setSettings] = useState(() => cloneData(defaultSettings));

  const [savedSettings, setSavedSettings] = useState(() =>
    cloneData(defaultSettings),
  );

  const [activeSection, setActiveSection] = useState("store");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty =
    JSON.stringify(getComparableValue(settings)) !==
    JSON.stringify(getComparableValue(savedSettings));

  // تحميل بيانات الإعدادات
  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [storeData, accountData] = await Promise.all([
          getSettings(),
          getAdminAccount(),
        ]);

        if (!active) return;

        const loaded = {
          ...cloneData(defaultSettings),
          ...storeData,
          account: accountData,
        };

        setSettings(loaded);
        setSavedSettings(cloneData(loaded));
      } catch (error) {
        if (active) {
          showToast({
            type: "error",
            title: "تعذر تحميل الإعدادات",
            message: getAdminErrorMessage(
              error,
              "حدث خطأ أثناء تحميل إعدادات المتجر. حاول تحديث الصفحة.",
            ),
          });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [showToast]);

  // تحديث الإعدادات
  const update = (section, field, value) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };

  // حفظ التغييرات
  const handleSave = async () => {
    if (!isDirty || saving || loading) return;

    try {
      setSaving(true);

      const updated = await saveSettings(settings, savedSettings);

      const nextSettings = {
        ...settings,
        ...updated,
        account: settings.account,
      };

      setSettings(nextSettings);
      setSavedSettings(cloneData(nextSettings));

      showToast({
        type: "success",
        title: "تم حفظ الإعدادات",
        message: "تم حفظ جميع التعديلات بنجاح.",
      });
    } catch (error) {
      showToast({
        type: "error",
        title: "تعذر حفظ الإعدادات",
        message: getAdminErrorMessage(
          error,
          "حدث خطأ أثناء حفظ الإعدادات. حاول مرة أخرى.",
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  // التراجع عن التعديلات
  const handleReset = () => {
    if (loading || saving) return;

    setSettings(cloneData(savedSettings));
  };

  // تغيير قسم الإعدادات
  const handleSectionChange = (section) => {
    if (loading) return;

    setActiveSection(section);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="الإعدادات"
        description="تحكم في بيانات وإعدادات متجر سديم من مكان واحد."
        status={
          isDirty ? (
            <span className="rounded-lg bg-[#FFF6E5] px-3 py-2 text-[11px] font-semibold text-[#B7791F]">
              لديك تغييرات غير محفوظة
            </span>
          ) : null
        }
      />

      <SettingsNavigation
        activeSection={activeSection}
        onChange={handleSectionChange}
      />

      <main className="min-w-0 space-y-4">
        {loading ? (
          <SettingsContentSkeleton />
        ) : (
          <SettingsContent
            activeSection={activeSection}
            settings={settings}
            update={update}
            onPasswordSave={updateAdminPassword}
          />
        )}

        <SettingsActions
          isDirty={isDirty}
          saving={saving}
          loading={loading}
          onSave={handleSave}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}

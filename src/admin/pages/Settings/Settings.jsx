import { useEffect, useState } from "react";

import {defaultSettings} from "../../data/setting";
import {
  getSettings,
  saveSettings,
  getAdminAccount,
  updateAdminPassword,
} from "../../../services/settingsService";

import SettingsNavigation from "./SettingsNavigation";
import SettingsContent from "./SettingsContent";
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
  const [settings, setSettings] = useState(() => cloneData(defaultSettings));
  const [savedSettings, setSavedSettings] = useState(() =>
    cloneData(defaultSettings),
  );

  const [activeSection, setActiveSection] = useState("store");
  const [saveMessage, setSaveMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty =
    JSON.stringify(getComparableValue(settings)) !==
    JSON.stringify(getComparableValue(savedSettings));

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);

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
        console.error("Settings loading error:", error);

        if (active) {
          setSaveMessage(error.message || "تعذر تحميل إعدادات المتجر.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const update = (section, field, value) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));

    setSaveMessage("");
  };

  const handleSave = async () => {
    if (!isDirty || saving) return;

    try {
      setSaving(true);
      setSaveMessage("");

      const updated = await saveSettings(settings, savedSettings);

      const nextSettings = {
        ...settings,
        ...updated,
        account: settings.account,
      };

      setSettings(nextSettings);
      setSavedSettings(cloneData(nextSettings));
      setSaveMessage("تم حفظ الإعدادات بنجاح.");
    } catch (error) {
      console.error("Settings saving error:", error);

      setSaveMessage(error.message || "تعذر حفظ الإعدادات، حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(cloneData(savedSettings));
    setSaveMessage("");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSaveMessage("");
  };

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#E9EBF0] border-t-[#4059E8]" />
      </div>
    );
  }

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
        <SettingsContent
          activeSection={activeSection}
          settings={settings}
          update={update}
          onPasswordSave={updateAdminPassword}
        />

        <SettingsActions
          isDirty={isDirty}
          saving={saving}
          onSave={handleSave}
          onReset={handleReset}
        />

        {saveMessage && (
          <div
            role="status"
            className={`rounded-lg border px-4 py-3 text-xs font-semibold ${
              saveMessage.includes("بنجاح")
                ? "border-[#D5F0E3] bg-[#E8F7F0] text-[#16865B]"
                : "border-[#FDE7C3] bg-[#FFF6E5] text-[#B7791F]"
            }`}
          >
            {saveMessage}
          </div>
        )}
      </main>
    </div>
  );
}

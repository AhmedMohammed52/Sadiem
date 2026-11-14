import StoreSettings from "./StoreSettings";
import SocialSettings from "./SocialSettings";
import GeneralSettings from "./GeneralSettings";
import AccountSettings from "./AccountSettings";

const COMPONENTS = {
  store: StoreSettings,
  social: SocialSettings,
  general: GeneralSettings,
  account: AccountSettings,
};

export default function SettingsContent({
  activeSection,
  settings,
  update,
  onPasswordSave,
}) {
  const ActiveComponent = COMPONENTS[activeSection];

  if (!ActiveComponent) return null;

  return (
    <div className="min-w-0">
      <ActiveComponent
        settings={settings}
        update={update}
        onPasswordSave={onPasswordSave}
      />
    </div>
  );
}

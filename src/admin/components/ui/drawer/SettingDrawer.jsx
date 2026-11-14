import BaseDrawer from "../../common/Drawer";

export default function SettingDrawer({
  isOpen,
  onClose,
  title = "تعديل البيانات",
  description,
  children,
  footer,
  width = "max-w-xl",
}) {
  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      width={width}
      footer={footer}
    >
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </BaseDrawer>
  );
}

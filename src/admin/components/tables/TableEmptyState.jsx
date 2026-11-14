import { PackageOpen } from "lucide-react";

export default function TableEmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-50 text-pink-500">
        <Icon size={30} />
      </div>

      <h3 className="text-sm font-bold text-[#22252D]">{title}</h3>

      <p className="mt-2 max-w-sm text-xs leading-6 text-[#A0A5B1]">
        {description}
      </p>
    </div>
  );
}

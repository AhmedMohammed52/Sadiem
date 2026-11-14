export default function PageHeader({
  title,
  description,
  eyebrow,
  icon: Icon,
  action,
  status,
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Heading */}
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-(--admin-primary)">
            {Icon && <Icon size={16} />}
            <span>{eyebrow}</span>
          </div>
        )}

        <h1 className="text-xl font-bold leading-8 text-(--admin-text-primary)">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-xs leading-6 text-(--admin-text-secondary)">
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {(action || status) && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {status}
          {action}
        </div>
      )}
    </div>
  );
}

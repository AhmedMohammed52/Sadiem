export default function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none skeleton-shimmer rounded-md ${className}`}
    />
  );
}

export default function BotanicalAccent({ className = "" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 140 200"
      className={`botanical-accent pointer-events-none absolute -z-10 text-blush-deep ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M65 195C72 153 75 126 65 87M70 153C49 141 32 133 22 112M72 137C91 124 108 113 117 94" />
      <path
        d="M70 152C39 152 23 134 22 112C45 115 64 133 70 152ZM72 137C78 113 93 95 117 94C115 119 97 135 72 137Z"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <path d="M65 88C40 92 24 79 29 65C33 56 46 58 57 66C38 49 40 29 53 29C65 29 68 44 67 59C70 37 85 24 94 35C103 47 89 63 76 70C97 59 118 63 116 77C114 91 92 92 76 83C89 98 86 114 74 112C64 110 60 99 65 88Z" />
      <path d="M66 79C48 79 37 72 29 65M66 79C56 60 52 43 53 29M66 79C75 61 85 45 94 35M66 79C89 74 105 75 116 77M66 79C72 91 75 102 74 112" />
      <ellipse
        cx="66"
        cy="79"
        rx="7"
        ry="6"
        fill="currentColor"
        fillOpacity="0.12"
      />
    </svg>
  );
}

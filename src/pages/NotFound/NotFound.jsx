import { Home } from "lucide-react";
import BotanicalAccent from "../../components/ui/BotanicalAccent";

export default function NotFoundPage() {
  return (
    <main
      className="relative flex min-h-[80vh] w-full items-center justify-center px-4 py-20 overflow-hidden bg-background text-foreground"
      dir="rtl"
    >
      <BotanicalAccent className="pointer-events-none absolute top-10 right-10 h-40 w-28 opacity-10 rotate-12" />
      <BotanicalAccent className="pointer-events-none absolute bottom-10 left-10 h-40 w-28 opacity-10 -scale-x-100 -rotate-12" />

      <div className="relative mx-auto max-w-lg text-center px-6 py-12">
        <p className="font-latin text-xs tracking-[0.5em] text-blush-deep uppercase">
          SADIM
        </p>

        <h1 className="font-display mt-3 text-7xl font-bold tracking-tight md:text-8xl">
          404
        </h1>

        <h2 className="font-display mt-4 text-2xl font-semibold md:text-3xl">
          الصفحة غير موجودة
        </h2>

        <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg">
          عذراً، الصفحة التي تبحثين عنها قد تكون انتقلت لمكان آخر أو غير متوفرة
          حالياً.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-base font-semibold text-ink-foreground shadow-sm transition hover:bg-ink/90"
          >
            <Home className="size-4" />
            العودة للرئيسية
          </a>
        </div>
      </div>
    </main>
  );
}

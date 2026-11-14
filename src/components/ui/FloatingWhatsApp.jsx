import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getSettings } from "../../services/settingsService";

export default function FloatingWhatsApp() {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const settings = await getSettings();

        if (isMounted) {
          setPhone(settings.social.whatsapp || "");
        }
      } catch (error) {
        console.error("WhatsApp settings error:", error);
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  // تحويل الرقم لصيغة WhatsApp الصحيحة
  const whatsappNumber = phone.replace(/\D/g, "").replace(/^00/, "");

  const message = encodeURIComponent("مرحباً سديم، عندي استفسار");

  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي معنا عبر واتساب"
      className="fixed bottom-5 left-5 z-30 grid size-13 place-items-center rounded-full bg-whatsapp text-ink-foreground shadow-lg transition hover:scale-105"
    >
      <MessageCircle className="size-6" aria-hidden="true" />
    </a>
  );
}

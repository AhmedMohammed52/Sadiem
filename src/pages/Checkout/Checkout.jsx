import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import DeliveryForm from "./DeliveryForm";
import OrderSummary from "./OrderSummary";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import { createOrder } from "../../services/ordersService";
import { getSettings } from "../../services/settingsService";

// تحويل الرقم إلى صيغة WhatsApp الدولية
function normalizeWhatsAppNumber(value = "") {
  let number = String(value).replace(/\D/g, "");

  if (number.startsWith("00")) {
    number = number.slice(2);
  }

  if (number.startsWith("0")) {
    number = `20${number.slice(1)}`;
  } else if (number.startsWith("1")) {
    number = `20${number}`;
  }

  return number;
}

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  // رقم واتساب المتجر من الباك إند
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    governorate: "",
    city: "",
    address: "",
    notes: "",
  });

  // تحميل إعدادات المتجر
  useEffect(() => {
    let isMounted = true;

    async function loadStoreSettings() {
      try {
        const settings = await getSettings();

        if (isMounted) {
          setWhatsappNumber(
            normalizeWhatsAppNumber(settings.social?.whatsapp || ""),
          );
        }
      } catch (error) {
        console.error("Checkout settings error:", error);
      } finally {
        if (isMounted) {
          setIsSettingsLoading(false);
        }
      }
    }

    loadStoreSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      const updated = { ...prev };

      if (name === "phone") {
        const cleanPhone = value.replace(/[\s-]/g, "");
        const phonePattern = /^(?:(?:\+20|0020)|0)?1[0125]\d{8}$/;

        if (!value.trim()) {
          updated.phone = "رقم الموبايل مطلوب";
        } else if (!phonePattern.test(cleanPhone)) {
          updated.phone = "رقم الموبايل غير صحيح";
        } else {
          delete updated.phone;
        }
      } else if (!value.trim() && name !== "notes") {
        updated[name] = "هذا الحقل مطلوب";
      } else {
        delete updated[name];
      }

      return updated;
    });

    setSubmitError("");
  };

  const handleUpdateQuantity = (id, delta) => {
    if (delta > 0) {
      increaseQuantity(id);
    } else {
      decreaseQuantity(id);
    }
  };

  const unavailableItems = cart.filter((item) => item.isOutOfStock);

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      ["name", "الاسم مطلوب"],
      ["phone", "رقم الموبايل مطلوب"],
      ["governorate", "اختاري المحافظة"],
      ["city", "المدينة أو المنطقة مطلوبة"],
      ["address", "العنوان بالتفصيل مطلوب"],
    ];

    requiredFields.forEach(([field, message]) => {
      if (!String(formData[field] || "").trim()) {
        newErrors[field] = message;
      }
    });

    const cleanPhone = formData.phone.replace(/[\s-]/g, "");
    const phonePattern = /^(?:(?:\+20|0020)|0)?1[0125]\d{8}$/;

    if (formData.phone.trim() && !phonePattern.test(cleanPhone)) {
      newErrors.phone = "رقم الموبايل غير صحيح، أدخلي رقمًا مصريًا صحيحًا";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    if (!cart.length) {
      setSubmitError("الشنطة فارغة، أضيفي منتجات أولًا.");
      return;
    }

    if (unavailableItems.length) {
      setSubmitError(
        "بعض المنتجات غير متاحة حاليًا. احذفيها من الشنطة للمتابعة.",
      );
      return;
    }

    // التأكد من تحميل رقم واتساب المتجر
    if (isSettingsLoading) {
      setSubmitError("جاري تحميل إعدادات المتجر، حاولي مرة أخرى بعد لحظات.");
      return;
    }

    if (!whatsappNumber) {
      setSubmitError(
        "رقم واتساب المتجر غير متوفر. يرجى مراجعة إعدادات التواصل.",
      );
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, "");

    // فتح نافذة واتساب قبل الحفظ لتجنب منع Popup
    const whatsappWindow = window.open("about:blank", "_blank");

    setIsSubmitting(true);

    try {
      // تسجيل الطلب في قاعدة البيانات
      const order = await createOrder(
        {
          customer_name: formData.name.trim(),
          phone: cleanPhone,
          governorate: formData.governorate,
          city: formData.city.trim(),
          address: formData.address.trim(),
          notes: formData.notes.trim(),
          subtotal: cartTotal,
          discount: 0,
          payment_method: "cod",
        },
        cart,
      );

      // تجهيز تفاصيل المنتجات
      const itemsText = cart
        .map(
          (item) =>
            `• ${item.name}\n  الكمية: ${item.quantity}\n  السعر: ${(item.price * item.quantity).toLocaleString("ar-EG")} ج.م`,
        )
        .join("\n\n");

      // تجهيز رسالة واتساب
      const message = `مرحباً سديم ✨، أرغب في تأكيد طلبي:

*رقم الطلب:* #${order.order_number}

*تفاصيل الطلب:*

${itemsText}

--------------------
*إجمالي المنتجات:* ${cartTotal.toLocaleString("ar-EG")} ج.م
*الشحن:* يتم تحديده عبر واتساب
*طريقة الدفع:* الدفع عند الاستلام

*بيانات التوصيل:*
- الاسم: ${formData.name.trim()}
- الموبايل: ${cleanPhone}
- المحافظة: ${formData.governorate}
- المدينة/المنطقة: ${formData.city.trim()}
- العنوان: ${formData.address.trim()}
${formData.notes.trim() ? `- ملاحظات: ${formData.notes.trim()}` : ""}`;

      // استخدام رقم واتساب الموجود في إعدادات المتجر
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      if (whatsappWindow) {
        whatsappWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      if (whatsappWindow) whatsappWindow.close();

      console.error("Create order error:", error);

      setSubmitError(
        error.message || "حدث خطأ أثناء تسجيل الطلب. من فضلك حاولي مرة أخرى.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // حالة الشنطة الفارغة
  if (!cart.length) {
    return (
      <main dir="rtl" className="mx-auto max-w-6xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto mb-5 size-12 text-muted-foreground" />

        <h1 className="font-display text-2xl font-bold">شنطتك فارغة</h1>

        <p className="mt-3 text-muted-foreground">
          أضيفي بعض المنتجات إلى شنطتك قبل إتمام الطلب.
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-ink px-8 text-sm font-semibold text-ink-foreground transition hover:opacity-90"
        >
          تصفحي المنتجات
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-7 md:px-8 md:py-10" dir="rtl">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 inline-flex h-9 items-center gap-2 text-sm font-medium transition-colors hover:text-blush-deep"
      >
        <ArrowRight className="size-4" />
        العودة للشنطة
      </button>

      <h1 className="font-display text-3xl font-bold md:text-4xl">
        إتمام الطلب
      </h1>

      <p className="mt-2 text-muted-foreground">
        كمّلي بياناتك لتأكيد طلبك من سديم
      </p>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mt-7 grid min-w-0 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]"
      >
        <div className="min-w-0 space-y-4">
          <DeliveryForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            >
              <span className="text-base">⚠</span>
              <p>{submitError}</p>
            </div>
          )}
        </div>

        <OrderSummary
          cartItems={cart}
          subtotal={cartTotal}
          onUpdateQuantity={handleUpdateQuantity}
          onRemove={removeFromCart}
          hasUnavailableItems={unavailableItems.length > 0}
          isSubmitting={isSubmitting}
        />
      </form>
    </main>
  );
}

export const getAdminErrorMessage = (error, fallback) => {
  const code = error?.code;
  const message = (error?.message || "").toLowerCase();

  // Network Errors
  if (
    message.includes("failed to fetch") ||
    message.includes("network") ||
    message.includes("fetch")
  ) {
    return "تعذر الاتصال بالإنترنت. تأكد من اتصالك وحاول مرة أخرى.";
  }

  // Permission Errors
  if (code === "42501" || message.includes("permission denied")) {
    return "ليس لديك صلاحية لتنفيذ هذا الإجراء. يرجى مراجعة صلاحيات الحساب.";
  }

  // Duplicate Data
  if (code === "23505") {
    return "هذه البيانات موجودة بالفعل. تحقق من البيانات المدخلة.";
  }

  // Foreign Key Violation
  if (code === "23503") {
    return "لا يمكن تنفيذ العملية بسبب ارتباط البيانات بسجلات أخرى.";
  }

  // Check Constraint
  if (code === "23514") {
    return "البيانات المدخلة غير مطابقة للشروط المطلوبة.";
  }

  // Record Not Found
  if (code === "PGRST116") {
    return "تعذر العثور على البيانات المطلوبة. ربما تم حذفها.";
  }

  // Authentication Errors
  if (
    message.includes("jwt") ||
    message.includes("token") ||
    message.includes("expired")
  ) {
    return "انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.";
  }

  return fallback || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
};

import { supabase } from "../lib/supabase";

const SETTINGS_TABLE = "store_settings";
const STORAGE_BUCKET = "store-assets";

const DEFAULT_SOCIAL = {
  facebook: "",
  instagram: "",
  tiktok: "",
  whatsapp: "",
};

const DEFAULT_GENERAL = {
  productsPerPage: 12,
  defaultSort: "default",
};

function mapStoreSettings(row) {
  return {
    id: row.id,
    store: {
      name: row.name || "",
      tagline: row.tagline || "",
      description: row.description || "",
      phone: row.phone || "",
      email: row.email || "",
      logo: row.logo_url || "",
      favicon: row.favicon_url || "",
    },
    social: {
      ...DEFAULT_SOCIAL,
      ...(row.social_links || {}),
    },
    general: {
      ...DEFAULT_GENERAL,
      ...(row.general_settings || {}),
    },
  };
}

export async function getSettings() {
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new Error("لم يتم العثور على سجل إعدادات المتجر.");
  }

  return mapStoreSettings(data);
}

function isFile(value) {
  return typeof File !== "undefined" && value instanceof File;
}

function getStoragePath(publicUrl) {
  if (!publicUrl) return null;

  try {
    const url = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const index = url.pathname.indexOf(marker);

    if (index === -1) return null;

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

async function uploadAsset(file, type) {
  if (!isFile(file)) return file || "";

  const extension = file.name.split(".").pop()?.toLowerCase() || "png";
  const filePath = `store/${type}-${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);

  return {
    url: data.publicUrl,
    path: filePath,
  };
}

async function removeUploadedFiles(paths) {
  const validPaths = paths.filter(Boolean);

  if (!validPaths.length) return;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .remove(validPaths);

  if (error) {
    console.error("Storage cleanup error:", error);
  }
}

export async function saveSettings(settings, savedSettings) {
  const uploadedPaths = [];

  try {
    let logoUrl = settings.store.logo || "";
    let faviconUrl = settings.store.favicon || "";

    if (isFile(settings.store.logo)) {
      const uploaded = await uploadAsset(settings.store.logo, "logo");
      logoUrl = uploaded.url;
      uploadedPaths.push(uploaded.path);
    }

    if (isFile(settings.store.favicon)) {
      const uploaded = await uploadAsset(settings.store.favicon, "favicon");
      faviconUrl = uploaded.url;
      uploadedPaths.push(uploaded.path);
    }

    const payload = {
      name: settings.store.name.trim(),
      tagline: settings.store.tagline.trim(),
      description: settings.store.description.trim(),
      phone: settings.store.phone.trim(),
      email: settings.store.email.trim(),
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      social_links: {
        ...DEFAULT_SOCIAL,
        ...settings.social,
      },
      general_settings: {
        ...DEFAULT_GENERAL,
        ...settings.general,
      },
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from(SETTINGS_TABLE)
      .update(payload)
      .eq("id", settings.id)
      .select("*")
      .single();

    if (error) throw error;

    const oldLogoPath = getStoragePath(savedSettings.store.logo);
    const oldFaviconPath = getStoragePath(savedSettings.store.favicon);

    const pathsToRemove = [];

    if (oldLogoPath && oldLogoPath !== getStoragePath(logoUrl)) {
      pathsToRemove.push(oldLogoPath);
    }

    if (oldFaviconPath && oldFaviconPath !== getStoragePath(faviconUrl)) {
      pathsToRemove.push(oldFaviconPath);
    }

    await removeUploadedFiles(pathsToRemove);

    return mapStoreSettings(data);
  } catch (error) {
    await removeUploadedFiles(uploadedPaths);
    throw error;
  }
}

export async function getAdminAccount() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("يجب تسجيل الدخول أولًا.");

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  return {
    name: data?.full_name || "",
    email: user.email || "",
  };
}

export async function updateAdminPassword(password) {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) throw error;

  return true;
}

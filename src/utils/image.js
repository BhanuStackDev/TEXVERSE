const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export function getImageUrl(image) {
  if (!image) {
    return "";
  }

  const value = String(image).trim();

  if (!value) {
    return "";
  }

  // Already an absolute URL
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  // Data/blob URLs
  if (
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  // Normalize Windows/backslash paths
  const normalized = value
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");

  // Backend upload paths
  if (normalized.startsWith("uploads/")) {
    return `${API_URL}/${normalized}`;
  }

  // /uploads/... form
  if (normalized.startsWith("upload/")) {
    return `${API_URL}/${normalized}`;
  }

  // If backend already returned a root-relative path
  if (value.startsWith("/")) {
    return `${API_URL}${value}`;
  }

  // Plain filename/path
  return `${API_URL}/${normalized}`;
}

export default getImageUrl;
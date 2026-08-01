/**
 * Converts a payload to FormData only when it contains a File (or an array
 * with one) — otherwise returns the plain object so axios sends normal JSON.
 * Only ProductColor create/update ever needs this (image uploads).
 */
export function buildFormData<T extends Record<string, any>>(payload: T): FormData | T {
  const hasFile = Object.values(payload).some(
    (v) => v instanceof File || (Array.isArray(v) && v.some((i) => i instanceof File))
  );
  if (!hasFile) return payload;

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) formData.append(key, item);
        else if (typeof item === "object") formData.append(`${key}_existing`, JSON.stringify(item));
        else formData.append(key, String(item));
      });
    } else if (value instanceof File) {
      formData.append(key, value);
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
}

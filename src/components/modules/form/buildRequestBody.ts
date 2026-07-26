/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Detects whether any field in the payload is a File (or contains one in an array),
 * and switches transport accordingly:
 *  - No files  -> returns the plain object (RTK Query sends it as JSON, as usual)
 *  - Has files -> returns a FormData instance for Multer's multipart/form-data parser
 *
 * This means a single mutation/endpoint works whether or not the form includes an
 * image-upload field — the caller (dialog/component) never needs to know or care.
 */

function containsFile(value: unknown): boolean {
  if (value instanceof File) return true
  if (Array.isArray(value)) return value.some((v) => v instanceof File)
  return false
}

export function buildRequestBody<T extends Record<string, any>>(
  data: T
): FormData | T {
  const hasFile = Object.values(data).some(containsFile)
  if (!hasFile) return data

  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          // Multer reads these as req.files under this field name
          formData.append(key, item)
        } else if (typeof item === "object") {
          // e.g. an existing { url, id } image the user chose to keep — sent alongside
          // new files so the backend knows the final image list (kept + newly uploaded)
          formData.append(`${key}_existing`, JSON.stringify(item))
        } else {
          formData.append(key, String(item))
        }
      })
    } else if (value instanceof File) {
      formData.append(key, value)
    } else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, String(value))
    }
  }

  return formData
}

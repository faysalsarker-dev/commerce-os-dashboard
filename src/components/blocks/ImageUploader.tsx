"use client";

import * as React from "react";
import { ImagePlus, UploadCloud, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface ImageUploaderResult {
  /** Newly selected files, not yet uploaded to your backend */
  files: File[];
  /** Existing image URLs still kept (edit-mode) */
  existingUrls: string[];
  /** Existing image URLs the user removed — tell your backend to delete these */
  removedUrls: string[];
  isEmpty: boolean;
}

type UploaderItem =
  | { kind: "new"; id: string; file: File; previewUrl: string }
  | { kind: "existing"; id: string; url: string };

export interface ImageUploaderProps {
  /** Max number of images. Ignored if `unlimited` is true. Default: 1 */
  maxImages?: number;
  /** No upper limit on image count. Default: false */
  unlimited?: boolean;
  /** Existing image URLs — pass when editing a record that already has images */
  existingImages?: string[];
  /** Accept attribute for the file input. Default: "image/*" */
  accept?: string;
  /** Max size per file in MB. Default: 5 */
  maxSizeMB?: number;
  disabled?: boolean;
  className?: string;
  /** Fires on every change with the full current selection */
  onChange?: (result: ImageUploaderResult) => void;
  label?: string;
  helperText?: string;
}

let uid = 0;
const nextId = () => `img_${Date.now()}_${uid++}`;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ============================================================================
// FormData helper — build a multipart payload straight from the result
// ============================================================================

export function imagesToFormData(
  result: ImageUploaderResult,
  options?: {
    /** field name for new files. Default: "images" */
    fileField?: string;
    /** field name for kept existing urls. Default: "existingImages" */
    existingField?: string;
    /** field name for removed existing urls. Default: "removedImages" */
    removedField?: string;
    extra?: Record<string, string | Blob>;
  }
): FormData {
  const {
    fileField = "images",
    existingField = "existingImages",
    removedField = "removedImages",
    extra,
  } = options ?? {};

  const fd = new FormData();
  result.files.forEach((file) => fd.append(fileField, file));
  result.existingUrls.forEach((url) => fd.append(existingField, url));
  result.removedUrls.forEach((url) => fd.append(removedField, url));
  if (extra) Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
  return fd;
}

// ============================================================================
// Component
// ============================================================================

export function ImageUploader({
  maxImages = 1,
  unlimited = false,
  existingImages = [],
  accept = "image/*",
  maxSizeMB = 5,
  disabled = false,
  className,
  onChange,
  label,
  helperText,
}: ImageUploaderProps) {
  const limit = unlimited ? Infinity : Math.max(1, maxImages);
  const multiple = limit > 1;

  const [items, setItems] = React.useState<UploaderItem[]>(() =>
    existingImages.map((url) => ({ kind: "existing", id: nextId(), url }))
  );
  const [removedUrls, setRemovedUrls] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const emitChange = React.useCallback(
    (next: UploaderItem[], nextRemoved: string[]) => {
      const files = next
        .filter((i): i is Extract<UploaderItem, { kind: "new" }> => i.kind === "new")
        .map((i) => i.file);
      const existingUrls = next
        .filter((i): i is Extract<UploaderItem, { kind: "existing" }> => i.kind === "existing")
        .map((i) => i.url);
      onChange?.({
        files,
        existingUrls,
        removedUrls: nextRemoved,
        isEmpty: files.length === 0 && existingUrls.length === 0,
      });
    },
    [onChange]
  );

  const addFiles = (fileList: FileList | File[]) => {
    if (disabled) return;
    setError(null);
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith("image/"));

    if (incoming.length === 0) {
      setError("Only image files are allowed.");
      return;
    }
    const tooLarge = incoming.find((f) => f.size > maxSizeMB * 1024 * 1024);
    if (tooLarge) {
      setError(`"${tooLarge.name}" exceeds the ${maxSizeMB}MB limit.`);
      return;
    }

    setItems((prev) => {
      // single mode: always replace whatever is there
      if (!multiple) {
        prev.forEach((i) => i.kind === "new" && URL.revokeObjectURL(i.previewUrl));
        const file = incoming[0];
        const next: UploaderItem[] = [
          { kind: "new", id: nextId(), file, previewUrl: URL.createObjectURL(file) },
        ];
        emitChange(next, removedUrls);
        return next;
      }

      const room = limit - prev.length;
      if (room <= 0) {
        setError(`You can only upload ${limit} image${limit > 1 ? "s" : ""}.`);
        return prev;
      }
      const accepted = incoming.slice(0, room);
      const newItems: UploaderItem[] = accepted.map((file) => ({
        kind: "new",
        id: nextId(),
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      const next = [...prev, ...newItems];
      emitChange(next, removedUrls);
      return next;
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;
      let nextRemoved = removedUrls;
      if (target.kind === "existing") {
        nextRemoved = [...removedUrls, target.url];
        setRemovedUrls(nextRemoved);
      } else {
        URL.revokeObjectURL(target.previewUrl);
      }
      const next = prev.filter((i) => i.id !== id);
      emitChange(next, nextRemoved);
      return next;
    });
  };

  // revoke any remaining object URLs on unmount
  React.useEffect(() => {
    return () => {
      items.forEach((i) => i.kind === "new" && URL.revokeObjectURL(i.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canAddMore = items.length < limit;
  const remaining = unlimited ? null : limit - items.length;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const openBrowser = () => {
    if (!disabled && canAddMore) inputRef.current?.click();
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {!multiple ? (
        // ---- Single-image mode: one tile that is both dropzone and preview ----
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={openBrowser}
          className={cn(
            "group relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed bg-muted/30 transition-colors",
            isDragging && "border-primary bg-primary/5",
            disabled && "cursor-not-allowed opacity-60",
            !items.length && !disabled && "hover:border-primary/50 hover:bg-muted/50"
          )}
        >
          {items[0] ? (
            <>
              <img
                src={items[0].kind === "new" ? items[0].previewUrl : items[0].url}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(items[0].id);
                }}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm ring-1 ring-border transition-opacity hover:bg-background"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                <span className="text-xs font-medium text-white">Replace</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 px-3 text-center">
              <UploadCloud className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{label ?? "Upload image"}</span>
            </div>
          )}
        </div>
      ) : (
        // ---- Multi-image mode: dropzone + grid of previews ----
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled && canAddMore) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={openBrowser}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
              canAddMore && !disabled && "cursor-pointer hover:border-primary/50 hover:bg-muted/30",
              isDragging && "border-primary bg-primary/5",
              !canAddMore && "opacity-50",
              disabled && "cursor-not-allowed opacity-60"
            )}
          >
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {label ?? "Drag & drop images, or click to browse"}
              </p>
              <p className="text-xs text-muted-foreground">
                {helperText ??
                  `Up to ${maxSizeMB}MB per image${
                    unlimited ? "" : ` · ${remaining} of ${limit} remaining`
                  }`}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-muted/30"
                >
                  <img
                    src={item.kind === "new" ? item.previewUrl : item.url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm ring-1 ring-border transition-opacity group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {item.kind === "new" && (
                    <span className="absolute bottom-1 left-1 rounded bg-background/90 px-1 py-0.5 text-[10px] text-muted-foreground ring-1 ring-border">
                      {formatBytes(item.file.size)}
                    </span>
                  )}
                </div>
              ))}
              {canAddMore && (
                <button
                  type="button"
                  onClick={openBrowser}
                  disabled={disabled}
                  className="flex aspect-square items-center justify-center rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Add more images"
                >
                  <ImagePlus className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
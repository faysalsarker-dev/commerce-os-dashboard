import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface UploaderItem {
  /** Stable key */
  id: string;
  /** Preview URL (remote URL or object URL) */
  url: string;
  /** Present only for newly-picked files */
  file?: File;
}

export interface ImageUploaderProps {
  value: UploaderItem[];
  onChange: (items: UploaderItem[]) => void;
  max?: number;
  maxSizeMb?: number;
  accept?: string;
  disabled?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

const uid = () => `img_${Math.random().toString(36).slice(2, 10)}`;

export function fileToItem(file: File): UploaderItem {
  return { id: uid(), url: URL.createObjectURL(file), file };
}

export function urlToItem(url: string): UploaderItem {
  return { id: uid(), url };
}

/**
 * Reusable multi-image uploader.
 * Holds both already-uploaded URLs and freshly picked Files so the parent can
 * build a multipart/form-data payload (multer-friendly) on submit.
 */
export function ImageUploader({
  value,
  onChange,
  max = 8,
  maxSizeMb = 5,
  accept = "image/png,image/jpeg,image/webp,image/avif",
  disabled,
  label = "Images",
  hint,
  className,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createdUrls = useRef<string[]>([]);

  useEffect(
    () => () => {
      createdUrls.current.forEach((u) => URL.revokeObjectURL(u));
    },
    [],
  );

  const remaining = max - value.length;

  const addFiles = useCallback(
    (fileList: FileList | File[] | null) => {
      if (!fileList) return;
      const files = Array.from(fileList);
      if (!files.length) return;

      const accepted: UploaderItem[] = [];
      let message: string | null = null;

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          message = "Only image files are allowed.";
          continue;
        }
        if (file.size > maxSizeMb * 1024 * 1024) {
          message = `Each image must be ${maxSizeMb}MB or smaller.`;
          continue;
        }
        if (accepted.length >= remaining) {
          message = `You can upload up to ${max} images.`;
          break;
        }
        const item = fileToItem(file);
        createdUrls.current.push(item.url);
        accepted.push(item);
      }

      setError(message);
      if (accepted.length) onChange([...value, ...accepted]);
    },
    [max, maxSizeMb, onChange, remaining, value],
  );

  const removeAt = (id: string) => {
    setError(null);
    onChange(value.filter((item) => item.id !== id));
  };

  const canAdd = !disabled && remaining > 0;
  const helper = useMemo(
    () => hint ?? `PNG, JPG, WEBP or AVIF · up to ${maxSizeMb}MB each · ${value.length}/${max} added`,
    [hint, max, maxSizeMb, value.length],
  );

  return (
    <div className={cn("space-y-3", className)}>
      {label ? (
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="numeric text-xs text-muted-foreground">
            {value.length}/{max}
          </span>
        </div>
      ) : null}

      <div
        role="button"
        tabIndex={canAdd ? 0 : -1}
        aria-disabled={!canAdd}
        onClick={() => canAdd && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (!canAdd) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          if (!canAdd) return;
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (canAdd) addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface/40 px-4 py-6 text-center transition-colors",
          canAdd && "cursor-pointer hover:border-ring hover:bg-accent/40",
          dragging && "border-ring bg-accent/60",
          !canAdd && "cursor-not-allowed opacity-60",
        )}
      >
        <span className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
          <UploadCloud className="size-4" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {remaining > 0 ? "Drop images or click to browse" : "Image limit reached"}
        </span>
        <span className="text-xs text-muted-foreground">{helper}</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="sr-only"
        disabled={!canAdd}
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}

      {value.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((item, index) => (
            <li
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-md border border-border bg-muted"
            >
              <img
                src={item.url}
                alt={`Upload ${index + 1}`}
                loading="lazy"
                className="size-full object-cover"
              />
              {index === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-foreground/80 px-1.5 py-0.5 text-[10px] font-medium text-background">
                  Cover
                </span>
              ) : null}
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                disabled={disabled}
                onClick={() => removeAt(item.id)}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-md bg-background/90 text-muted-foreground opacity-0 shadow-card transition group-hover:opacity-100 focus-visible:opacity-100 hover:text-destructive"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
          {canAdd ? (
            <li>
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                className="size-full aspect-square h-auto flex-col gap-1 border-dashed text-muted-foreground"
              >
                <ImagePlus className="size-4" />
                <span className="text-xs">Add</span>
              </Button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}

export function UploaderPending() {
  return <Loader2 className="animate-spin" />;
}

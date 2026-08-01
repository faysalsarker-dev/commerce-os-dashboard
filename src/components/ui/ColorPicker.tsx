import { useRef } from "react";
import { Check, Pipette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PRESETS = [
  "#0A0A0A",
  "#3A3A3E",
  "#8E8E93",
  "#F4F1E8",
  "#FFFFFF",
  "#9EC5E8",
  "#2563EB",
  "#0F766E",
  "#16A34A",
  "#CA8A04",
  "#EA580C",
  "#DC2626",
  "#DB2777",
  "#7C3AED",
  "#78350F",
  "#1E3A5F",
];

const isHex = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  disabled?: boolean;
  className?: string;
}

/** Swatch grid + native eyedropper/colour wheel + hex input. */
export function ColorPicker({ value, onChange, disabled, className }: ColorPickerProps) {
  const nativeRef = useRef<HTMLInputElement>(null);
  const valid = isHex(value);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          aria-label="Open colour picker"
          onClick={() => nativeRef.current?.click()}
          className="relative size-9 shrink-0 overflow-hidden rounded-md border border-border transition hover:border-ring"
          style={{ backgroundColor: valid ? value : undefined }}
        >
          {!valid ? (
            <Pipette className="absolute inset-0 m-auto size-4 text-muted-foreground" />
          ) : null}
        </button>
        <input
          ref={nativeRef}
          type="color"
          tabIndex={-1}
          aria-hidden
          value={valid ? value : "#9EC5E8"}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="pointer-events-none absolute size-0 opacity-0"
        />
        <Input
          className="font-mono uppercase"
          placeholder="#9EC5E8"
          maxLength={7}
          disabled={disabled}
          value={value}
          onChange={(event) => {
            const next = event.target.value.trim();
            onChange(next && !next.startsWith("#") ? `#${next}` : next);
          }}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => {
          const active = valid && value.toUpperCase() === preset;
          return (
            <button
              key={preset}
              type="button"
              disabled={disabled}
              title={preset}
              aria-label={`Use ${preset}`}
              aria-pressed={active}
              onClick={() => onChange(preset)}
              className={cn(
                "flex size-6 items-center justify-center rounded-md border border-border transition hover:scale-110",
                active && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
              style={{ backgroundColor: preset }}
            >
              {active ? (
                <Check
                  className="size-3"
                  style={{ color: preset === "#FFFFFF" || preset === "#F4F1E8" ? "#0A0A0A" : "#FFFFFF" }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

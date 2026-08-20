
import { useCallback, useEffect, useMemo, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { Minus, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface QrLabel {
  barcode: string;
  sku: string;
  size: string;
  colorName: string;
  productName: string;
}

interface QrPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: QrLabel | null;
}

const LABEL_PRESETS = {
  small: { name: "Small", width: 30, height: 20 },
  medium: { name: "Medium", width: 40, height: 25 },
  large: { name: "Large", width: 50, height: 30 },
  custom: { name: "Custom", width: 40, height: 25 },
} as const;

type LabelPreset = keyof typeof LABEL_PRESETS;
const MIN_LABEL_SIZE = 1;
const MAX_LABEL_SIZE = 200;
const MAX_QUANTITY = 1000;

const BARCODE_OPTIONS = {
  format: "CODE128",
  displayValue: false,
  margin: 0,
  width: 1.4,
  height: 48,
} as const;

// Only one code type prints per label — you can't stack a barcode and a
// QR code on the same sticker, so this is a single exclusive choice
// rather than another on/off switch.
type CodeType = "barcode" | "qrcode";

const FIELD_LABELS = {
  name: "Product name",
  codeValue: "Code number (text under barcode/QR)",
  sku: "SKU",
  size: "Size",
} as const;

type FieldKey = keyof typeof FIELD_LABELS;
type FieldVisibility = Record<FieldKey, boolean>;

const DEFAULT_FIELDS: FieldVisibility = { name: true, codeValue: true, sku: true, size: true };

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" };
    return entities[character];
  });

export function QrPreviewDialog({ open, onOpenChange, label }: QrPreviewDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [preset, setPreset] = useState<LabelPreset>("medium");
  const [width, setWidth] = useState<number>(LABEL_PRESETS.medium.width);
  const [height, setHeight] = useState<number>(LABEL_PRESETS.medium.height);
  const [rotate90, setRotate90] = useState<boolean>(true);
  const [codeType, setCodeType] = useState<CodeType>("barcode"); // barcode selected by default, QR is opt-in
  const [fields, setFields] = useState<FieldVisibility>(DEFAULT_FIELDS);
  const [qrPreviewUrl, setQrPreviewUrl] = useState<string | null>(null);

  const toggleField = (key: FieldKey) => setFields((current) => ({ ...current, [key]: !current[key] }));

  const renderBarcode = useCallback(
    (svg: SVGSVGElement | null) => {
      if (!svg || !label?.barcode || codeType !== "barcode") return;

      try {
        JsBarcode(svg, label.barcode, BARCODE_OPTIONS);
      } catch {
        svg.replaceChildren();
      }
    },
    [label, codeType],
  );

  // QR generation is async (the `qrcode` package returns a promise), so it
  // can't be rendered synchronously like the barcode SVG — this effect
  // keeps a data-URL in state for the live preview.
  useEffect(() => {
    if (codeType !== "qrcode" || !label?.barcode) return;
    let cancelled = false;
    QRCode.toDataURL(label.barcode, { margin: 0, width: 240 })
      .then((url) => {
        if (!cancelled) setQrPreviewUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrPreviewUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [codeType, label?.barcode]);

  const dimensionsValid = width >= MIN_LABEL_SIZE && width <= MAX_LABEL_SIZE && height >= MIN_LABEL_SIZE && height <= MAX_LABEL_SIZE;
  const quantityValid = Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY;
  const canPrint = Boolean(label?.barcode) && dimensionsValid && quantityValid;

  // The label PRESET always describes the *content's* natural width x
  // height (how it reads upright). When rotated 90°, the physical page fed
  // into the printer needs its dimensions swapped to match — otherwise a
  // "40 x 25" preset would still print on 40mm-wide stock even though the
  // rotated content is now 25mm wide x 40mm tall.
  const pageWidth = rotate90 ? height : width;
  const pageHeight = rotate90 ? width : height;

  const previewStyle = useMemo(
    () => ({ aspectRatio: `${pageWidth} / ${pageHeight}`, width: `${Math.min(280, Math.max(150, pageWidth * 6))}px` }),
    [pageWidth, pageHeight],
  );

  const updatePreset = (value: LabelPreset) => {
    setPreset(value);
    if (value !== "custom") {
      setWidth(LABEL_PRESETS[value].width);
      setHeight(LABEL_PRESETS[value].height);
    }
  };

  const changeQuantity = (next: number) => setQuantity(Math.max(1, Math.min(MAX_QUANTITY, next)));
  const updateDimension = (setter: (value: number) => void, value: string) => {
    setPreset("custom");
    setter(Number(value));
  };

  const handlePrint = async () => {
    if (!label?.barcode) return toast.error("A barcode value is required before printing.");
    if (!quantityValid) return toast.error(`Enter a whole number between 1 and ${MAX_QUANTITY} labels.`);
    if (!dimensionsValid) return toast.error(`Label width and height must be between ${MIN_LABEL_SIZE} and ${MAX_LABEL_SIZE} mm.`);

    let codeMarkup: string;
    if (codeType === "qrcode") {
      try {
        const qrDataUrl = await QRCode.toDataURL(label.barcode, { margin: 0, width: 480 });
        codeMarkup = `<img src="${qrDataUrl}" alt="QR code for ${escapeHtml(label.barcode)}" />`;
      } catch {
        return toast.error("This value cannot be rendered as a QR code.");
      }
    } else {
      const printBarcode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      printBarcode.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      try {
        JsBarcode(printBarcode, label.barcode, BARCODE_OPTIONS);
      } catch {
        return toast.error("This barcode value cannot be rendered as a barcode.");
      }
      codeMarkup = new XMLSerializer().serializeToString(printBarcode);
    }

    const printWindow = window.open("", "_blank", "width=480,height=640");
    if (!printWindow) return toast.error("The print window was blocked. Allow pop-ups and try again.");

    const productName = escapeHtml(label.productName);
    const sku = escapeHtml(label.sku);
    const size = escapeHtml(label.size);
    const codeValue = escapeHtml(label.barcode);
    const codeBoxClass = codeType === "qrcode" ? "code-box qrcode" : "code-box barcode";

    // Text lines only render when their toggle is on; the code graphic
    // itself always renders since that's the scannable part of the label.
    const labelBody = `
        ${fields.name ? `<div class="product-name">${productName}</div>` : ""}
        <div class="${codeBoxClass}">${codeMarkup}</div>
        ${fields.codeValue ? `<div class="code-value">${codeValue}</div>` : ""}
        ${fields.sku && sku ? `<div class="sku">SKU: ${sku}</div>` : ""}
        ${fields.size && size ? `<div class="size">Size: ${size}</div>` : ""}`;

    const labelClass = rotate90 ? "label rotated" : "label";
    const labels = Array.from({ length: quantity }, () => `<article class="${labelClass}"><div class="label-content">${labelBody}</div></article>`).join("");

    printWindow.document.write(`<!doctype html><html><head><title>Labels</title>
      <style>
        @page { size: ${pageWidth}mm ${pageHeight}mm; margin: 0; }
        * { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; background: #fff; }
        .label {
          width: ${pageWidth}mm; height: ${pageHeight}mm;
          display: flex; align-items: center; justify-content: center; overflow: hidden;
          break-after: page; page-break-after: always; color: #000; font-family: Arial, sans-serif;
        }
        .label:last-child { break-after: auto; page-break-after: auto; }
        .label-content {
          padding: 1.2mm 1.5mm; display: flex; flex-direction: column; align-items: center;
          text-align: center; overflow: hidden;
        }
        /* Normal (unrotated) label: content fills the page's own box. */
        .label:not(.rotated) .label-content { width: 100%; height: 100%; justify-content: center; }
        /* Rotated label: content keeps its natural width x height (how it
           reads upright), then the block is spun 90°. Since the physical
           page is already swapped to height x width above, the rotated
           bounding box fits it exactly. */
        .label.rotated .label-content {
          width: ${width}mm; height: ${height}mm;
          justify-content: center;
          transform: rotate(90deg);
        }
        .product-name { width: 100%; overflow: hidden; font-size: clamp(6pt, 2.5vw, 9pt); font-weight: 700; line-height: 1.1; white-space: nowrap; text-overflow: ellipsis; }
        .code-box { width: 100%; display: flex; align-items: center; justify-content: center; margin: .5mm 0; }
        .code-box.barcode { height: 9mm; min-height: 7mm; }
        .code-box.barcode svg { width: 100%; height: 100%; display: block; }
        .code-box.qrcode { height: 14mm; min-height: 10mm; }
        .code-box.qrcode img { height: 100%; width: auto; display: block; }
        .code-value { width: 100%; overflow: hidden; font-family: monospace; font-size: clamp(6pt, 2.2vw, 8pt); line-height: 1.1; letter-spacing: .04em; white-space: nowrap; }
        .sku, .size { width: 100%; overflow: hidden; font-size: clamp(5pt, 1.8vw, 7pt); line-height: 1.1; white-space: nowrap; }
      </style></head><body>${labels}<script>window.onload = function () { window.focus(); window.print(); window.close(); };</script></body></html>`);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-155">
        <DialogHeader>
          <DialogTitle>Print barcode labels</DialogTitle>
        </DialogHeader>
        {label ? (
          <div className="space-y-5">
            <section className="rounded-lg border border-border bg-muted/25 p-3">
              <p className="text-xs font-medium text-muted-foreground">PRODUCT</p>
              <p className="mt-1 truncate font-semibold text-foreground">{label.productName}</p>
              <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                <p className="truncate">
                  SKU: <span className="font-mono text-foreground">{label.sku || "—"}</span>
                </p>
                <p className="truncate">
                  Barcode: <span className="font-mono text-foreground">{label.barcode || "Missing"}</span>
                </p>
                <p className="truncate">
                  Size: <span className="text-foreground">{label.size || "—"}</span>
                </p>
              </div>
            </section>

            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Code type</label>
                  <Select value={codeType} onValueChange={(value) => setCodeType(value as CodeType)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="barcode">Barcode</SelectItem>
                      <SelectItem value="qrcode">QR code</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Only one code prints per label — switching replaces the other.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="label-quantity">
                    Number of labels
                  </label>
                  <div className="flex w-fit items-center gap-2">
                    <Button variant="outline" size="icon" type="button" aria-label="Decrease label quantity" onClick={() => changeQuantity(quantity - 1)} disabled={quantity <= 1}>
                      <Minus />
                    </Button>
                    <Input
                      id="label-quantity"
                      type="number"
                      min={1}
                      max={MAX_QUANTITY}
                      value={quantity}
                      onChange={(event) => setQuantity(Number(event.target.value))}
                      className="w-20 text-center tabular-nums"
                    />
                    <Button variant="outline" size="icon" type="button" aria-label="Increase label quantity" onClick={() => changeQuantity(quantity + 1)} disabled={quantity >= MAX_QUANTITY}>
                      <Plus />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Label size</label>
                  <Select value={preset} onValueChange={(value) => updatePreset(value as LabelPreset)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(LABEL_PRESETS).map(([key, option]) => (
                        <SelectItem key={key} value={key}>
                          {option.name}
                          {key !== "custom" ? ` — ${option.width} × ${option.height} mm` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1 text-xs text-muted-foreground">
                      Width (mm)
                      <Input type="number" min={MIN_LABEL_SIZE} max={MAX_LABEL_SIZE} value={width} onChange={(event) => updateDimension(setWidth, event.target.value)} />
                    </label>
                    <label className="space-y-1 text-xs text-muted-foreground">
                      Height (mm)
                      <Input type="number" min={MIN_LABEL_SIZE} max={MAX_LABEL_SIZE} value={height} onChange={(event) => updateDimension(setHeight, event.target.value)} />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">The size above always describes the content the way it reads upright.</p>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">Rotate label 90°</p>
                    <p className="text-xs text-muted-foreground">
                      Prints on {pageWidth} × {pageHeight} mm stock, content spun sideways to match
                    </p>
                  </div>
                  <Switch checked={rotate90} onCheckedChange={setRotate90} />
                </div>

                <div className="space-y-1 rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm font-medium">What to print</p>
                  {(Object.keys(FIELD_LABELS) as FieldKey[]).map((key) => (
                    <div key={key} className="flex items-center justify-between gap-3 py-1">
                      <p className="text-sm text-muted-foreground">{FIELD_LABELS[key]}</p>
                      <Switch checked={fields[key]} onCheckedChange={() => toggleField(key)} />
                    </div>
                  ))}
                </div>
              </div>

              <section className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <div style={previewStyle} className="mx-auto flex max-w-full items-center justify-center overflow-hidden rounded border border-border bg-white p-2 text-black shadow-sm">
                  <div
                    className="flex flex-col items-center justify-center text-center"
                    style={
                      rotate90
                        ? { width: `${width}mm`, height: `${height}mm`, transform: "rotate(90deg)" }
                        : { width: "100%", height: "100%" }
                    }
                  >
                    {fields.name ? <p className="line-clamp-2 text-[10px] leading-tight font-bold">{label.productName}</p> : null}
                    {codeType === "qrcode" ? (
                      qrPreviewUrl ? (
                        <img src={qrPreviewUrl} alt={`QR code for ${label.barcode}`} className="my-1 h-12 w-12 shrink-0" />
                      ) : (
                        <div className="my-1 h-12 w-12 shrink-0 animate-pulse rounded bg-muted" />
                      )
                    ) : (
                      <svg ref={renderBarcode} className="my-1 h-12 w-full shrink-0" aria-label={`Barcode for ${label.barcode}`} />
                    )}
                    {fields.codeValue ? <p className="truncate font-mono text-[9px] leading-tight tracking-wide">{label.barcode}</p> : null}
                    {fields.sku && label.sku ? <p className="truncate text-[8px] leading-tight">SKU: {label.sku}</p> : null}
                    {fields.size && label.size ? <p className="truncate text-[8px] leading-tight">Size: {label.size}</p> : null}
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Prints on {pageWidth} × {pageHeight} mm
                </p>
              </section>
            </div>

            {!canPrint ? <p className="text-sm text-destructive">Enter a valid barcode, quantity, and label dimensions to print.</p> : null}

            <Button onClick={handlePrint} className="w-full" disabled={!canPrint}>
              <Printer /> Print {quantity} label{quantity === 1 ? "" : "s"}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
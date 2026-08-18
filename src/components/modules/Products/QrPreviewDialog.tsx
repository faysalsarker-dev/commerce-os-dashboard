import { useCallback, useMemo, useState } from "react";
import JsBarcode from "jsbarcode";
import { Minus, Plus, Printer } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const renderBarcode = useCallback(
    (svg: SVGSVGElement | null) => {
      if (!svg || !label?.barcode) return;

      try {
        JsBarcode(svg, label.barcode, {
          format: "CODE128",
          displayValue: false,
          margin: 0,
          width: 1.4,
          height: 48,
        });
      } catch {
        svg.replaceChildren();
      }
    },
    [label],
  );

  const dimensionsValid = width >= MIN_LABEL_SIZE && width <= MAX_LABEL_SIZE && height >= MIN_LABEL_SIZE && height <= MAX_LABEL_SIZE;
  const quantityValid = Number.isInteger(quantity) && quantity >= 1 && quantity <= MAX_QUANTITY;
  const canPrint = Boolean(label?.barcode) && dimensionsValid && quantityValid;
  const previewStyle = useMemo(() => ({ aspectRatio: `${width} / ${height}`, width: `${Math.min(280, Math.max(150, width * 6))}px` }), [height, width]);

  const updatePreset = (value: LabelPreset) => {
    setPreset(value);
    if (value !== "custom") {
      setWidth(LABEL_PRESETS[value].width);
      setHeight(LABEL_PRESETS[value].height);
    }
  };

  const handlePrint = () => {
    if (!label?.barcode) return toast.error("A barcode value is required before printing.");
    if (!quantityValid) return toast.error(`Enter a whole number between 1 and ${MAX_QUANTITY} labels.`);
    if (!dimensionsValid) return toast.error(`Label width and height must be between ${MIN_LABEL_SIZE} and ${MAX_LABEL_SIZE} mm.`);
    const printBarcode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    printBarcode.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    try {
      JsBarcode(printBarcode, label.barcode, { format: "CODE128", displayValue: false, margin: 0, width: 1.4, height: 48 });
    } catch {
      return toast.error("This barcode value cannot be rendered as a barcode.");
    }
    const barcodeSvg = new XMLSerializer().serializeToString(printBarcode);
    const printWindow = window.open("", "_blank", "width=480,height=640");
    if (!printWindow) return toast.error("The print window was blocked. Allow pop-ups and try again.");

    const productName = escapeHtml(label.productName);
    const sku = escapeHtml(label.sku);
    const size = escapeHtml(label.size);
    const barcodeValue = escapeHtml(label.barcode);
    const labels = Array.from({ length: quantity }, () => `
      <article class="label">
        <div class="product-name">${productName}</div>
        <div class="barcode">${barcodeSvg}</div>
        <div class="barcode-value">${barcodeValue}</div>
        ${sku ? `<div class="sku">SKU: ${sku}</div>` : ""}
        ${size ? `<div class="size">Size: ${size}</div>` : ""}
      </article>`).join("");

    printWindow.document.write(`<!doctype html><html><head><title>Barcode labels</title>
      <style>
        @page { size: ${width}mm ${height}mm; margin: 0; }
        * { box-sizing: border-box; } html, body { margin: 0; padding: 0; background: #fff; }
        .label { width: ${width}mm; height: ${height}mm; padding: 1.2mm 1.5mm; display: flex; flex-direction: column; align-items: center; overflow: hidden; break-after: page; page-break-after: always; color: #000; font-family: Arial, sans-serif; text-align: center; }
        .product-name { width: 100%; overflow: hidden; font-size: clamp(6pt, 2.5vw, 9pt); font-weight: 700; line-height: 1.1; white-space: nowrap; text-overflow: ellipsis; }
        .barcode { width: 100%; height: 9mm; min-height: 7mm; display: flex; align-items: center; justify-content: center; margin: .5mm 0; }
        .barcode svg { width: 100%; height: 100%; display: block; }
        .barcode-value { width: 100%; overflow: hidden; font-family: monospace; font-size: clamp(6pt, 2.2vw, 8pt); line-height: 1.1; letter-spacing: .04em; white-space: nowrap; }
        .sku, .size { width: 100%; overflow: hidden; font-size: clamp(5pt, 1.8vw, 7pt); line-height: 1.1; white-space: nowrap; }
        .label:last-child { break-after: auto; page-break-after: auto; }
      </style></head><body>${labels}<script>window.onload = function () { window.focus(); window.print(); window.close(); };</script></body></html>`);
    printWindow.document.close();
  };

  const changeQuantity = (next: number) => setQuantity(Math.max(1, Math.min(MAX_QUANTITY, next)));
  const updateDimension = (setter: (value: number) => void, value: string) => { setPreset("custom"); setter(Number(value)); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-155">
        <DialogHeader><DialogTitle>Print barcode labels</DialogTitle></DialogHeader>
        {label ? <div className="space-y-5">
          <section className="rounded-lg border border-border bg-muted/25 p-3">
            <p className="text-xs font-medium text-muted-foreground">PRODUCT</p>
            <p className="mt-1 truncate font-semibold text-foreground">{label.productName}</p>
            <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
              <p className="truncate">SKU: <span className="font-mono text-foreground">{label.sku || "—"}</span></p>
              <p className="truncate">Barcode: <span className="font-mono text-foreground">{label.barcode || "Missing"}</span></p>
              <p className="truncate">Size: <span className="text-foreground">{label.size || "—"}</span></p>
            </div>
          </section>
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="label-quantity">Number of labels</label>
                <div className="flex w-fit items-center gap-2">
                  <Button variant="outline" size="icon" type="button" aria-label="Decrease label quantity" onClick={() => changeQuantity(quantity - 1)} disabled={quantity <= 1}><Minus /></Button>
                  <Input id="label-quantity" type="number" min={1} max={MAX_QUANTITY} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-20 text-center tabular-nums" />
                  <Button variant="outline" size="icon" type="button" aria-label="Increase label quantity" onClick={() => changeQuantity(quantity + 1)} disabled={quantity >= MAX_QUANTITY}><Plus /></Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Label size</label>
                <Select value={preset} onValueChange={(value) => updatePreset(value as LabelPreset)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(LABEL_PRESETS).map(([key, option]) => <SelectItem key={key} value={key}>{option.name}{key !== "custom" ? ` — ${option.width} × ${option.height} mm` : ""}</SelectItem>)}</SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1 text-xs text-muted-foreground">Width (mm)<Input type="number" min={MIN_LABEL_SIZE} max={MAX_LABEL_SIZE} value={width} onChange={(event) => updateDimension(setWidth, event.target.value)} /></label>
                  <label className="space-y-1 text-xs text-muted-foreground">Height (mm)<Input type="number" min={MIN_LABEL_SIZE} max={MAX_LABEL_SIZE} value={height} onChange={(event) => updateDimension(setHeight, event.target.value)} /></label>
                </div>
              </div>
            </div>
            <section className="space-y-2">
              <p className="text-sm font-medium">Preview</p>
              <div style={previewStyle} className="mx-auto flex max-w-full flex-col justify-center overflow-hidden rounded border border-border bg-white p-2 text-center text-black shadow-sm">
                <p className="line-clamp-2 text-[10px] leading-tight font-bold">{label.productName}</p>
                <svg ref={renderBarcode} className="my-1 h-12 w-full shrink-0" aria-label={`Barcode for ${label.barcode}`} />
                <p className="truncate font-mono text-[9px] leading-tight tracking-wide">{label.barcode}</p>
                {label.sku ? <p className="truncate text-[8px] leading-tight">SKU: {label.sku}</p> : null}
                {label.size ? <p className="truncate text-[8px] leading-tight">Size: {label.size}</p> : null}
              </div>
              <p className="text-center text-xs text-muted-foreground">{width} × {height} mm</p>
            </section>
          </div>
          {!canPrint ? <p className="text-sm text-destructive">Enter a valid barcode, quantity, and label dimensions to print.</p> : null}
          <Button onClick={handlePrint} className="w-full" disabled={!canPrint}><Printer /> Print {quantity} label{quantity === 1 ? "" : "s"}</Button>
        </div> : null}
      </DialogContent>
    </Dialog>
  );
}

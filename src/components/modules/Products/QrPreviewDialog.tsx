import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface QrLabel {
  qrCode: string;
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

export function QrPreviewDialog({ open, onOpenChange, label }: QrPreviewDialogProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!label) return;
    const canvas = canvasRef.current?.querySelector("canvas");
    const dataUrl = canvas?.toDataURL() ?? "";
    const printWindow = window.open("", "_blank", "width=420,height=520");
    if (!printWindow) return;

    printWindow.document.write(`<!doctype html><html><head><title>${label.sku}</title>
      <style>
        @page { margin: 8mm }
        body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 0; display: grid; place-items: center; height: 100vh }
        .label { text-align: center; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px 20px }
        img { width: 160px; height: 160px; display: block; margin: 0 auto 10px }
        .sku { font-size: 14px; font-weight: 600; letter-spacing: .04em; font-family: ui-monospace, monospace }
        .meta { font-size: 11px; color: #52525b; margin-top: 2px }
      </style></head>
      <body><div class="label">
        <img src="${dataUrl}" alt="${label.sku}" />
        <div class="sku">${label.sku}</div>
        <div class="meta">${label.productName} — ${label.colorName} / ${label.size}</div>
      </div>
      <script>window.onload = function () { window.focus(); window.print(); window.close(); }<script/>
      </body></html>`);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Label preview</DialogTitle>
        </DialogHeader>

        {label ? (
          <div className="space-y-4">
            <div
              ref={canvasRef}
              className="mx-auto grid w-fit place-items-center rounded-lg border border-border bg-card p-5 shadow-card"
            >
              <QRCodeCanvas value={label.qrCode} size={168} level="M" marginSize={1} />
              <p className="numeric mt-3 font-mono text-sm font-semibold tracking-wide text-foreground">
                {label.sku}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {label.productName} — {label.colorName} / {label.size}
              </p>
            </div>

            <Button onClick={handlePrint} className="w-full">
              <Printer /> Print label
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
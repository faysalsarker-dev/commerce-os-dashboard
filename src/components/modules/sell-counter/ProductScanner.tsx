import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {  DivideCircle, ScanLine, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductScannerProps {
  onScan: (code: string) => void;
  isLoading?: boolean;
}

export function ProductScanner({ onScan, isLoading }: ProductScannerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [code, setCode] = useState("");
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) return;
    onScan(value);
    setCode("");
    setFlash((n) => n + 1);
    inputRef.current?.focus();
  };

  return (
    <Card className="relative overflow-hidden p-3">
      <AnimatePresence>
        {flash > 0 ? (
          <motion.span
            key={flash}
            aria-hidden
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 bg-primary/20"
          />
        ) : null}
      </AnimatePresence>




      <form onSubmit={submit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <ScanLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Scan barcode or type SKU, then press Enter"
            aria-label="Scan product"
            autoComplete="off"
            className="numeric h-11 pl-9 text-base"
          />
        </div>
        <Button disabled={isLoading} type="submit" className="h-11">
          <Search /> Add
        </Button>
      </form>
{
  isLoading && (
<div className="flex items-center gap-2">
  <DivideCircle/>
  <p>Processing...</p>
</div>

  )
}




    </Card>
  );
}
import { Check, Printer, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceCard } from "@/components/modules/invoice/InvoiceCard";
import { type Invoice } from "@/components/modules/invoice/types";
import { useReducedMotion, motion } from "framer-motion";
import { Link, useLocation, Navigate } from "react-router";

export function InvoiceReceipt() {
  const reduceMotion = useReducedMotion();
  const location = useLocation();

  // Route state is where checkout hands off the invoice — see SellCounter's
  // navigate("/invoice", { state: { invoice } }) call.
  const invoice = location.state?.invoice as Invoice | undefined;

  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  // No state means: hard refresh, direct URL visit, or back/forward nav — the
  // data is gone (that's the known tradeoff of route state). Bounce back to
  // Sell Counter rather than rendering a broken/empty receipt.
  if (!invoice) {
    return <Navigate to="/app/sell" replace />;
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mx-auto w-full max-w-115"
      >
        <div className="mb-5 flex flex-col items-center text-center print:hidden">
          <motion.span
            initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.28, delay: 0.1, ease: "easeOut" }}
            className="grid size-10 place-items-center rounded-full bg-success text-success-foreground"
          >
            <Check className="size-5" aria-hidden />
          </motion.span>
          <h1 className="mt-3 text-lg font-semibold tracking-tight">Sale completed</h1>
          <p className="text-sm text-muted-foreground">
            Invoice {invoice.invoiceNo} is ready to print.
          </p>
        </div>

        <InvoiceCard invoice={invoice} />

        <div className="mt-5 grid gap-2 sm:grid-cols-2 print:hidden">
          <Button onClick={handlePrint} className="w-full active:scale-[0.98]">
            <Printer className="size-4" aria-hidden />
            Print invoice
          </Button> <Link to="/app/sell">
          <Button variant="outline" className="w-full active:scale-[0.98] flex items-center justify-center gap-2">
           
              <ShoppingCart className="size-4" aria-hidden />
              New sale
            
          </Button></Link>
        </div>
      </motion.div>
    </main>
  );
}

export default InvoiceReceipt;
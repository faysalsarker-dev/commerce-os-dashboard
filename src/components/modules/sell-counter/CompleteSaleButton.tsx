import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CompleteSaleButtonProps {
  disabled?: boolean;
  onComplete: () => void;
}

export function CompleteSaleButton({ disabled, onComplete }: CompleteSaleButtonProps) {
  const [done, setDone] = useState(false);

  const handleClick = () => {
    onComplete();
    setDone(true);
    window.setTimeout(() => setDone(false), 1600);
  };

  return (
    <Button
      className="relative h-11 w-full overflow-hidden"
      disabled={disabled || done}
      onClick={handleClick}
    >
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.span
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <Check className="size-4" /> Sale completed
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <Printer className="size-4" /> Complete sale &amp; print bill
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}
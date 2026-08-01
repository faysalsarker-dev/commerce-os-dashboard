import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, UserPlus, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PosCustomer } from "./types";

interface CustomerLookupProps {
  customer: PosCustomer | null;
  onSearch: (phone: string) => void | Promise<void>;
  onCreate: (name: string, phone: string) => void;
  onClear: () => void;
  notFoundPhone: string | null;
}

export function CustomerLookup({
  customer,
  onSearch,
  onCreate,
  onClear,
  notFoundPhone,
}: CustomerLookupProps) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Customer</h2>
        {customer ? (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X /> Clear
          </Button>
        ) : null}
      </div>

      {customer ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-md border border-border bg-muted/40 px-3 py-2.5"
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <UserRound className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{customer.name}</p>
            <p className="numeric truncate text-xs text-muted-foreground">{customer.phone}</p>
          </div>
        </motion.div>
      ) : (
        <>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (phone.trim()) void onSearch(phone);
            }}
          >
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              inputMode="tel"
              aria-label="Customer phone number"
              className="numeric"
            />
            <Button type="submit" variant="secondary">
              <Search /> Find
            </Button>
          </form>

          <AnimatePresence>
            {notFoundPhone ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 rounded-md border border-dashed border-border p-3">
                  <p className="text-xs text-muted-foreground">
                    No customer found for{" "}
                    <span className="numeric font-medium text-foreground">{notFoundPhone}</span>.
                    Create one now.
                  </p>
                  <Label htmlFor="new-customer-name" className="text-xs">
                    Full name
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="new-customer-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahim Uddin"
                    />
                    <Button
                      type="button"
                      disabled={!name.trim()}
                      onClick={() => {
                        onCreate(name.trim(), notFoundPhone);
                        setName("");
                        setPhone("");
                      }}
                    >
                      <UserPlus /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Card>
  );
}
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Search, UserPlus, UserRound, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Customer } from "@/types/data-types/customer/customer.types"

interface CustomerLookupProps {
  customer: Customer | null
  onSearch: (phone: string) => void | Promise<void>
  onCreate: (name: string, phone: string) => void
  onClear: () => void
  notFoundPhone: string | null
  isSearching: boolean
}

export function CustomerLookup({
  customer,
  onSearch,
  onCreate,
  onClear,
  notFoundPhone,
  isSearching,
}: CustomerLookupProps) {
  const [phone, setPhone] = useState("")
  const [name, setName] = useState("")

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
          className="rounded-md border border-border bg-muted/40 p-3"
        >
          <div className="flex items-center gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <UserRound className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{customer.name}</p>
              <p className="numeric truncate text-xs text-muted-foreground">
                {customer.phone}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 divide-x rounded-md border bg-background">
            <div className="px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Due</p>
              <p className="numeric mt-0.5 text-sm font-semibold">
                {customer.totalDue ?? 0}
              </p>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Orders</p>
              <p className="numeric mt-0.5 text-sm font-semibold">
                {customer.totalOrders ?? 0}
              </p>
            </div>

            <div className="px-3 py-2">
              <p className="text-[11px] text-muted-foreground">Spent</p>
              <p className="numeric mt-0.5 text-sm font-semibold">
                {customer.totalSpent ?? 0}
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (phone.trim()) void onSearch(phone)
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
            <Button
              type="submit"
              variant="secondary"
              disabled={!phone.trim() || isSearching}
            >
              {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
              {isSearching ? "Finding..." : "Find"}
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
                    <span className="numeric font-medium text-foreground">
                      {notFoundPhone}
                    </span>
                    . Create one now.
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
                        onCreate(name.trim(), notFoundPhone)
                        setName("")
                        setPhone("")
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
  )
}

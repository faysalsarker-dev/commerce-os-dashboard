import { useState, type FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CustomerFormValues } from "@/types/data-types/customer/customer.types"

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  submitLabel: string
  initialValues?: CustomerFormValues
  isSaving: boolean
  onSubmit: (values: CustomerFormValues) => Promise<void>
}

export function CustomerFormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  initialValues,
  isSaving,
  onSubmit,
}: CustomerFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <CustomerForm
          key={`${open}-${initialValues?.name ?? ""}-${initialValues?.phone ?? ""}`}
          initialValues={initialValues}
          submitLabel={submitLabel}
          description={description}
          title={title}
          isSaving={isSaving}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

function CustomerForm({
  initialValues,
  submitLabel,
  description,
  title,
  isSaving,
  onCancel,
  onSubmit,
}: {
  initialValues?: CustomerFormValues
  submitLabel: string
  description: string
  title: string
  isSaving: boolean
  onCancel: () => void
  onSubmit: (values: CustomerFormValues) => Promise<void>
}) {
  const [formError, setFormError] = useState("")

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    if (!name) {
      setFormError("Enter the customer's name.")
      return
    }
    setFormError("")
    const phone = String(formData.get("phone") ?? "").trim()
    await onSubmit({ name, phone: phone || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4">
        <label className="block space-y-1.5 text-sm font-medium">
          Customer name
          <Input
            autoFocus
            autoComplete="name"
            required
            name="name"
            defaultValue={initialValues?.name ?? ""}
            placeholder="e.g. Ayesha Rahman"
          />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          Phone number
          <Input
            type="tel"
            autoComplete="tel"
            name="phone"
            defaultValue={initialValues?.phone ?? ""}
            placeholder="+880 1XXX-XXXXXX"
          />
        </label>
        {formError && (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        )}
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  )
}

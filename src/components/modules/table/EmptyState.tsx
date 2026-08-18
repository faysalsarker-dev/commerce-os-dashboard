import emtyImage from "@/assets/system/commerce-os-emty.png"

interface EmptyStateProps {
  title?: string
  description?: string
  className?: string
}

const EmptyState = ({
  title = "No results found",
  description = "There is no data to display here yet.",
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 py-8 ${className}`}
    >
      <img
        src={emtyImage}
        alt="No data"
        className="mb-2 h-36 w-36 object-contain"
      />

      <h3 className="text-sm font-medium text-foreground">
        {title}
      </h3>

      <p className="max-w-sm text-center text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default EmptyState
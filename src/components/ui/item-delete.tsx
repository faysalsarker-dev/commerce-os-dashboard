// import * as React from "react"
// import { AnimatePresence, motion } from "framer-motion"
// import { Loader2, Trash2 } from "lucide-react"

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui"
// import trashIcon from "@/assets/commerce-os-trush.png"

// export interface ItemDeleteProps {
//   /** Controls whether the confirmation dialog is visible. */
//   open: boolean
//   /** Update the dialog's open state. */
//   onOpenChange: (open: boolean) => void
//   /** Called after the user confirms deletion. Supports async work. */
//   onDelete: () => void | Promise<void>
//   title?: React.ReactNode
//   description?: React.ReactNode
//   confirmLabel?: string
//   cancelLabel?: string
//   /** Use when deletion state is managed outside this component. */
//   loading?: boolean
// }

// /**
//  * A centered, reusable confirmation dialog for destructive delete actions.
//  */
// export function ItemDelete({
//   open,
//   onOpenChange,
//   onDelete,
//   title = "Delete this item?",
//   description = "This action cannot be undone.",
//   confirmLabel = "Delete",
//   cancelLabel = "Cancel",
//   loading = false,
// }: ItemDeleteProps) {
//   const [isDeleting, setIsDeleting] = React.useState(false)
//   const busy = loading || isDeleting

//   const handleOpenChange = (nextOpen: boolean) => {
//     if (!busy) onOpenChange(nextOpen)
//   }

//   const handleDelete = async () => {
//     if (busy) return

//     setIsDeleting(true)
//     try {
//       await onDelete()
//       onOpenChange(false)
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   return (
//     <AlertDialog open={open} onOpenChange={handleOpenChange}>
//       <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-104 gap-0 overflow-hidden rounded-3xl border border-border/60 bg-card p-6 text-center shadow-2xl sm:w-full">

//         <AlertDialogHeader className="items-center gap-4  text-center sm:gap-5 ">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.75 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ type: "spring", stiffness: 260, damping: 18 }}
//             className="flex shrink-0 items-center justify-center"
//           >
//             <img src={trashIcon} alt="Delete warning" className="h-auto w-1/2" />
//           </motion.div>

//           <div className="space-y-1.5 sm:space-y-2">
//             <AlertDialogTitle className="text-lg text-center font-semibold tracking-tight text-balance sm:text-xl">
//               {title}
//             </AlertDialogTitle>
//             <AlertDialogDescription className="text-[13px]  text-center leading-relaxed text-pretty text-muted-foreground sm:text-sm">
//               {description}
//             </AlertDialogDescription>
//           </div>
//         </AlertDialogHeader>



//  <AlertDialogFooter className="mt-6 grid grid-cols-2 gap-2 sm:space-x-0 ">
//           <AlertDialogCancel
//             disabled={busy}
//             className="mt-0 h-10 rounded-lg border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80"
//           >
//              {cancelLabel}
//           </AlertDialogCancel>

//           <AlertDialogAction
//           disabled={busy}
//             onClick={handleDelete}
//             variant="destructive"
//             className="h-10 rounded-lg bg-red-500 text-primary-foreground shadow-sm hover:bg-primary/90"
//           >
//           <AnimatePresence initial={false} mode="wait">
//               <motion.span
//                 key={busy ? "loading" : "delete"}
//                 initial={{ opacity: 0, width: 0 }}
//                 animate={{ opacity: 1, width: "auto" }}
//                 exit={{ opacity: 0, width: 0 }}
//                 transition={{ duration: 0.15 }}
//                 className="inline-flex overflow-hidden"
//               >
//                 {busy ? (
//                   <Loader2 className="size-4 animate-spin" />
//                 ) : (
//                   <Trash2 className="size-4" />
//                 )}
//               </motion.span>
//             </AnimatePresence>
//             {busy ? "Deleting..." : confirmLabel}
//           </AlertDialogAction>
//         </AlertDialogFooter>

//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui"
import trashIcon from "@/assets/commerce-os-trush.png"

export interface ItemDeleteProps {
  /** Controls whether the confirmation dialog is visible. */
  open: boolean
  /** Update the dialog's open state. */
  onOpenChange: (open: boolean) => void
  /** Called after the user confirms deletion. Supports async work. */
  onDelete: () => void | Promise<void>
  title?: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  /** Use when deletion state is managed outside this component. */
  loading?: boolean
}

/**
 * A centered, reusable confirmation dialog for destructive delete actions.
 */
export function ItemDelete({
  open,
  onOpenChange,
  onDelete,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
}: ItemDeleteProps) {
  const [isDeleting, setIsDeleting] = React.useState(false)
  const busy = loading || isDeleting

  const handleOpenChange = (nextOpen: boolean) => {
    if (!busy) onOpenChange(nextOpen)
  }

  const handleDelete = async () => {
    if (busy) return

    setIsDeleting(true)
    try {
      await onDelete()
      onOpenChange(false)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="w-[calc(100vw-2rem)] max-w-104 gap-0 overflow-hidden rounded-3xl border border-border/60 bg-card p-6 text-center shadow-2xl sm:w-full">

        <AlertDialogHeader className="items-center gap-4 text-center sm:gap-5">

          {/* Animated Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 300,
      damping: 20,
    }}
            className="flex w-full items-center justify-center"
          >
            <img
              src={trashIcon}
              alt="Delete warning"
              className="h-32 w-32 object-contain sm:h-36 sm:w-36"
            
            />
          </motion.div>

          {/* Text */}
          <div className="w-full space-y-1.5 text-center sm:space-y-2">
            <AlertDialogTitle className="text-center text-lg font-semibold tracking-tight text-balance sm:text-xl">
              {title}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-[13px] leading-relaxed text-pretty text-muted-foreground sm:text-sm">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Actions */}
        <AlertDialogFooter className="mt-6 grid grid-cols-2 gap-2 sm:space-x-0">

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <AlertDialogCancel
              disabled={busy}
              className="mt-0 h-10 w-full rounded-lg border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80"
            >
              {cancelLabel}
            </AlertDialogCancel>
          </motion.div>

          <motion.div
            whileHover={{ scale: busy ? 1 : 1.02 }}
            whileTap={{ scale: busy ? 1 : 0.97 }}
          >
            <AlertDialogAction
              disabled={busy}
              onClick={handleDelete}
              variant="destructive"
              className="h-10 w-full rounded-lg bg-red-500 text-primary-foreground shadow-sm hover:bg-red-600"
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={busy ? "loading" : "delete"}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                    width: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    width: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.7,
                    width: 0,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className="inline-flex overflow-hidden"
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={busy ? "deleting" : "delete-text"}
                  initial={{
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                >
                  {busy ? "Deleting..." : confirmLabel}
                </motion.span>
              </AnimatePresence>
            </AlertDialogAction>
          </motion.div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
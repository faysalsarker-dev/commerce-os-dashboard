import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router"
import emtyImage from "@/assets/system/commerce-os-emty.png"
import { motion } from "framer-motion"


interface PageEmptyStateProps {
  image?: string
  title?: string
  description?: string
  buttonText?: string
  navigateTo?: string
}

const PageEmptyState = ({
  image = emtyImage,
  title = "Nothing here yet",
  description = "We couldn't find any data for this page.",
  buttonText = "Go Back",
  navigateTo,
}: PageEmptyStateProps) => {
  const navigate = useNavigate()

  const handleNavigate = () => {
    if (navigateTo) {
      navigate(navigateTo)
    } else {
      navigate(-1)
    }
  }

  return (
<div className="flex min-h-[calc(100vh-4rem)] flex-col rounded-2xl bg-card">
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.4,
      ease: "easeOut",
    }}
    className="flex items-center border-b border-border px-6 py-4"
  >
    <motion.button
      type="button"
      onClick={handleNavigate}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="group inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
      {buttonText}
    </motion.button>
  </motion.div>

  <div className="flex flex-1 items-center justify-center px-6 py-12">
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="flex max-w-md flex-col items-center text-center"
    >
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            scale: 0.94,
            y: 10,
          },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
          },
        }}
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <motion.img
          src={image}
          alt="No data found"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-56 w-56 object-contain"
        />
      </motion.div>

      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 8,
          },
          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        className="mt-6"
      >
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </motion.div>
    </motion.div>
  </div>
</div>
  )
}

export default PageEmptyState
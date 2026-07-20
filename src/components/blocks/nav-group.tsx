// src/components/blocks/nav-group.tsx
import { useLocation } from "react-router"
import { motion } from "framer-motion"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLabel } from "@/components/blocks/nav-label"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
}

interface NavGroupProps {
  title?: string
  items: NavItem[]
  className?: string
}

const rowVariants = {
  rest: { scale: 1, x: 0 },
  hover: { scale: 1.03, x: 4 },
}

export function NavGroup({ title, items, className }: NavGroupProps) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup className={className}>
      {title && (
        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/70">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={
                    <motion.span
                      initial="rest"
                      whileHover={isActive ? undefined : "hover"}
                      animate="rest"
                      variants={rowVariants}
                      transition={{
                        scale: { duration: 0.12, ease: "easeOut" },
                        x: { duration: 0.15, ease: "easeOut", delay: 0.1 },
                      }}
                    />
                  }
                  className={cn(
                    "group/item h-10 rounded-lg px-2 origin-left ",
                    "transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground  hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-muted "
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md [&_svg]:size-4",
                      "transition-transform duration-200 ease-out",
                      !isActive &&
                        "group-hover/item:-rotate-6 group-hover/item:bg-background group-hover/item:shadow-sm"
                    )}
                  >
                    {item.icon}
                  </span>
                  <NavLabel active={isActive}>{item.title}</NavLabel>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
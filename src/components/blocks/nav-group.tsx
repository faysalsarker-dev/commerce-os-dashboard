
import { Link, useLocation } from "react-router"
import { motion } from "framer-motion"
import { ChevronRightIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui"
import { NavLabel } from "@/components/blocks/nav-label"
import { cn } from "@/lib/utils"
import type { SidebarNavItem } from "@/app/router/generator/generateSidebarNav"
const MotionLink = motion.create(Link)

interface NavGroupProps {
  title?: string
  items: SidebarNavItem[]
  className?: string
}

const rowVariants = {
  rest: { scale: 1, x: 0 },
  hover: { scale: 1.03, x: 4 },
}

function isItemActive(item: SidebarNavItem, pathname: string): boolean {
  if (pathname === item.url) return true
  return item.items?.some((child) => isItemActive(child, pathname)) ?? false
}

function NavItemIcon({ icon: Icon }: { icon?: SidebarNavItem["icon"] }) {
  if (!Icon) return null
  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-md [&_svg]:size-4",
        "transition-transform duration-200 ease-out",
        "group-hover/item:-rotate-6 group-hover/item:bg-background group-hover/item:shadow-sm"
      )}
    >
      <Icon />
    </span>
  )
}

export function NavGroup({ title, items, className }: NavGroupProps) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup className={className}>
      {title && (
        <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide ">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive = isItemActive(item, pathname)
            const hasChildren = !!item.items?.length

            if (hasChildren) {
              return (
                <Collapsible
                  key={item.title}
                  defaultOpen={isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          className={cn(
                            "group/item h-10 rounded-lg px-2",
                            "text-muted-foreground hover:bg-muted transition-colors duration-200"
                          )}
                        />
                      }
                    >
                      <NavItemIcon icon={item.icon} />
                      <NavLabel>{item.title}</NavLabel>
                      <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items!.map((child) => {
                          const childActive = pathname === child.url
                          return (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton
                                render={<Link to={child.url} />}
                                className={cn(
                                  childActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-black hover:bg-muted"
                                )}
                              >
                                <NavLabel active={childActive}>{child.title}</NavLabel>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={
                    <MotionLink
                      to={item.url}
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
                    "group/item h-10 rounded-lg px-2 origin-left",
                    "transition-colors duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <NavItemIcon icon={item.icon} />
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
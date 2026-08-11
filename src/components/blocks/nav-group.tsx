
// import { Link, useLocation } from "react-router"
// import { motion } from "framer-motion"
// import { ChevronRightIcon } from "lucide-react"
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui"
// import { NavLabel } from "@/components/blocks/nav-label"
// import { cn } from "@/lib/utils"
// import type { SidebarNavItem } from "@/app/router/generator/generateSidebarNav"
// const MotionLink = motion.create(Link)

// interface NavGroupProps {
//   title?: string
//   items: SidebarNavItem[]
//   className?: string
// }

// const rowVariants = {
//   rest: { scale: 1, x: 0 },
//   hover: { scale: 1.03, x: 4 },
// }

// function isItemActive(item: SidebarNavItem, pathname: string): boolean {
//   if (pathname === item.url) return true
//   return item.items?.some((child) => isItemActive(child, pathname)) ?? false
// }

// function NavItemIcon({ icon: Icon }: { icon?: SidebarNavItem["icon"] }) {
//   if (!Icon) return null
//   return (
//     <span
//       className={cn(
//         "flex size-6 items-center justify-center rounded-md [&_svg]:size-4",
//         "transition-transform duration-200 ease-out",
//         "group-hover/item:-rotate-6 group-hover/item:bg-background group-hover/item:shadow-sm"
//       )}
//     >
//       <Icon />
//     </span>
//   )
// }

// export function NavGroup({ title, items, className }: NavGroupProps) {
//   const { pathname } = useLocation()

//   return (
//     <SidebarGroup className={className}>
//       {title && (
//         <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wide ">
//           {title}
//         </SidebarGroupLabel>
//       )}
//       <SidebarGroupContent>
//         <SidebarMenu className="gap-1">
//           {items.map((item) => {
//             const isActive = isItemActive(item, pathname)
//             const hasChildren = !!item.items?.length

//             if (hasChildren) {
//               return (
//                 <Collapsible
//                   key={item.title}
//                   defaultOpen={isActive}
//                   className="group/collapsible"
//                 >
//                   <SidebarMenuItem>
//                     <CollapsibleTrigger
//                       render={
//                         <SidebarMenuButton
//                           className={cn(
//                             "group/item h-10 rounded-lg px-2",
//                             "text-muted-foreground hover:bg-muted transition-colors duration-200"
//                           )}
//                         />
//                       }
//                     >
//                       <NavItemIcon icon={item.icon} />
//                       <NavLabel>{item.title}</NavLabel>
//                       <ChevronRightIcon className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
//                     </CollapsibleTrigger>
//                     <CollapsibleContent>
//                       <SidebarMenuSub>
//                         {item.items!.map((child) => {
//                           const childActive = pathname === child.url
//                           return (
//                             <SidebarMenuSubItem key={child.title}>
//                               <SidebarMenuSubButton
//                                 render={<Link to={child.url} />}
//                                 className={cn(
//                                   childActive
//                                     ? "bg-primary text-primary-foreground"
//                                     : "text-black hover:bg-muted"
//                                 )}
//                               >
//                                 <NavLabel active={childActive}>{child.title}</NavLabel>
//                               </SidebarMenuSubButton>
//                             </SidebarMenuSubItem>
//                           )
//                         })}
//                       </SidebarMenuSub>
//                     </CollapsibleContent>
//                   </SidebarMenuItem>
//                 </Collapsible>
//               )
//             }

//             return (
//               <SidebarMenuItem key={item.title}>
//                 <SidebarMenuButton
//                   render={
//                     <MotionLink
//                       to={item.url}
//                       initial="rest"
//                       whileHover={isActive ? undefined : "hover"}
//                       animate="rest"
//                       variants={rowVariants}
//                       transition={{
//                         scale: { duration: 0.12, ease: "easeOut" },
//                         x: { duration: 0.15, ease: "easeOut", delay: 0.1 },
//                       }}
//                     />
//                   }
//                   className={cn(
//                     "group/item h-10 rounded-lg px-2 origin-left",
//                     "transition-colors duration-200",
//                     isActive
//                       ? "bg-primary text-primary-foreground hover:bg-primary/90"
//                       : "text-muted-foreground hover:bg-muted"
//                   )}
//                 >
//                   <NavItemIcon icon={item.icon} />
//                   <NavLabel active={isActive}>{item.title}</NavLabel>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             )
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   )
// }


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
  useSidebar,
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

// original animation, preserved
const rowVariants = {
  rest: { scale: 1, x: 0 },
  hover: { scale: 1.03, x: 4 },
}

function isItemActive(item: SidebarNavItem, pathname: string): boolean {
  if (pathname === item.url) return true
  return item.items?.some((child) => isItemActive(child, pathname)) ?? false
}

function NavItemIcon({
  icon: Icon,
  active,
}: {
  icon?: SidebarNavItem["icon"]
  active?: boolean
}) {
  if (!Icon) return null
  return (
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
        "transition-transform duration-200 ease-out",
        // in collapsed mode the button itself is the hit target: no inner box
        "group-data-[collapsible=icon]:size-auto group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none",
        active
          ? "text-primary-foreground"
          : "text-muted-foreground group-hover/item:-rotate-6 group-hover/item:bg-background group-hover/item:text-foreground group-hover/item:shadow-sm group-data-[collapsible=icon]:group-hover/item:rotate-0 group-data-[collapsible=icon]:group-hover/item:bg-transparent"
      )}
    >
      <Icon />
    </span>
  )
}

export function NavGroup({ title, items, className }: NavGroupProps) {
  const { pathname } = useLocation()
  const { state, isMobile } = useSidebar()
  const collapsed = !isMobile && state === "collapsed"

  const rowBase =
    "group/item h-10 gap-2.5 rounded-xl px-2 text-sm font-medium origin-left transition-colors duration-200 " +
    "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg"

  return (
    <SidebarGroup className={cn("px-1 py-2 group-data-[collapsible=icon]:px-0", className)}>
      {title && (
        <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/70 group-data-[collapsible=icon]:hidden">
          {title}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive = isItemActive(item, pathname)
            const hasChildren = !!item.items?.length

            // collapsed: parents behave as a single icon row linking to the first child
            if (hasChildren && collapsed) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    render={<Link to={item.items![0]!.url} />}
                    className={cn(
                      rowBase,
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <NavItemIcon icon={item.icon} active={isActive} />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

            if (hasChildren) {
              return (
                <Collapsible key={item.title} defaultOpen={isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger
                      render={
                        <SidebarMenuButton
                          tooltip={item.title}
                          className={cn(
                            rowBase,
                            "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                            isActive && "text-foreground"
                          )}
                        />
                      }
                    >
                      <NavItemIcon icon={item.icon} />
                      <NavLabel>{item.title}</NavLabel>
                      <ChevronRightIcon className="ml-auto size-4 text-muted-foreground/70 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
                    </CollapsibleTrigger>

                    <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
                      <SidebarMenuSub className="ml-4 mt-1 gap-0.5 border-l border-sidebar-border/70 pl-3">
                        {item.items!.map((child) => {
                          const childActive = pathname === child.url
                          return (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton
                                render={<Link to={child.url} />}
                                className={cn(
                                  "h-9 rounded-lg px-2.5 text-sm transition-colors duration-200",
                                  childActive
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
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
                  tooltip={item.title}
                  isActive={isActive}
                  render={
                    <MotionLink
                      to={item.url}
                      initial="rest"
                      animate="rest"
                      whileHover={isActive || collapsed ? undefined : "hover"}
                      variants={rowVariants}
                      transition={{
                        scale: { duration: 0.12, ease: "easeOut" },
                        x: { duration: 0.15, ease: "easeOut", delay: 0.1 },
                      }}
                    />
                  }
                  className={cn(
                    rowBase,
                    isActive
                      ? "bg-primary! text-white! shadow-sm hover:bg-primary/80! hover:text-white/80!"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <NavItemIcon icon={item.icon} active={isActive} />
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

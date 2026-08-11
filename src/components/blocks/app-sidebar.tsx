// import * as React from "react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui"
// import { NavGroup } from "./nav-group"
// import { useAuth } from "@/hooks/auth/useAuth"
// import { generateSidebarNav } from "@/app/router/generator/generateSidebarNav"
// import { routeGroups } from "@/app/router/config/routes.config"
// import type { Role } from "@/types/data-types/enums"
// import Logo from "../ui/Logo"
// import { Link } from "react-router"

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { role, isLoading, isFetching } = useAuth()
//   const isAuthPending = isLoading || isFetching

//   const navGroups = React.useMemo(
//     () => generateSidebarNav(routeGroups, isAuthPending ? undefined : (role as Role | undefined)),
//     [role, isAuthPending]
//   )

//   return (
//     <Sidebar collapsible="icon" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               className="data-[slot=sidebar-menu-button]:p-1.5!"
//               render={<Link to="/app" />}
//             >
//               <Logo withText />
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         {navGroups.map((group) => (
//           <NavGroup key={group.label} title={group.label} items={group.items} />
//         ))}
//       </SidebarContent>
//       <SidebarFooter></SidebarFooter>
//     </Sidebar>
//   )
// }

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  ScrollArea,
  useSidebar,
} from "@/components/ui"
import { NavGroup } from "./nav-group"
import { useAuth } from "@/hooks/auth/useAuth"
import { generateSidebarNav } from "@/app/router/generator/generateSidebarNav"
import { routeGroups } from "@/app/router/config/routes.config"
import type { Role } from "@/types/data-types/enums"
import Logo from "../ui/Logo"
import { Link } from "react-router"
import { LogOutIcon } from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role, isLoading, isFetching, clearAuth } = useAuth()
  const { state, isMobile } = useSidebar()
  const collapsed = !isMobile && state === "collapsed"
  const isAuthPending = isLoading || isFetching

  const navGroups = React.useMemo(
    () => generateSidebarNav(routeGroups, isAuthPending ? undefined : (role as Role | undefined)),
    [role, isAuthPending]
  )

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/70 bg-sidebar"
      {...props}
    >
      <SidebarHeader className="p-2 ">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Commerce OS"
              className="h-12 rounded-xl transition-colors duration-200 hover:bg-sidebar-accent group-data-[collapsible=icon]:size-8!"
              render={<Link to="/app" />}
            >
              <Logo withText={!collapsed} width={collapsed ? 20 : 28} height={collapsed ? 20 : 28} />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* overflow-hidden so SidebarContent's native scrollbar never appears */}
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-1 px-2 py-1 group-data-[collapsible=icon]:px-1">
            {navGroups.map((group) => (
              <NavGroup key={group.label} title={group.label} items={group.items} />
            ))}
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/60 p-2 group-data-[collapsible=icon]:p-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Log out"
              onClick={() => clearAuth?.()}
              className="group/item h-10 gap-2.5 rounded-xl px-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 [&_svg]:size-4 group-data-[collapsible=icon]:size-auto">
                <LogOutIcon />
              </span>
              <span className="truncate group-data-[collapsible=icon]:hidden">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui"
import { NavGroup } from "./nav-group"
import { useAuth } from "@/hooks/auth/useAuth"
import { generateSidebarNav } from "@/app/router/generator/generateSidebarNav"
import { routeGroups } from "@/app/router/config/routes.config"
import type { Role } from "@/types/data-types/enums"
import Logo from "../ui/Logo"
import { Link } from "react-router"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role, isLoading, isFetching } = useAuth()
  const isAuthPending = isLoading || isFetching

  const navGroups = React.useMemo(
    () => generateSidebarNav(routeGroups, isAuthPending ? undefined : (role as Role | undefined)),
    [role, isAuthPending]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link to="/app" />}
            >
              <Logo width={30} />
              <span className="text-base font-semibold">CommerceOS</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <NavGroup key={group.label} title={group.label} items={group.items} />
        ))}
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

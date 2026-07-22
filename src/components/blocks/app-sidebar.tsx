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
import { CommandIcon } from "lucide-react"
import { useAuth } from "@/hooks/auth/useAuth"
import { generateSidebarNav } from "@/app/router/generator/generateSidebarNav"
import { routeGroups } from "@/app/router/config/routes.config"
import type { Role } from "@/types/data-types/enums"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { role } = useAuth()

  const navGroups = React.useMemo(
    () => generateSidebarNav(routeGroups, role as Role),
    [role]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Acme Inc.</span>
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

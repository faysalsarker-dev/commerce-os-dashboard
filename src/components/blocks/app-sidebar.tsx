import * as React from "react"


import { NavUser } from "@/components/blocks/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/auth/useAuth"
import { NavGroup } from "./nav-group"
import { CommandIcon, DatabaseIcon, FileChartColumnIcon, FileIcon } from "lucide-react"




const mockNavDocuments = [
  { title: "Data Library", url: "/", icon: <DatabaseIcon /> },
  { title: "Reports", url: "/reports", icon: <FileChartColumnIcon /> },
  { title: "Invoices", url: "/invoices", icon: <FileIcon /> },
]








export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

const {user} = useAuth()

  return (
    <Sidebar collapsible="icon" {...props}   
    
    

    >
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
     
        <NavGroup title="Documents" items={mockNavDocuments} />
    
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}

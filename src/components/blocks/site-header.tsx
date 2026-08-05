
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { HeaderBreadcrumbs , HeaderSearch , UserMenu } from "@/components/blocks"
import { ThemeToggle } from "./theme-toggle"


export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-14 border-b border-border/60 bg-sidebar backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="size-8 rounded-lg hover:bg-accent" />

          <Separator orientation="vertical" className="h-5" />

          <HeaderBreadcrumbs />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <HeaderSearch />

          <Separator
            orientation="vertical"
            className="mx-1 hidden h-5 md:block"
          />

          <ThemeToggle />

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
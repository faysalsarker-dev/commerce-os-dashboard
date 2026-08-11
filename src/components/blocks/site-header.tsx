

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import { HeaderBreadcrumbs, HeaderSearch, UserMenu } from "@/components/blocks"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border/60 bg-sidebar/80 backdrop-blur-xl ssupports-backdrop-filter:bg-sidebar/60">
      <div className="flex h-full items-center justify-between gap-3 px-3 lg:px-5">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="size-8 shrink-0 rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />

          <Separator orientation="vertical" className="mx-1 hidden h-5 bg-border/70 sm:block" />

          <div className="min-w-0 overflow-hidden">
            <HeaderBreadcrumbs />
          </div>
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-1.5">
          <HeaderSearch />

         

          <ThemeToggle />
 <Separator orientation="vertical" className="mx-1 hidden h-8 bg-border/70 md:block" />
          <div className="ml-0.5">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  )
}

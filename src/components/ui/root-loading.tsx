import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
 Skeleton } from "@/components/ui"

export default function PageLoader() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Sidebar */}
        <Sidebar collapsible="none">
          <SidebarHeader className="border-b p-4">
            <Skeleton className="h-8 w-36 rounded-lg" />
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarMenu>
              {Array.from({ length: 8 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-5 w-5 rounded-md" />
                      <Skeleton className="h-4 flex-1 rounded-md" />
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main */}
        <SidebarInset>
          <div

            className="flex h-full flex-col"
          >
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b px-6">
              <Skeleton className="h-8 w-52" />

              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 space-y-6 p-6">
              {/* Stats */}
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-5 space-y-4"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>

              {/* Charts + Activity */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 lg:col-span-2">
                  <Skeleton className="mb-5 h-5 w-40" />
                  <Skeleton className="h-[340px] w-full rounded-xl" />
                </div>

                <div className="rounded-xl border bg-card p-5">
                  <Skeleton className="mb-5 h-5 w-32" />

                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />

                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border bg-card p-5">
                <Skeleton className="mb-5 h-5 w-40" />

                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>

                  {Array.from({ length: 8 }).map((_, row) => (
                    <div
                      key={row}
                      className="grid grid-cols-5 gap-4 border-t pt-4"
                    >
                      {Array.from({ length: 5 }).map((_, col) => (
                        <Skeleton key={col} className="h-5 w-full" />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
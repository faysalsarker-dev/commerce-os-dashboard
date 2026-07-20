// src/components/blocks/user-menu.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  LogOutIcon,
  ChevronRightIcon,
} from "lucide-react"
import { useAuth } from "@/hooks/auth/useAuth"
import { useLogout } from "@/hooks/auth/useLogout"

const menuItems = [
  { title: "Profile", icon: UserIcon, url: "/profile" },
  { title: "Account Settings", icon: SettingsIcon, url: "/settings" },
  { title: "Billing", icon: CreditCardIcon, url: "/billing" },
]

export function UserMenu() {
  const { user } = useAuth()
  const {logout}=useLogout()
  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <Sheet>
      <SheetTrigger render={<button className="rounded-full" />}>
        <Avatar className="size-8">
          <AvatarImage src={user?.image as string} alt={user?.name} />
          <AvatarFallback>{initials || "CM"}</AvatarFallback>
        </Avatar>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-80 flex-col gap-0 p-0">
        <SheetHeader className="border-b p-6">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src={user?.image as string} alt={user?.name} />
              <AvatarFallback>{initials || "CM"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <SheetTitle className="text-base">{user?.name}</SheetTitle>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </SheetHeader>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.title}
                href={item.url}
                className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4 text-muted-foreground" />
                  {item.title}
                </span>
                <ChevronRightIcon className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            )
          })}
        </nav>

        <div className="border-t p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
          >
            <LogOutIcon className="size-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
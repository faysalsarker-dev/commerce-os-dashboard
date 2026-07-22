import { Link } from "react-router";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
 Avatar, AvatarFallback, AvatarImage , Button , Separator } from "@/components/ui";

import {
  Home,
  User,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/hooks/auth/useAuth";
import { LogoutDialog } from "./logout-dialog";
import { useState } from "react";

const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
 
];

export function UserMenu() {
  const { user } = useAuth();
const [logoutOpen, setLogoutOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CM";












  return (
    <Sheet>
      <SheetTrigger render={<button className="rounded-full outline-none bg-none"/>}>
    
          <Avatar className="size-9 cursor-pointer">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
 
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex h-full w-85 flex-col p-0"
      >
        {/* ================= Header ================= */}

        <SheetHeader className="px-6 py-10">
          <div className="flex flex-col items-center text-center">
            {/* Avatar + Active Status */}
            <div className="relative">
              <Avatar className="size-20">
                <AvatarImage src={user?.image ?? ""} />
                <AvatarFallback className="text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Messenger Active Dot */}
              <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-background">
                <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-green-500 opacity-40" />
                <span className="relative h-3 w-3 rounded-full bg-green-500" />
              </span>
            </div>

            <SheetTitle className="mt-5 text-2xl font-semibold">
              {user?.name}
            </SheetTitle>

            <p className="mt-1 text-sm font-medium text-muted-foreground capitalize">
              {user?.role ?? "Administrator"}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </SheetHeader>

        <Separator />

        {/* ================= Navigation ================= */}

        <div className="flex-1 px-4 py-6">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  to={item.href}
                  className="flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] font-medium transition-all hover:bg-muted"
                >
                  <Icon className="size-5 text-muted-foreground" />

                  <span className="flex-1">{item.title}</span>

                
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ================= Footer ================= */}

        <Separator />

        <div className="p-4">



<LogoutDialog
  open={logoutOpen}
  onOpenChange={setLogoutOpen}
/>


          <Button
            variant="ghost"
            onClick={() => setLogoutOpen(true)}
            className="h-11 w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
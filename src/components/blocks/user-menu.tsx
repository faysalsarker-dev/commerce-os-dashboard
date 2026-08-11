// import { Link } from "react-router";

// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//  Avatar, AvatarFallback, AvatarImage , Button , Separator } from "@/components/ui";

// import {
//   Home,
//   User,
//   LogOut,
// } from "lucide-react";

// import { useAuth } from "@/hooks/auth/useAuth";
// import { LogoutDialog } from "./logout-dialog";
// import { useState } from "react";

// const menuItems = [
//   {
//     title: "Home",
//     icon: Home,
//     href: "/",
//   },
//   {
//     title: "Profile",
//     icon: User,
//     href: "/profile",
//   },
 
// ];

// export function UserMenu() {
//   const { user } = useAuth();
// const [logoutOpen, setLogoutOpen] = useState(false);

//   const initials =
//     user?.name
//       ?.split(" ")
//       .map((n) => n[0])
//       .join("")
//       .slice(0, 2)
//       .toUpperCase() || "CM";












//   return (
//     <Sheet>
//       <SheetTrigger render={<button type="button" className="rounded-full outline-none bg-none"/>}>
    
//           <Avatar className="size-9 cursor-pointer">
//             <AvatarImage src={user?.image ?? ""} />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
 
//       </SheetTrigger>

//       <SheetContent
//         side="right"
//         className="flex h-full w-85 flex-col p-0"
//       >
//         {/* ================= Header ================= */}

//         <SheetHeader className="px-6 py-10">
//           <div className="flex flex-col items-center text-center">
//             {/* Avatar + Active Status */}
//             <div className="relative">
//               <Avatar className="size-20">
//                 <AvatarImage src={user?.image ?? ""} />
//                 <AvatarFallback className="text-xl">
//                   {initials}
//                 </AvatarFallback>
//               </Avatar>

//               {/* Messenger Active Dot */}
//               <span className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full border-2 border-background bg-background">
//                 <span className="absolute inline-flex h-3.5 w-3.5 animate-ping rounded-full bg-green-500 opacity-40" />
//                 <span className="relative h-3 w-3 rounded-full bg-green-500" />
//               </span>
//             </div>

//             <SheetTitle className="mt-5 text-2xl font-semibold">
//               {user?.name}
//             </SheetTitle>

//             <p className="mt-1 text-sm font-medium text-muted-foreground capitalize">
//               {user?.role ?? "Administrator"}
//             </p>

//             <p className="mt-2 text-sm text-muted-foreground">
//               {user?.email}
//             </p>
//           </div>
//         </SheetHeader>

//         <Separator />

//         {/* ================= Navigation ================= */}

//         <div className="flex-1 px-4 py-6">
//           <nav className="space-y-1">
//             {menuItems.map((item) => {
//               const Icon = item.icon;

//               return (
//                 <Link
//                   key={item.title}
//                   to={item.href}
//                   className="flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] font-medium transition-all hover:bg-muted"
//                 >
//                   <Icon className="size-5 text-muted-foreground" />

//                   <span className="flex-1">{item.title}</span>

                
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* ================= Footer ================= */}

//         <Separator />

//         <div className="p-4">



// <LogoutDialog
//   open={logoutOpen}
//   onOpenChange={setLogoutOpen}
// />


//           <Button
//             variant="ghost"
//             onClick={() => setLogoutOpen(true)}
//             className="h-11 w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
//           >
//             <LogOut className="size-5" />
//             Logout
//           </Button>
//         </div>
//       </SheetContent>
//     </Sheet>
//   );
// }

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/auth/useAuth"

export function UserMenu() {
  const { user, clearAuth } = useAuth()

  const name = user?.name ?? "User"
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="ghost"
          className="h-10 gap-2 rounded-full px-1 pr-1 transition-colors hover:bg-muted sm:pr-3"
        >
          <span className="relative">
            <Avatar className="size-8 ring-2 ring-background">
              <AvatarImage src={user?.image ?? ""} alt={name} />
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </span>
          <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
            <span className="max-w-36 truncate text-sm font-medium">{name}</span>
            <span className="max-w-36 truncate text-[11px] text-muted-foreground">
              {user?.email}
            </span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl p-1.5">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <Avatar className="size-10">
            <AvatarImage src={user?.image as string ?? ""} alt={name} />
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuGroup>
          {[
            { icon: UserIcon, label: "Profile" },
            { icon: CreditCardIcon, label: "Billing" },
            { icon: BellIcon, label: "Notifications" },
            { icon: SettingsIcon, label: "Settings" },
          ].map(({ icon: Icon, label }) => (
            <DropdownMenuItem
              key={label}
              className="gap-2.5 rounded-lg px-2.5 py-2 text-sm focus:bg-muted"
            >
              <Icon className="size-4 text-muted-foreground" />
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5" />

        <DropdownMenuItem
          onClick={() => clearAuth?.()}
          className="gap-2.5 rounded-lg px-2.5 py-2 text-sm text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOutIcon className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

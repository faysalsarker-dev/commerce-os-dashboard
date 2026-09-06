import { useState, useRef, useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import { motion } from "framer-motion"
import {
  Printer,
  ArrowLeft,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Shield,
  Building2,
  CheckCircle2,
  RotateCw,
  QrCode,
  UserPlus,
  Sparkles,
  IdCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useGetUserQuery } from "@/redux/features/user/user.api"
import type { User } from "@/types/data-types/user/user.type"
import { Role } from "@/types/data-types/enums"
import { cn } from "@/lib/utils"

const ROLE_COLORS: Record<
  Role,
  {
    gradient: string
    badgeBg: string
    text: string
    accent: string
    label: string
  }
> = {
  [Role.SUPER_ADMIN]: {
    gradient: "from-amber-600 via-orange-600 to-amber-700",
    badgeBg: "bg-amber-500 text-white",
    text: "text-amber-600 dark:text-amber-400",
    accent: "border-amber-500",
    label: "SUPER ADMIN",
  },
  [Role.ADMIN]: {
    gradient: "from-indigo-600 via-blue-600 to-indigo-700",
    badgeBg: "bg-indigo-600 text-white",
    text: "text-indigo-600 dark:text-indigo-400",
    accent: "border-indigo-500",
    label: "ADMINISTRATOR",
  },
  [Role.MANAGER]: {
    gradient: "from-sky-600 via-cyan-600 to-teal-700",
    badgeBg: "bg-sky-600 text-white",
    text: "text-sky-600 dark:text-sky-400",
    accent: "border-sky-500",
    label: "OPERATIONS MANAGER",
  },
  [Role.MARKETER]: {
    gradient: "from-purple-600 via-pink-600 to-purple-700",
    badgeBg: "bg-purple-600 text-white",
    text: "text-purple-600 dark:text-purple-400",
    accent: "border-purple-500",
    label: "MARKETING SPECIALIST",
  },
  [Role.SALESMAN]: {
    gradient: "from-emerald-600 via-teal-600 to-emerald-700",
    badgeBg: "bg-emerald-600 text-white",
    text: "text-emerald-600 dark:text-emerald-400",
    accent: "border-emerald-500",
    label: "SALES & POS EXECUTIVE",
  },
}

export default function UserIdCard() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [side, setSide] = useState<"front" | "back">("front")
  const printRef = useRef<HTMLDivElement>(null)

  // Retrieve user passed from creation state, or fetch from API
  const stateUser = location.state?.user as User | undefined
  const { data: response, isLoading } = useGetUserQuery(id as string, {
    skip: Boolean(stateUser),
  })

  const user: User | undefined = stateUser || response?.data

  const roleStyle = useMemo(() => {
    if (!user?.role) return ROLE_COLORS[Role.SALESMAN]
    return ROLE_COLORS[user.role] || ROLE_COLORS[Role.SALESMAN]
  }, [user?.role])

  const empCode = useMemo(() => {
    if (!user?.id) return "EMP-000000"
    return `EMP-${user.id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase()}`
  }, [user?.id])

  const handlePrint = () => {
    window.print()
  }

  if (isLoading && !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Loading employee badge...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
        <IdCard className="size-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">User Not Found</h2>
        <p className="text-sm text-muted-foreground">
          Could not locate details for this employee badge.
        </p>
        <Button onClick={() => navigate("/app/users")}>Return to Users</Button>
      </div>
    )
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] p-4 sm:p-8 flex flex-col items-center justify-center">
      {/* Print CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-card-container, #printable-card-container * {
            visibility: visible !important;
          }
          #printable-card-container {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 320px !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating Action Controls Header (Hidden during Print) */}
      <div className="no-print w-full max-w-3xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/90 backdrop-blur-md border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/app/users")}
            className="gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Users
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/app/users/${user.id}`)}
            className="gap-1.5 cursor-pointer"
          >
            <UserIcon className="size-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/users/create")}
            className="gap-1.5 cursor-pointer"
          >
            <UserPlus className="size-4" />
            Add Another
          </Button>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSide((prev) => (prev === "front" ? "back" : "front"))}
            className="gap-1.5 cursor-pointer"
          >
            <RotateCw className="size-3.5" />
            Flip to {side === "front" ? "Back" : "Front"}
          </Button>

          <Button
            size="sm"
            onClick={handlePrint}
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Printer className="size-4" />
            Print ID Card
          </Button>
        </div>
      </div>

      {/* Central Printable ID Card Wrapper */}
      <div
        id="printable-card-container"
        ref={printRef}
        className="flex flex-col items-center"
      >
        {/* Lanyard Slot Clip simulation */}
        <div className="no-print -mb-3 z-20 flex items-center justify-center">
          <div className="w-16 h-3 rounded-full bg-border/90 border border-muted-foreground/30 shadow-inner flex items-center justify-center">
            <div className="w-12 h-1.5 rounded-full bg-background" />
          </div>
        </div>

        {/* Card Component */}
        <motion.div
          key={side}
          initial={{ rotateY: side === "front" ? -90 : 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut", type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-[330px] sm:w-[350px] min-h-[540px] rounded-[2rem] overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col justify-between text-zinc-900 dark:text-zinc-100"
          style={{
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {side === "front" ? (
            /* FRONT OF ID CARD */
            <div className="flex flex-col h-full relative">
              {/* Header Gradient Banner */}
              <div
                className={cn(
                  "relative h-[150px] bg-gradient-to-br p-6 text-white flex flex-col justify-between overflow-hidden",
                  roleStyle.gradient
                )}
              >
                {/* Decorative Elements */}
                <div className="absolute -right-12 -top-12 size-36 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute right-0 bottom-0 size-24 bg-gradient-to-tl from-white/10 to-transparent blur-xl pointer-events-none" />
                <div className="absolute right-4 bottom-4 text-white/10 pointer-events-none mix-blend-overlay transform -rotate-12 scale-110">
                  <Building2 className="size-24" />
                </div>

                <div className="flex items-start justify-between z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-white/20">
                      <Sparkles className="size-4 text-white drop-shadow-md" />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-sm font-black tracking-[0.2em] uppercase leading-none text-white drop-shadow-sm">
                        COMMERCE OS
                      </h4>
                      <span className="text-[9px] font-semibold text-white/80 tracking-[0.15em] uppercase mt-0.5">
                        IDENTITY BADGE
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-mono tracking-widest text-white uppercase border border-white/10 shadow-inner">
                      {empCode}
                    </span>
                  </div>
                </div>

                <div className="z-10 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/90 drop-shadow-sm">
                    OFFICIAL PASS
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm text-[9px] font-bold text-emerald-100 tracking-wider">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                    ACTIVE
                  </div>
                </div>
              </div>

              {/* Holographic Seal (Simulated) */}
              <div className="absolute top-[135px] right-6 size-10 rounded-full bg-gradient-to-tr from-amber-200 via-pink-300 to-cyan-300 p-[1px] shadow-lg z-20 opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500">
                <div className="size-full rounded-full bg-gradient-to-bl from-white/40 to-transparent flex items-center justify-center backdrop-blur-sm border border-white/40">
                  <Shield className="size-4 text-white/90 drop-shadow-md" />
                </div>
              </div>

              {/* Avatar overlapping banner */}
              <div className="px-7 pb-7 pt-0 flex-1 flex flex-col items-center text-center">
                <div className="relative -mt-16 mb-4 z-10 group">
                  <div
                    className={cn(
                      "size-[120px] rounded-2xl border-[4px] border-[#fafafa] dark:border-[#0a0a0a] overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.15)] bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center relative",
                      roleStyle.accent
                    )}
                  >
                    {user.image ? (
                      <img
                         src={user.image}
                         alt={user.name}
                         className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="size-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-3xl font-black text-zinc-500 dark:text-zinc-400">
                        {user.name
                           .trim()
                           .split(" ")
                           .slice(0, 2)
                           .map((n) => n[0]?.toUpperCase())
                           .join("")}
                      </div>
                    )}
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-xl" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="size-5 text-emerald-500" />
                  </div>
                </div>

                {/* Name & Designation */}
                <h3 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                  {user.name}
                </h3>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                  {user.employeeDetail?.designation || "Staff Member"}
                </p>

                {/* Role Pill */}
                <div className="mt-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase shadow-sm border border-transparent",
                      roleStyle.badgeBg,
                      "dark:border-white/10"
                    )}
                  >
                    <Shield className="size-3" />
                    {roleStyle.label}
                  </span>
                </div>

                {/* Information Grid */}
                <div className="w-full mt-6 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80 space-y-3 text-left text-xs bg-zinc-50/50 dark:bg-zinc-900/50 -mx-7 px-7 pb-5">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 group">
                    <span className="flex items-center gap-2 text-[11px] font-medium transition-colors group-hover:text-primary">
                      <div className="size-5 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center"><Mail className="size-3" /></div> Email
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[160px]" title={user.email}>
                      {user.email}
                    </span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 group">
                      <span className="flex items-center gap-2 text-[11px] font-medium transition-colors group-hover:text-primary">
                        <div className="size-5 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center"><Phone className="size-3" /></div> Phone
                      </span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
                        {user.phone}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 group">
                    <span className="flex items-center gap-2 text-[11px] font-medium transition-colors group-hover:text-primary">
                      <div className="size-5 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center"><Calendar className="size-3" /></div> Issue Date
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
                      {user.employeeDetail?.joinDate || new Date().toISOString().split("T")[0]}
                    </span>
                  </div>

                  {(user.employeeDetail?.nidNumber ||
                    user.employeeDetail?.birthCertificateNumber) && (
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 group">
                      <span className="flex items-center gap-2 text-[11px] font-medium transition-colors group-hover:text-primary">
                        <div className="size-5 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center"><IdCard className="size-3" /></div> Legal ID
                      </span>
                      <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {user.employeeDetail?.nidNumber
                          ? `NID ••••${user.employeeDetail.nidNumber.slice(-4)}`
                          : `BC ••••${user.employeeDetail?.birthCertificateNumber?.slice(-4)}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Barcode & Security Stripe */}
                <div className="w-full mt-auto pt-4 flex items-center justify-between relative">
                  {/* Decorative Barcode */}
                  <div className="flex flex-col items-start">
                    <div className="flex items-end gap-[2px] h-7 opacity-80">
                      {[3, 1, 4, 2, 5, 1, 3, 2, 4, 1, 2, 5, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3].map(
                        (h, idx) => (
                          <div
                            key={idx}
                            className="bg-zinc-900 dark:bg-zinc-100 w-[2.5px] rounded-[1px]"
                            style={{ height: `${h * 5.5}px` }}
                          />
                        )
                      )}
                    </div>
                    <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-500 mt-1 font-semibold">
                      {empCode}
                    </span>
                  </div>

                  <div className="size-11 rounded-xl bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-sm">
                    <QrCode className="size-6 text-zinc-800 dark:text-zinc-200" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* BACK OF ID CARD */
            <div className="flex flex-col h-full justify-between pb-6">
              <div className="space-y-5">
                {/* Magnetic Stripe representation */}
                <div className="h-14 bg-zinc-900 dark:bg-black w-full flex items-end justify-end p-2 shadow-inner mt-6">
                  <span className="text-[8px] font-mono text-zinc-600 tracking-[0.2em] mb-1 mr-2 opacity-50">
                    SECURE MAGSTRIPE TRACK
                  </span>
                </div>

                {/* Terms of card */}
                <div className="px-6 space-y-2.5 text-left">
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                    <Shield className="size-3.5 text-primary" />
                    Terms & Conditions
                  </h5>
                  <p className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    This identification card is the exclusive property of <strong className="text-zinc-900 dark:text-zinc-200">Commerce OS</strong>. It is non-transferable and must be visibly displayed at all times while on company premises. Surrender immediately upon termination of employment or upon request by security personnel.
                  </p>
                </div>

                {/* Emergency Return Notice */}
                <div className="mx-6 p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50 text-left space-y-1.5 shadow-inner">
                  <p className="text-[10px] font-black text-zinc-800 dark:text-zinc-200 uppercase tracking-widest flex items-center gap-1.5">
                    <RotateCw className="size-3" /> Return Address
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Commerce OS Retail Operations Center<br />
                    Human Resources & Access Control<br />
                    <span className="text-zinc-800 dark:text-zinc-300 font-bold">Hotline: +880 1800-000000</span>
                  </p>
                  {user.employeeDetail?.emergencyContact && (
                    <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-zinc-800">
                      <p className="text-[10px] text-zinc-600 dark:text-zinc-400 flex items-center justify-between">
                        <span className="font-bold">Emergency Contact:</span>
                        <span className="font-mono font-semibold text-primary">{user.employeeDetail.emergencyContact}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Signature & Serial */}
              <div className="px-6 pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-32 border-b-2 border-zinc-800 dark:border-zinc-400 flex items-end justify-center pb-1">
                      <span className="font-serif italic text-lg text-zinc-800 dark:text-zinc-200 font-bold opacity-80">
                        CommerceOS
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-500 uppercase font-bold tracking-widest mt-1">
                      Authorized Signatory
                    </span>
                  </div>

                  <div className="text-right">
                    <Badge variant="outline" className="text-[10px] font-mono tracking-wider bg-zinc-50 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700">
                      EXP: {new Date().getFullYear() + 2}/12
                    </Badge>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 tracking-[0.15em] uppercase font-semibold">
                    SYS-UUID: {user.id.split('-').pop() || user.id}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Printing helper tooltip */}
      <p className="no-print text-xs text-muted-foreground mt-6 text-center">
        Tip: Click <strong>"Print ID Card"</strong> to print directly onto standard card stock or generate a clean PDF badge.
      </p>
    </div>
  )
}

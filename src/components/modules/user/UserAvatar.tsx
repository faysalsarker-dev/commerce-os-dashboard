import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { initialsFrom } from "@/lib/format";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  isOnline?: boolean;
  className?: string;
}

export function UserAvatar({ name, image, isOnline = false, className }: UserAvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-border/60 bg-primary/10 text-primary">
        {image ? (
          <img src={image} alt={`${name} profile photo`} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xl font-semibold tracking-tight sm:text-2xl">
            {initialsFrom(name)}
          </span>
        )}
      </div>
      {isOnline && (
        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center">
          <motion.span
            aria-hidden
            className="absolute inline-flex h-full w-full rounded-full bg-emerald-500/60"
            animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <span
            className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background"
            aria-label="Online"
          />
        </span>
      )}
    </div>
  );
}

export default UserAvatar;

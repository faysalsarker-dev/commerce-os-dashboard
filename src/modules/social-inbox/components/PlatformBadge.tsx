import { cn } from "@/lib/utils";
import { PLATFORM_CONFIG } from "../utils/platformConfig";
import type { Platform } from "../types";
import { PlatformIcon } from "./PlatformIcon";

interface PlatformBadgeProps {
  platform: Platform;
  className?: string;
  showLabel?: boolean;
}

export function PlatformBadge({ platform, className, showLabel = true }: PlatformBadgeProps) {
  const config = PLATFORM_CONFIG[platform];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        config.colorClass,
        className
      )}
    >
      <PlatformIcon platform={platform} size={11} />
      {showLabel && config.label}
    </span>
  );
}


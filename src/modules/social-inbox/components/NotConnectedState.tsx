import disconnectedImg from "@/assets/system/disconnected.png";
import { Button } from "@/components/ui/button";
import { PLATFORM_CONFIG } from "../utils/platformConfig";
import type { Platform } from "../types";

interface NotConnectedStateProps {
  platform: Platform;
}

export function NotConnectedState({ platform }: NotConnectedStateProps) {
  const label = PLATFORM_CONFIG[platform].label;
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4 py-8 text-center select-none">
      <div className="flex w-[85%] flex-col items-center justify-center">
        <img
          src={disconnectedImg}
          alt={`${label} not connected`}
          className="w-full max-w-[260px] object-contain"
        />

        <div className="mt-4 space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {label} not connected
          </p>
          <p className="mx-auto max-w-[240px] text-xs leading-relaxed text-muted-foreground">
            Connect your {label} account to manage customer messages in one place.
          </p>
        </div>

        <Button
          size="sm"
          className="mt-5"
          onClick={() => {
            /* OAuth / connection flow — UI only */
          }}
          aria-label={`Connect ${label} account`}
        >
          Connect {label}
        </Button>
      </div>
    </div>
  );
}

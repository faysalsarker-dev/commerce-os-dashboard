import { Link } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { PLATFORM_CONFIG } from "../utils/platformConfig";
import type { Platform } from "../types";

interface NotConnectedStateProps {
  platform: Platform;
}

export function NotConnectedState({ platform }: NotConnectedStateProps) {
  const label = PLATFORM_CONFIG[platform].label;
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        icon={Link}
        title={`${label} not connected`}
        description={`Connect your ${label} account to manage customer messages in one place.`}
        action={
          <Button
            size="sm"
            onClick={() => {
              /* OAuth / connection flow — UI only */
            }}
            aria-label={`Connect ${label} account`}
          >
            Connect {label}
          </Button>
        }
      />
    </div>
  );
}


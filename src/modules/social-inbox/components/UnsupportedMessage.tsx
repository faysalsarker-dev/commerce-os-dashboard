import { ExternalLink } from "lucide-react";
import type { Platform } from "../types";

interface UnsupportedMessageProps {
  platform: Platform;
}

const PLATFORM_LABEL: Record<Platform, string> = {
  messenger: "Messenger",
  instagram: "Instagram",
  tiktok: "TikTok",
  whatsapp: "WhatsApp",
};

export function UnsupportedMessage({ platform }: UnsupportedMessageProps) {
  const label = PLATFORM_LABEL[platform];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground italic">
      <ExternalLink className="size-3 shrink-0" />
      Customer sent a sticker. Open in {label} app to view.
    </span>
  );
}


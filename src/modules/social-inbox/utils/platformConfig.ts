import type { Platform } from "../types";

export interface PlatformConfig {
  label: string;
  /** Tailwind classes for the brand color pill/badge */
  colorClass: string;
  /** Tailwind classes for the brand icon color */
  iconColorClass: string;
  /** Hex color for inline SVG fill */
  brandColor: string;
}

export const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  messenger: {
    label: "Messenger",
    colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    brandColor: "#0084FF",
  },
  instagram: {
    label: "Instagram",
    colorClass: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    iconColorClass: "text-pink-600 dark:text-pink-400",
    brandColor: "#E1306C",
  },
  tiktok: {
    label: "TikTok",
    colorClass: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
    iconColorClass: "text-neutral-700 dark:text-neutral-300",
    brandColor: "#010101",
  },
  whatsapp: {
    label: "WhatsApp",
    colorClass: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    iconColorClass: "text-green-600 dark:text-green-400",
    brandColor: "#25D366",
  },
};


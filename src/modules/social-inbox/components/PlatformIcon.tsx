import { cn } from "@/lib/utils";
import type { Platform } from "../types";

interface PlatformIconProps {
  platform: Platform;
  className?: string;
  size?: number;
}

/**
 * Renders the official SVG brand icon for each platform.
 * Icons are inlined to avoid any new icon-library dependency.
 */
export function PlatformIcon({ platform, className, size = 16 }: PlatformIconProps) {
  const cls = cn("shrink-0", className);

  if (platform === "messenger") {
    return (
      <svg
        aria-label="Messenger"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={cls}
      >
        <defs>
          <linearGradient id="msg_grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#00B2FF" />
            <stop offset="1" stopColor="#006AFF" />
          </linearGradient>
        </defs>
        <path
          d="M12 2C6.477 2 2 6.145 2 11.243c0 2.919 1.467 5.527 3.773 7.237V22l3.498-1.924A10.57 10.57 0 0012 20.486c5.523 0 10-4.145 10-9.243S17.523 2 12 2z"
          fill="url(#msg_grad)"
        />
        <path
          d="M13.063 14.5l-2.558-2.73-4.991 2.73 5.489-5.826 2.621 2.73 4.928-2.73-5.489 5.826z"
          fill="#fff"
        />
      </svg>
    );
  }

  if (platform === "instagram") {
    return (
      <svg
        aria-label="Instagram"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={cls}
      >
        <defs>
          <radialGradient id="ig_grad" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#ffd600" />
            <stop offset="50%" stopColor="#ff0069" />
            <stop offset="100%" stopColor="#d300c5" />
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig_grad)" />
        <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.25" fill="none" stroke="white" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="white" />
      </svg>
    );
  }

  if (platform === "tiktok") {
    return (
      <svg
        aria-label="TikTok"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        className={cls}
      >
        <rect width="24" height="24" rx="5" fill="#010101" />
        <path
          d="M17.5 7.5a3.5 3.5 0 01-3.5-3.5h-2.5v11.25a2 2 0 11-2-2 2 2 0 01.5.065V10.75A4.5 4.5 0 008 19a4.5 4.5 0 004.5-4.5V9.635A6 6 0 0017.5 10V7.5z"
          fill="white"
        />
        <path
          d="M17 7.25A3.25 3.25 0 0113.75 4h-.25v10.5a1.75 1.75 0 11-1.75-1.75c.08 0 .16.005.238.015V10.5A4.25 4.25 0 008.25 19 4.25 4.25 0 0012.5 14.75V9.413A5.75 5.75 0 0017 10.25V7.25z"
          fill="#FE2C55"
        />
        <path
          d="M12.5 14.75A1.75 1.75 0 1010.75 13c.08 0 .16.005.238.015v.247a1.75 1.75 0 001.512 1.73V14.75z"
          fill="#25F4EE"
        />
      </svg>
    );
  }

  // whatsapp
  return (
    <svg
      aria-label="WhatsApp"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cls}
    >
      <rect width="24" height="24" rx="5" fill="#25D366" />
      <path
        d="M12 4a8 8 0 00-6.895 12.016L4 20l4.098-1.071A8 8 0 1012 4zm0 14.5a6.498 6.498 0 01-3.313-.908l-.237-.141-2.433.636.65-2.37-.154-.244A6.5 6.5 0 1112 18.5zm3.57-4.87c-.196-.098-1.16-.572-1.34-.637-.18-.065-.31-.098-.44.098-.13.196-.503.637-.617.768-.114.13-.228.147-.424.049-.196-.098-.827-.305-1.574-.972-.581-.52-.974-1.162-1.088-1.358-.114-.196-.012-.302.085-.4.088-.087.196-.228.294-.342.098-.114.13-.196.195-.326.065-.13.033-.244-.016-.342-.049-.098-.44-1.063-.603-1.456-.159-.38-.32-.33-.44-.336-.114-.006-.244-.007-.374-.007-.13 0-.342.049-.521.244-.18.196-.685.669-.685 1.633 0 .964.7 1.895.797 2.025.098.13 1.376 2.1 3.335 2.944.466.2.83.32 1.113.41.468.148.894.127 1.231.077.375-.056 1.16-.473 1.323-.93.164-.455.164-.845.115-.928-.049-.082-.18-.13-.375-.228z"
        fill="white"
      />
    </svg>
  );
}


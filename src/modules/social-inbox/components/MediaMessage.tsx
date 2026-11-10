import { Image, Video, FileAudio, FileText } from "lucide-react";
import type { Message } from "../types";

interface MediaMessageProps {
  message: Message;
}

export function MediaMessage({ message }: MediaMessageProps) {
  if (message.type === "image") {
    return (
      <div className="overflow-hidden rounded-lg">
        <img
          src={message.mediaUrl}
          alt={message.text ?? "Image"}
          className="max-h-56 w-full max-w-xs rounded-lg object-cover"
          loading="lazy"
        />
        {message.text && (
          <p className="mt-1.5 text-sm">{message.text}</p>
        )}
      </div>
    );
  }

  if (message.type === "video") {
    return (
      <div>
        <video
          src={message.mediaUrl}
          controls
          className="max-h-56 max-w-xs rounded-lg"
          aria-label="Video message"
        />
        {message.text && <p className="mt-1.5 text-sm">{message.text}</p>}
      </div>
    );
  }

  if (message.type === "audio") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
        <FileAudio className="size-4 shrink-0 text-muted-foreground" />
        <audio src={message.mediaUrl} controls className="h-7 flex-1" aria-label="Audio message" />
      </div>
    );
  }

  if (message.type === "file") {
    return (
      <a
        href={message.mediaUrl ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm hover:bg-muted transition-colors"
        aria-label="Download file attachment"
      >
        <FileText className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{message.text ?? "File attachment"}</span>
      </a>
    );
  }

  // Fallback icon for other inline media
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
      <Image className="size-4 shrink-0" />
      <span>Media</span>
    </div>
  );
}


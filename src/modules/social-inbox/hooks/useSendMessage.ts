import { useCallback, useRef, useState } from "react";
import type { Message, MessageTemplate } from "../types";

interface SendTextPayload {
  conversationId: string;
  text: string;
}

interface SendTemplatePayload {
  conversationId: string;
  template: MessageTemplate;
}

type SendPayload = SendTextPayload | SendTemplatePayload;

interface UseSendMessageResult {
  send: (payload: SendPayload) => Promise<Message>;
  isSending: boolean;
}

function isTemplatePayload(p: SendPayload): p is SendTemplatePayload {
  return "template" in p;
}

/**
 * Appends an optimistic 'sending' message, then resolves to 'sent'.
 *
 * SWAP POINT: Replace the setTimeout simulation with a real API call, e.g.:
 *   const [sendMessageMutation] = useSendMessageMutation()
 *   await sendMessageMutation(payload).unwrap()
 * The returned Message shape stays identical.
 */
export function useSendMessage(
  onMessageSent: (message: Message) => void
): UseSendMessageResult {
  const [isSending, setIsSending] = useState(false);
  // monotonic counter so IDs are unique within the session
  const counter = useRef(0);

  const send = useCallback(
    async (payload: SendPayload): Promise<Message> => {
      setIsSending(true);
      const tempId = `msg_local_${Date.now()}_${++counter.current}`;

      const optimistic: Message = {
        id: tempId,
        conversationId: payload.conversationId,
        externalMessageId: "",
        direction: "outbound",
        type: isTemplatePayload(payload) ? "template" : "text",
        text: isTemplatePayload(payload) ? undefined : payload.text,
        template: isTemplatePayload(payload) ? payload.template : undefined,
        status: "sending",
        createdAt: new Date().toISOString(),
      };

      onMessageSent(optimistic);

      return new Promise<Message>((resolve) => {
        setTimeout(() => {
          const sent: Message = { ...optimistic, status: "sent" };
          onMessageSent(sent); // triggers UI update (replace optimistic)
          setIsSending(false);
          resolve(sent);
        }, 800);
      });
    },
    [onMessageSent]
  );

  return { send, isSending };
}


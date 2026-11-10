import type { MessageTemplate } from "../types";

export const mockTemplates: MessageTemplate[] = [
  {
    id: "tpl_order_update",
    name: "order_update",
    language: "en_US",
    category: "UTILITY",
    headerText: "Order Status Update",
    bodyText:
      "Hi {{1}}, your order #{{2}} has been dispatched and is on its way. Expected delivery: {{3}}. Track here: {{4}}",
    footerText: "Commerce OS Store",
  },
  {
    id: "tpl_refund_confirmation",
    name: "refund_confirmation",
    language: "en_US",
    category: "UTILITY",
    headerText: "Refund Processed",
    bodyText:
      "Dear {{1}}, your refund of ৳{{2}} for order #{{3}} has been successfully processed. It will reflect in 3-5 business days.",
    footerText: "Commerce OS Store",
  },
  {
    id: "tpl_welcome_back",
    name: "welcome_back",
    language: "en_US",
    category: "MARKETING",
    headerText: "We Miss You! 🛍️",
    bodyText:
      "Hi {{1}}! It's been a while. Here's an exclusive 10% off coupon just for you: {{2}}. Valid until {{3}}.",
    footerText: "Reply STOP to unsubscribe",
  },
  {
    id: "tpl_delivery_failed",
    name: "delivery_failed",
    language: "en_US",
    category: "UTILITY",
    headerText: "Delivery Attempt Failed",
    bodyText:
      "Hi {{1}}, we were unable to deliver order #{{2}} on {{3}}. Please contact us to reschedule your delivery.",
    footerText: "Commerce OS Store",
  },
  {
    id: "tpl_payment_reminder",
    name: "payment_reminder",
    language: "en_US",
    category: "UTILITY",
    headerText: "Payment Reminder",
    bodyText:
      "Hi {{1}}, your payment of ৳{{2}} for order #{{3}} is pending. Please complete your payment by {{4}} to avoid cancellation.",
    footerText: "Commerce OS Store",
  },
];


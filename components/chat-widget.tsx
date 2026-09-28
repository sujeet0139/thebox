"use client";

import { MessageSquareText, PhoneCall, Send, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { useSiteSettings } from "@/components/site-settings-provider";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

function getBotReply(message: string) {
  const normalized = message.trim().toLowerCase();

  if (!normalized) return "Tell me what you need help with — quote, sizes, delivery timeline, or product selection.";

  if (/(quote|price|pricing|rate|cost)/.test(normalized)) {
    return "For accurate pricing, share box type, size (L×W×H), quantity, printing needs, and delivery city. Tap “Request a Quote” to message our team.";
  }

  if (/(delivery|dispatch|timeline|turnaround|ship|shipping)/.test(normalized)) {
    return "Delivery timelines depend on product type and quantity. Share the product and your city — we’ll confirm the best dispatch window.";
  }

  if (/(custom|printing|print|logo|branding|lamination|die|cut)/.test(normalized)) {
    return "Customisation is available for many products. Tell me the box type, size, and printing details — our team will guide you.";
  }

  if (/(track|tracking|status|update)/.test(normalized)) {
    return "For order updates, please share your order details on WhatsApp and we’ll respond with the latest status.";
  }

  return "I can help with product selection, customisation, pricing, and timelines. What do you need?";
}

export function ChatWidget() {
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const whatsappHref = useMemo(() => {
    const text = "Hi TheBoxMakers, I need help with packaging (quote / product / delivery).";
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  }, [settings.whatsapp]);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "bot",
      text: "Hi! I’m your packaging assistant. Ask me about products, pricing, customisation, or delivery timelines.",
    },
  ]);

  function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userId = `${Date.now()}-u`;
    const botId = `${Date.now()}-b`;

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", text: trimmed },
      { id: botId, role: "bot", text: getBotReply(trimmed) },
    ]);
    setDraft("");
    queueMicrotask(() => inputRef.current?.focus());
  }

  return (
    <div className="fixed bottom-6 right-4 z-50">
      {open ? (
        <div className="mb-3 w-[92vw] max-w-sm overflow-hidden rounded-[26px] border border-[#dcc7aa]/70 bg-white shadow-2xl">
          <div className="flex items-center justify-between gap-3 bg-forest px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">Packaging Assistant</p>
                <p className="text-xs text-white/70">Replies instantly • Connects to WhatsApp</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-auto bg-[#f6f1e8]/55 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl bg-forest px-3 py-2 text-sm leading-6 text-white"
                    : "mr-auto max-w-[88%] rounded-2xl border border-[#dcc7aa]/60 bg-white px-3 py-2 text-sm leading-6 text-ink/80"
                }
              >
                {message.text}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => sendMessage("I need a quote")}
                className="rounded-full border border-[#dcc7aa]/70 bg-white px-3 py-2 text-xs font-semibold text-forest transition hover:bg-sand/40"
              >
                Request a Quote
              </button>
              <button
                type="button"
                onClick={() => sendMessage("What is the delivery timeline?")}
                className="rounded-full border border-[#dcc7aa]/70 bg-white px-3 py-2 text-xs font-semibold text-forest transition hover:bg-sand/40"
              >
                Delivery Timeline
              </button>
            </div>
          </div>

          <div className="border-t border-[#dcc7aa]/60 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(draft);
                }}
                placeholder="Type a message…"
                className="h-10 w-full rounded-full border border-[#dcc7aa]/70 bg-white px-4 text-sm text-ink outline-none transition focus:border-gold/80 focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="button"
                onClick={() => sendMessage(draft)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gold text-forest shadow-[0_14px_35px_rgba(197,154,92,0.35)] transition hover:-translate-y-0.5 hover:bg-gold/90"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#20c15a]"
              >
                Continue on WhatsApp
              </a>
              <a
                href={`tel:${settings.phone.replace(/\\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-[#dcc7aa]/70 bg-white px-3 py-2 text-xs font-semibold text-forest transition hover:bg-sand/40"
              >
                <PhoneCall className="h-3.5 w-3.5" />
                Call
              </a>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          queueMicrotask(() => inputRef.current?.focus());
        }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-forest text-white shadow-2xl transition hover:-translate-y-1 hover:bg-forest/90"
        aria-label="Open chat"
      >
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-gold ring-4 ring-cream/90" />
        <MessageSquareText className="h-6 w-6 transition group-hover:scale-105" />
      </button>
    </div>
  );
}


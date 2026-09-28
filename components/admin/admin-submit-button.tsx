"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { cn } from "@/utils/cn";

type AdminSubmitButtonProps = {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
  processing?: boolean;
};

export function AdminSubmitButton({
  children,
  className,
  pendingLabel = "Processing... Please wait",
  processing = false,
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isBusy = pending || processing;

  return (
    <button
      type="submit"
      disabled={isBusy}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      <span>{isBusy ? pendingLabel : children}</span>
    </button>
  );
}

export function AdminProcessingNotice({ processing = false }: { processing?: boolean }) {
  const { pending } = useFormStatus();

  if (!pending && !processing) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-forest/10 bg-sand/70 px-4 py-3 text-sm font-medium text-forest">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Processing... Please wait</span>
    </div>
  );
}
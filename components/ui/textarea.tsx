import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[160px] w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-50 placeholder:text-slate-400 shadow-inner shadow-black/20 outline-none transition focus:ring-2 focus:ring-cyan-400 focus:ring-offset-0 border border-white/10 frosted-scrollbar",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

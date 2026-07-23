import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-950 shadow-xs transition-colors outline-none placeholder:text-zinc-400 focus-visible:border-emerald-700 focus-visible:ring-3 focus-visible:ring-emerald-700/15 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:opacity-70 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

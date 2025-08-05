import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-600/20 focus-visible:ring-offset-2 no-underline hover:no-underline",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white rounded-full shadow hover:bg-blue-700",
        primary:
          "bg-blue-700 text-white rounded-full shadow-md hover:bg-blue-800",
        destructive:
          "bg-destructive text-white rounded-md hover:bg-destructive/90",
        outline:
          "border border-brand-lighter/20 bg-white rounded-lg hover:bg-white/80",
        secondary:
          "bg-white/80 text-brand rounded-full hover:bg-brand-lighter/10",
        ghost:
          "hover:bg-white/80 rounded-md",
        link: "text-brandPurple underline-offset-4 hover:underline",
      },
      size: {
        default: "px-6 py-2",
        sm: "px-4 py-1 text-xs",
        lg: "px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#b76e79] text-white hover:bg-[#a05d68] focus-visible:ring-[#b76e79] shadow-sm hover:shadow-md",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        outline:
          "border-2 border-[#b76e79] text-[#b76e79] bg-transparent hover:bg-[#b76e79]/10",
        secondary:
          "bg-[#f5e6da] text-[#2d1a1f] hover:bg-[#edd5c8]",
        ghost:
          "hover:bg-[#f5e6da] hover:text-[#b76e79]",
        link:
          "text-[#b76e79] underline-offset-4 hover:underline",
        gold:
          "bg-linear-to-r from-[#b76e79] to-[#d4a0a8] text-white hover:from-[#a05d68] hover:to-[#c9858f] shadow-md hover:shadow-lg",
        dark:
          "bg-[#1a0d10] text-white hover:bg-[#2d1a1f] shadow-sm hover:shadow-md",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm:      "h-8 rounded-full px-4 text-xs",
        lg:      "h-12 rounded-full px-10 text-base",
        xl:      "h-14 rounded-full px-12 text-lg",
        icon:    "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

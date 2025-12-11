import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Premium variants
        gold: "border-transparent bg-primary/15 text-primary font-medium",
        navy: "border-transparent bg-secondary text-secondary-foreground",
        success: "border-transparent bg-success/15 text-success font-medium",
        warning: "border-transparent bg-warning/15 text-warning font-medium",
        info: "border-transparent bg-info/15 text-info font-medium",
        muted: "border-transparent bg-muted text-muted-foreground",
        // Category badges for tours
        dubai: "border-transparent bg-info/15 text-info",
        "abu-dhabi": "border-transparent bg-success/15 text-success",
        desert: "border-transparent bg-warning/15 text-accent",
        adventure: "border-transparent bg-destructive/15 text-destructive",
        cruise: "border-transparent bg-primary/15 text-primary",
        experience: "border-transparent bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };

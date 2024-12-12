import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/components/lib/utils";

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-green-950 dark:focus-visible:ring-green-300 ',
    {
        variants: {
            variant: {
                default: 'bg-primary hover:bg-primary/90 text-background',
                destructive: 'bg-destructive hover:bg-destructive/90 text-background',
                outline: 'border text-background border-green-200 bg-background',
                secondary: 'bg-secondary text-background',
                ghost: 'text-background ',
                link: 'text-background underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                xlg: 'h-14 rounded-md px-12',
                icon: 'h-10 w-10',
              },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
          },
    }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, size, variant, asChild = false, ...props}) => {
        const Comp = asChild ? Slot : 'button';
        return (
            <Comp
                className={cn(buttonVariants({ className, size, variant }))}
                {...props}
                />
        )
    });

Button.displayName = 'Button';

export default Button;

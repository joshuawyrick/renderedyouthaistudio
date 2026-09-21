import React from 'react';
import { cn } from "@/lib/utils";
import { Loader2 } from 'lucide-react';

interface RYButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const RYButton = React.forwardRef<HTMLButtonElement, RYButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center gap-2 rounded-md font-semibold",
      "transition-all duration-200 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ry-yellow focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
    );
    
    const variants = {
      // Primary: Yellow with black border and shadow (distinctive RY style)
      primary: cn(
        "bg-ry-yellow text-ry-black border-2 border-ry-black",
        "shadow-button hover:shadow-button-hover",
        "hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
      ),
      // Secondary: Outlined black
      secondary: cn(
        "bg-transparent text-ry-black border-2 border-ry-black",
        "hover:bg-ry-black hover:text-white"
      ),
      // Outline: Same as secondary (for compatibility)
      outline: cn(
        "bg-transparent text-ry-black border-2 border-ry-black",
        "hover:bg-ry-black hover:text-white"
      ),
      // Tertiary: Text only
      tertiary: cn(
        "bg-transparent text-ry-black border-none",
        "hover:text-ry-yellow underline-offset-4 hover:underline"
      ),
      // Destructive
      destructive: cn(
        "bg-error text-white border-2 border-error-dark",
        "hover:bg-error-dark"
      ),
      // Ghost: minimal
      ghost: cn(
        "bg-transparent text-ry-black",
        "hover:bg-gray-100"
      ),
    };
    
    const sizes = {
      sm: "h-9 px-4 py-2 text-sm",
      md: "h-11 px-6 py-3 text-base",
      lg: "h-12 px-8 py-4 text-lg",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

RYButton.displayName = "RYButton";

export { RYButton };

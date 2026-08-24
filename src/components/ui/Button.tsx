import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-forest-700 text-sand-50 hover:bg-forest-800 active:bg-forest-900 shadow-sm",
  secondary:
    "bg-gold-400 text-forest-950 hover:bg-gold-500 active:bg-gold-600 shadow-sm",
  outline:
    "border border-forest-300 text-forest-800 hover:bg-forest-50 active:bg-forest-100",
  ghost: "text-forest-700 hover:bg-forest-50 active:bg-forest-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-13 px-6 text-base rounded-xl",
};

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}

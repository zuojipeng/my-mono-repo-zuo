import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";

type BadgeVariant = "brand" | "success" | "warning" | "error" | "neutral";
type BadgeStyle = "solid" | "outline" | "soft";

type BadgeProps = ComponentProps<"span"> & {
  variant?: BadgeVariant;
  variantStyle?: BadgeStyle;
};

const variantClasses: Record<BadgeVariant, Record<BadgeStyle, string>> = {
  brand: {
    solid: "bg-brand-600 text-white",
    outline: "border border-brand-200 text-brand-700 bg-white",
    soft: "bg-brand-50 text-brand-700",
  },
  success: {
    solid: "bg-emerald-600 text-white",
    outline: "border border-emerald-200 text-emerald-700 bg-white",
    soft: "bg-emerald-50 text-emerald-700",
  },
  warning: {
    solid: "bg-amber-500 text-white",
    outline: "border border-amber-200 text-amber-700 bg-white",
    soft: "bg-amber-50 text-amber-700",
  },
  error: {
    solid: "bg-red-600 text-white",
    outline: "border border-red-200 text-red-700 bg-white",
    soft: "bg-red-50 text-red-700",
  },
  neutral: {
    solid: "bg-slate-700 text-white",
    outline: "border border-slate-200 text-slate-700 bg-white",
    soft: "bg-slate-100 text-slate-700",
  },
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", variantStyle = "soft", ...rest }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tracking-wide transition-colors",
          variantClasses[variant][variantStyle],
          className,
        )}
        {...rest}
      />
    );
  },
);

Badge.displayName = "Badge";


import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";

type CardProps = ComponentProps<"div"> & {
  hoverable?: boolean;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300",
          hoverable && "hover:border-brand-200 hover:shadow-lg hover:-translate-y-1",
          className,
        )}
        {...rest}
      />
    );
  },
);

Card.displayName = "Card";

export const CardHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={clsx("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
);
CardHeader.displayName = "CardHeader";

export const CardTitle = ({ className, ...props }: ComponentProps<"h3">) => (
  <h3
    className={clsx("text-lg font-bold leading-none tracking-tight text-slate-900", className)}
    {...props}
  />
);
CardTitle.displayName = "CardTitle";

export const CardDescription = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={clsx("text-sm text-slate-500", className)}
    {...props}
  />
);
CardDescription.displayName = "CardDescription";

export const CardContent = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={clsx("p-6 pt-0", className)} {...props} />
);
CardContent.displayName = "CardContent";

export const CardFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={clsx("flex items-center p-6 pt-0", className)}
    {...props}
  />
);
CardFooter.displayName = "CardFooter";




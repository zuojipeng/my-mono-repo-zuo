import { ComponentProps, forwardRef } from "react";
import clsx from "clsx";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;

    return (
      <label className="flex w-full flex-col gap-1.5">
        {label && (
          <span className="text-sm font-medium text-slate-700 ml-0.5">
            {label}
          </span>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={clsx(
              "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 shadow-xs transition-all placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/10",
              className,
            )}
            {...rest}
          />
        </div>
        {hint && !error && (
          <span className="text-xs text-slate-500 ml-0.5">{hint}</span>
        )}
        {error && (
          <span className="text-xs font-medium text-red-500 ml-0.5">{error}</span>
        )}
      </label>
    );
  },
);

Input.displayName = "Input";


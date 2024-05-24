import { cn } from "@/lib";
import { forwardRef } from "react";

type StackProps = {
  direction?: "col" | "row";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  justify?:
    | "normal"
    | "start"
    | "end"
    | "center"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  gap?: number;
  children: React.ReactNode;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  className?: string;
};

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = "col", gap, children, align, justify, wrap, className },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          direction && `flex-${direction}`,
          gap && `gap-${gap}`,
          align && `items-${align}`,
          justify && `justify-${justify}`,
          wrap && `flex-${wrap}`,
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Stack.displayName = "Stack";

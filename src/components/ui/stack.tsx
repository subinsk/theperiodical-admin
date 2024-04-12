import { cn } from "@/lib";

export const Stack = ({
  direction = "col",
  gap,
  children,
  align,
  justify,
  className,
}: {
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
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex",
        direction && `flex-${direction}`,
        gap && `gap-${gap}`,
        align && `items-${align}`,
        justify && `justify-${justify}`,
        className
      )}
    >
      {children}
    </div>
  );
};

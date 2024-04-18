import { cn } from "@/lib";

export const Grid = ({
  container,
  item,
  gap,
  xs,
  sm,
  md,
  lg,
  xl,
  className,
  children,
}: {
  container?: boolean;
  item?: boolean;
  gap?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        container && "grid grid-cols-12",
        // item && "col-span-1",
        gap && `gap-${gap}`,
        xs && `col-span-${xs}`,
        sm && `sm:col-span-${sm}`,
        md && `md:col-span-${md}`,
        lg && `lg:col-span-${lg}`,
        xl && `xl:col-span-${xl}`
      )}
    >
      {children}
    </div>
  );
};

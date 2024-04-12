import { cn } from "@/lib";

export const Typography = ({
  variant,
  color,
  className,
  children,
}: {
  variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  color?: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const Component = variant;

  let styles = "";
  let colorStyles = "";

  switch (variant) {
    case "h1":
      styles = "text-4xl font-bold";
      break;
    case "h2":
      styles = "text-3xl font-bold";
      break;
    case "h3":
      styles = "text-2xl font-bold";
      break;
    case "h4":
      styles = "text-xl font-bold";
      break;
    case "h5":
      styles = "text-lg font-bold";
      break;
    case "h6":
      styles = "text-base font-bold";
      break;
    case "p":
      styles = "text-base";
      break;
    case "span":
      styles = "text-sm";
      break;
  }

  switch (color) {
    case "success":
      colorStyles += " text-green-500";
      break;
    case "error":
      colorStyles += " text-red-500";
      break;
    case "warning":
      colorStyles += " text-yellow-500";
      break;
    case "info":
      colorStyles += " text-blueSecondary";
      break;
  }

  return (
    <Component className={cn(styles, colorStyles, className)}>
      {children}
    </Component>
  );
};

import type { LinkProps as NextLinkProps } from "next/link";
import NextLink from "next/link";
import type { CSSProperties } from "react";
import { useMemo } from "react";

export function NavLink({
  className,
  children,
  styles,
  borderRadius,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  styles?: CSSProperties;
  borderRadius?: string;
} & NextLinkProps): JSX.Element {
  const memoizedStyles = useMemo(
    () => ({
      borderRadius: borderRadius || 0,
      ...styles,
    }),
    [borderRadius, styles]
  );

  return (
    <NextLink className={`${className}`} style={memoizedStyles} {...props}>
      {children}
    </NextLink>
  );
}

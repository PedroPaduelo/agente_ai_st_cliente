import type React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
}

export function TypographyH1({ 
  className, 
  children, 
  as: Component = "h1", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-3xl font-bold tracking-tight text-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH2({ 
  className, 
  children, 
  as: Component = "h2", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-2xl font-semibold tracking-tight text-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH3({ 
  className, 
  children, 
  as: Component = "h3", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-xl font-semibold tracking-tight text-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyH4({ 
  className, 
  children, 
  as: Component = "h4", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-lg font-semibold tracking-tight text-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyP({ 
  className, 
  children, 
  as: Component = "p", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("leading-relaxed text-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyLead({ 
  className, 
  children, 
  as: Component = "p", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-lg text-muted-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyLarge({ 
  className, 
  children, 
  as: Component = "div", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-lg font-medium", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographySmall({ 
  className, 
  children, 
  as: Component = "small", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-sm font-medium", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyMuted({ 
  className, 
  children, 
  as: Component = "p", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-sm text-muted-foreground", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyValue({ 
  className, 
  children, 
  as: Component = "div", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("text-2xl font-bold tracking-tight", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyTableHeader({ 
  className, 
  children, 
  as: Component = "th", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function TypographyTableCell({ 
  className, 
  children, 
  as: Component = "td", 
  ...props 
}: TypographyProps) {
  return (
    <Component 
      className={cn("px-4 py-3 text-sm", className)} 
      {...props}
    >
      {children}
    </Component>
  );
}

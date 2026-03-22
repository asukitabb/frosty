import type { HTMLAttributes, ReactNode } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassPanel({ children, className = "", ...rest }: GlassPanelProps) {
  return (
    <div
      className={`rounded-3xl border border-white/50 bg-frosty-glass/80 shadow-glass shadow-glass-inset backdrop-blur-xl ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

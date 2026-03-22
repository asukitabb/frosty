import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "rounded-2xl px-4 py-3 font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-[48px] touch-manipulation";
  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-br from-frosty-mint/90 to-frosty-sky/90 text-frosty-ink shadow-md hover:brightness-105",
    ghost:
      "bg-white/30 text-frosty-ink border border-white/40 hover:bg-white/45",
    danger:
      "bg-frosty-peach/90 text-frosty-ink shadow-md hover:brightness-105",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={`w-full rounded-2xl border border-white/50 bg-white/40 px-4 py-3 text-frosty-ink shadow-inner outline-none ring-0 ring-frosty-lavender/40 focus:border-frosty-lavender/80 focus:ring-2 min-h-[48px] touch-manipulation placeholder:text-frosty-ink/40 ${className}`}
      {...rest}
    />
  );
}

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`h-10 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover transition-all active:scale-[0.98] disabled:opacity-60 l-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

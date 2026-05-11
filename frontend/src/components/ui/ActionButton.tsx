import type { CSSProperties, MouseEventHandler, PropsWithChildren } from 'react';

type ActionButtonProps = PropsWithChildren<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  color?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: CSSProperties;
}>;

export function ActionButton({ children, variant = 'primary', size = 'sm', color, className, onClick, style: extraStyle }: ActionButtonProps) {
  const base: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    border: 'none', borderRadius: 7, cursor: 'pointer',
    fontFamily: 'inherit', fontWeight: 500, transition: 'background 0.15s, color 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.15s',
    ...(size === 'md' ? { padding: '8px 16px', fontSize: 14 } : { padding: '5px 12px', fontSize: 13 }),
    ...(size === 'xs' ? { padding: '3px 8px', fontSize: 12 } : {}),
  };

  const variants: Record<NonNullable<ActionButtonProps['variant']>, CSSProperties> = {
    primary: { background: color || '#2563EB', color: '#fff' },
    secondary: { background: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB' },
    ghost: { background: 'transparent', color: color || '#6B7280' },
    outline: { background: 'transparent', color: color || '#2563EB', border: `1px solid ${color || '#2563EB'}` },
  };

  return (
    <button className={className} onClick={onClick} style={{ ...base, ...variants[variant], ...extraStyle }}>
      {children}
    </button>
  );
}

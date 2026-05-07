import type { PropsWithChildren } from 'react';

type BadgeProps = PropsWithChildren<{
  color?: string;
  bg?: string;
  dot?: boolean;
}>;

export function Badge({ children, color = '#6B7280', bg, dot }: BadgeProps) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      color,
      background: bg || `${color}10`,
      border: `1px solid ${color}22`,
      lineHeight: 1,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 0 2px ${color}14` }} />}
      {children}
    </span>
  );
}

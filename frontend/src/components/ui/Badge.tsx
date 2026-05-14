import type { PropsWithChildren } from 'react';

type BadgeProps = PropsWithChildren<{
  color?: string;
  bg?: string;
  dot?: boolean;
}>;

export function Badge({ children, color = 'var(--color-muted)', bg, dot }: BadgeProps) {
  const finalBg = bg || `color-mix(in oklch, ${color}, transparent 90%)`;
  const finalBorder = `color-mix(in oklch, ${color}, transparent 80%)`;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 8px', borderRadius: 999, fontSize: 11, fontWeight: 800,
      color,
      background: finalBg,
      border: `1px solid ${finalBorder}`,
      lineHeight: 1,
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block', boxShadow: `0 0 0 2px color-mix(in oklch, ${color}, transparent 92%)` }} />}
      {children}
    </span>
  );
}

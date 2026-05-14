type AvatarProps = {
  initials: string;
  size?: number;
  color?: string;
};

export function Avatar({ initials, size = 32, color = 'var(--color-brand)' }: AvatarProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `color-mix(in oklch, ${color}, transparent 84%)`,
      color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
      letterSpacing: '-0.02em',
    }}>{initials}</div>
  );
}

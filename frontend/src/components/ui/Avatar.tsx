type AvatarProps = {
  initials: string;
  size?: number;
  color?: string;
};

export function Avatar({ initials, size = 32, color = '#2563EB' }: AvatarProps) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}20`, color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

type SectionHeaderProps = {
  title: string;
  link?: string;
};

export function SectionHeader({ title, link }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: '#111827' }}>{title}</span>
      {link && <button style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>{link} →</button>}
    </div>
  );
}

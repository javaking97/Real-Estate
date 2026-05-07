import React from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  style?: CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}>;

export function Card({ children, style, onClick, hover }: CardProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #E5E7EB',
        boxShadow: hovered && hover ? '0 4px 16px rgba(0,0,0,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

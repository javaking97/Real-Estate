import React from 'react';
import type { CSSProperties, PropsWithChildren } from 'react';

type CardProps = PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}>;

export function Card({ children, className, style, onClick, hover }: CardProps) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        boxShadow: hovered && hover ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transition: 'all var(--duration-base) var(--ease-standard)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

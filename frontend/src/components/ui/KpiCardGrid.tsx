import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type KpiCardItem = {
  label: ReactNode;
  value?: ReactNode;
  unit?: ReactNode;
  valueClassName?: string;
  children?: ReactNode;
};

type KpiCardGridProps = {
  className: string;
  labelClassName: string;
  valueClassName: string;
  items: KpiCardItem[];
};

export function KpiCardGrid({ className, labelClassName, valueClassName, items }: KpiCardGridProps) {
  return (
    <div className={className}>
      {items.map((kpiItem) => (
        <Card key={String(kpiItem.label)} style={{ padding: 16 }}>
          <div className={labelClassName}>{kpiItem.label}</div>
          {kpiItem.children ?? (
            <div className={`${valueClassName}${kpiItem.valueClassName ? ` ${kpiItem.valueClassName}` : ''}`}>
              {kpiItem.value}
              {kpiItem.unit && <span>{kpiItem.unit}</span>}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

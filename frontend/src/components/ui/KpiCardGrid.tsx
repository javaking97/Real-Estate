import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkline } from '@/components/ui/Sparkline';

export type KpiTrend = 'up' | 'down' | 'flat';

export interface KpiDelta {
  trend: KpiTrend;
  label: string;
}

export interface KpiSparkline {
  data: number[];
  color?: string;
}

export interface KpiCardItem {
  label: ReactNode;
  value?: ReactNode;
  unit?: ReactNode;
  valueClassName?: string;
  delta?: KpiDelta;
  sparkline?: KpiSparkline;
  children?: ReactNode;
}

interface KpiCardGridProps {
  className: string;
  labelClassName: string;
  valueClassName: string;
  items: KpiCardItem[];
}

const trendGlyph: Record<KpiTrend, string> = {
  up: '▲',
  down: '▼',
  flat: '—',
};

function KpiDeltaChip({ delta }: { delta: KpiDelta }) {
  return (
    <span className={`kpi-card-delta is-${delta.trend}`}>
      <span aria-hidden="true">{trendGlyph[delta.trend]}</span>
      {delta.label}
    </span>
  );
}

export function KpiCardGrid({ className, labelClassName, valueClassName, items }: KpiCardGridProps) {
  return (
    <div className={className}>
      {items.map((kpiItem) => {
        const composedValueClassName = `${valueClassName}${kpiItem.valueClassName ? ` ${kpiItem.valueClassName}` : ''}`;
        const hasInsight = Boolean(kpiItem.delta || kpiItem.sparkline);

        return (
          <Card key={String(kpiItem.label)} className="kpi-card" style={{ padding: 16 }}>
            <div className={labelClassName}>{kpiItem.label}</div>
            {kpiItem.children ?? (
              <div className="kpi-card-row">
                <div className="kpi-card-numbers">
                  <div className={composedValueClassName}>
                    {kpiItem.value}
                    {kpiItem.unit && <span>{kpiItem.unit}</span>}
                  </div>
                  {kpiItem.delta && <KpiDeltaChip delta={kpiItem.delta} />}
                </div>
                {kpiItem.sparkline && (
                  <Sparkline data={kpiItem.sparkline.data} color={kpiItem.sparkline.color} />
                )}
              </div>
            )}
            {!kpiItem.children && !hasInsight && null}
          </Card>
        );
      })}
    </div>
  );
}

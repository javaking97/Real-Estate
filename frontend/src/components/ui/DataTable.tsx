import type { CSSProperties, ReactNode } from 'react';

type CSSVars = { [key: `--${string}`]: string | number | undefined };

export interface DataColumn<T> {
  key: string;
  header: ReactNode;
  width?: string;
  align?: 'left' | 'right' | 'center';
  area?: string;
  hideOnCompact?: boolean;
  render: (row: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  compactTemplate?: string;
  compactColumns?: string;
  emptyState?: ReactNode;
  minDesktopWidth?: number;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  compactTemplate,
  compactColumns = '1fr auto',
  emptyState,
  minDesktopWidth = 760,
}: DataTableProps<T>) {
  const desktopCols = columns.map((column) => column.width ?? 'minmax(0, 1fr)').join(' ');

  const trackStyle: CSSProperties & CSSVars = {
    '--dt-cols': desktopCols,
    '--dt-compact-cols': compactColumns,
    '--dt-compact-areas': compactTemplate,
    '--dt-min-w': `${minDesktopWidth}px`,
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, row: T) => {
    if (!onRowClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onRowClick(row);
    }
  };

  return (
    <div className="dt" style={trackStyle}>
      <div className="dt-head" role="row">
        {columns.map((column) => (
          <div
            key={column.key}
            className="dt-head-cell"
            data-align={column.align ?? 'left'}
            role="columnheader"
          >
            {column.header}
          </div>
        ))}
      </div>

      <div className="dt-body" role="rowgroup">
        {rows.length === 0 && emptyState ? (
          <div className="dt-empty">{emptyState}</div>
        ) : (
          rows.map((row) => (
            <div
              key={rowKey(row)}
              className="dt-row"
              role={onRowClick ? 'button' : 'row'}
              tabIndex={onRowClick ? 0 : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? (event) => handleKeyDown(event, row) : undefined}
            >
              {columns.map((column) => {
                const cellStyle: CSSProperties & CSSVars = {};
                if (column.area) cellStyle['--cell-area'] = column.area;

                return (
                  <div
                    key={column.key}
                    className="dt-cell"
                    data-align={column.align ?? 'left'}
                    data-hide-compact={column.hideOnCompact ? 'true' : undefined}
                    style={cellStyle}
                  >
                    {column.render(row)}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: ReactNode;
  summary: ReactNode;
  actions?: ReactNode;
  className: string;
  titleClassName: string;
  summaryClassName: string;
};

export function PageHeader({ title, summary, actions, className, titleClassName, summaryClassName }: PageHeaderProps) {
  return (
    <div className={className}>
      <div>
        <h1 className={titleClassName}>{title}</h1>
        <p className={summaryClassName}>{summary}</p>
      </div>
      {actions}
    </div>
  );
}

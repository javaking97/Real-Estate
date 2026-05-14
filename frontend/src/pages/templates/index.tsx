import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { AppIcons } from '@/components/icons/AppIcons';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';

type TemplateItem = (typeof realEstateMockData.templates)[number];
type TemplateStatusFilter = '전체' | TemplateItem['status'];

const templateStatusConfigMap: Record<string, { color: string; bg: string; label: string }> = {
  '작성 완료': { color: '#10B981', bg: '#ECFDF5', label: '배포 가능' },
  '작성 대기': { color: '#F59E0B', bg: '#FFFBEB', label: '작성 필요' },
  '초안 생성 중': { color: '#2563EB', bg: '#EFF6FF', label: '생성 중' },
  미작성: { color: '#EF4444', bg: '#FEF2F2', label: '비어 있음' },
};

const channelIconMap: Record<string, React.ReactNode> = {
  '네이버 블로그': AppIcons.penLine,
  '문자/카카오톡': AppIcons.sms,
  '네이버 부동산': AppIcons.home,
  '직방/다방': AppIcons.fileText,
  인스타그램: AppIcons.image,
};

const templateStatusFilters: TemplateStatusFilter[] = ['전체', '작성 완료', '작성 대기', '초안 생성 중', '미작성'];

export function TemplatesPage() {
  const navigate = useNavigate();
  const templates = realEstateMockData.templates;
  const [activeFilter, setActiveFilter] = React.useState<TemplateStatusFilter>('전체');
  const filteredTemplates = templates.filter((template) => activeFilter === '전체' || template.status === activeFilter);
  const completedTemplateCount = templates.filter((template) => template.status === '작성 완료').length;
  const pendingTemplateCount = templates.filter((template) => template.status !== '작성 완료').length;
  const aiReadyCount = templates.filter((template) => template.status === '작성 대기' || template.status === '미작성').length;

  return (
    <div className="templates-page">
      <PageHeader
        className="templates-page-header"
        titleClassName="templates-title"
        summaryClassName="templates-summary"
        title="템플릿관리"
        summary={<>전체 {templates.length}개 · 작성 대기 {pendingTemplateCount}개 · AI 작성 가능 {aiReadyCount}개</>}
        actions={(
          <div className="templates-header-actions">
            <ActionButton variant="secondary" size="md" style={{ minHeight: 40 }}>AI 일괄 생성</ActionButton>
            <ActionButton variant="primary" size="md" style={{ minHeight: 40 }}>+ 템플릿 추가</ActionButton>
          </div>
        )}
      />

      <KpiCardGrid
        className="templates-kpi-grid"
        labelClassName="templates-kpi-label"
        valueClassName="templates-kpi-value"
        items={[
          {
            label: '전체 템플릿',
            value: templates.length,
            unit: '개',
            delta: { trend: 'up', label: '+3 이번 주' },
            sparkline: { data: [12, 12, 13, 14, 15, 15, 16], color: 'var(--color-brand)' },
          },
          {
            label: '작성 완료',
            value: completedTemplateCount,
            unit: '개',
            valueClassName: 'accent-green',
            delta: { trend: 'up', label: '+2 전일' },
            sparkline: { data: [6, 7, 8, 8, 9, 10, 11], color: 'var(--color-success)' },
          },
          {
            label: 'AI 작성 필요',
            value: aiReadyCount,
            unit: '개',
            valueClassName: 'accent-orange',
            delta: { trend: 'down', label: `대기 ${pendingTemplateCount}개` },
            sparkline: { data: [5, 4, 4, 3, 3, 2, 2], color: 'var(--color-warn)' },
          },
        ]}
      />

      <div className="templates-toolbar">
        <div className="templates-filter-tabs" aria-label="템플릿 상태 필터">
          {templateStatusFilters.map((filterOption) => (
            <button key={filterOption} type="button" className={activeFilter === filterOption ? 'is-active' : ''} onClick={() => setActiveFilter(filterOption)}>{filterOption}</button>
          ))}
        </div>
      </div>

      <div className="templates-grid">
        {filteredTemplates.map((template) => {
          const statusConfig = templateStatusConfigMap[template.status] || templateStatusConfigMap.미작성;

          return (
            <div key={template.id} className="templates-card" onClick={() => navigate(template.id.toString())}>
              <div className="templates-card-icon" style={{ color: statusConfig.color, background: statusConfig.bg }}>
                {channelIconMap[template.channel] || AppIcons.fileText}
              </div>
              <div className="templates-card-body">
                <div className="templates-card-title-row">
                  <strong>{template.title}</strong>
                  <Badge color={statusConfig.color} bg={statusConfig.bg} dot>{template.status}</Badge>
                </div>
                <div className="templates-card-meta">
                  <Badge color="#6B7280">{template.channel}</Badge>
                  <Badge color="#9CA3AF">{template.type}</Badge>
                  <span>{template.updated}</span>
                </div>
                <p className={template.preview ? '' : 'is-empty'}>{template.preview || '아직 작성된 본문이 없습니다. AI 작성으로 초안을 생성해보세요.'}</p>
                <div className="templates-card-footer">
                  <span style={{ color: statusConfig.color }}>{statusConfig.label}</span>
                  <div onClick={(event) => event.stopPropagation()}>
                    {template.status === '미작성' || template.status === '작성 대기'
                      ? <ActionButton variant="primary" size="xs">AI로 작성하기</ActionButton>
                      : <ActionButton variant="secondary" size="xs">수정하기</ActionButton>}
                    <ActionButton variant="outline" size="xs" onClick={() => navigate(template.id.toString())}>미리보기</ActionButton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}

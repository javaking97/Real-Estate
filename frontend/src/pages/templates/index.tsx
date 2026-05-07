import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { AppIcons } from '@/components/icons/AppIcons';
import { DetailModal, type DetailModalPayload } from '@/components/modals/DetailModal';
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
  const templates = realEstateMockData.templates;
  const [modal, setModal] = React.useState<DetailModalPayload | null>(null);
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
          { label: '전체 템플릿', value: templates.length, unit: '개' },
          { label: '작성 완료', value: completedTemplateCount, unit: '개', valueClassName: 'accent-green' },
          { label: 'AI 작성 필요', value: aiReadyCount, unit: '개', valueClassName: 'accent-orange' },
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
            <button key={template.id} type="button" className="templates-card" onClick={() => setModal({ type: 'template', data: template })}>
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
                    <ActionButton variant="outline" size="xs" onClick={() => setModal({ type: 'template', data: template })}>미리보기</ActionButton>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <DetailModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

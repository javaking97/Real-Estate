import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { showToast } from '@/components/ui/toast';
import { EmptyResult } from '@/components/ui/EmptyResult';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchToolbar } from '@/components/ui/SearchToolbar';

type ConsultationItem = (typeof realEstateMockData.consultations)[number];
type ConsultationViewMode = 'list' | 'pipeline';
type ConsultationFilter = '전체' | ConsultationItem['status'];

const consultationStatusConfigMap: Record<string, { color: string; bg: string; stage: string }> = {
  '응답 대기': { color: '#EF4444', bg: '#FEF2F2', stage: '1단계' },
  '일정 대기': { color: '#F59E0B', bg: '#FFFBEB', stage: '2단계' },
  '매물 검색 중': { color: '#2563EB', bg: '#EFF6FF', stage: '3단계' },
  '계약 임박': { color: '#8B5CF6', bg: '#F5F3FF', stage: '4단계' },
  '만기 임박': { color: '#EF4444', bg: '#FEF2F2', stage: '긴급' },
};

const consultationFilters: ConsultationFilter[] = ['전체', '응답 대기', '일정 대기', '매물 검색 중', '계약 임박', '만기 임박'];

const consultationTimelineLabels = ['상담 접수', '상담 내용 정리', '다음 할 일 지정'];

const consultationStageLabels: Record<string, string> = {
  '응답 대기': '답변 기다림',
  '일정 대기': '방문 일정 조율',
  '매물 검색 중': '조건 맞는 매물 찾기',
  '계약 임박': '계약 전 확인',
  '만기 임박': '만기 전 연락 필요',
};

export function ConsultationsPage() {
  const consultations = realEstateMockData.consultations;
  const [selectedConsultation, setSelectedConsultation] = React.useState<ConsultationItem>(consultations[0]);
  const [activeFilter, setActiveFilter] = React.useState<ConsultationFilter>('전체');
  const [viewMode, setViewMode] = React.useState<ConsultationViewMode>('list');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const filteredConsultations = consultations
    .filter((consultation) => activeFilter === '전체' || consultation.status === activeFilter)
    .filter((consultation) => {
      const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
      return !normalizedSearchKeyword || `${consultation.customer} ${consultation.type} ${consultation.summary} ${consultation.nextAction}`.toLowerCase().includes(normalizedSearchKeyword);
    });
  const pendingConsultationCount = consultations.filter((consultation) => consultation.status.includes('대기') || consultation.status.includes('임박')).length;
  const contractReadyCount = consultations.filter((consultation) => consultation.status === '계약 임박').length;
  const waitingReplyCount = consultations.filter((consultation) => consultation.status === '응답 대기').length;
  const schedulingCount = consultations.filter((consultation) => consultation.status === '일정 대기').length;

  return (
    <div className="consultations-page">
      <PageHeader
        className="consultations-page-header"
        titleClassName="consultations-title"
        summaryClassName="consultations-summary"
        title="상담관리"
        summary={<>이번 주 상담 {consultations.length}건 · 후속 조치 {pendingConsultationCount}건 · 계약 임박 {contractReadyCount}건</>}
        actions={<ActionButton variant="primary" size="md" style={{ minHeight: 40 }}>+ 상담 기록</ActionButton>}
      />

      <KpiCardGrid
        className="consultations-kpi-grid"
        labelClassName="consultations-kpi-label"
        valueClassName="consultations-kpi-value"
        items={[
          { label: '이번 주 상담', value: consultations.length, unit: '건' },
          { label: '후속 조치', value: pendingConsultationCount, unit: '건', valueClassName: 'accent-red' },
          { label: '계약 임박', value: contractReadyCount, unit: '건', valueClassName: 'accent-purple' },
        ]}
      />

      <div className="consultations-flow-strip" aria-label="상담 진행 흐름">
        <FlowStep label="답변 기다림" count={waitingReplyCount} tone="#EF4444" active />
        <FlowStep label="방문 일정 조율" count={schedulingCount} tone="#F59E0B" />
        <FlowStep label="조건 맞는 매물 찾기" count={consultations.filter((consultation) => consultation.status === '매물 검색 중').length} tone="#2563EB" />
        <FlowStep label="계약 전 확인" count={contractReadyCount} tone="#8B5CF6" />
      </div>

      <SearchToolbar
        className="consultations-toolbar"
        searchBoxClassName="consultations-search-box"
        filterTabsClassName="consultations-filter-tabs"
        searchValue={searchKeyword}
        searchPlaceholder="고객명, 상담내용, 다음 액션 검색"
        onSearchChange={setSearchKeyword}
        onSearchClear={() => setSearchKeyword('')}
        filterOptions={consultationFilters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filterAriaLabel="상담 상태 필터"
        middle={(
          <div className="consultations-view-toggle" aria-label="상담 보기 방식">
            <button type="button" className={viewMode === 'list' ? 'is-active' : ''} onClick={() => setViewMode('list')}>목록</button>
            <button type="button" className={viewMode === 'pipeline' ? 'is-active' : ''} onClick={() => setViewMode('pipeline')}>진행 단계</button>
          </div>
        )}
      />

      <div className="consultations-layout">
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {viewMode === 'list' ? (
            <div className="consultations-list">
              {filteredConsultations.map((consultation) => (
                <ConsultationRow
                  key={consultation.id}
                  consultation={consultation}
                  selected={selectedConsultation.id === consultation.id}
                  onSelect={() => setSelectedConsultation(consultation)}
                />
              ))}
              {filteredConsultations.length === 0 && <EmptyResult title="조건에 맞는 상담이 없습니다" description="검색어나 상담 상태 필터를 초기화해 다시 확인하세요." buttonLabel="전체 상담 보기" className="consultations-empty-state" onReset={() => { setSearchKeyword(''); setActiveFilter('전체'); }} />}
            </div>
          ) : (
            <div className="consultations-pipeline">
              {consultationFilters.filter((filterOption) => filterOption !== '전체').map((status) => {
                const statusConsultations = consultations.filter((consultation) => consultation.status === status);
                const config = consultationStatusConfigMap[status];

                return (
                  <section key={status} className="consultations-pipeline-column">
                    <div className="consultations-pipeline-title" style={{ borderColor: config.color }}>
                      <strong>{status}</strong>
                      <span>{statusConsultations.length}</span>
                    </div>
                    {statusConsultations.map((consultation) => (
                      <button key={consultation.id} type="button" className="consultations-pipeline-card" onClick={() => setSelectedConsultation(consultation)}>
                        <strong>{consultation.customer}</strong>
                        <span>{consultation.nextAction}</span>
                        <Badge color={config.color} bg={config.bg}>{consultation.type}</Badge>
                      </button>
                    ))}
                  </section>
                );
              })}
            </div>
          )}
        </Card>

        <ConsultationDetailPanel consultation={selectedConsultation} />
      </div>
    </div>
  );
}

function ConsultationRow({ consultation, selected, onSelect }: { consultation: ConsultationItem; selected: boolean; onSelect: () => void }) {
  const statusConfig = consultationStatusConfigMap[consultation.status] || { color: '#6B7280', bg: '#F8FAFC', stage: '-' };
  const stageLabel = consultationStageLabels[consultation.status] || consultation.status;

  return (
    <button type="button" className={`consultations-row${selected ? ' is-selected' : ''}`} onClick={onSelect}>
      <div className="consultations-row-main">
        <Avatar initials={`${consultation.customer[0]}○`} size={38} color={statusConfig.color} />
        <div>
          <div className="consultations-row-title">
            <strong>{consultation.customer}</strong>
            <Badge color="#6B7280">{consultation.type}</Badge>
            <Badge color={statusConfig.color} bg={statusConfig.bg} dot>{stageLabel}</Badge>
          </div>
          <p>{consultation.summary}</p>
        </div>
      </div>
      <div className="consultations-row-meta">
        <span>{consultation.date}</span>
        <strong>{consultation.nextAction}</strong>
        <em>바로 처리</em>
      </div>
    </button>
  );
}

function FlowStep({ label, count, tone, active }: { label: string; count: number; tone: string; active?: boolean }) {
  return (
    <div className={`consultations-flow-step${active ? ' is-active' : ''}`} style={{ '--step-tone': tone } as React.CSSProperties}>
      <span>{label}</span>
      <strong>{count}건</strong>
    </div>
  );
}

function ConsultationDetailPanel({ consultation }: { consultation: ConsultationItem }) {
  const statusConfig = consultationStatusConfigMap[consultation.status] || { color: '#6B7280', bg: '#F8FAFC', stage: '-' };
  const stageLabel = consultationStageLabels[consultation.status] || consultation.status;

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <aside className="consultations-detail-panel">
        <div className="consultations-detail-hero" style={{ background: `linear-gradient(135deg, ${statusConfig.bg} 0%, #fff 68%)` }}>
          <div className="consultations-detail-profile">
            <Avatar initials={`${consultation.customer[0]}○`} size={48} color={statusConfig.color} />
            <div>
              <strong>{consultation.customer} 상담</strong>
              <span>{consultation.date} · 담당자 김민수</span>
            </div>
          </div>
          <div className="consultations-detail-badges">
            <Badge color={statusConfig.color} bg={statusConfig.bg} dot>{stageLabel}</Badge>
            <Badge color="#6B7280">{consultation.type}</Badge>
          </div>
        </div>

        <div className="consultations-decision-block">
          <span>상담 판단</span>
          <div className="consultations-evidence-grid">
            <div><strong>상담 내용</strong><p>{consultation.summary}</p></div>
            <div><strong>진행 상태</strong><p>{stageLabel}</p></div>
          </div>
          <p>{consultation.nextAction}을 먼저 처리하면 다음 단계로 넘길 수 있습니다.</p>
        </div>

        <div className="consultations-next-action">
          <span>다음 할 일</span>
          <strong>{consultation.nextAction}</strong>
          <ActionButton variant="primary" size="sm" onClick={() => showToast('액션 처리를 진행합니다.', 'info')}>처리하기</ActionButton>
        </div>

        <div className="consultations-timeline">
          <div className="consultations-panel-title">상담 타임라인</div>
          {consultationTimelineLabels.map((label, index) => (
            <div key={label} className="consultations-timeline-item">
              <i style={{ background: index === 2 ? statusConfig.color : '#CBD5E1' }} />
              <div>
                <strong>{label}</strong>
                <span>{index === 0 ? consultation.summary : index === 1 ? `${consultation.customer} 니즈와 후속 조치를 자동 정리했습니다.` : consultation.nextAction}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="consultations-detail-actions">
          <ActionButton variant="outline" size="sm" color="#8B5CF6" onClick={() => showToast('문자를 작성합니다.', 'success')}>문자 작성</ActionButton>
          <ActionButton variant="secondary" size="sm" onClick={() => showToast('일정을 연결합니다.', 'info')}>일정 연결</ActionButton>
          <ActionButton variant="primary" size="sm" onClick={() => showToast('완료 처리합니다.', 'success')}>완료 처리</ActionButton>
        </div>
      </aside>
    </Card>
  );
}
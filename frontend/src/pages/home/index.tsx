import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { AppIcons } from '@/components/icons/AppIcons';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Sparkline } from '@/components/ui/Sparkline';
import { showToast } from '@/components/ui/toast';

const taskNumColors = ['#EF4444', '#EF4444', '#F59E0B', '#F59E0B', '#8B5CF6'];

type MetricTrend = 'up' | 'down' | 'flat';
type MetricInsight = { spark: number[]; deltaLabel: string; trend: MetricTrend };

const metricInsightMap: Record<string, MetricInsight> = {
  visit: { spark: [2, 3, 1, 4, 3, 5, 3], deltaLabel: '+12% 전주', trend: 'up' },
  reply: { spark: [6, 4, 7, 5, 8, 6, 5], deltaLabel: '+3 미응답', trend: 'down' },
  consult: { spark: [1, 3, 2, 4, 3, 2, 2], deltaLabel: '동일 수준', trend: 'flat' },
  template: { spark: [5, 3, 6, 4, 5, 4, 4], deltaLabel: '+2 완료', trend: 'up' },
  contract: { spark: [4, 5, 6, 5, 7, 6, 6], deltaLabel: '+18% 전주', trend: 'up' },
};

const trendGlyph: Record<MetricTrend, string> = { up: '▲', down: '▼', flat: '—' };

const marketData = [
  { area: '강남구', type: '전세', price: '8.2억', change: +2.1, trend: 'up' },
  { area: '마포구', type: '매매', price: '6.1억', change: -0.8, trend: 'down' },
  { area: '서초구', type: '전세', price: '7.9억', change: +1.3, trend: 'up' },
  { area: '용산구', type: '매매', price: '9.4억', change: +0.5, trend: 'up' },
];

const quickActions = [
  { label: '+ 고객 등록', color: '#2563EB', bg: '#EFF6FF' },
  { label: '+ 매물 등록', color: '#10B981', bg: '#ECFDF5' },
  { label: '문자 작성', color: '#8B5CF6', bg: '#F5F3FF' },
  { label: '상담 기록', color: '#F59E0B', bg: '#FFFBEB' },
  { label: 'AI 소개글', color: '#0EA5E9', bg: '#F0F9FF' },
  { label: '일정 등록', color: '#EF4444', bg: '#FEF2F2' },
];

export function HomePage() {
  const [expandedTask, setExpandedTask] = React.useState<number | null>(null);
  const d = realEstateMockData;

  const todoDone = 2, todoTotal = 6;
  const progressPct = Math.round((todoDone / todoTotal) * 100);
  const focusTask = d.priorityTasks[0];
  const focusCustomer = d.customers[0];
  const focusRecommendation = d.recommendedProperties[0];
  const focusProperty = focusRecommendation?.properties[0];
  const focusSchedule = d.schedules[0];
  const compactMetrics = d.summaryCards.filter((card) => ['reply', 'visit', 'contract'].includes(card.id));
  const flowSteps = [
    { label: '고객', value: focusTask.customer, meta: focusCustomer?.interest || '조건 확인' },
    { label: '추천 매물', value: focusProperty?.name || '조건 매칭 매물', meta: focusProperty ? `${focusProperty.price} · ${focusProperty.match}%` : '매칭 대기' },
    { label: '문자 초안', value: focusTask.action, meta: '근거 포함 자동 작성' },
    { label: '일정', value: focusSchedule ? `${focusSchedule.time} ${focusSchedule.title}` : '방문 일정 확정', meta: focusSchedule?.customer || '캘린더 반영' },
  ];

  const togglePriorityTask = (taskId: number) => {
    setExpandedTask((currentTaskId) => currentTaskId === taskId ? null : taskId);
  };

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.6); } }
        @keyframes fadeSlideDn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
        .task-expand { animation: fadeSlideDn 0.18s ease; }
        .qa-btn:hover { filter: brightness(0.92); }
        .home-hero-grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.6fr); gap: 14px; margin-bottom: 14px; }
        .home-focus-card { border: 1px solid #BFDBFE; border-radius: 24px; background: linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%); box-shadow: 0 18px 48px rgba(15,23,42,0.08); overflow: hidden; }
        .home-focus-inner { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: 22px; padding: 24px; }
        .home-focus-kicker { display: inline-flex; width: fit-content; align-items: center; gap: 7px; border: 1px solid #DBEAFE; border-radius: 999px; background: #EFF6FF; color: #1D4ED8; padding: 6px 10px; font-size: 12px; font-weight: 900; }
        .home-focus-title { margin: 14px 0 10px; color: #0F172A; font-size: clamp(24px, 3vw, 36px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.08; text-wrap: balance; }
        .home-focus-copy { max-width: 680px; margin: 0; color: #475569; font-size: 15px; font-weight: 650; line-height: 1.65; }
        .home-evidence-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 18px; }
        .home-evidence-card { border: 1px solid #E2E8F0; border-radius: 16px; background: rgba(255,255,255,0.76); padding: 13px; }
        .home-evidence-card span { display: block; margin-bottom: 5px; color: #64748B; font-size: 11px; font-weight: 900; letter-spacing: 0.03em; text-transform: uppercase; }
        .home-evidence-card strong { display: block; color: #111827; font-size: 18px; font-weight: 900; letter-spacing: -0.02em; }
        .home-evidence-card small { display: block; margin-top: 4px; color: #64748B; font-size: 12px; font-weight: 700; line-height: 1.4; }
        .home-action-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 20px; }
        .home-property-board { border: 1px solid #D7DEE8; border-radius: 20px; background: #fff; padding: 16px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.8); }
        .home-map-strip { position: relative; min-height: 128px; overflow: hidden; border-radius: 16px; border: 1px solid #E5E7EB; background: #F8FAFC; background-image: linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px); background-size: 32px 32px; }
        .home-map-route { position: absolute; inset: 20px 28px; border: 2px solid #93C5FD; border-left-color: transparent; border-bottom-color: transparent; border-radius: 999px; transform: rotate(-12deg); }
        .home-map-pin { position: absolute; width: 12px; height: 12px; border-radius: 999px; background: #2563EB; box-shadow: 0 0 0 6px rgba(37,99,235,0.12); }
        .home-property-summary { display: grid; gap: 8px; margin-top: 13px; }
        .home-property-summary strong { color: #111827; font-size: 15px; font-weight: 900; line-height: 1.35; }
        .home-property-summary span { color: #1D4ED8; font-size: 22px; font-weight: 900; letter-spacing: -0.03em; }
        .home-property-summary small { color: #64748B; font-size: 12px; font-weight: 750; }
        .home-side-card { display: flex; flex-direction: column; gap: 10px; border: 1px solid #E2E8F0; border-radius: 20px; background: #fff; padding: 16px; }
        .home-metric-list { display: grid; gap: 10px; }
        .home-metric-card { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; border: 1px solid #EEF2F7; border-radius: 15px; padding: 12px; }
        .home-metric-card > div { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .home-metric-card strong { display: block; color: #111827; font-size: 22px; font-weight: 900; letter-spacing: -0.03em; font-variant-numeric: tabular-nums; line-height: 1.05; }
        .home-metric-card span { color: #64748B; font-size: 12px; font-weight: 800; }
        .home-metric-delta { display: inline-flex; align-items: center; gap: 4px; margin-top: 2px; font-size: 11px; font-weight: 800; font-style: normal; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; line-height: 1; }
        .home-metric-delta span { color: inherit !important; font-size: 9px !important; font-weight: 700 !important; }
        .home-metric-delta.is-up { color: var(--color-success); }
        .home-metric-delta.is-down { color: var(--color-danger); }
        .home-metric-delta.is-flat { color: var(--color-muted); }
        .home-flow { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin: 0 0 14px; }
        .home-flow-step { position: relative; border: 1px solid #E2E8F0; border-radius: 18px; background: #fff; padding: 14px; min-height: 104px; }
        .home-flow-step:not(:last-child)::after { content: ''; position: absolute; top: 50%; right: -10px; width: 10px; height: 1px; background: #CBD5E1; }
        .home-flow-step span { display: block; color: #64748B; font-size: 11px; font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase; }
        .home-flow-step strong { display: block; margin-top: 8px; color: #111827; font-size: 14px; font-weight: 900; line-height: 1.35; }
        .home-flow-step small { display: block; margin-top: 7px; color: #64748B; font-size: 12px; font-weight: 700; line-height: 1.45; }
        .home-lower-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        @container main (max-width: 1100px) {
          .home-hero-grid, .home-focus-inner, .home-lower-grid { grid-template-columns: 1fr; }
          .home-flow { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .home-flow-step::after { display: none; }
        }
        @container main (max-width: 720px) {
          .home-focus-inner { padding: 18px; }
          .home-evidence-grid, .home-flow { grid-template-columns: 1fr; }
          .home-focus-title { font-size: 24px; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <h1 style={{ fontSize: 23, fontWeight: 700, color: '#111827', margin: 0 }}>샘플부동산 비서 브리핑</h1>
          <p style={{ color: '#6B7280', fontSize: 14, margin: '3px 0 0' }}>홍진영 소장님, 오늘은 응답 마감 고객부터 처리하면 흐름이 가장 좋습니다.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '5px 10px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }} />
            <span style={{ fontSize: 13, color: '#DC2626', fontWeight: 600 }}>응답 대기 5명</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8, padding: '5px 10px', cursor: 'pointer' }}>
            <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{d.today}</span>
            {AppIcons.chevronDown}
          </div>
        </div>
      </div>

      <div className="home-hero-grid">
        <section className="home-focus-card">
          <div className="home-focus-inner">
            <div>
              <span className="home-focus-kicker"><span style={{ width: 7, height: 7, borderRadius: 999, background: '#2563EB' }} />오늘의 최우선 액션</span>
              <h2 className="home-focus-title"><span style={{ color: '#2563EB' }}>{focusTask.customer}</span> 고객에게 조건 매칭 매물 3건을 보내고 방문 일정까지 확정하세요.</h2>
              <p className="home-focus-copy">응답 마감이 오늘이고 예산·지역 조건이 맞는 매물이 이미 준비되어 있습니다. 지금 처리하면 문자 작성, 매물 제안, 방문 예약까지 한 번에 이어집니다.</p>

              <div className="home-evidence-grid">
                <div className="home-evidence-card"><span>근거 01</span><strong>오늘 마감</strong><small>{focusTask.urgency} · 응답 대기 5명 중 우선순위 1</small></div>
                <div className="home-evidence-card"><span>근거 02</span><strong>{focusProperty?.match || 94}% 매칭</strong><small>{focusCustomer?.region || '관심 지역'} · {focusCustomer?.budget || '예산 조건'} 기준</small></div>
                <div className="home-evidence-card"><span>근거 03</span><strong>{focusSchedule?.time || '14:00'}</strong><small>가장 빠른 방문 가능 슬롯</small></div>
              </div>

              <div className="home-action-row">
                <ActionButton variant="primary" size="md" onClick={() => showToast('문자 초안과 추천 매물 3건을 준비합니다.', 'success')}>문자 초안 만들기</ActionButton>
                <ActionButton variant="secondary" size="md" onClick={() => showToast('고객 상세와 상담 기록을 엽니다.', 'info')}>고객 상세 보기</ActionButton>
                <ActionButton variant="outline" size="md" color="#2563EB" onClick={() => showToast('방문 가능 시간을 확인합니다.', 'info')}>일정 확인</ActionButton>
              </div>
            </div>

            <aside className="home-property-board" aria-label="추천 매물 위치와 조건 요약">
              <div className="home-map-strip">
                <span className="home-map-route" />
                <span className="home-map-pin" style={{ left: '22%', top: '58%' }} />
                <span className="home-map-pin" style={{ left: '58%', top: '28%', background: '#10B981', boxShadow: '0 0 0 6px rgba(16,185,129,0.12)' }} />
                <span className="home-map-pin" style={{ left: '76%', top: '66%', background: '#F59E0B', boxShadow: '0 0 0 6px rgba(245,158,11,0.12)' }} />
              </div>
              <div className="home-property-summary">
                <strong>{focusProperty?.name || '조건 매칭 추천 매물'}</strong>
                <span>{focusProperty?.price || '예산 내 매물'}</span>
                <small>{focusProperty ? `${focusProperty.rooms} · ${focusProperty.floor} · ${focusProperty.type}` : focusTask.tags.join(' · ')}</small>
              </div>
            </aside>
          </div>
        </section>

        <aside className="home-side-card">
          <SectionHeader title="핵심 지표" />
          <div className="home-metric-list">
            {compactMetrics.map((metric) => {
              const insight = metricInsightMap[metric.id] ?? { spark: [1, 2, 3, 2, 4, 3, 4], deltaLabel: '—', trend: 'flat' as MetricTrend };
              return (
                <div key={metric.id} className="home-metric-card">
                  <div>
                    <strong style={{ color: metric.color }}>{metric.value}<span style={{ marginLeft: 3, color: '#94A3B8', fontSize: 12 }}>{metric.unit}</span></strong>
                    <span>{metric.label}</span>
                    <em className={`home-metric-delta is-${insight.trend}`}>
                      <span aria-hidden="true">{trendGlyph[insight.trend]}</span>
                      {insight.deltaLabel}
                    </em>
                  </div>
                  <Sparkline data={insight.spark} color={metric.color} width={96} height={32} strokeWidth={1.75} />
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <div className="home-flow">
        {flowSteps.map((step, index) => (
          <div key={step.label} className="home-flow-step">
            <span>{String(index + 1).padStart(2, '0')} · {step.label}</span>
            <strong>{step.value}</strong>
            <small>{step.meta}</small>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '8px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap' }}>오늘 진행률</span>
        <div style={{ width: 100, height: 6, background: '#F3F4F6', borderRadius: 99 }}>
          <div style={{ width: progressPct + '%', height: '100%', background: 'linear-gradient(90deg,#2563EB,#10B981)', borderRadius: 99 }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#10B981', whiteSpace: 'nowrap' }}>{todoDone}/{todoTotal} ({progressPct}%)</span>
        <div style={{ width: 1, height: 18, background: '#E5E7EB', margin: '0 4px' }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {quickActions.map((a, i) => (
            <button key={i} className="qa-btn" onClick={() => showToast(a.label + ' 기능을 실행합니다.', 'info')} style={{ padding: '4px 11px', borderRadius: 7, border: '1px solid ' + a.color + '30', background: a.bg, color: a.color, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'filter 0.15s' }}>{a.label}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <section style={{ borderRadius: 22, border: '1px solid #E2E8F0', background: '#fff', boxShadow: '0 12px 34px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#2563EB', fontSize: 22, lineHeight: 1 }}>ϟ</span>
              <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>다음 우선 업무 큐</span>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>전체 보기 →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {d.priorityTasks.map((task, i) => {
              const isExpanded = expandedTask === task.id;
              const customer = d.customers[i];
              return (
                <article key={task.id} className={`accordion-row ${isExpanded ? 'is-open' : ''}`} style={{ borderBottom: i < d.priorityTasks.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <div className="accordion-trigger" onClick={() => togglePriorityTask(task.id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 22px', cursor: 'pointer' }}>
                    <div className="accordion-index" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: taskNumColors[i] + '12', color: taskNumColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>{i + 1}</div>
                    <div className="accordion-summary" style={{ flex: 1, minWidth: 0 }}>
                      <div className="accordion-title" style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.01em', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        <span style={{ color: '#2563EB', fontWeight: 600 }}>{task.customer}</span> {task.text}
                      </div>
                      <div className="accordion-tag-list" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7, flexWrap: 'wrap' }}>
                        {task.meta && <span className="accordion-tag" style={{ borderRadius: 99, background: '#F1F5F9', padding: '3px 9px', fontSize: 12, fontWeight: 600, color: '#64748B' }}>{task.meta}</span>}
                        {task.tags.map(tag => <span className="accordion-tag" key={tag} style={{ borderRadius: 99, background: '#F1F5F9', padding: '3px 9px', fontSize: 12, fontWeight: 600, color: '#64748B' }}>{tag}</span>)}
                      </div>
                    </div>
                    <span className="accordion-urgency" style={{ borderRadius: 99, background: `${task.urgencyColor}12`, padding: '5px 10px', fontSize: 12, fontWeight: 800, color: task.urgencyColor, whiteSpace: 'nowrap' }}>{task.urgency}</span>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      className="accordion-row-button"
                      style={{ width: 34, height: 34, border: 'none', borderRadius: 12, background: 'transparent', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit', flexShrink: 0 }}
                    >
                      <span style={{ display: 'inline-block', fontSize: 18, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 200ms ease' }}>⌄</span>
                    </button>
                  </div>

                  <div className="accordion-content" aria-hidden={!isExpanded}>
                    <div className="accordion-inner">
                      <div className="accordion-detail-offset" style={{ padding: '0 22px 22px 70px' }}>
                        <div className="accordion-detail-card" style={{ borderRadius: 20, border: '1px solid #DBEAFE', background: '#F8FBFF', padding: 20, boxShadow: '0 12px 34px rgba(37,99,235,0.06)' }}>
                          <div className="r-grid-3 accordion-detail-grid" style={{ gap: 18 }}>
                            <section>
                              <div className="accordion-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 15, fontWeight: 800, color: '#111827' }}>
                                <IconCircle>▣</IconCircle>
                                최근 상담
                              </div>
                              {customer && (
                                <>
                                  <InfoLine label="마지막 상담" value={customer.lastContact} />
                                  <InfoLine label="고객 니즈" value={customer.interest} />
                                  <InfoLine label="관심 지역" value={customer.region} />
                                  <InfoLine label="예산 범위" value={customer.budget} />
                                </>
                              )}
                            </section>

                            <section className="accordion-property-section" style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', padding: '0 18px' }}>
                              <div className="accordion-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 15, fontWeight: 800, color: '#111827' }}>
                                <IconCircle>⌂</IconCircle>
                                추천 매물
                              </div>
                              <div style={{ overflow: 'hidden', borderRadius: 16, border: '1px solid #E2E8F0', background: '#fff', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
                                <div className="accordion-property-grid" style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                                  <div className="accordion-property-image" style={{ minHeight: 112, background: 'linear-gradient(135deg,#F5F5F4,#E7E5E4,#D6D3D1)' }} />
                                  <div style={{ padding: 16 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                      <strong className="accordion-property-title" style={{ fontSize: 14, color: '#111827' }}>조건 매칭 추천 매물</strong>
                                      <span style={{ borderRadius: 99, background: '#EFF6FF', padding: '4px 8px', fontSize: 12, fontWeight: 700, color: '#2563EB' }}>추천도 높음</span>
                                    </div>
                                    <div className="accordion-property-meta" style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: '#475569' }}>{task.tags[0] || '고객 조건 기반'}</div>
                                    <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                      {task.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
                                    </div>
                                    <button className="accordion-link-button" style={{ marginTop: 14, background: 'none', border: 'none', padding: 0, color: '#2563EB', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>매물 자세히 보기 →</button>
                                  </div>
                                </div>
                              </div>
                            </section>

                            <section>
                              <div className="accordion-section-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 15, fontWeight: 800, color: '#111827' }}>
                                <IconCircle>✓</IconCircle>
                                추천 판단
                              </div>
                              <div className="accordion-action-card" style={{ borderRadius: 16, border: '1px solid #E2E8F0', background: '#fff', padding: 18, boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
                                <div className="accordion-action-title" style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{task.action}</div>
                                <p className="accordion-action-copy" style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.6, color: '#64748B' }}>근거 데이터가 맞는 경우 바로 연락하거나 일정 확정으로 넘기세요.</p>
                                <div style={{ marginTop: 16, borderTop: '1px solid #F1F5F9', paddingTop: 16 }}>
                                  <div className="accordion-action-label" style={{ fontSize: 13, fontWeight: 700, color: '#64748B' }}>권장 일정</div>
                                  <div className="accordion-action-deadline" style={{ marginTop: 4, fontSize: 15, fontWeight: 800, color: '#1E293B' }}>{task.urgency}</div>
                                </div>
                                <button className="accordion-action-button" style={{ marginTop: 18, width: '100%', height: 42, border: 'none', borderRadius: 12, background: '#2563EB', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 18px rgba(37,99,235,0.22)' }}>{task.action}</button>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <div className="home-lower-grid">
        <Card style={{ padding: 14 }}>
          <SectionHeader title="최근 상담 요약" link="전체 보기" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.recentConsultations.slice(0, 3).map(c => (
              <div key={c.id} style={{ paddingBottom: 8, borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                  <Avatar initials={c.name[0] + '○'} size={28} color={c.statusColor} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{c.name}</span>
                      <Badge color={c.statusColor} dot>{c.status}</Badge>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>{c.time}</span>
                </div>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 2px', lineHeight: 1.5 }}>{c.summary}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{c.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 14 }}>
          <SectionHeader title="추천 매물 (고객 조건 기반)" link="전체 보기" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.recommendedProperties.slice(0, 2).map(r => (
              <div key={r.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <Badge color="#2563EB">{r.forCustomer}</Badge>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>고객 조건 매칭</span>
                  <Badge color="#10B981">{r.matchCount}건</Badge>
                  <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#2563EB', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>보기</button>
                </div>
                {r.properties.map(p => (
                  <div key={p.name} style={{ background: '#F9FAFB', borderRadius: 8, padding: '9px 11px', border: '1px solid #F3F4F6', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <div style={{ width: 52, height: 42, borderRadius: 6, flexShrink: 0, background: 'repeating-linear-gradient(45deg,#E5E7EB,#E5E7EB 2px,#F3F4F6 2px,#F3F4F6 8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 9, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.3 }}>매물사진</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: '#1D4ED8', marginTop: 1 }}>{p.price}</div>
                        <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{p.rooms} · {p.floor} · {p.type}</div>
                      </div>
                      <Badge color="#10B981">{p.match}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>더 많은 매물 추천 받기 →</button>
        </Card>

        <Card style={{ padding: 14 }}>
          <SectionHeader title="템플릿 작업 대기" link="전체 보기" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {d.templateTasks.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', background: '#F9FAFB', borderRadius: 8, border: '1px solid #F3F4F6' }}>
                <div style={{ width: 27, height: 27, borderRadius: 6, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6B7280' }}>
                  {t.icon === 'blog' ? AppIcons.penLine : t.icon === 'sms' ? AppIcons.sms : t.icon === 'news' ? AppIcons.newspaper : AppIcons.fileText}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#374151', lineHeight: 1.4 }}>{t.text}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{t.channel} · {t.time}</div>
                </div>
                <ActionButton variant="outline" size="xs" color="#2563EB" onClick={() => showToast('AI가 ' + t.text + ' 작업을 시작합니다.', 'success')}>{t.action}</ActionButton>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: 14 }}>
          <SectionHeader title="오늘의 시장 동향" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {marketData.map((m, i) => (
              <div key={m.area} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: i < marketData.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: '#F0F3F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#6B7280' }}>{AppIcons.building}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{m.area}</span>
                    <Badge color="#6B7280">{m.type}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>평균 {m.price}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: m.trend === 'up' ? '#10B981' : '#EF4444' }}>
                    {m.trend === 'up' ? '▲' : '▼'} {Math.abs(m.change)}%
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF' }}>전주 대비</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, padding: '8px 10px', background: '#F0F9FF', borderRadius: 8, border: '1px solid #BAE6FD' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <span style={{ color: '#0369A1', flexShrink: 0, display: 'flex' }}>{AppIcons.sparkle}</span>
              <p style={{ margin: 0, fontSize: 12, color: '#0369A1', lineHeight: 1.6 }}>강남구·서초구 전세가 상승세입니다. 박OO 고객에게 빠른 매물 제안을 권장합니다.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', padding: '12px 0' }}>
      <span className="accordion-info-label" style={{ fontSize: 14, fontWeight: 600, color: '#64748B' }}>{label}</span>
      <span className="accordion-info-value" style={{ fontSize: 14, fontWeight: 800, color: '#1E293B', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function IconCircle({ children }: { children: React.ReactNode }) {
  return (
    <span className="accordion-icon-circle" style={{ display: 'flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: '#EFF6FF', color: '#2563EB', fontSize: 13, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="accordion-pill" style={{ borderRadius: 99, background: '#F1F5F9', padding: '3px 9px', fontSize: 12, fontWeight: 700, color: '#64748B' }}>{children}</span>;
}
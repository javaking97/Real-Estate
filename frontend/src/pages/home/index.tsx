import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { AppIcons } from '@/components/icons/AppIcons';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { showToast } from '@/components/ui/toast';

const cardIcons = { calendar: AppIcons.calendar, user: AppIcons.users, chat: AppIcons.chat, doc: AppIcons.fileText, contract: AppIcons.template } as const;
const taskNumColors = ['#EF4444', '#EF4444', '#F59E0B', '#F59E0B', '#8B5CF6'];

const sparkData: Record<string, number[]> = {
  visit: [2, 3, 1, 4, 3, 5, 3],
  reply: [6, 4, 7, 5, 8, 6, 5],
  consult: [1, 3, 2, 4, 3, 2, 2],
  template: [5, 3, 6, 4, 5, 4, 4],
  contract: [4, 5, 6, 5, 7, 6, 6],
};

const aiInsights: Record<string, string> = {
  visit: '이번 주 방문 예약이 전주 대비 +40% 증가했습니다. 방문 전 매물 브리핑을 미리 준비하세요.',
  reply: '5명 중 2명은 오늘 응답 마감입니다. 박OO, 이OO 우선 연락을 권장합니다.',
  consult: '요약 대기 2건이 48시간을 초과했습니다. AI 자동 요약을 사용해보세요.',
  template: '4건 중 2건은 매물 노출 기한이 임박했습니다. AI 일괄 생성을 권장합니다.',
  contract: '진행 중 계약 6건 중 2건이 이번 주 계약 예정입니다.',
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 104, h = 34;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return x + ',' + y;
  }).join(' ');
  const areaClose = w + ',' + h + ' 0,' + h;
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      <polyline points={'0,' + h + ' ' + pts + ' ' + areaClose} fill={color} fillOpacity="0.12" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [tooltipCard, setTooltipCard] = React.useState<string | null>(null);
  const d = realEstateMockData;

  const todoDone = 2, todoTotal = 6;
  const progressPct = Math.round((todoDone / todoTotal) * 100);

  const togglePriorityTask = (taskId: number) => {
    setExpandedTask((currentTaskId) => currentTaskId === taskId ? null : taskId);
  };

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes pulse-dot { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.6); } }
        @keyframes fadeSlideDn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tooltipFadeSlide { from { opacity:0; transform:translateX(-50%) translateY(-5px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        .task-expand { animation: fadeSlideDn 0.18s ease; }
        .qa-btn:hover { filter: brightness(0.92); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <h1 style={{ fontSize: 23, fontWeight: 700, color: '#111827', margin: 0 }}>샘플부동산 비서 브리핑</h1>
          <p style={{ color: '#6B7280', fontSize: 14, margin: '3px 0 0' }}>홍진영 소장님, 오늘도 좋은 하루 본내세요!</p>
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

      {/* Progress + Quick Actions bar */}
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

      {/* KPI AI insight cards */}
      <div className="r-grid-kpi" style={{ marginBottom: 10 }}>
        {d.summaryCards.slice(0, 5).map(c => (
          <div key={c.id} style={{ position: 'relative' }}
            onMouseEnter={() => setTooltipCard(c.id)}
            onMouseLeave={() => setTooltipCard(null)}
          >
            <Card hover style={{ padding: '12px 14px', height: '100%', minHeight: 124, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>
                  {cardIcons[c.icon as keyof typeof cardIcons]}
                </div>
                <span style={{ fontSize: 10, color: '#C4C9D4' }}>7일 ▾</span>
              </div>
              <div style={{ margin: '5px 0 3px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: c.color, lineHeight: 1 }}>
                  {c.value}<span style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF', marginLeft: 2 }}>{c.unit}</span>
                </div>
                <div style={{ fontSize: 12, color: '#6B7280', marginTop: 3, textWrap: 'balance' }}>{c.label}</div>
              </div>
              <Sparkline data={sparkData[c.id] || [1, 2, 3, 2, 4, 3, 4]} color={c.color} />
            </Card>
            {tooltipCard === c.id && (
              <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: '#1E293B', color: '#fff', borderRadius: 9, padding: '9px 12px', fontSize: 12, lineHeight: 1.55, width: 210, zIndex: 999, boxShadow: '0 6px 24px rgba(0,0,0,0.22)', animation: 'tooltipFadeSlide 0.15s ease', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                  <span style={{ color: '#60A5FA', display: 'flex' }}>{AppIcons.sparkle}</span>
                  <span style={{ fontWeight: 700, fontSize: 11, color: '#93C5FD' }}>AI 인사이트</span>
                </div>
                {aiInsights[c.id]}
                <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 8, height: 8, background: '#1E293B' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Row 1: Priority Tasks */}
      <div style={{ marginBottom: 10 }}>
        <section style={{ borderRadius: 22, border: '1px solid #E2E8F0', background: '#fff', boxShadow: '0 12px 34px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#2563EB', fontSize: 22, lineHeight: 1 }}>ϟ</span>
              <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', color: '#111827' }}>AI가 추천하는 오늘의 우선 업무</span>
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
                                다음 액션
                              </div>
                              <div className="accordion-action-card" style={{ borderRadius: 16, border: '1px solid #E2E8F0', background: '#fff', padding: 18, boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
                                <div className="accordion-action-title" style={{ fontSize: 15, fontWeight: 800, color: '#111827' }}>{task.action}</div>
                                <p className="accordion-action-copy" style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.6, color: '#64748B' }}>고객 선호 조건에 맞춰 후속 조치를 진행하세요.</p>
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

      {/* Row 2: cards */}
      <div className="r-grid-4">
        {/* Recent consultations */}
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

        {/* Recommended properties */}
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

        {/* Template tasks */}
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

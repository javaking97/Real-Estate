import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { AppIcons } from '@/components/icons/AppIcons';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';

const weeklyData = [
  { day: '월', consult: 3, visit: 1, contract: 0 },
  { day: '화', consult: 5, visit: 2, contract: 1 },
  { day: '수', consult: 2, visit: 3, contract: 0 },
  { day: '목', consult: 6, visit: 1, contract: 2 },
  { day: '금', consult: 4, visit: 2, contract: 1 },
  { day: '토', consult: 3, visit: 3, contract: 0 },
];

const managerRankingItems = [
  { name: '김민수', consult: 12, contract: 3, conversion: 25 },
  { name: '박서준', consult: 7, contract: 1, conversion: 14 },
  { name: '이지은', consult: 8, contract: 1, conversion: 13 },
];

const regionDemandItems = [
  { region: '강남/서초', demand: 42, color: 'var(--color-brand)' },
  { region: '마포/용산', demand: 28, color: 'var(--color-success)' },
  { region: '송파/강동', demand: 18, color: 'var(--color-warn)' },
  { region: '성동/광진', demand: 12, color: 'var(--color-domain-consultations)' },
];

const funnelItems = [
  { label: '상담', value: 23, color: 'color-mix(in oklch, var(--color-brand), transparent 40%)' },
  { label: '방문', value: 12, color: 'var(--color-brand)' },
  { label: '계약', value: 4, color: 'var(--color-domain-consultations)' },
];

const insightItems = [
  { title: '목요일 전환율 집중', text: '목요일 상담 이후 방문 전환율이 가장 높습니다. 다음 주 방문 슬롯을 목요일 오후에 우선 확보하세요.', color: 'var(--color-brand)' },
  { title: '강남/서초 수요 우세', text: '강남/서초 문의 비중이 42%로 가장 높습니다. 전세 8억 이하 매물 확보가 우선입니다.', color: 'var(--color-success)' },
  { title: '계약 병목 구간', text: '방문 이후 계약 전환이 33%입니다. 방문 후 24시간 내 후속 연락 자동화를 권장합니다.', color: 'var(--color-warn)' },
];

export function AnalyticsPage() {
  const totalConsultationCount = weeklyData.reduce((sum, week) => sum + week.consult, 0);
  const totalVisitCount = weeklyData.reduce((sum, week) => sum + week.visit, 0);
  const totalContractCount = weeklyData.reduce((sum, week) => sum + week.contract, 0);
  const visitConversionRate = Math.round((totalVisitCount / totalConsultationCount) * 100);
  const contractConversionRate = Math.round((totalContractCount / totalVisitCount) * 100);
  const maxDailyTotal = Math.max(...weeklyData.map((week) => week.consult + week.visit + week.contract));

  return (
    <div className="analytics-page">
      <PageHeader
        className="analytics-page-header"
        titleClassName="analytics-title"
        summaryClassName="analytics-summary"
        title="분석 리포트"
        summary="상담·방문·계약 성과와 병목 구간을 주간 단위로 확인하세요."
        actions={(
          <div className="analytics-header-actions">
            <div className="analytics-period-tabs" aria-label="분석 기간">
              <button type="button" className="is-active">주간</button>
              <button type="button">월간</button>
              <button type="button">분기</button>
            </div>
            <ActionButton variant="secondary" size="md" style={{ minHeight: 40 }}>내보내기</ActionButton>
          </div>
        )}
      />

      <KpiCardGrid
        className="analytics-kpi-grid"
        labelClassName="analytics-kpi-label"
        valueClassName="analytics-kpi-value"
        items={[
          {
            label: '총 상담',
            value: totalConsultationCount,
            unit: '건',
            delta: { trend: 'up', label: '+23% 전주' },
            sparkline: { data: weeklyData.map((week) => week.consult), color: 'var(--color-brand)' },
          },
          {
            label: '방문 전환율',
            value: visitConversionRate,
            unit: '%',
            valueClassName: 'accent-blue',
            delta: { trend: 'up', label: `방문 ${totalVisitCount}건` },
            sparkline: { data: weeklyData.map((week) => week.visit), color: 'var(--color-brand)' },
          },
          {
            label: '계약 전환율',
            value: contractConversionRate,
            unit: '%',
            valueClassName: 'accent-purple',
            delta: { trend: 'flat', label: `계약 ${totalContractCount}건` },
            sparkline: { data: weeklyData.map((week) => week.contract), color: 'var(--color-domain-consultations)' },
          },
        ]}
      />

      <div className="analytics-main-grid">
        <Card style={{ padding: 18 }}>
          <div className="analytics-section-header">
            <div><span>{AppIcons.barChart}</span><strong>이번 주 성과 추세</strong></div>
            <Badge color="var(--color-success)" bg="color-mix(in oklch, var(--color-success), transparent 92%)">↑ +23%</Badge>
          </div>
          <div className="analytics-stacked-chart">
            {weeklyData.map((week) => {
              const total = week.consult + week.visit + week.contract;
              const chartHeight = Math.round((total / maxDailyTotal) * 180);

              return (
                <div key={week.day} className="analytics-chart-column">
                  <span>{total}</span>
                  <div style={{ height: chartHeight }}>
                    <i style={{ height: `${(week.contract / total) * 100}%`, background: 'var(--color-domain-consultations)' }} />
                    <i style={{ height: `${(week.visit / total) * 100}%`, background: 'var(--color-brand)' }} />
                    <i style={{ height: `${(week.consult / total) * 100}%`, background: 'color-mix(in oklch, var(--color-brand), transparent 60%)' }} />
                  </div>
                  <strong>{week.day}</strong>
                </div>
              );
            })}
          </div>
          <div className="analytics-legend">
            <span><i style={{ background: 'color-mix(in oklch, var(--color-brand), transparent 60%)' }} />상담 {totalConsultationCount}건</span>
            <span><i style={{ background: 'var(--color-brand)' }} />방문 {totalVisitCount}건</span>
            <span><i style={{ background: 'var(--color-domain-consultations)' }} />계약 {totalContractCount}건</span>
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <div className="analytics-section-header"><div><span>{AppIcons.zap}</span><strong>상담 전환 퍼널</strong></div></div>
          <div className="analytics-funnel">
            {funnelItems.map((funnelItem, index) => (
              <div key={funnelItem.label} className="analytics-funnel-row">
                <div>
                  <strong>{funnelItem.label}</strong>
                  <span>{funnelItem.value}건</span>
                </div>
                <div><i style={{ width: `${(funnelItem.value / funnelItems[0].value) * 100}%`, background: funnelItem.color }} /></div>
                {index > 0 && <em>{Math.round((funnelItem.value / funnelItems[index - 1].value) * 100)}%</em>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="analytics-secondary-grid">
        <Card style={{ padding: 18 }}>
          <div className="analytics-section-header"><div><span>{AppIcons.user}</span><strong>담당자별 실적</strong></div></div>
          <div className="analytics-ranking-list">
            {managerRankingItems.map((manager, index) => (
              <div key={manager.name}>
                <span>{index + 1}</span>
                <div><strong>{manager.name}</strong><small>상담 {manager.consult}건 · 계약 {manager.contract}건</small></div>
                <Badge color="var(--color-brand)" bg="color-mix(in oklch, var(--color-brand), transparent 92%)">{manager.conversion}%</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 18 }}>
          <div className="analytics-section-header"><div><span>{AppIcons.home}</span><strong>지역별 수요</strong></div></div>
          <div className="analytics-region-list">
            {regionDemandItems.map((regionItem) => (
              <div key={regionItem.region}>
                <div><strong>{regionItem.region}</strong><span>{regionItem.demand}%</span></div>
                <i><b style={{ width: `${regionItem.demand}%`, background: regionItem.color }} /></i>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 18, borderColor: 'color-mix(in oklch, var(--color-brand), transparent 70%)', background: 'linear-gradient(180deg, var(--color-surface) 0%, color-mix(in oklch, var(--color-brand), transparent 96%) 100%)' }}>
          <div className="analytics-section-header"><div><span>{AppIcons.sparkle}</span><strong>AI 인사이트</strong></div></div>
          <div className="analytics-insight-list">
            {insightItems.map((insight) => (
              <div key={insight.title} style={{ borderLeftColor: insight.color }}>
                <strong>{insight.title}</strong>
                <p>{insight.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card style={{ overflow: 'hidden' }}>
        <div className="analytics-table-header">
          <strong>상세 데이터</strong>
          <span>요일별 상담·방문·계약 현황</span>
        </div>
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead><tr><th>요일</th><th>상담</th><th>방문</th><th>계약</th><th>방문 전환</th><th>계약 전환</th></tr></thead>
            <tbody>
              {weeklyData.map((week) => (
                <tr key={week.day}>
                  <td>{week.day}</td>
                  <td>{week.consult}건</td>
                  <td>{week.visit}건</td>
                  <td>{week.contract}건</td>
                  <td>{Math.round((week.visit / week.consult) * 100)}%</td>
                  <td>{week.visit > 0 ? Math.round((week.contract / week.visit) * 100) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

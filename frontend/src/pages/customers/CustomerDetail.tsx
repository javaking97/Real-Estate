import React from 'react';
import { useParams } from 'react-router-dom';
import { realEstateMockData } from '@/lib/mock-data';
import { DetailDrawer } from '@/components/layout/DetailDrawer';
import { ActionButton } from '@/components/ui/ActionButton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AppIcons } from '@/components/icons/AppIcons';
import { showToast } from '@/components/ui/toast';

export function CustomerDetail() {
  const { id } = useParams();
  const customer = realEstateMockData.customers.find((c) => c.id.toString() === id);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if (!customer) return null;

  const handleDelete = () => {
    showToast(`${customer.name} 고객 삭제를 확인했습니다.`, 'success');
  };

  return (
    <DetailDrawer 
      open={true} 
      title={`${customer.name} 고객 상세`} 
      subtitle={`${customer.region} · ${customer.type}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar initials={`${customer.name[0]}○`} size={56} color={customer.statusColor} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-fg)' }}>{customer.name}</span>
              <Badge color={customer.statusColor} dot>{customer.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ActionButton variant="primary" size="sm">연락하기</ActionButton>
              <ActionButton variant="secondary" size="sm">문자 작성</ActionButton>
              <ActionButton variant="secondary" size="sm">일정 등록</ActionButton>
            </div>
          </div>
        </div>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>기본 정보</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <InfoRow label="거래 유형" value={customer.type} />
            <InfoRow label="관심 지역" value={customer.region} highlight />
            <InfoRow label="예산" value={customer.budget} highlight />
            <InfoRow label="선호 조건" value={customer.interest} />
            <InfoRow label="최근 상담" value={customer.lastContact} />
            <InfoRow label="다음 액션" value={customer.nextAction} highlight />
          </div>
        </Card>

        <Card style={{ padding: 20, background: 'color-mix(in oklch, var(--color-brand), transparent 96%)', borderColor: 'color-mix(in oklch, var(--color-brand), transparent 80%)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-brand)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            {AppIcons.lightbulb} AI 분석
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-fg)', lineHeight: 1.6, marginBottom: 12 }}>
            {customer.region} 지역 {customer.budget} 범위 내 {customer.type} 매물을 우선 추천 대상으로 유지 중입니다.
            {customer.interest.includes('역세권') ? ' 역세권 조건 매칭 우선순위가 높습니다.' : ''}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-brand)', fontWeight: 800, marginBottom: 6 }}>
            {AppIcons.barChart} 전환 가능성
          </div>
          <div style={{ fontSize: 14, color: 'var(--color-fg)', lineHeight: 1.6 }}>
            최근 상담 빈도와 다음 액션 기준으로 계약 전환 가능성이 높습니다. 오늘 후속 연락을 권장합니다.
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>상담 이력</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {realEstateMockData.consultations.slice(0, 3).map((consultation, index) => (
              <div key={consultation.id} style={{ paddingBottom: index < 2 ? 16 : 0, borderBottom: index < 2 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600 }}>{consultation.date}</span>
                  <Badge color="var(--color-muted)">{consultation.type}</Badge>
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-fg)', lineHeight: 1.5 }}>{consultation.summary}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 20, borderColor: confirmDelete ? 'var(--color-danger)' : 'var(--color-border)', background: confirmDelete ? 'color-mix(in oklch, var(--color-danger), transparent 96%)' : 'transparent' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 200, flex: 1 }}>
              <div style={{ color: 'var(--color-danger)', fontSize: 14, fontWeight: 900 }}>고객 정보 관리</div>
              <div style={{ marginTop: 4, color: 'var(--color-muted)', fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>삭제된 정보는 복구할 수 없습니다.</div>
            </div>
            {confirmDelete ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <ActionButton variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>취소</ActionButton>
                <ActionButton variant="primary" size="sm" color="var(--color-danger)" onClick={handleDelete}>삭제 확인</ActionButton>
              </div>
            ) : (
              <ActionButton variant="outline" size="sm" color="var(--color-danger)" onClick={() => setConfirmDelete(true)}>{AppIcons.trash} 고객 삭제</ActionButton>
            )}
          </div>
        </Card>
      </div>
    </DetailDrawer>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--color-bg)' }}>
      <span style={{ fontSize: 13, color: 'var(--color-muted)', minWidth: 100, flexShrink: 0, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, color: highlight ? 'var(--color-brand)' : 'var(--color-fg)', fontWeight: highlight ? 700 : 500 }}>{value}</span>
    </div>
  );
}

import React from 'react';
import { useParams } from 'react-router-dom';
import { realEstateMockData } from '@/lib/mock-data';
import { DetailDrawer } from '@/components/layout/DetailDrawer';
import { ActionButton } from '@/components/ui/ActionButton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AppIcons } from '@/components/icons/AppIcons';

export function PropertyDetail() {
  const { id } = useParams();
  const property = realEstateMockData.properties.find((p) => p.id.toString() === id);

  if (!property) return null;

  const matchedCustomers = realEstateMockData.customers.slice(0, property.matchCount);

  return (
    <DetailDrawer 
      open={true} 
      title={property.name} 
      subtitle={`${property.region} · ${property.type} ${property.price}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ 
          height: 220, 
          borderRadius: 12, 
          overflow: 'hidden', 
          background: 'var(--color-bg)', 
          border: '1px solid var(--color-border)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexDirection: 'column', 
          gap: 12,
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'radial-gradient(var(--color-fg) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
          <span style={{ color: 'var(--color-muted)', transform: 'scale(1.5)' }}>{AppIcons.building}</span>
          <span style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 600 }}>매물 사진 준비 중</span>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--color-brand)', letterSpacing: '-0.04em', marginBottom: 4 }}>{property.price}</div>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', fontWeight: 600 }}>{property.area} · {property.floor} · {property.type}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <ActionButton variant="primary" size="sm">소개글 생성</ActionButton>
            <ActionButton variant="secondary" size="sm">수정</ActionButton>
          </div>
        </div>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>매물 상세 정보</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <InfoRow label="매물명" value={property.name} />
            <InfoRow label="주소" value={property.region} highlight />
            <InfoRow label="거래 유형" value={property.type} />
            <InfoRow label="가격" value={property.price} highlight />
            <InfoRow label="면적" value={property.area} />
            <InfoRow label="층수" value={property.floor} />
            <InfoRow label="상태" value={property.status} />
            <InfoRow label="최근 수정" value={property.updated} />
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>매칭 고객 ({property.matchCount}명)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {matchedCustomers.length > 0
              ? matchedCustomers.map((customer, index) => (
                  <div key={customer.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: index < matchedCustomers.length - 1 ? 12 : 0, borderBottom: index < matchedCustomers.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <Avatar initials={`${customer.name[0]}○`} size={32} color={customer.statusColor} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-fg)' }}>{customer.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 500 }}>{customer.region} · {customer.budget}</div>
                    </div>
                    <Badge color="var(--color-success)">매칭됨</Badge>
                  </div>
                ))
              : <div style={{ fontSize: 13, color: 'var(--color-muted)', padding: '8px 0', fontWeight: 500 }}>아직 매칭된 고객이 없습니다.</div>}
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>홍보 채널 관리</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
            {['네이버 블로그', '문자/카카오톡', '네이버 부동산', '직방/다방'].map((channel) => (
              <span key={channel} style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 6, 
                padding: '6px 12px', 
                borderRadius: 10, 
                background: 'var(--color-bg)', 
                border: '1px solid var(--color-border)', 
                fontSize: 13, 
                color: 'var(--color-fg)',
                fontWeight: 600
              }}>
                <span style={{ color: 'var(--color-muted)' }}>
                  {channel === '네이버 블로그' ? AppIcons.penLine : channel === '문자/카카오톡' ? AppIcons.sms : channel === '네이버 부동산' ? AppIcons.home : AppIcons.fileText}
                </span>
                {channel}
              </span>
            ))}
          </div>
          <ActionButton variant="primary" size="md" style={{ width: '100%' }}>AI 전체 채널 홍보 문구 생성</ActionButton>
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

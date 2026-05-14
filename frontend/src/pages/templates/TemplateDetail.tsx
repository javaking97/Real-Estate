import React from 'react';
import { useParams } from 'react-router-dom';
import { realEstateMockData } from '@/lib/mock-data';
import { DetailDrawer } from '@/components/layout/DetailDrawer';
import { ActionButton } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AppIcons } from '@/components/icons/AppIcons';

export function TemplateDetail() {
  const { id } = useParams();
  const template = realEstateMockData.templates.find((t) => t.id.toString() === id);

  if (!template) return null;

  const statusColorMap: Record<string, string> = {
    '작성 완료': 'var(--color-success)',
    '작성 대기': 'var(--color-warn)',
    '초안 생성 중': 'var(--color-brand)',
    미작성: 'var(--color-danger)',
  };
  const statusColor = statusColorMap[template.status] || 'var(--color-muted)';

  return (
    <DetailDrawer 
      open={true} 
      title={template.title} 
      subtitle={`${template.channel} · ${template.type} · ${template.updated}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge color={statusColor} dot>{template.status}</Badge>
            <Badge color="var(--color-muted)">{template.channel}</Badge>
            <Badge color="color-mix(in oklch, var(--color-muted), transparent 40%)">{template.type}</Badge>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ActionButton variant="secondary" size="sm">수정하기</ActionButton>
            <ActionButton variant="outline" size="sm">복사하기</ActionButton>
          </div>
        </div>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>콘텐츠 미리보기</div>
          <div style={{ 
            minHeight: 200, 
            border: '1px solid var(--color-border)', 
            borderRadius: 12, 
            background: 'var(--color-bg)', 
            padding: 16, 
            fontSize: 14, 
            color: template.preview ? 'var(--color-fg)' : 'var(--color-muted)', 
            lineHeight: 1.8, 
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit'
          }}>
            {template.preview || '아직 미리볼 본문이 없습니다. AI로 작성하기를 실행하면 이 영역에서 초안 내용을 확인할 수 있습니다.'}
          </div>
        </Card>

        <Card style={{ padding: 20, background: 'color-mix(in oklch, var(--color-brand), transparent 96%)', borderColor: 'color-mix(in oklch, var(--color-brand), transparent 80%)' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-brand)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{AppIcons.sparkle}</span> AI 추천 작업
          </div>
          <p style={{ fontSize: 14, color: 'var(--color-fg)', lineHeight: 1.7, margin: 0 }}>
            {template.status === '작성 완료' ? '현재 템플릿은 바로 복사해 발송할 수 있습니다. 채널별 문구 톤만 최종 확인하세요.' : `${template.channel} 채널에 맞춰 ${template.type} 초안을 생성하는 것을 권장합니다.`}
          </p>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>템플릿 정보</div>
          <InfoRow label="채널" value={template.channel} highlight />
          <InfoRow label="유형" value={template.type} />
          <InfoRow label="상태" value={template.status} highlight />
          <InfoRow label="최근 수정" value={template.updated} />
        </Card>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'stretch', flexWrap: 'wrap' }}>
          <ActionButton variant="primary" size="md" style={{ flex: 1 }}>AI로 작성하기</ActionButton>
          <ActionButton variant="secondary" size="md" style={{ flex: 1 }}>최종 발행하기</ActionButton>
        </div>
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

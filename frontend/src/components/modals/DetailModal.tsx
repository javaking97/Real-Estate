import React from 'react';
import { AppIcons } from '@/components/icons/AppIcons';
import { ActionButton } from '@/components/ui/ActionButton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { showToast } from '@/components/ui/toast';
import { realEstateMockData, type RealEstateMockData } from '@/lib/mock-data';
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence';

type CustomerItem = RealEstateMockData['customers'][number];
type PropertyItem = RealEstateMockData['properties'][number];
type ConsultationItem = RealEstateMockData['consultations'][number];
type TemplateItem = RealEstateMockData['templates'][number];

export type DetailModalPayload =
  | { type: 'customer'; data: CustomerItem }
  | { type: 'property'; data: PropertyItem }
  | { type: 'consultation'; data: ConsultationItem }
  | { type: 'template'; data: TemplateItem };

type DetailModalProps = {
  modal: DetailModalPayload | null;
  onClose: () => void;
};

export function DetailModal({ modal, onClose }: DetailModalProps) {
  const [activeModal, setActiveModal] = React.useState<DetailModalPayload | null>(modal);
  const modalPresence = useAnimatedPresence(Boolean(modal), 160);

  React.useEffect(() => {
    if (modal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- 닫힘 애니메이션 동안 직전 모달 데이터를 유지해야 한다.
      setActiveModal(modal);
    }
  }, [modal]);

  useEscapeKey(activeModal, onClose);

  if (!modalPresence.present || !activeModal) {
    return null;
  }

  return (
    <>
      <button
        aria-label="상세 모달 닫기"
        onClick={onClose}
        className="modal-backdrop"
        data-transition-status={modalPresence.transitionStatus}
        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)', border: 'none' }}
      />
      <section
        className="r-modal"
        data-transition-status={modalPresence.transitionStatus}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 301,
          width: activeModal.type === 'customer' ? 640 : 580,
          maxWidth: '92vw',
          maxHeight: '85vh',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {activeModal.type === 'customer' ? <CustomerModal data={activeModal.data} onClose={onClose} /> : null}
        {activeModal.type === 'property' ? <PropertyModal data={activeModal.data} onClose={onClose} /> : null}
        {activeModal.type === 'consultation' ? <ConsultationModal data={activeModal.data} onClose={onClose} /> : null}
        {activeModal.type === 'template' ? <TemplateModal data={activeModal.data} onClose={onClose} /> : null}
      </section>
    </>
  );
}

function useEscapeKey(modal: DetailModalPayload | null, onClose: () => void) {
  React.useEffect(() => {
    if (!modal) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modal, onClose]);
}

function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div style={{ padding: '18px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{subtitle}</div> : null}
      </div>
      <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
        {AppIcons.x}
      </button>
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #F9FAFB' }}>
      <span style={{ fontSize: 13, color: '#9CA3AF', minWidth: 90, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: highlight ? '#2563EB' : '#374151', fontWeight: highlight ? 600 : 400 }}>{value}</span>
    </div>
  );
}

function CustomerModal({ data, onClose }: { data: CustomerItem; onClose: () => void }) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    showToast(`${data.name} 고객 삭제를 확인했습니다.`, 'success');
    onClose();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
      <ModalHeader title={`${data.name} 고객 상세`} subtitle={`${data.region} · ${data.type}`} onClose={onClose} />
      <div style={{ overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <Avatar initials={`${data.name[0]}○`} size={48} color={data.statusColor} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{data.name}</span>
              <Badge color={data.statusColor} dot>{data.status}</Badge>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <ActionButton variant="primary" size="sm">연락하기</ActionButton>
              <ActionButton variant="secondary" size="sm">문자 작성</ActionButton>
              <ActionButton variant="secondary" size="sm">일정 등록</ActionButton>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          <Card style={{ padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>기본 정보</div>
            <InfoRow label="거래 유형" value={data.type} />
            <InfoRow label="관심 지역" value={data.region} highlight />
            <InfoRow label="예산" value={data.budget} highlight />
            <InfoRow label="선호 조건" value={data.interest} />
            <InfoRow label="최근 상담" value={data.lastContact} />
            <InfoRow label="다음 액션" value={data.nextAction} highlight />
          </Card>

          <Card style={{ padding: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI 분석</div>
            <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: 8, padding: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#0369A1', fontWeight: 700, marginBottom: 4 }}>
                {AppIcons.lightbulb} AI 추천:
              </div>
              <div style={{ fontSize: 13, color: '#0369A1', lineHeight: 1.5, marginBottom: 8 }}>
                {data.region} 지역 {data.budget} 범위 내 {data.type} 매물을 우선 추천 대상으로 유지 중입니다.
                {data.interest.includes('역세권') ? ' 역세권 조건 매칭 우선순위가 높습니다.' : ''}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: '#0369A1', fontWeight: 700, marginBottom: 4 }}>
                {AppIcons.barChart} 전환 가능성
              </div>
              <div style={{ fontSize: 13, color: '#0369A1', lineHeight: 1.5 }}>
                최근 상담 빈도와 다음 액션 기준으로 계약 전환 가능성이 높습니다. 오늘 후속 연락을 권장합니다.
              </div>
            </div>
          </Card>
        </div>

        <Card style={{ padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>상담 이력</div>
          {realEstateMockData.consultations.slice(0, 3).map((consultation, index) => (
            <div key={consultation.id} style={{ padding: '6px 0', borderBottom: index < 2 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>{consultation.date}</span>
                <Badge color="#6B7280">{consultation.type}</Badge>
              </div>
              <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.35 }}>{consultation.summary}</div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 12, borderColor: confirmDelete ? '#FCA5A5' : '#FEE2E2', background: confirmDelete ? '#FEF2F2' : '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 220, flex: 1 }}>
              <div style={{ color: '#B91C1C', fontSize: 13, fontWeight: 900 }}>고객 삭제</div>
              <div style={{ marginTop: 4, color: '#64748B', fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>삭제 전 한 번 더 확인해 실수로 고객 정보를 잃지 않도록 합니다.</div>
            </div>
            {confirmDelete ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <ActionButton variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>취소</ActionButton>
                <ActionButton variant="primary" size="sm" color="#DC2626" onClick={handleDelete}>삭제 확인</ActionButton>
              </div>
            ) : (
              <ActionButton variant="outline" size="sm" color="#DC2626" onClick={() => setConfirmDelete(true)}>{AppIcons.trash} 고객 삭제</ActionButton>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function PropertyModal({ data, onClose }: { data: PropertyItem; onClose: () => void }) {
  const matchedCustomers = realEstateMockData.customers.slice(0, data.matchCount);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
      <ModalHeader title={data.name} subtitle={`${data.region} · ${data.type} ${data.price}`} onClose={onClose} />
      <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ height: 180, borderRadius: 10, overflow: 'hidden', background: 'repeating-linear-gradient(45deg, #E5E7EB, #E5E7EB 3px, #F3F4F6 3px, #F3F4F6 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
          <span style={{ color: '#9CA3AF' }}>{AppIcons.building}</span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>매물 사진 — 실제 사진으로 교체 필요</span>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1D4ED8', marginBottom: 4 }}>{data.price}</div>
            <div style={{ fontSize: 13, color: '#6B7280' }}>{data.area} · {data.floor} · {data.type}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <ActionButton variant="primary" size="sm">소개글 생성</ActionButton>
            <ActionButton variant="secondary" size="sm">수정</ActionButton>
          </div>
        </div>

        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>매물 상세</div>
          <InfoRow label="매물명" value={data.name} />
          <InfoRow label="주소" value={data.region} highlight />
          <InfoRow label="거래 유형" value={data.type} />
          <InfoRow label="가격" value={data.price} highlight />
          <InfoRow label="면적" value={data.area} />
          <InfoRow label="층수" value={data.floor} />
          <InfoRow label="상태" value={data.status} />
          <InfoRow label="최근 수정" value={data.updated} />
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>추천 고객 ({data.matchCount}명)</div>
          {matchedCustomers.length > 0
            ? matchedCustomers.map((customer, index) => (
                <div key={customer.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: index < matchedCustomers.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                  <Avatar initials={`${customer.name[0]}○`} size={28} color={customer.statusColor} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{customer.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{customer.region} · {customer.budget}</div>
                  </div>
                  <Badge color="#10B981">매칭</Badge>
                </div>
              ))
            : <div style={{ fontSize: 13, color: '#9CA3AF', padding: '8px 0' }}>아직 매칭된 고객이 없습니다.</div>}
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>템플릿 현황</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {['네이버 블로그', '문자/카카오톡', '네이버 부동산', '직방/다방'].map((channel) => (
              <span key={channel} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 9px', borderRadius: 7, background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: 12, color: '#374151' }}>
                {channel === '네이버 블로그' ? AppIcons.penLine : channel === '문자/카카오톡' ? AppIcons.sms : channel === '네이버 부동산' ? AppIcons.home : AppIcons.fileText}
                {channel}
              </span>
            ))}
          </div>
          <ActionButton variant="primary" size="sm">AI 전체 채널 생성</ActionButton>
        </Card>
      </div>
    </div>
  );
}

function ConsultationModal({ data, onClose }: { data: ConsultationItem; onClose: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
      <ModalHeader title={`${data.customer} 상담 상세`} subtitle={`${data.date} · ${data.type}`} onClose={onClose} />
      <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10 }}>상담 내용</div>
          <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.8, margin: 0 }}>{data.summary}</p>
        </Card>
        <Card style={{ padding: 16, background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0369A1', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{AppIcons.sparkle}</span> AI 요약
          </div>
          <p style={{ fontSize: 14, color: '#0C4A6E', lineHeight: 1.7, margin: 0 }}>
            {data.summary.split('·')[0].trim()}. 빠른 후속 조치가 필요합니다.
          </p>
        </Card>
        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10 }}>다음 액션</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#F9FAFB', borderRadius: 8 }}>
            <span style={{ color: '#F59E0B' }}>{AppIcons.zap}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', flex: 1 }}>{data.nextAction}</span>
            <ActionButton variant="primary" size="sm">처리하기</ActionButton>
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <ActionButton variant="outline" size="sm" color="#8B5CF6">문자 초안 작성</ActionButton>
          <ActionButton variant="secondary" size="sm">일정 연결</ActionButton>
          <ActionButton variant="primary" size="sm">완료 처리</ActionButton>
        </div>
      </div>
    </div>
  );
}

function TemplateModal({ data, onClose }: { data: TemplateItem; onClose: () => void }) {
  const statusColorMap: Record<string, string> = {
    '작성 완료': '#10B981',
    '작성 대기': '#F59E0B',
    '초안 생성 중': '#2563EB',
    미작성: '#EF4444',
  };
  const statusColor = statusColorMap[data.status] || '#9CA3AF';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}>
      <ModalHeader title={data.title} subtitle={`${data.channel} · ${data.type} · ${data.updated}`} onClose={onClose} />
      <div style={{ overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Badge color={statusColor} dot>{data.status}</Badge>
            <Badge color="#6B7280">{data.channel}</Badge>
            <Badge color="#9CA3AF">{data.type}</Badge>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ActionButton variant="secondary" size="sm">수정하기</ActionButton>
            <ActionButton variant="outline" size="sm">복사하기</ActionButton>
          </div>
        </div>

        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>콘텐츠 미리보기</div>
          <div style={{ minHeight: 160, border: '1px solid #E5E7EB', borderRadius: 10, background: '#F9FAFB', padding: 14, fontSize: 14, color: data.preview ? '#374151' : '#9CA3AF', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
            {data.preview || '아직 미리볼 본문이 없습니다. AI로 작성하기를 실행하면 이 영역에서 초안 내용을 확인할 수 있습니다.'}
          </div>
        </Card>

        <Card style={{ padding: 16, background: '#F0F9FF', border: '1px solid #BAE6FD' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0369A1', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{AppIcons.sparkle}</span> AI 추천 작업
          </div>
          <p style={{ fontSize: 14, color: '#0C4A6E', lineHeight: 1.7, margin: 0 }}>
            {data.status === '작성 완료' ? '현재 템플릿은 바로 복사해 발송할 수 있습니다. 채널별 문구 톤만 최종 확인하세요.' : `${data.channel} 채널에 맞춰 ${data.type} 초안을 생성하는 것을 권장합니다.`}
          </p>
        </Card>

        <Card style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>템플릿 정보</div>
          <InfoRow label="채널" value={data.channel} highlight />
          <InfoRow label="유형" value={data.type} />
          <InfoRow label="상태" value={data.status} highlight />
          <InfoRow label="최근 수정" value={data.updated} />
        </Card>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <ActionButton variant="secondary" size="sm">수정하기</ActionButton>
          <ActionButton variant="outline" size="sm">복사하기</ActionButton>
          <ActionButton variant="primary" size="sm">AI로 작성하기</ActionButton>
        </div>
      </div>
    </div>
  );
}

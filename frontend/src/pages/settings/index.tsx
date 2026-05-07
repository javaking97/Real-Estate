import React from 'react';
import { ActionButton } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { AppIcons } from '@/components/icons/AppIcons';
import { showToast } from '@/components/ui/toast';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { PageHeader } from '@/components/ui/PageHeader';

type SettingsTab = '계정' | '알림' | '업무 기본값' | '화면 설정' | '연동';

const settingsTabs: SettingsTab[] = ['계정', '알림', '업무 기본값', '화면 설정', '연동'];

const notificationSettings = [
  { title: '신규 상담 알림', description: '새 고객 상담이 등록되면 즉시 알려줍니다.', enabled: true },
  { title: '일정 임박 알림', description: '방문·계약 일정 30분 전에 알림을 보냅니다.', enabled: true },
  { title: '계약 임박 알림', description: '계약 가능성이 높은 상담을 우선 표시합니다.', enabled: true },
  { title: '만기 임박 알림', description: '임대차 만기 30일 전부터 재계약 확인을 안내합니다.', enabled: false },
];

const workflowDefaults = [
  { label: '기본 담당 지역', value: '강남구 · 서초구 · 송파구' },
  { label: '주요 매물 유형', value: '아파트 · 오피스텔 · 빌라' },
  { label: '기본 상담 상태', value: '응답 대기' },
  { label: '매물 추천 기준', value: '지역 우선 · 가격 보조' },
];

const integrationItems = [
  { name: '캘린더 연동', status: '준비중', description: '구글·네이버 캘린더 일정 동기화' },
  { name: '문자 발송 연동', status: '준비중', description: '상담 템플릿 기반 문자 발송' },
  { name: '공공데이터 연동', status: '후순위', description: '실거래가·공시자료 자동 조회' },
];

export function SettingsPage() {
  const { data: currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = React.useState<SettingsTab>('계정');

  return (
    <div className="settings-page">
      <PageHeader
        className="settings-page-header"
        titleClassName="settings-title"
        summaryClassName="settings-summary"
        title="설정"
        summary="계정, 알림, 업무 기본값을 현재 사무소 운영 방식에 맞게 관리합니다."
        actions={<ActionButton variant="primary" size="md" onClick={() => showToast('설정이 저장되었습니다.', 'success')} style={{ minHeight: 40 }} className="settings-save-button">변경사항 저장</ActionButton>}
      />

      <div className="settings-tabs" aria-label="설정 카테고리">
        {settingsTabs.map((tab) => (
          <button key={tab} type="button" className={activeTab === tab ? 'is-active' : ''} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="settings-layout">
        <div className="settings-main">
          {activeTab === '계정' && (
            <>
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div className="settings-section-header">
                  <div>
                    <strong>계정 프로필</strong>
                    <span>상담·계약 문서와 알림에 표시되는 기본 정보입니다.</span>
                  </div>
                  <Badge color="#10B981" bg="#ECFDF5" dot>활성</Badge>
                </div>
                <div className="settings-form-grid">
                  <label><span>이름</span><input value={currentUser?.displayName || '홍진영 소장'} readOnly /></label>
                  <label><span>소속 부동산</span><input value="샘플부동산" readOnly /></label>
                  <label><span>연락처</span><input value="010-1234-5678" readOnly /></label>
                  <label><span>이메일</span><input value="owner@realestate.local" readOnly /></label>
                </div>
              </Card>

              <Card style={{ padding: 18 }}>
                <div className="settings-security-card">
                  <div className="settings-icon-box">{AppIcons.user}</div>
                  <div>
                    <strong>보안 관리</strong>
                    <span>비밀번호 변경과 로그인 세션 관리는 다음 단계에서 연동됩니다.</span>
                  </div>
                  <ActionButton variant="secondary" size="sm">비밀번호 변경</ActionButton>
                </div>
              </Card>
            </>
          )}

          {activeTab === '알림' && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="settings-section-header">
                <div>
                  <strong>알림 설정</strong>
                  <span>놓치면 안 되는 상담·일정·계약 이벤트를 관리합니다.</span>
                </div>
              </div>
              <div className="settings-toggle-list">
                {notificationSettings.map((setting) => <SettingsToggleRow key={setting.title} {...setting} />)}
              </div>
            </Card>
          )}

          {activeTab === '업무 기본값' && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="settings-section-header">
                <div>
                  <strong>업무 기본값</strong>
                  <span>고객 등록, 상담 시작, 매물 추천에 기본 적용되는 값입니다.</span>
                </div>
              </div>
              <div className="settings-default-grid">
                {workflowDefaults.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <button type="button">수정</button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === '화면 설정' && (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="settings-section-header">
                <div>
                  <strong>화면 설정</strong>
                  <span>업무 시작 화면과 보조 패널 표시 방식을 정합니다.</span>
                </div>
              </div>
              <div className="settings-form-grid">
                <label><span>기본 시작 페이지</span><select defaultValue="dashboard"><option value="dashboard">샘플부동산 비서</option><option value="today">오늘 할 일</option><option value="customers">고객관리</option></select></label>
                <label><span>상담 기본 보기</span><select defaultValue="list"><option value="list">목록</option><option value="pipeline">파이프라인</option></select></label>
                <label><span>매물 기본 보기</span><select defaultValue="table"><option value="table">테이블</option><option value="card">카드</option></select></label>
                <label><span>검색 결과 개수</span><select defaultValue="6"><option value="6">6개</option><option value="10">10개</option><option value="15">15개</option></select></label>
              </div>
            </Card>
          )}

          {activeTab === '연동' && (
            <div className="settings-integration-grid">
              {integrationItems.map((item) => (
                <Card key={item.name} style={{ padding: 18 }}>
                  <div className="settings-integration-card">
                    <div className="settings-icon-box">{AppIcons.link}</div>
                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.description}</span>
                    </div>
                    <Badge color={item.status === '준비중' ? '#F59E0B' : '#64748B'}>{item.status}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <aside className="settings-side-panel">
          <Card style={{ padding: 18 }}>
            <div className="settings-side-title">설정 체크리스트</div>
            <div className="settings-check-list">
              <span><i /> 계정 정보 확인</span>
              <span><i /> 신규 상담 알림 활성화</span>
              <span><i /> 담당 지역 기본값 설정</span>
            </div>
          </Card>
          <Card style={{ padding: 18 }}>
            <div className="settings-side-title">권장 다음 단계</div>
            <p className="settings-side-copy">캘린더와 문자 발송 연동을 연결하면 일정 누락과 후속 연락 지연을 줄일 수 있습니다.</p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SettingsToggleRow({ title, description, enabled }: { title: string; description: string; enabled: boolean }) {
  const [checked, setChecked] = React.useState(enabled);

  return (
    <button type="button" className="settings-toggle-row" onClick={() => setChecked((current) => !current)}>
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <span className={`settings-toggle${checked ? ' is-on' : ''}`}><i /></span>
    </button>
  );
}

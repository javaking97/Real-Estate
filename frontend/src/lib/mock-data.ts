export type IconName =
  | 'calendar'
  | 'user'
  | 'chat'
  | 'doc'
  | 'contract'
  | 'blog'
  | 'sms'
  | 'news'
  | 'bell'
  | 'sparkle'
  | 'template'
  | 'zap';

export type NotificationType = 'urgent' | 'schedule' | 'ai' | 'expire' | 'contract';

export type NotificationItem = {
  id: number;
  type: NotificationType;
  icon: IconName;
  title: string;
  desc: string;
  time: string;
  read: boolean;
};

export type SummaryCard = {
  id: string;
  icon: IconName;
  label: string;
  value: number;
  unit: string;
  desc: string;
  color: string;
  bg: string;
};

export type RealEstateMockData = {
  user: { name: string; company: string; avatar: string };
  today: string;
  priorityTasks: Array<{
    id: number;
    customer: string;
    text: string;
    meta: string;
    tags: string[];
    urgency: string;
    urgencyColor: string;
    action: string;
    actionColor: string;
  }>;
  summaryCards: SummaryCard[];
  recentConsultations: Array<{
    id: number;
    name: string;
    status: string;
    statusColor: string;
    time: string;
    summary: string;
    detail: string;
  }>;
  recommendedProperties: Array<{
    id: number;
    forCustomer: string;
    matchCount: number;
    properties: Array<{
      name: string;
      price: string;
      rooms: string;
      floor: string;
      type: string;
      match: number;
    }>;
    img: string | null;
  }>;
  templateTasks: Array<{
    id: number;
    icon: IconName;
    text: string;
    channel: string;
    time: string;
    action: string;
  }>;
  quickMemos: string[];
  customers: Array<{
    id: number;
    name: string;
    type: string;
    region: string;
    budget: string;
    lastContact: string;
    nextAction: string;
    status: string;
    statusColor: string;
    interest: string;
  }>;
  properties: Array<{
    id: number;
    name: string;
    region: string;
    type: string;
    price: string;
    area: string;
    floor: string;
    status: string;
    matchCount: number;
    template: string;
    updated: string;
  }>;
  consultations: Array<{
    id: number;
    date: string;
    customer: string;
    type: string;
    summary: string;
    nextAction: string;
    assignee: string;
    status: string;
    statusColor: string;
  }>;
  schedules: Array<{
    id: number;
    time: string;
    customer: string;
    title: string;
    type: string;
    color: string;
  }>;
  templates: Array<{
    id: number;
    title: string;
    channel: string;
    type: string;
    status: string;
    updated: string;
    preview: string;
  }>;
  notifications: NotificationItem[];
};

export const realEstateMockData: RealEstateMockData = {
  user: { name: '홍진영 소장', company: '샘플부동산', avatar: 'KM' },
  today: '2026.04.25 토',
  priorityTasks: [
    {
      id: 1,
      customer: '박OO',
      text: '고객에게 어제 본 매물 후속 연락 필요',
      meta: '어제 통화',
      tags: ['전화/감성/8억 이하'],
      urgency: '오늘 마감',
      urgencyColor: '#EF4444',
      action: '연락하기',
      actionColor: '#2563EB',
    },
    {
      id: 2,
      customer: '이OO',
      text: '고객 방문 일정 확정 필요',
      meta: '2일 전 문자',
      tags: ['매매/마포·용산/6억대'],
      urgency: '오늘 마감',
      urgencyColor: '#EF4444',
      action: '일정 확인',
      actionColor: '#2563EB',
    },
    {
      id: 3,
      customer: '김OO',
      text: '고객 조건에 맞는 신규 매물 2건 확인 필요',
      meta: '성동·광진',
      tags: ['7억 이하'],
      urgency: '우선 순위 높음',
      urgencyColor: '#F59E0B',
      action: '매물 보기',
      actionColor: '#2563EB',
    },
    {
      id: 4,
      customer: '전세 만기',
      text: '30일 전 고객 2명 연락 필요',
      meta: '만기 임박',
      tags: [],
      urgency: '우선 순위 높음',
      urgencyColor: '#F59E0B',
      action: '대상 확인',
      actionColor: '#2563EB',
    },
    {
      id: 5,
      customer: '역삼동',
      text: '매물 블로그 게시글 초안 작성 가능',
      meta: '템플릿 작업',
      tags: [],
      urgency: '작업 대기',
      urgencyColor: '#8B5CF6',
      action: '작성하기',
      actionColor: '#8B5CF6',
    },
  ],
  summaryCards: [
    { id: 'visit', icon: 'calendar', label: '오늘 방문 예약', value: 3, unit: '건', desc: '예정된 방문 일정', color: '#2563EB', bg: '#EFF6FF' },
    { id: 'reply', icon: 'user', label: '응답 필요 고객', value: 5, unit: '명', desc: '후속 응대가 필요한 고객', color: '#10B981', bg: '#ECFDF5' },
    { id: 'consult', icon: 'chat', label: '상담 요약 대기', value: 2, unit: '건', desc: '정리되지 않은 상담 기록', color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'template', icon: 'doc', label: '템플릿 작성 대기', value: 4, unit: '건', desc: '게시글/문자 작성 필요', color: '#8B5CF6', bg: '#F5F3FF' },
    { id: 'contract', icon: 'contract', label: '계약 진행 건', value: 6, unit: '건', desc: '진행 중인 계약', color: '#0EA5E9', bg: '#F0F9FF' },
  ],
  recentConsultations: [
    {
      id: 1,
      name: '박OO',
      status: '진행중',
      statusColor: '#10B981',
      time: '어제',
      summary: '강남/서초 전세 8억 이하, 주차 가능 매물 선호',
      detail: '어제 통화 · 다음 액션: 매물 3개 전송',
    },
    {
      id: 2,
      name: '이OO',
      status: '진행중',
      statusColor: '#2563EB',
      time: '2일 전',
      summary: '마포/용산 아파트 매매 희망, 역세권 선호',
      detail: '2일 전 문자 · 다음 액션: 방문 일정 확정',
    },
    {
      id: 3,
      name: '최OO',
      status: '신상담',
      statusColor: '#F59E0B',
      time: '3일 전',
      summary: '송파/강동 9억 이하, 학군 중요',
      detail: '3일 전 통화 · 다음 액션: 추가 매물 추천',
    },
  ],
  recommendedProperties: [
    {
      id: 1,
      forCustomer: '박OO',
      matchCount: 3,
      properties: [
        { name: '역삼동 아파트 전세', price: '7.8억', rooms: '34㎡', floor: '12층', type: '전세', match: 92 },
      ],
      img: null,
    },
    {
      id: 2,
      forCustomer: '이OO',
      matchCount: 2,
      properties: [
        { name: '아현동 아파트 매매', price: '6.2억', rooms: '25평', floor: '8층', type: '매매', match: 88 },
      ],
      img: null,
    },
  ],
  templateTasks: [
    { id: 1, icon: 'blog', text: '역삼동 전세 매물 소개글 작성', channel: '블로그', time: '3시간 전', action: '작성하기' },
    { id: 2, icon: 'sms', text: '박OO 고객 안내 문자 작성', channel: '문자', time: '5시간 전', action: '작성하기' },
    { id: 3, icon: 'news', text: '이번 주 부동산 소식 블로그 초안', channel: '네이버 부동산', time: '1일 전', action: '작성하기' },
    { id: 4, icon: 'doc', text: '신규 매물 4건 게시글 문구 생성', channel: '블로그', time: '6시간 전', action: '작성하기' },
  ],
  quickMemos: [
    '박OO 고객 방문 가능 여부 확인',
    '이OO 대출 상담사 연결 요청',
    '역삼동 신규 매물 사진 촬영 요청',
    '블로그 글 주 2회 업로드 목표',
  ],
  customers: [
    { id: 1, name: '박OO', type: '전세', region: '강남/서초', budget: '8억 이하', lastContact: '어제', nextAction: '매물 3개 전송', status: '진행중', statusColor: '#10B981', interest: '역세권, 주차 가능' },
    { id: 2, name: '이OO', type: '매매', region: '마포/용산', budget: '6억대', lastContact: '2일 전', nextAction: '방문 일정 확정', status: '진행중', statusColor: '#2563EB', interest: '역세권 선호' },
    { id: 3, name: '최OO', type: '매매', region: '송파/강동', budget: '9억 이하', lastContact: '3일 전', nextAction: '추가 매물 추천', status: '신상담', statusColor: '#F59E0B', interest: '학군 중요' },
    { id: 4, name: '정OO', type: '월세', region: '마포/은평', budget: '보증 1억/월 90', lastContact: '5일 전', nextAction: '재계약 안내', status: '만기 임박', statusColor: '#EF4444', interest: '엘리베이터, 주차' },
    { id: 5, name: '한OO', type: '전세', region: '성동/광진', budget: '5억 이하', lastContact: '1주일 전', nextAction: '매물 안내', status: '대기', statusColor: '#9CA3AF', interest: '조용한 환경' },
    { id: 6, name: '윤OO', type: '매매', region: '강남/서초', budget: '15억 이하', lastContact: '어제', nextAction: '계약서 검토', status: '계약 임박', statusColor: '#8B5CF6', interest: '고층, 한강뷰' },
  ],
  properties: [
    { id: 1, name: '역삼동 래미안아파트', region: '강남구 역삼동', type: '전세', price: '7.8억', area: '34평', floor: '12층', status: '추천 중', matchCount: 3, template: '작성 완료', updated: '오늘' },
    { id: 2, name: '아현동 힐스테이트', region: '마포구 아현동', type: '매매', price: '6.2억', area: '25평', floor: '8층', status: '진행 중', matchCount: 2, template: '작성 대기', updated: '2일 전' },
    { id: 3, name: '반포동 자이아파트', region: '서초구 반포동', type: '전세', price: '8억', area: '32평', floor: '15층', status: '신규', matchCount: 1, template: '미작성', updated: '오늘' },
    { id: 4, name: '도곡동 타워팰리스', region: '강남구 도곡동', type: '전세', price: '7.5억', area: '30평', floor: '22층', status: '추천 중', matchCount: 2, template: '작성 완료', updated: '3일 전' },
    { id: 5, name: '효창동 e편한세상', region: '용산구 효창동', type: '매매', price: '6억', area: '28평', floor: '5층', status: '신규', matchCount: 0, template: '미작성', updated: '오늘' },
  ],
  consultations: [
    { id: 1, date: '2026.04.24', customer: '박OO', type: '전화 상담', summary: '강남/서초 전세 8억 이하, 주차 가능 매물 선호. 이번 주말 방문 희망.', nextAction: '매물 3개 전송', assignee: '김민수', status: '응답 대기', statusColor: '#EF4444' },
    { id: 2, date: '2026.04.23', customer: '이OO', type: '방문 상담', summary: '마포/용산 아파트 매매 희망. 6억대, 역세권 선호. 방문 일정 조율 필요.', nextAction: '방문 일정 확정', assignee: '김민수', status: '일정 대기', statusColor: '#F59E0B' },
    { id: 3, date: '2026.04.22', customer: '최OO', type: '전화 상담', summary: '송파/강동 9억 이하 매매. 학군 중요. 초품아 선호.', nextAction: '추가 매물 추천', assignee: '김민수', status: '매물 검색 중', statusColor: '#2563EB' },
    { id: 4, date: '2026.04.20', customer: '윤OO', type: '방문 상담', summary: '강남 15억 이하 매매. 한강뷰 고층 아파트. 계약 가능성 높음.', nextAction: '계약서 검토', assignee: '김민수', status: '계약 임박', statusColor: '#8B5CF6' },
    { id: 5, date: '2026.04.18', customer: '정OO', type: '문자 상담', summary: '마포 월세 재계약 여부 확인 필요. 만기 30일 전.', nextAction: '재계약 안내', assignee: '김민수', status: '만기 임박', statusColor: '#EF4444' },
  ],
  schedules: [
    { id: 1, time: '10:30', customer: '박OO', title: '매물 브리핑', type: '방문', color: '#2563EB' },
    { id: 2, time: '13:00', customer: '이OO', title: '아파트 방문', type: '방문', color: '#2563EB' },
    { id: 3, time: '15:00', customer: '윤OO', title: '계약서 검토', type: '계약', color: '#8B5CF6' },
    { id: 4, time: '17:30', customer: '정OO', title: '전세 만기 후속 연락', type: '연락', color: '#F59E0B' },
  ],
  templates: [
    { id: 1, title: '역삼동 래미안 전세 소개글', channel: '네이버 블로그', type: '매물 소개', status: '작성 완료', updated: '오늘', preview: '강남구 역삼동에 위치한 래미안 아파트 전세 매물을 소개합니다...' },
    { id: 2, title: '박OO 고객 매물 안내 문자', channel: '문자/카카오톡', type: '고객 안내', status: '작성 대기', updated: '3시간 전', preview: '박OO 고객님, 말씀하신 조건에 맞는 매물 3건을 정리해드렸습니다...' },
    { id: 3, title: '이번 주 강남 부동산 소식', channel: '네이버 블로그', type: '주간 소식', status: '초안 생성 중', updated: '1일 전', preview: '이번 주 강남구 아파트 시장 동향과 주목할 만한 매물을 정리했습니다...' },
    { id: 4, title: '아현동 힐스테이트 매물 소개', channel: '직방/다방', type: '매물 소개', status: '미작성', updated: '2일 전', preview: '' },
    { id: 5, title: '신규 매물 인스타그램 홍보글', channel: '인스타그램', type: '홍보 콘텐츠', status: '미작성', updated: '오늘', preview: '' },
  ],
  notifications: [
    { id: 1, type: 'urgent', icon: 'bell', title: '박OO 고객 응답 필요', desc: '어제 통화 이후 후속 연락이 없습니다.', time: '10분 전', read: false },
    { id: 2, type: 'schedule', icon: 'calendar', title: '오늘 방문 일정 3건', desc: '10:30 박OO · 13:00 이OO · 15:00 윤OO', time: '30분 전', read: false },
    { id: 3, type: 'ai', icon: 'sparkle', title: 'AI 매물 추천 완료', desc: '김OO 고객 조건에 맞는 신규 매물 2건이 발견되었습니다.', time: '1시간 전', read: false },
    { id: 4, type: 'expire', icon: 'zap', title: '전세 만기 임박 알림', desc: '정OO 고객 전세 만기 30일 전입니다.', time: '2시간 전', read: true },
    { id: 5, type: 'contract', icon: 'template', title: '계약 일정 확정', desc: '윤OO 고객 계약서 검토 일정이 확정되었습니다.', time: '3시간 전', read: true },
    { id: 6, type: 'ai', icon: 'sparkle', title: '템플릿 초안 생성 완료', desc: '역삼동 래미안 블로그 초안이 준비되었습니다.', time: '5시간 전', read: true },
    { id: 7, type: 'schedule', icon: 'calendar', title: '내일 일정 리마인더', desc: '내일 오후 2시 이OO 고객 아파트 방문 예정입니다.', time: '어제', read: true },
  ],
};

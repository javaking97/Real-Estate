import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { showToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/ui/PageHeader';

type TodoPriority = 'high' | 'mid' | 'low';
type TodoStage = 'queue' | 'working' | 'scheduled';

type TodoItem = {
  id: number;
  done: boolean;
  stage: TodoStage;
  text: string;
  priority: TodoPriority;
  tag: string;
  customer: string;
  deadline: string;
  evidence: string[];
  recommendation: string;
  primaryAction: string;
  propertyHint: string;
};

const priorityConfigMap: Record<TodoPriority, { label: string; color: string; bg: string }> = {
  high: { label: '긴급', color: '#EF4444', bg: '#FEF2F2' },
  mid: { label: '중요', color: '#F59E0B', bg: '#FFFBEB' },
  low: { label: '일반', color: '#10B981', bg: '#ECFDF5' },
};

const filterOptions = ['전체', '고객 응대', '일정', '매물', '마케팅'] as const;
type TodoFilter = (typeof filterOptions)[number];

const boardStages: Array<{ id: TodoStage; title: string; description: string }> = [
  { id: 'queue', title: '대기 중', description: '아직 시작 전' },
  { id: 'working', title: '진행 중', description: '초안·확인 중' },
  { id: 'scheduled', title: '예약·후속', description: '시간 확인 필요' },
];

const initialTodos: TodoItem[] = [
  {
    id: 1,
    done: false,
    stage: 'working',
    text: '박OO 매물 3개 전송',
    priority: 'high',
    tag: '고객 응대',
    customer: '박OO',
    deadline: '오늘 11:30 전',
    evidence: ['응답 마감 D-day', '강남·서초 전세 8억대', '조건 매칭 매물 3건'],
    recommendation: '문자 초안과 추천 매물 링크를 먼저 보내고, 14:00 방문 가능 시간을 함께 제안하세요.',
    primaryAction: '문자 초안 만들기',
    propertyHint: '서초 래미안 84㎡ · 전세 8.1억 · 94% 매칭',
  },
  {
    id: 2,
    done: false,
    stage: 'scheduled',
    text: '이OO 방문 일정 확정',
    priority: 'high',
    tag: '일정',
    customer: '이OO',
    deadline: '오늘 13:00 전',
    evidence: ['어제 문자 열람', '방문 후보 2개', '담당자 캘린더 공석'],
    recommendation: '가능 시간이 사라지기 전에 15:30 또는 17:00 중 하나로 방문 확정을 요청하세요.',
    primaryAction: '방문 일정 확정',
    propertyHint: '마포 신축 오피스텔 · 월세 130 · 89% 매칭',
  },
  {
    id: 3,
    done: true,
    stage: 'scheduled',
    text: '역삼동 매물 사진 등록',
    priority: 'mid',
    tag: '매물',
    customer: '매물팀',
    deadline: '완료됨',
    evidence: ['사진 12장 등록', '대표 이미지 지정', '노출 준비 완료'],
    recommendation: '등록된 사진으로 매물 소개글을 이어서 생성할 수 있습니다.',
    primaryAction: '소개글 생성',
    propertyHint: '역삼 센트럴 59㎡ · 매매 12.4억',
  },
  {
    id: 4,
    done: false,
    stage: 'queue',
    text: '김OO 신규 매물 안내 문자 작성',
    priority: 'mid',
    tag: '고객 응대',
    customer: '김OO',
    deadline: '오늘 16:00 전',
    evidence: ['신규 문의 2시간 경과', '예산 조건 확인 완료', '선호 지역 일치'],
    recommendation: '처음 보내는 안내이므로 매물 2건과 상담 가능 시간을 짧게 묶어 제안하세요.',
    primaryAction: '안내 문자 작성',
    propertyHint: '한남 리버뷰 72㎡ · 매매 15.2억 · 87% 매칭',
  },
  {
    id: 5,
    done: false,
    stage: 'queue',
    text: '전세 만기 고객 재계약 안내 전화',
    priority: 'high',
    tag: '고객 응대',
    customer: '최OO 외 2명',
    deadline: '오늘 중',
    evidence: ['만기 45일 전', '동일 단지 전세가 상승', '재계약 문의 이력 있음'],
    recommendation: '시세 변동을 먼저 설명하고 재계약 의향을 확인한 뒤 대체 매물을 함께 제안하세요.',
    primaryAction: '통화 목록 열기',
    propertyHint: '만기 임박 고객 3명 · 재계약 후보 2건',
  },
  {
    id: 6,
    done: true,
    stage: 'queue',
    text: '블로그 게시글 업로드',
    priority: 'low',
    tag: '마케팅',
    customer: '마케팅',
    deadline: '완료됨',
    evidence: ['초안 검수 완료', '대표 이미지 적용', '예약 발행 설정'],
    recommendation: '발행 후 유입 키워드만 분석 리포트에서 확인하면 됩니다.',
    primaryAction: '성과 확인',
    propertyHint: '강남 전세 시장 브리핑',
  },
];

export function TodayPage() {
  const [todos, setTodos] = React.useState<TodoItem[]>(initialTodos);
  const [activeFilter, setActiveFilter] = React.useState<TodoFilter>('전체');
  const [selectedTodoId, setSelectedTodoId] = React.useState(initialTodos[0].id);
  const completedTodoCount = todos.filter((todo) => todo.done).length;
  const pendingTodos = todos.filter((todo) => !todo.done);
  const filteredTodos = todos.filter((todo) => activeFilter === '전체' || todo.tag === activeFilter);
  const filteredPendingTodos = filteredTodos.filter((todo) => !todo.done);
  const filteredCompletedTodos = filteredTodos.filter((todo) => todo.done);
  const progressPercent = Math.round((completedTodoCount / todos.length) * 100);
  const nextSchedule = realEstateMockData.schedules[0];
  const selectedTodo = todos.find((todo) => todo.id === selectedTodoId) ?? pendingTodos[0] ?? todos[0];
  const urgentTodoCount = pendingTodos.filter((todo) => todo.priority === 'high').length;
  const timeQueue = pendingTodos.slice(0, 4);

  const toggleTodo = (todoId: number) => {
    const targetTodo = todos.find((todo) => todo.id === todoId);
    setTodos((previousTodos) => previousTodos.map((todo) => (todo.id === todoId ? { ...todo, done: !todo.done } : todo)));
    if (targetTodo) {
      showToast(targetTodo.done ? '완료 상태를 해제했습니다.' : '업무를 완료 처리했습니다.', targetTodo.done ? 'info' : 'success');
    }
  };

  return (
    <div className="today-page">
      <PageHeader
        className="today-page-header"
        titleClassName="today-title"
        summaryClassName="today-summary"
        title="오늘 할 일"
        summary={<>{realEstateMockData.today} · {completedTodoCount}/{todos.length} 완료</>}
        actions={(
          <div className="today-header-actions">
            <Badge color="#EF4444" bg="#FEF2F2" dot>긴급 {urgentTodoCount}</Badge>
            <ActionButton variant="primary" size="md" style={{ minHeight: 40 }}>+ 업무 추가</ActionButton>
          </div>
        )}
      />

      <div className="today-command-bar">
        <div className="today-meter-card">
          <span>완료율</span>
          <strong>{progressPercent}%</strong>
          <div className="today-progress-track"><div style={{ width: `${progressPercent}%` }} /></div>
          <small>{completedTodoCount}/{todos.length} 완료 · 남은 업무 {pendingTodos.length}건</small>
        </div>
        <div className="today-next-card">
          <span>다음 일정</span>
          <strong>{nextSchedule.time}</strong>
          <small>{nextSchedule.customer} · {nextSchedule.title}</small>
        </div>
      </div>

      <div className="today-workspace">
        <aside className="today-time-rail" aria-label="시간별 할 일">
          <SectionHeader title="시간별 할 일" />
          <div className="today-time-list">
            {timeQueue.map((todo) => {
              const priorityConfig = priorityConfigMap[todo.priority];
              return (
                <button
                  key={todo.id}
                  type="button"
                  className={`today-time-item ${selectedTodo.id === todo.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedTodoId(todo.id)}
                >
                  <span>{todo.deadline}</span>
                  <strong>{todo.customer}</strong>
                  <Badge color={priorityConfig.color} bg={priorityConfig.bg} dot>{priorityConfig.label}</Badge>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="today-board-container" aria-label="처리 단계별 할 일">
          <div className="today-board-filter">
            <span className="today-board-filter-label">업무 유형</span>
            <div className="today-filter-tabs" aria-label="업무 필터">
              {filterOptions.map((filterOption) => {
                const count = filterOption === '전체' 
                  ? pendingTodos.length 
                  : pendingTodos.filter(t => t.tag === filterOption).length;
                return (
                  <button
                    key={filterOption}
                    type="button"
                    className={activeFilter === filterOption ? 'is-active' : ''}
                    onClick={() => setActiveFilter(filterOption)}
                  >
                    {filterOption} <span className="today-filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="today-board">
            {boardStages.map((stage) => {
              const stageTodos = filteredPendingTodos.filter((todo) => todo.stage === stage.id);
              return (
                <section key={stage.id} className="today-board-column">
                  <header className="today-board-column-header">
                    <div>
                      <strong>{stage.title}</strong>
                      <span>{stage.description}</span>
                    </div>
                    <em>{stageTodos.length}</em>
                  </header>
                  <div className="today-board-stack">
                    {stageTodos.map((todo) => {
                      const priorityConfig = priorityConfigMap[todo.priority];
                      return (
                        <article key={todo.id} className={`today-board-card ${selectedTodo.id === todo.id ? 'is-selected' : ''}`}>
                          <button type="button" className="today-card-main" onClick={() => setSelectedTodoId(todo.id)}>
                            <div className="today-card-topline">
                              <Badge color={priorityConfig.color} bg={priorityConfig.bg} dot>{priorityConfig.label}</Badge>
                              <span>{todo.tag}</span>
                            </div>
                            <strong>{todo.text}</strong>
                            <p>{todo.evidence[0]}</p>
                            <div className="today-card-property">{todo.propertyHint}</div>
                          </button>
                          <div className="today-card-actions">
                            <button type="button" onClick={() => toggleTodo(todo.id)}>완료</button>
                            <button type="button" onClick={() => showToast(`${todo.primaryAction} 작업을 시작합니다.`, 'success')}>{todo.primaryAction}</button>
                          </div>
                        </article>
                      );
                    })}
                    {stageTodos.length === 0 && <div className="today-empty-lane">해당 업무 없음</div>}
                  </div>
                </section>
              );
            })}
          </div>
        </main>

        <aside className="today-decision-panel" aria-label="선택한 업무 상세">
          <div className="today-decision-main-card">
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div className="today-decision-head">
              <Badge color="#2563EB" bg="#DBEAFE" dot>선택 업무</Badge>
              <h2>{selectedTodo.text}</h2>
              <span>{selectedTodo.customer} · {selectedTodo.deadline}</span>
            </div>
            <div className="today-decision-section">
              <strong>판단 근거</strong>
              <div className="today-ai-evidence-list">
                {selectedTodo.evidence.map((evidenceItem) => <span key={evidenceItem}>{evidenceItem}</span>)}
              </div>
            </div>
            <div className="today-decision-section">
              <strong>추천 실행</strong>
              <p>{selectedTodo.recommendation}</p>
              <div className="today-property-chip">{selectedTodo.propertyHint}</div>
            </div>
            <div className="today-decision-actions">
              <ActionButton variant="primary" size="md" onClick={() => showToast(`${selectedTodo.primaryAction} 작업을 시작합니다.`, 'success')}>{selectedTodo.primaryAction}</ActionButton>
              <ActionButton variant="outline" size="md" color="#2563EB" onClick={() => showToast(`${selectedTodo.customer} 고객 상세를 엽니다.`, 'info')}>고객 상세</ActionButton>
              <ActionButton variant="secondary" size="md" onClick={() => toggleTodo(selectedTodo.id)}>완료 처리</ActionButton>
            </div>
          </Card>
          </div>

          <Card style={{ padding: 16 }}>
            <SectionHeader title="완료된 업무" />
            <div className="today-completed-list">
              {filteredCompletedTodos.map((todo) => (
                <button key={todo.id} type="button" onClick={() => toggleTodo(todo.id)}>
                  <span>✓</span>
                  <strong>{todo.text}</strong>
                </button>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
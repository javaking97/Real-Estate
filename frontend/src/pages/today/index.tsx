import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ActionButton } from '@/components/ui/ActionButton';
import { showToast } from '@/components/ui/toast';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';

type TodoPriority = 'high' | 'mid' | 'low';

type TodoItem = {
  id: number;
  done: boolean;
  text: string;
  priority: TodoPriority;
  tag: string;
};

const priorityConfigMap: Record<TodoPriority, { label: string; color: string; bg: string }> = {
  high: { label: '긴급', color: '#EF4444', bg: '#FEF2F2' },
  mid: { label: '중요', color: '#F59E0B', bg: '#FFFBEB' },
  low: { label: '일반', color: '#10B981', bg: '#ECFDF5' },
};

const filterOptions = ['전체', '고객 응대', '일정', '매물', '마케팅'] as const;
type TodoFilter = (typeof filterOptions)[number];

const initialTodos: TodoItem[] = [
  { id: 1, done: false, text: '박OO 매물 3개 전송', priority: 'high', tag: '고객 응대' },
  { id: 2, done: false, text: '이OO 방문 일정 확정', priority: 'high', tag: '일정' },
  { id: 3, done: true, text: '역삼동 매물 사진 등록', priority: 'mid', tag: '매물' },
  { id: 4, done: false, text: '김OO 신규 매물 안내 문자 작성', priority: 'mid', tag: '고객 응대' },
  { id: 5, done: false, text: '전세 만기 고객 재계약 안내 전화', priority: 'high', tag: '고객 응대' },
  { id: 6, done: true, text: '블로그 게시글 업로드', priority: 'low', tag: '마케팅' },
];

export function TodayPage() {
  const [todos, setTodos] = React.useState<TodoItem[]>(initialTodos);
  const [activeFilter, setActiveFilter] = React.useState<TodoFilter>('전체');
  const completedTodoCount = todos.filter((todo) => todo.done).length;
  const pendingTodos = todos.filter((todo) => !todo.done);
  const filteredTodos = todos.filter((todo) => activeFilter === '전체' || todo.tag === activeFilter);
  const filteredPendingTodos = filteredTodos.filter((todo) => !todo.done);
  const filteredCompletedTodos = filteredTodos.filter((todo) => todo.done);
  const progressPercent = Math.round((completedTodoCount / todos.length) * 100);
  const nextSchedule = realEstateMockData.schedules[0];

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
            <Badge color="#EF4444" bg="#FEF2F2" dot>긴급 {pendingTodos.filter((todo) => todo.priority === 'high').length}</Badge>
            <ActionButton variant="primary" size="md" style={{ minHeight: 40 }}>+ 업무 추가</ActionButton>
          </div>
        )}
      />

      <KpiCardGrid
        className="today-kpi-grid"
        labelClassName="today-kpi-label"
        valueClassName="today-kpi-value"
        items={[
          {
            label: '완료율',
            children: <><div className="today-progress-row"><strong>{progressPercent}%</strong><span>{completedTodoCount}/{todos.length}</span></div><div className="today-progress-track"><div style={{ width: `${progressPercent}%` }} /></div></>,
          },
          { label: '남은 업무', value: pendingTodos.length, unit: '건' },
          {
            label: '다음 일정',
            children: <><div className="today-next-schedule">{nextSchedule.time}</div><span>{nextSchedule.customer} · {nextSchedule.title}</span></>,
          },
        ]}
      />

      <div className="today-layout">
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="today-task-header">
            <div>
              <SectionHeader title="우선 처리 업무" />
              <p>긴급도와 업무 유형을 함께 확인하고 바로 완료 처리하세요.</p>
            </div>
            <div className="today-filter-tabs" aria-label="업무 필터">
              {filterOptions.map((filterOption) => (
                <button
                  key={filterOption}
                  type="button"
                  className={activeFilter === filterOption ? 'is-active' : ''}
                  onClick={() => setActiveFilter(filterOption)}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          <div className="today-task-list">
            {filteredPendingTodos.map((todo) => {
              const priorityConfig = priorityConfigMap[todo.priority];

              return (
                <div key={todo.id} className="today-task-item">
                  <button type="button" className="today-task-check" onClick={() => toggleTodo(todo.id)} aria-label={`${todo.text} 완료 처리`} />
                  <button type="button" className="today-task-content today-task-open" onClick={() => showToast(`${todo.text} 상세를 확인합니다.`, 'info')}>
                    <strong>{todo.text}</strong>
                    <span>{todo.tag}</span>
                  </button>
                  <Badge color={priorityConfig.color} bg={priorityConfig.bg} dot>{priorityConfig.label}</Badge>
                </div>
              );
            })}

            {filteredCompletedTodos.length > 0 && (
              <div className="today-completed-section">
                <div className="today-completed-title">완료됨 {filteredCompletedTodos.length}</div>
                {filteredCompletedTodos.map((todo) => (
                  <div key={todo.id} className="today-task-item is-done">
                    <button type="button" className="today-task-check" onClick={() => toggleTodo(todo.id)} aria-label={`${todo.text} 완료 해제`}>✓</button>
                    <button type="button" className="today-task-content today-task-open" onClick={() => showToast(`${todo.text} 상세를 확인합니다.`, 'info')}>
                      <strong>{todo.text}</strong>
                      <span>{todo.tag}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="today-side-stack">
          <Card style={{ padding: 16 }}>
            <SectionHeader title="오늘 일정" />
            <div className="today-schedule-list">
              {realEstateMockData.schedules.map((schedule) => (
                <div key={schedule.id} className="today-schedule-item">
                  <span style={{ color: schedule.color }}>{schedule.time}</span>
                  <div>
                    <strong>{schedule.customer} {schedule.title}</strong>
                    <Badge color={schedule.color}>{schedule.type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card style={{ padding: 16, borderColor: '#BFDBFE', background: 'linear-gradient(180deg, #fff 0%, #EFF6FF 100%)' }}>
            <SectionHeader title="AI 추천 오늘 업무" />
            <div className="today-ai-card">
              <Badge color="#2563EB" bg="#DBEAFE" dot>우선순위 1</Badge>
              <p>박OO 고객 응대가 가장 시급합니다. 매물 전송 후 방문 일정까지 연결하면 계약 가능성이 높아집니다.</p>
              <ActionButton variant="outline" size="sm">문자 초안 만들기</ActionButton>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Avatar } from '@/components/ui/Avatar';
import { PageHeader } from '@/components/ui/PageHeader';

const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
const initialScheduleDate = new Date(2026, 3, 25);

const scheduleTypeColorMap: Record<string, string> = {
  방문: 'var(--color-brand)',
  계약: 'var(--color-domain-consultations)',
  연락: 'var(--color-warn)',
  만기: 'var(--color-danger)',
};

const weeklyScheduleItems = [
  { date: new Date(2026, 3, 25), title: '박OO 매물 브리핑', type: '방문', time: '10:30' },
  { date: new Date(2026, 3, 26), title: '이OO 아파트 방문', type: '방문', time: '13:00' },
  { date: new Date(2026, 3, 27), title: '윤OO 계약서 검토', type: '계약', time: '15:00' },
  { date: new Date(2026, 3, 28), title: '전세 만기 고객 연락', type: '연락', time: '17:30' },
];

const expiringCustomers = [
  { name: '정OO', date: '5월 10일', type: '전세 만기' },
  { name: '한OO', date: '5월 22일', type: '월세 만기' },
];

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const formatKoreanMonth = (date: Date) => `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
const formatKoreanSelectedDate = (date: Date) => `${date.getMonth() + 1}.${date.getDate()} ${dayLabels[date.getDay()]}`;

const moveMonth = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const getCalendarDays = (month: Date) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const calendarStart = new Date(firstDay);
  calendarStart.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
};

const isSameDate = (left: Date, right: Date) => formatDateKey(left) === formatDateKey(right);

export function SchedulePage() {
  const schedules = realEstateMockData.schedules;
  const [selectedDate, setSelectedDate] = useState(initialScheduleDate);
  const [calendarMonth, setCalendarMonth] = useState(initialScheduleDate);
  const [viewMode, setViewMode] = useState<'월' | '주' | '일'>('월');

  const selectedDateKey = formatDateKey(selectedDate);
  const calendarDays = useMemo(() => getCalendarDays(calendarMonth), [calendarMonth]);
  const schedulesByDate = useMemo(() => ({ [formatDateKey(initialScheduleDate)]: schedules }), [schedules]);
  const selectedSchedules = schedulesByDate[selectedDateKey] ?? [];

  return (
    <div className="schedule-page">
      <PageHeader
        className="schedule-page-header"
        titleClassName="schedule-title"
        summaryClassName="schedule-summary"
        title="일정관리"
        summary={<>오늘 {schedules.length}건 · 이번 주 12건 · 만기 임박 {expiringCustomers.length}명</>}
        actions={(
          <div className="schedule-header-actions">
            <div className="schedule-sync-badge">🔗 Google 캘린더 연동됨</div>
            <ActionButton variant="primary" size="md" style={{ minHeight: 40 }}>+ 일정 등록</ActionButton>
          </div>
        )}
      />

      <div className="schedule-toolbar">
        <div className="schedule-view-toggle" aria-label="일정 보기 방식">
          {(['월', '주', '일'] as const).map((viewOption) => (
            <button
              key={viewOption}
              type="button"
              className={viewMode === viewOption ? 'is-active' : ''}
              onClick={() => setViewMode(viewOption)}
            >
              {viewOption}
            </button>
          ))}
        </div>
        <div className="schedule-month-controls">
          <ActionButton variant="secondary" size="sm" onClick={() => setCalendarMonth((month) => moveMonth(month, -1))}>← 이전</ActionButton>
          <ActionButton variant="secondary" size="sm" onClick={() => {
            setSelectedDate(initialScheduleDate);
            setCalendarMonth(initialScheduleDate);
          }}>오늘</ActionButton>
          <ActionButton variant="secondary" size="sm" onClick={() => setCalendarMonth((month) => moveMonth(month, 1))}>다음 →</ActionButton>
        </div>
      </div>

      <div className="schedule-layout">
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div className="schedule-calendar-shell">
            <div className="schedule-calendar-main">
              <div className="schedule-calendar-heading">
                <div>
                  <span className="schedule-current-month">{formatKoreanMonth(calendarMonth)}</span>
                  <span className="schedule-current-view">{viewMode}간 보기</span>
                </div>
                <div className="schedule-legend">
                  {Object.entries(scheduleTypeColorMap).map(([type, color]) => (
                    <span key={type}><i style={{ background: color }} />{type}</span>
                  ))}
                </div>
              </div>

              <div className="schedule-calendar-grid">
                {dayLabels.map((dayLabel) => (
                  <div key={dayLabel} className="schedule-weekday">{dayLabel}</div>
                ))}
                {calendarDays.map((date) => {
                  const dateKey = formatDateKey(date);
                  const dailySchedules = schedulesByDate[dateKey] ?? [];
                  const outsideMonth = date.getMonth() !== calendarMonth.getMonth();
                  const selected = isSameDate(date, selectedDate);
                  const today = isSameDate(date, initialScheduleDate);
                  const visibleSchedules = dailySchedules.slice(0, 2);
                  const hiddenScheduleCount = dailySchedules.length - visibleSchedules.length;

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      className={`schedule-day-cell${outsideMonth ? ' is-outside' : ''}${selected ? ' is-selected' : ''}${today ? ' is-today' : ''}`}
                      onClick={() => {
                        setSelectedDate(date);
                        if (date.getMonth() !== calendarMonth.getMonth()) setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1));
                      }}
                    >
                      <span className="schedule-day-number">{date.getDate()}</span>
                      <span className="schedule-day-events">
                        {visibleSchedules.map((schedule) => (
                          <span key={schedule.id} className="schedule-event-chip" style={{ color: schedule.color, background: `color-mix(in oklch, ${schedule.color}, transparent 92%)` }}>
                            <i style={{ background: schedule.color }} />{schedule.time} {schedule.type}
                          </span>
                        ))}
                        {hiddenScheduleCount > 0 && <span className="schedule-event-more">+{hiddenScheduleCount}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <aside className="schedule-selected-panel">
              <div className="schedule-panel-header">
                <span>선택한 일정</span>
                <strong>{formatKoreanSelectedDate(selectedDate)}</strong>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDate.toDateString()}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="schedule-selected-list"
                >
                  {selectedSchedules.length > 0 ? selectedSchedules.map((schedule) => (
                    <div key={schedule.id} className="schedule-timeline-item" style={{ borderColor: schedule.color, background: `color-mix(in oklch, ${schedule.color}, transparent 96%)` }}>
                      <span className="schedule-time" style={{ color: schedule.color }}>{schedule.time}</span>
                      <div>
                        <div className="schedule-item-title">{schedule.customer} · {schedule.title}</div>
                        <Badge color={scheduleTypeColorMap[schedule.type] || 'var(--color-muted)'} dot>{schedule.type}</Badge>
                      </div>
                    </div>
                  )) : (
                    <div className="schedule-empty-state">
                      <strong>등록된 일정이 없습니다</strong>
                      <span>빈 날짜를 선택한 상태입니다.</span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </aside>
          </div>
        </Card>

        <div className="schedule-side-stack">
          <Card style={{ padding: 16 }}>
            <SectionHeader title="이번 주 중요 일정" />
            {weeklyScheduleItems.map((item, index) => (
              <div key={`${item.date.toISOString()}-${item.title}`} className="schedule-side-item" style={{ borderBottom: index < weeklyScheduleItems.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div className="schedule-date-badge">{formatKoreanSelectedDate(item.date)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="schedule-side-title">{item.title}</div>
                  <div className="schedule-side-meta">{item.time}</div>
                </div>
                <Badge color={scheduleTypeColorMap[item.type]}>{item.type}</Badge>
              </div>
            ))}
          </Card>
          <Card style={{ padding: 16, borderColor: 'var(--color-danger)', background: 'linear-gradient(180deg, var(--color-surface) 0%, color-mix(in oklch, var(--color-danger), transparent 96%) 100%)' }}>
            <SectionHeader title="만기 임박 고객" />
            {expiringCustomers.map((item, index) => (
              <div key={item.name} className="schedule-side-item" style={{ borderBottom: index < expiringCustomers.length - 1 ? '1px solid color-mix(in oklch, var(--color-danger), transparent 80%)' : 'none' }}>
                <Avatar initials={`${item.name[0]}○`} size={32} color="var(--color-danger)" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="schedule-side-title">{item.name}</div>
                  <div className="schedule-side-meta">{item.date} · {item.type}</div>
                </div>
                <ActionButton variant="outline" size="xs" color="var(--color-danger)" style={{ minHeight: 32 }}>연락하기</ActionButton>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

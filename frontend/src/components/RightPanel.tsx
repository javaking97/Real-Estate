import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { AppIcons } from '@/components/icons/AppIcons';
import { useUiStore } from '@/app/store/ui';

type PanelTab = 'chat' | 'quick';
type MessageRole = 'assistant' | 'user';
type ChatMessage = { role: MessageRole; content: string };
type QuickAction = { label: string; icon: React.ReactNode; color: string };

export const RightPanel = () => {
  const [tab, setTab] = React.useState<PanelTab>('chat');
  const rightPanelOpen = useUiStore(state => state.rightPanelOpen);
  const toggleRightPanel = useUiStore(state => state.toggleRightPanel);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { role: 'assistant', content: '안녕하세요! 샘플부동산 비서입니다.\n무엇을 도와드릴까요?' },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [memos, setMemos] = React.useState<string[]>(realEstateMockData.quickMemos);
  const [newMemo, setNewMemo] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (rightPanelOpen && messagesEndRef.current?.parentElement) {
      messagesEndRef.current.parentElement.scrollTop = messagesEndRef.current.offsetTop;
    }
  }, [messages, rightPanelOpen]);

  const quickReplies = [
    '박OO 고객에게 보낼 매물 안내 문자 작성해줘',
    '강남구 전세 8억 이하 매물 3개 추천해줘',
    '어제 상담한 고객 내용 요약해줘',
    '이번 주 방문 일정 정리해줘',
  ];

  const quickActions: QuickAction[] = [
    { label: '상담 요약하기', icon: AppIcons.fileText, color: '#2563EB' },
    { label: '고객 문자 작성', icon: AppIcons.sms, color: '#10B981' },
    { label: '매물 소개글 만들기', icon: AppIcons.building, color: '#F59E0B' },
    { label: '일정 등록하기', icon: AppIcons.calendar, color: '#8B5CF6' },
    { label: '블로그 초안 작성', icon: AppIcons.penLine, color: '#0EA5E9' },
  ];

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: msg }];
    setMessages(newMsgs);
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const responseText = "AI 답변을 준비 중입니다.";
      setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '죄송합니다. 잠시 후 다시 시도해주세요.' }]);
    }
    setLoading(false);
  };

  const addMemo = () => {
    if (!newMemo.trim()) return;
    setMemos(prev => [newMemo.trim(), ...prev]);
    setNewMemo('');
  };

  const deleteMemo = (index: number) => setMemos(prev => prev.filter((_, memoIndex) => memoIndex !== index));

  return (
    <>
      <div className="right-panel-backdrop" data-open={rightPanelOpen} onClick={toggleRightPanel} />
      <div className="right-panel-slot" data-open={rightPanelOpen}>
        <aside data-right-panel="true" data-open={rightPanelOpen} className="right-panel-aside">
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Panel header */}
          <div style={{ padding: '14px 16px 0', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#2563EB', background: '#EFF6FF', padding: '4px 6px', borderRadius: 6, lineHeight: 1 }}>AI</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>샘플부동산 비서</span>
              </div>
              <button 
                onClick={toggleRightPanel}
                className="right-panel-close-btn"
                style={{ 
                  background: 'none', border: 'none', padding: 4, cursor: 'pointer', 
                  color: '#9CA3AF'
                }}
              >
                {AppIcons.x}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 0, background: '#F3F4F6', borderRadius: 8, padding: 3 }}>
              {(['chat', 'quick'] as PanelTab[]).map((t) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '6px 0', borderRadius: 6, border: 'none',
                  background: tab === t ? '#fff' : 'transparent',
                  color: tab === t ? '#111827' : '#6B7280',
                  fontSize: 13, fontWeight: tab === t ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
                }}>
                  {t === 'chat' ? '대화하기' : '빠른 실행'}
                </button>
              ))}
            </div>
          </div>

      {tab === 'chat' ? (
        <>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Bot avatar on first message */}
            {messages[0]?.role === 'assistant' && messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0 10px' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #EFF6FF, #E0E7FF)',
                  border: '2px solid #BFDBFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: '#2563EB',
                }}>{AppIcons.bot}</div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '85%', padding: '9px 12px', borderRadius: m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: m.role === 'user' ? '#2563EB' : '#F3F4F6',
                  color: m.role === 'user' ? '#fff' : '#111827',
                  fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                }}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#9CA3AF',
                      animation: 'bounce 1.2s infinite',
                      animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick reply chips */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => sendMessage(qr)} style={{
                  background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8,
                  padding: '7px 10px', fontSize: 12, color: '#374151', cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s, border-color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#EFF6FF'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}>
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="메시지를 입력하세요..."
                rows={2}
                style={{
                  flex: 1, border: '1px solid #E5E7EB', borderRadius: 9, padding: '8px 10px',
                  fontFamily: 'inherit', fontSize: 13, outline: 'none', resize: 'none',
                  background: '#F9FAFB', color: '#374151', lineHeight: 1.5,
                }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: 'none',
                  background: input.trim() ? '#2563EB' : '#E5E7EB',
                  color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'background 0.15s',
                }}
              >
                {AppIcons.send}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 10 }}>자주 쓰는 기능</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {quickActions.map((quickAction) => (
              <button key={quickAction.label} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 9,
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                transition: 'background 0.15s, border-color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#BFDBFE'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                onClick={() => { setTab('chat'); void sendMessage(`${quickAction.label} 도와줘`); }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${quickAction.color}15`, color: quickAction.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{quickAction.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>{quickAction.label}</span>
                <span style={{ marginLeft: 'auto', color: '#9CA3AF' }}>{AppIcons.chevronRight}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Memo */}
      <div style={{ borderTop: '1px solid #F3F4F6', padding: '12px 14px', maxHeight: 200, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ color: '#F59E0B' }}>{AppIcons.pin}</span>빠른 메모</span>
          <span style={{ fontSize: 12, color: '#9CA3AF' }}>+ 새 메모</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <input
            value={newMemo}
            onChange={e => setNewMemo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addMemo()}
            placeholder="메모 입력..."
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '5px 8px', fontFamily: 'inherit', fontSize: 12, outline: 'none' }}
          />
          <button onClick={addMemo} style={{ background: '#2563EB', border: 'none', borderRadius: 6, width: 26, height: 26, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {AppIcons.plus}
          </button>
        </div>
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {memos.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 5, background: '#FFFBEB' }}>
              <span style={{ fontSize: 11, color: '#92400E', flex: 1, lineHeight: 1.4 }}>{m}</span>
              <button onClick={() => deleteMemo(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 1, flexShrink: 0 }}>{AppIcons.x}</button>
            </div>
          ))}
        </div>
          </div>
        </div>
        </aside>
      </div>
    </>
  );
};

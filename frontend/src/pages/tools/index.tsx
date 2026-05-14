import React from 'react';
import { FloatingFocusManager, FloatingOverlay, useFloating } from '@floating-ui/react';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { AppIcons } from '@/components/icons/AppIcons';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchToolbar } from '@/components/ui/SearchToolbar';
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence';

type ToolCategory = '전체' | '국가 신고' | '실거래/시세' | '등기/대장' | '세무/계산' | '내 사이트';
type ToolScope = '공용' | '개인';

type WorkToolBookmark = {
  id: string;
  title: string;
  url: string;
  category: Exclude<ToolCategory, '전체'>;
  scope: ToolScope;
  description: string;
  required?: boolean;
  favorite: boolean;
  lastAccessed?: string;
};

const storageKey = 'real-estate-work-tools-v1';
const categories: ToolCategory[] = ['전체', '국가 신고', '실거래/시세', '등기/대장', '세무/계산', '내 사이트'];

const categoryColorMap: Record<Exclude<ToolCategory, '전체'>, string> = {
  '국가 신고': '#2563EB',
  '실거래/시세': '#10B981',
  '등기/대장': '#8B5CF6',
  '세무/계산': '#F59E0B',
  '내 사이트': '#64748B',
};

const defaultBookmarks: WorkToolBookmark[] = [
  { id: 'rtms-report', title: '부동산거래관리시스템', url: 'https://rtms.molit.go.kr', category: '국가 신고', scope: '공용', description: '부동산 거래 신고 및 신고내역 확인', required: true, favorite: true },
  { id: 'molit-price', title: '국토교통부 실거래가 공개', url: 'https://rt.molit.go.kr', category: '실거래/시세', scope: '공용', description: '아파트·연립·단독 실거래가 조회', required: true, favorite: true },
  { id: 'rental-home', title: '렌트홈', url: 'https://www.renthome.go.kr', category: '국가 신고', scope: '공용', description: '임대사업자 등록 및 임대차 관련 신고', required: true, favorite: false },
  { id: 'housing-lease', title: '주택임대차 신고', url: 'https://rtms.molit.go.kr', category: '국가 신고', scope: '공용', description: '주택 임대차 계약 신고 업무', required: true, favorite: false },
  { id: 'kb-land', title: 'KB부동산', url: 'https://kbland.kr', category: '실거래/시세', scope: '공용', description: 'KB 시세·매물·지역 동향 확인', favorite: true },
  { id: 'reb', title: '한국부동산원', url: 'https://www.reb.or.kr', category: '실거래/시세', scope: '공용', description: '부동산 통계·가격동향·공시자료 확인', favorite: false },
  { id: 'naver-land', title: '네이버 부동산', url: 'https://land.naver.com', category: '실거래/시세', scope: '공용', description: '매물 현황과 주변 시세 빠른 확인', favorite: false },
  { id: 'iros', title: '인터넷등기소', url: 'https://www.iros.go.kr', category: '등기/대장', scope: '공용', description: '등기부등본 열람 및 발급', required: true, favorite: true },
  { id: 'gov-building', title: '정부24 건축물대장', url: 'https://www.gov.kr', category: '등기/대장', scope: '공용', description: '건축물대장 열람·발급', required: true, favorite: false },
  { id: 'eum', title: '토지이음', url: 'https://www.eum.go.kr', category: '등기/대장', scope: '공용', description: '토지이용계획·규제 정보 확인', favorite: false },
  { id: 'juso', title: '도로명주소', url: 'https://www.juso.go.kr', category: '등기/대장', scope: '공용', description: '도로명주소 및 영문주소 검색', favorite: false },
  { id: 'hometax', title: '홈택스', url: 'https://www.hometax.go.kr', category: '세무/계산', scope: '공용', description: '세금 신고·증명·계산 업무', required: true, favorite: false },
  { id: 'broker-fee', title: '중개보수 계산기', url: 'https://www.reb.or.kr', category: '세무/계산', scope: '공용', description: '거래금액별 중개보수 확인', favorite: false },
  { id: 'acquisition-tax', title: '취득세 계산기', url: 'https://www.wetax.go.kr', category: '세무/계산', scope: '공용', description: '취득세 예상액 확인', favorite: false },
];

const createBookmarkId = () => `custom-${Date.now()}`;
const normalizeUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`);

const loadBookmarks = () => {
  try {
    const savedBookmarks = localStorage.getItem(storageKey);
    return savedBookmarks ? JSON.parse(savedBookmarks) as WorkToolBookmark[] : defaultBookmarks;
  } catch {
    return defaultBookmarks;
  }
};

export function ToolsPage() {
  const [bookmarks, setBookmarks] = React.useState<WorkToolBookmark[]>(loadBookmarks);
  const [selectedCategory, setSelectedCategory] = React.useState<ToolCategory>('전체');
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [selectedBookmark, setSelectedBookmark] = React.useState<WorkToolBookmark | null>(null);
  const [detailEditMode, setDetailEditMode] = React.useState(false);
  const [newBookmark, setNewBookmark] = React.useState({ title: '', url: '', category: '내 사이트' as Exclude<ToolCategory, '전체'>, scope: '개인' as ToolScope, description: '' });
  const [editingBookmark, setEditingBookmark] = React.useState({ title: '', url: '', category: '내 사이트' as Exclude<ToolCategory, '전체'>, scope: '개인' as ToolScope, description: '' });

  const addModalPresence = useAnimatedPresence(addModalOpen, 160);
  const detailModalPresence = useAnimatedPresence(Boolean(selectedBookmark), 160);
  const addModalFloating = useFloating({
    open: addModalOpen,
    onOpenChange: setAddModalOpen,
  });
  const detailModalFloating = useFloating({
    open: Boolean(selectedBookmark),
    onOpenChange: (open) => {
      if (!open) {
        setSelectedBookmark(null);
        setDetailEditMode(false);
      }
    },
  });
  const [activeBookmark, setActiveBookmark] = React.useState<WorkToolBookmark | null>(null);

  React.useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const filteredBookmarks = bookmarks
    .filter((bookmark) => selectedCategory === '전체' || bookmark.category === selectedCategory)
    .filter((bookmark) => {
      const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
      return !normalizedSearchKeyword || `${bookmark.title} ${bookmark.description} ${bookmark.category}`.toLowerCase().includes(normalizedSearchKeyword);
    })
    .sort((leftBookmark, rightBookmark) => Number(rightBookmark.favorite) - Number(leftBookmark.favorite));

  const requiredBookmarkCount = bookmarks.filter((bookmark) => bookmark.required).length;
  const customBookmarkCount = bookmarks.filter((bookmark) => bookmark.scope === '개인' || bookmark.category === '내 사이트').length;
  const favoriteBookmarkCount = bookmarks.filter((bookmark) => bookmark.favorite).length;

  const openBookmark = (bookmark: WorkToolBookmark) => {
    setBookmarks((currentBookmarks) => currentBookmarks.map((currentBookmark) => (
      currentBookmark.id === bookmark.id ? { ...currentBookmark, lastAccessed: new Date().toISOString() } : currentBookmark
    )));
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  const toggleFavorite = (bookmarkId: string) => {
    setBookmarks((currentBookmarks) => currentBookmarks.map((bookmark) => (
      bookmark.id === bookmarkId ? { ...bookmark, favorite: !bookmark.favorite } : bookmark
    )));
  };

  const deleteBookmark = (bookmarkId: string) => {
    setBookmarks((currentBookmarks) => currentBookmarks.filter((bookmark) => bookmark.id !== bookmarkId));
    setSelectedBookmark((currentBookmark) => currentBookmark?.id === bookmarkId ? null : currentBookmark);
  };

  const openDetailModal = (bookmark: WorkToolBookmark) => {
    setActiveBookmark(bookmark);
    setSelectedBookmark(bookmark);
    setDetailEditMode(false);
    setEditingBookmark({ title: bookmark.title, url: bookmark.url, category: bookmark.category, scope: bookmark.scope, description: bookmark.description });
  };

  const closeDetailModal = () => {
    setSelectedBookmark(null);
    setDetailEditMode(false);
  };

  const addBookmark = () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) return;

    setBookmarks((currentBookmarks) => [
      ...currentBookmarks,
      {
        id: createBookmarkId(),
        title: newBookmark.title.trim(),
        url: normalizeUrl(newBookmark.url.trim()),
        category: newBookmark.category,
        scope: newBookmark.scope,
        description: newBookmark.description.trim() || '직접 추가한 업무 사이트',
        favorite: false,
      },
    ]);
    setNewBookmark({ title: '', url: '', category: '내 사이트', scope: '개인', description: '' });
    setAddModalOpen(false);
  };

  const updateBookmark = () => {
    if (!selectedBookmark || !editingBookmark.title.trim() || !editingBookmark.url.trim()) return;

    const updatedBookmark: WorkToolBookmark = {
      ...selectedBookmark,
      title: editingBookmark.title.trim(),
      url: normalizeUrl(editingBookmark.url.trim()),
      category: editingBookmark.category,
      scope: editingBookmark.scope,
      description: editingBookmark.description.trim() || '직접 추가한 업무 사이트',
    };

    setBookmarks((currentBookmarks) => currentBookmarks.map((bookmark) => bookmark.id === selectedBookmark.id ? updatedBookmark : bookmark));
    setActiveBookmark(updatedBookmark);
    setSelectedBookmark(updatedBookmark);
    setDetailEditMode(false);
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (addModalOpen) setAddModalOpen(false);
        else if (selectedBookmark) closeDetailModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addModalOpen, selectedBookmark]);

  return (
    <div className="tools-page">
      <PageHeader
        className="tools-page-header"
        titleClassName="tools-title"
        summaryClassName="tools-summary"
        title="업무 도구"
        summary="부동산 신고·조회·확인 업무에 필요한 외부 사이트를 한곳에서 관리하세요."
        actions={<ActionButton variant="primary" size="md" onClick={() => setAddModalOpen(true)} style={{ minHeight: 40 }}>+ 사이트 추가</ActionButton>}
      />

      <KpiCardGrid
        className="tools-kpi-grid"
        labelClassName="tools-kpi-label"
        valueClassName="tools-kpi-value"
        items={[
          {
            label: '전체 사이트',
            value: bookmarks.length,
            unit: '개',
            delta: { trend: 'flat', label: `직접 등록 ${customBookmarkCount}` },
          },
          {
            label: '필수 사이트',
            value: requiredBookmarkCount,
            unit: '개',
            valueClassName: 'accent-blue',
            delta: { trend: 'up', label: '업무 필수' },
          },
          {
            label: '즐겨찾기',
            value: favoriteBookmarkCount,
            unit: '개',
            valueClassName: 'accent-orange',
            delta: { trend: 'up', label: `+${customBookmarkCount} 직접 등록` },
          },
        ]}
      />

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <SearchToolbar
          className="tools-toolbar"
          searchBoxClassName="tools-search-box"
          filterTabsClassName="tools-filter-tabs"
          searchValue={searchKeyword}
          searchPlaceholder="사이트명, 설명, 카테고리 검색"
          onSearchChange={setSearchKeyword}
          onSearchClear={() => setSearchKeyword('')}
          filterOptions={categories}
          activeFilter={selectedCategory}
          onFilterChange={setSelectedCategory}
          filterAriaLabel="업무 도구 카테고리"
        />
      </Card>

      <div className="tools-grid">
        {filteredBookmarks.map((bookmark) => {
          const categoryColor = categoryColorMap[bookmark.category];

          return (
            <Card key={bookmark.id} hover style={{ overflow: 'hidden' }}>
              <div className="tools-card" role="button" tabIndex={0} onClick={() => openDetailModal(bookmark)} onKeyDown={(event) => { if (event.key === 'Enter') openDetailModal(bookmark); }}>
                <div className="tools-card-icon" style={{ color: categoryColor, background: `${categoryColor}12` }}>{AppIcons.link}</div>
                <div className="tools-card-content">
                  <div className="tools-card-title-row">
                    <strong>{bookmark.title}</strong>
                    <button type="button" onClick={(event) => { event.stopPropagation(); toggleFavorite(bookmark.id); }} aria-label="즐겨찾기 토글">{bookmark.favorite ? '★' : '☆'}</button>
                  </div>
                  <p>{bookmark.description}</p>
                  <div className="tools-card-meta">
                    <Badge color={categoryColor} bg={`${categoryColor}14`}>{bookmark.category}</Badge>
                    <Badge color={bookmark.scope === '공용' ? '#2563EB' : '#64748B'}>{bookmark.scope}</Badge>
                    {bookmark.required && <Badge color="#EF4444" bg="#FEF2F2" dot>필수</Badge>}
                    {bookmark.lastAccessed && <span>{new Date(bookmark.lastAccessed).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })} 접속</span>}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {addModalPresence.present && (
        <FloatingOverlay lockScroll className="modal-backdrop tools-modal-backdrop" data-transition-status={addModalPresence.transitionStatus} onMouseDown={() => setAddModalOpen(false)}>
          <FloatingFocusManager context={addModalFloating.context}>
            <div ref={addModalFloating.refs.setFloating} className="r-modal tools-add-modal" data-transition-status={addModalPresence.transitionStatus} role="dialog" aria-modal="true" aria-labelledby="tools-add-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="tools-add-modal-header">
              <div>
                <strong id="tools-add-modal-title">사이트 추가</strong>
                <span>개인 또는 공용 업무 사이트를 직접 등록합니다.</span>
              </div>
              <button type="button" onClick={() => setAddModalOpen(false)} aria-label="닫기">{AppIcons.x}</button>
            </div>
            <div className="tools-add-modal-body">
              <label>
                <span>사이트명</span>
                <input value={newBookmark.title} onChange={(event) => setNewBookmark((bookmark) => ({ ...bookmark, title: event.target.value }))} placeholder="예: 관할 구청 부동산 민원" />
              </label>
              <label>
                <span>URL</span>
                <input value={newBookmark.url} onChange={(event) => setNewBookmark((bookmark) => ({ ...bookmark, url: event.target.value }))} placeholder="https://example.com" />
              </label>
              <label>
                <span>설명</span>
                <input value={newBookmark.description} onChange={(event) => setNewBookmark((bookmark) => ({ ...bookmark, description: event.target.value }))} placeholder="업무에서 사용하는 목적을 입력하세요" />
              </label>
              <div className="tools-add-modal-row">
                <label>
                  <span>카테고리</span>
                  <select value={newBookmark.category} onChange={(event) => setNewBookmark((bookmark) => ({ ...bookmark, category: event.target.value as Exclude<ToolCategory, '전체'> }))}>
                    {categories.filter((category) => category !== '전체').map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label>
                  <span>범위</span>
                  <select value={newBookmark.scope} onChange={(event) => setNewBookmark((bookmark) => ({ ...bookmark, scope: event.target.value as ToolScope }))}>
                    <option value="개인">개인</option>
                    <option value="공용">공용</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="tools-add-modal-footer">
              <ActionButton variant="secondary" size="sm" onClick={() => setAddModalOpen(false)}>취소</ActionButton>
              <ActionButton variant="primary" size="sm" onClick={addBookmark}>등록</ActionButton>
            </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}

      {detailModalPresence.present && activeBookmark && (
        <FloatingOverlay lockScroll className="modal-backdrop tools-modal-backdrop" data-transition-status={detailModalPresence.transitionStatus} onMouseDown={closeDetailModal}>
          <FloatingFocusManager context={detailModalFloating.context}>
            <div ref={detailModalFloating.refs.setFloating} className="r-modal tools-add-modal tools-detail-modal" data-transition-status={detailModalPresence.transitionStatus} role="dialog" aria-modal="true" aria-labelledby="tools-detail-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="tools-add-modal-header">
              <div className="tools-detail-title-block">
                <span className="tools-detail-icon" style={{ color: categoryColorMap[activeBookmark.category], background: `${categoryColorMap[activeBookmark.category]}12` }}>{AppIcons.link}</span>
                <div>
                  <strong id="tools-detail-modal-title">{detailEditMode ? '사이트 수정' : activeBookmark.title}</strong>
                  <span>{detailEditMode ? '등록된 업무 사이트 정보를 수정합니다.' : '업무 사이트 상세 정보와 링크를 확인합니다.'}</span>
                </div>
              </div>
              <button type="button" onClick={closeDetailModal} aria-label="닫기">{AppIcons.x}</button>
            </div>

            {detailEditMode ? (
              <div className="tools-add-modal-body">
                <label>
                  <span>사이트명</span>
                  <input value={editingBookmark.title} onChange={(event) => setEditingBookmark((bookmark) => ({ ...bookmark, title: event.target.value }))} />
                </label>
                <label>
                  <span>URL</span>
                  <input value={editingBookmark.url} onChange={(event) => setEditingBookmark((bookmark) => ({ ...bookmark, url: event.target.value }))} />
                </label>
                <label>
                  <span>설명</span>
                  <input value={editingBookmark.description} onChange={(event) => setEditingBookmark((bookmark) => ({ ...bookmark, description: event.target.value }))} />
                </label>
                <div className="tools-add-modal-row">
                  <label>
                    <span>카테고리</span>
                    <select value={editingBookmark.category} onChange={(event) => setEditingBookmark((bookmark) => ({ ...bookmark, category: event.target.value as Exclude<ToolCategory, '전체'> }))}>
                      {categories.filter((category) => category !== '전체').map((category) => <option key={category} value={category}>{category}</option>)}
                    </select>
                  </label>
                  <label>
                    <span>범위</span>
                    <select value={editingBookmark.scope} onChange={(event) => setEditingBookmark((bookmark) => ({ ...bookmark, scope: event.target.value as ToolScope }))}>
                      <option value="개인">개인</option>
                      <option value="공용">공용</option>
                    </select>
                  </label>
                </div>
              </div>
            ) : (
              <div className="tools-detail-modal-body">
                <div className="tools-detail-badge-row">
                  <Badge color={categoryColorMap[activeBookmark.category]} bg={`${categoryColorMap[activeBookmark.category]}14`}>{activeBookmark.category}</Badge>
                  <Badge color={activeBookmark.scope === '공용' ? '#2563EB' : '#64748B'}>{activeBookmark.scope}</Badge>
                  {activeBookmark.required && <Badge color="#EF4444" bg="#FEF2F2" dot>필수</Badge>}
                  {activeBookmark.favorite && <Badge color="#F59E0B" bg="#FFFBEB" dot>즐겨찾기</Badge>}
                </div>
                <div className="tools-detail-info-card">
                  <span>설명</span>
                  <p>{activeBookmark.description}</p>
                </div>
                <div className="tools-detail-info-card">
                  <span>외부 링크</span>
                  <p>{activeBookmark.url}</p>
                </div>
                <div className="tools-detail-meta-row">
                  <span>{activeBookmark.lastAccessed ? `${new Date(activeBookmark.lastAccessed).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })} 접속` : '아직 접속 기록 없음'}</span>
                </div>
              </div>
            )}

            <div className="tools-add-modal-footer tools-detail-modal-footer">
              {!activeBookmark.required && <ActionButton variant="ghost" size="sm" color="#EF4444" onClick={() => deleteBookmark(activeBookmark.id)}>삭제</ActionButton>}
              <div>
                {detailEditMode ? (
                  <>
                    <ActionButton variant="secondary" size="sm" onClick={() => setDetailEditMode(false)}>취소</ActionButton>
                    <ActionButton variant="primary" size="sm" onClick={updateBookmark}>변경사항 저장</ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton variant="secondary" size="sm" onClick={() => setDetailEditMode(true)}>수정</ActionButton>
                    <ActionButton variant="primary" size="sm" onClick={() => openBookmark(activeBookmark)}>사이트 열기 ↗</ActionButton>
                  </>
                )}
              </div>
            </div>
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </div>
  );
}

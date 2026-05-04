import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { DetailModal, type DetailModalPayload } from '@/components/modals/DetailModal';
import { EmptyResult } from '@/components/ui/EmptyResult';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchToolbar } from '@/components/ui/SearchToolbar';

const propertyStatusColorMap: Record<string, string> = {
  '추천 중': '#10B981',
  '진행 중': '#2563EB',
  신규: '#F59E0B',
};

const templateStatusColorMap: Record<string, string> = {
  '작성 완료': '#10B981',
  '작성 대기': '#F59E0B',
  미작성: '#EF4444',
};

const propertyTypeColorMap: Record<string, string> = {
  전세: '#2563EB',
  매매: '#10B981',
  월세: '#F59E0B',
};

const propertyFilterOptions = ['전체', '전세', '매매', '월세'] as const;
type PropertyFilter = (typeof propertyFilterOptions)[number];

export function PropertiesPage() {
  const [modal, setModal] = React.useState<DetailModalPayload | null>(null);
  const [activeFilter, setActiveFilter] = React.useState<PropertyFilter>('전체');
  const [searchText, setSearchText] = React.useState('');
  const properties = realEstateMockData.properties;
  const filteredProperties = properties.filter((property) => {
    const matchesType = activeFilter === '전체' || property.type === activeFilter;
    const normalizedSearchText = searchText.trim().toLowerCase();
    const matchesSearch = !normalizedSearchText || `${property.name} ${property.region}`.toLowerCase().includes(normalizedSearchText);

    return matchesType && matchesSearch;
  });
  const recommendedPropertyCount = properties.filter((property) => property.status === '추천 중').length;
  const unmatchedTemplateCount = properties.filter((property) => property.template !== '작성 완료').length;
  const totalMatchCount = properties.reduce((matchCountSum, property) => matchCountSum + property.matchCount, 0);

  return (
    <div className="properties-page">
      <PageHeader
        className="properties-page-header"
        titleClassName="properties-title"
        summaryClassName="properties-summary"
        title="매물관리"
        summary={<>등록 매물 {properties.length}건 · 오늘 신규 2건 · 매칭 고객 {totalMatchCount}명</>}
        actions={<ActionButton variant="primary" size="md" style={{ minHeight: 40 }}>+ 매물 등록</ActionButton>}
      />

      <KpiCardGrid
        className="properties-kpi-grid"
        labelClassName="properties-kpi-label"
        valueClassName="properties-kpi-value"
        items={[
          { label: '전체 매물', value: properties.length, unit: '건' },
          { label: '추천 중', value: recommendedPropertyCount, unit: '건', valueClassName: 'accent-green' },
          { label: '템플릿 필요', value: unmatchedTemplateCount, unit: '건', valueClassName: 'accent-red' },
        ]}
      />

      <Card style={{ overflow: 'hidden' }}>
        <SearchToolbar
          className="properties-toolbar"
          searchBoxClassName="properties-search-box"
          filterTabsClassName="properties-filter-tabs"
          searchValue={searchText}
          searchPlaceholder="매물명, 지역 검색"
          onSearchChange={setSearchText}
          onSearchClear={() => setSearchText('')}
          filterOptions={propertyFilterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          filterAriaLabel="거래유형 필터"
        />

        <div className="properties-table-wrap">
          <table className="properties-table">
            <thead>
              <tr>
                {['매물', '거래/가격', '상태', '매칭', '템플릿', '수정일'].map((headerLabel) => (
                  <th key={headerLabel}>{headerLabel}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} onClick={() => setModal({ type: 'property', data: property })}>
                  <td>
                    <div className="properties-name-cell">
                      <strong>{property.name}</strong>
                      <span>{property.region} · {property.area} / {property.floor}</span>
                    </div>
                  </td>
                  <td>
                    <div className="properties-price-cell">
                      <Badge color={propertyTypeColorMap[property.type] || '#6B7280'}>{property.type}</Badge>
                      <strong>{property.price}</strong>
                    </div>
                  </td>
                  <td><Badge color={propertyStatusColorMap[property.status] || '#9CA3AF'} dot>{property.status}</Badge></td>
                  <td><span className={property.matchCount > 0 ? 'properties-match-count is-active' : 'properties-match-count'}>{property.matchCount}명</span></td>
                  <td><Badge color={templateStatusColorMap[property.template] || '#9CA3AF'}>{property.template}</Badge></td>
                  <td><span className="properties-updated">{property.updated}</span></td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <EmptyResult title="조건에 맞는 매물이 없습니다" description="검색어나 거래 유형 필터를 초기화해 다시 확인하세요." onReset={() => { setSearchText(''); setActiveFilter('전체'); }} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="properties-card-list">
          {filteredProperties.map((property) => (
            <button key={property.id} type="button" className="properties-mobile-card" onClick={() => setModal({ type: 'property', data: property })}>
              <div className="properties-card-main">
                <div>
                  <strong>{property.name}</strong>
                  <span>{property.region}</span>
                </div>
                <strong className="properties-card-price">{property.price}</strong>
              </div>
              <div className="properties-card-meta">
                <span>{property.type}</span>
                <span>{property.area} / {property.floor}</span>
                <span>{property.matchCount}명 매칭</span>
              </div>
              <div className="properties-card-badges">
                <Badge color={propertyStatusColorMap[property.status] || '#9CA3AF'} dot>{property.status}</Badge>
                <Badge color={templateStatusColorMap[property.template] || '#9CA3AF'}>{property.template}</Badge>
                <span>{property.updated}</span>
              </div>
            </button>
          ))}
          {filteredProperties.length === 0 && <EmptyResult title="조건에 맞는 매물이 없습니다" description="검색어나 거래 유형 필터를 초기화해 다시 확인하세요." onReset={() => { setSearchText(''); setActiveFilter('전체'); }} />}
        </div>
      </Card>
      <DetailModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

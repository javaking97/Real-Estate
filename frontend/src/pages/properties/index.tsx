import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { DataTable, type DataColumn } from '@/components/ui/DataTable';
import { EmptyResult } from '@/components/ui/EmptyResult';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchToolbar } from '@/components/ui/SearchToolbar';

type Property = (typeof realEstateMockData.properties)[number];

const propertyStatusToken: Record<string, string> = {
  '추천 중': 'var(--color-success)',
  '진행 중': 'var(--color-brand)',
  신규: 'var(--color-warn)',
};

const templateStatusToken: Record<string, string> = {
  '작성 완료': 'var(--color-success)',
  '작성 대기': 'var(--color-warn)',
  미작성: 'var(--color-danger)',
};

const propertyTypeToken: Record<string, string> = {
  전세: 'var(--color-brand)',
  매매: 'var(--color-success)',
  월세: 'var(--color-warn)',
};

const propertyFilterOptions = ['전체', '전세', '매매', '월세'] as const;
type PropertyFilter = (typeof propertyFilterOptions)[number];

const PROPERTY_COMPACT_TEMPLATE = `
  "name price"
  "status template"
  "match updated"
`;

export function PropertiesPage() {
  const navigate = useNavigate();
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

  const resetFilters = () => {
    setSearchText('');
    setActiveFilter('전체');
  };

  const columns: DataColumn<Property>[] = [
    {
      key: 'name',
      header: '매물',
      width: 'minmax(190px, 2fr)',
      area: 'name',
      render: (property) => (
        <div className="dt-stack">
          <strong>{property.name}</strong>
          <span>{property.region} · {property.area} / {property.floor}</span>
        </div>
      ),
    },
    {
      key: 'price',
      header: '거래/가격',
      width: 'minmax(160px, 1.2fr)',
      area: 'price',
      align: 'right',
      render: (property) => (
        <div className="dt-inline">
          <Badge color={propertyTypeToken[property.type] ?? 'var(--color-muted)'}>{property.type}</Badge>
          <strong>{property.price}</strong>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      width: 'minmax(100px, auto)',
      area: 'status',
      render: (property) => (
        <Badge color={propertyStatusToken[property.status] ?? 'var(--color-muted)'} dot>{property.status}</Badge>
      ),
    },
    {
      key: 'match',
      header: '매칭',
      width: 'minmax(70px, auto)',
      area: 'match',
      render: (property) => (
        <span className={property.matchCount > 0 ? 'dt-match is-active' : 'dt-match'}>{property.matchCount}명</span>
      ),
    },
    {
      key: 'template',
      header: '템플릿',
      width: 'minmax(110px, auto)',
      area: 'template',
      align: 'right',
      render: (property) => (
        <Badge color={templateStatusToken[property.template] ?? 'var(--color-muted)'}>{property.template}</Badge>
      ),
    },
    {
      key: 'updated',
      header: '수정일',
      width: 'minmax(70px, auto)',
      area: 'updated',
      align: 'right',
      render: (property) => <span className="dt-meta">{property.updated}</span>,
    },
  ];

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
          {
            label: '전체 매물',
            value: properties.length,
            unit: '건',
            delta: { trend: 'up', label: '+2 신규' },
            sparkline: { data: [12, 13, 13, 15, 16, 18, 18], color: 'var(--color-brand)' },
          },
          {
            label: '추천 중',
            value: recommendedPropertyCount,
            unit: '건',
            valueClassName: 'accent-green',
            delta: { trend: 'up', label: `매칭 ${totalMatchCount}명` },
            sparkline: { data: [3, 4, 5, 4, 6, 7, 7], color: 'var(--color-success)' },
          },
          {
            label: '템플릿 필요',
            value: unmatchedTemplateCount,
            unit: '건',
            valueClassName: 'accent-red',
            delta: { trend: 'down', label: '-1 전일' },
            sparkline: { data: [5, 6, 5, 4, 4, 3, 3], color: 'var(--color-danger)' },
          },
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

        <DataTable
          columns={columns}
          rows={filteredProperties}
          rowKey={(property) => property.id}
          onRowClick={(property) => navigate(property.id.toString())}
          compactTemplate={PROPERTY_COMPACT_TEMPLATE}
          compactColumns="1fr auto"
          minDesktopWidth={760}
          emptyState={
            <EmptyResult
              title="조건에 맞는 매물이 없습니다"
              description="검색어나 거래 유형 필터를 초기화해 다시 확인하세요."
              onReset={resetFilters}
            />
          }
        />
      </Card>
      <Outlet />
    </div>
  );
}

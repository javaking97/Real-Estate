import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { DataTable, type DataColumn } from '@/components/ui/DataTable';
import { EmptyResult } from '@/components/ui/EmptyResult';
import { showToast } from '@/components/ui/toast';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchToolbar } from '@/components/ui/SearchToolbar';

type Customer = (typeof realEstateMockData.customers)[number];

const customerTypes = ['전체', '전세', '매매', '월세'] as const;
type CustomerFilter = (typeof customerTypes)[number];

const customerStatusToken: Record<string, string> = {
  진행중: 'var(--color-success)',
  신상담: 'var(--color-warn)',
  '만기 임박': 'var(--color-danger)',
  대기: 'var(--color-muted)',
  '계약 임박': 'var(--color-domain-customers)',
};

const customerTypeToken: Record<string, string> = {
  전세: 'var(--color-brand)',
  매매: 'var(--color-success)',
  월세: 'var(--color-warn)',
};

const CUSTOMER_COMPACT_TEMPLATE = `
  "name status"
  "condition condition"
  "next next"
  "actions actions"
`;

const readSavedFilter = (): CustomerFilter => {
  try {
    const savedFilter = sessionStorage.getItem('cust_filter');
    if (savedFilter && customerTypes.includes(savedFilter as CustomerFilter)) {
      return savedFilter as CustomerFilter;
    }
    return '전체';
  } catch {
    return '전체';
  }
};

export function CustomersPage() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<CustomerFilter>(readSavedFilter);

  const customers = realEstateMockData.customers;
  const responseNeededCount = customers.filter((customer) =>
    customer.status === '진행중' || customer.status === '만기 임박' || customer.status === '계약 임박'
  ).length;
  const expiringCustomerCount = customers.filter((customer) => customer.status === '만기 임박').length;
  const newConsultationCount = customers.filter((customer) => customer.status === '신상담').length;

  const setFilterAndSave = (filterType: CustomerFilter) => {
    try {
      sessionStorage.setItem('cust_filter', filterType);
    } catch {
      // sessionStorage가 차단된 환경에서도 필터 동작은 유지한다.
    }
    setSelectedType(filterType);
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesType = selectedType === '전체' || customer.type === selectedType;
    const normalizedSearchKeyword = searchKeyword.trim().toLowerCase();
    const matchesSearch = !normalizedSearchKeyword || `${customer.name} ${customer.region} ${customer.interest}`.toLowerCase().includes(normalizedSearchKeyword);
    return matchesType && matchesSearch;
  });

  const resetFilters = () => {
    setSearchKeyword('');
    setFilterAndSave('전체');
  };

  const columns: DataColumn<Customer>[] = [
    {
      key: 'name',
      header: '고객',
      width: 'minmax(180px, 1.6fr)',
      area: 'name',
      render: (customer) => (
        <div className="dt-name-row">
          <Avatar
            initials={`${customer.name[0]}○`}
            size={34}
            color={customerStatusToken[customer.status] ?? 'var(--color-muted)'}
          />
          <div className="dt-stack">
            <strong>{customer.name}</strong>
            <span>{customer.region}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'condition',
      header: '조건',
      width: 'minmax(180px, 1.4fr)',
      area: 'condition',
      render: (customer) => (
        <div className="dt-stack">
          <div className="dt-inline">
            <Badge color={customerTypeToken[customer.type] ?? 'var(--color-muted)'}>{customer.type}</Badge>
            <strong>{customer.budget}</strong>
          </div>
          <span>{customer.interest}</span>
        </div>
      ),
    },
    {
      key: 'next',
      header: '최근/다음 액션',
      width: 'minmax(160px, 1.2fr)',
      area: 'next',
      render: (customer) => (
        <div className="dt-next">
          <span>{customer.lastContact}</span>
          <strong>{customer.nextAction}</strong>
        </div>
      ),
    },
    {
      key: 'status',
      header: '상태',
      width: 'minmax(100px, auto)',
      area: 'status',
      align: 'right',
      render: (customer) => (
        <Badge color={customerStatusToken[customer.status] ?? 'var(--color-muted)'} dot>{customer.status}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '빠른 실행',
      width: 'minmax(160px, auto)',
      area: 'actions',
      align: 'right',
      render: (customer) => (
        <div className="dt-row-actions" onClick={(event) => event.stopPropagation()}>
          <button title="전화" onClick={() => showToast(`${customer.name}에게 전화를 연결합니다.`, 'info')}>전화</button>
          <button title="문자" onClick={() => showToast(`${customer.name} 문자 초안을 작성합니다.`, 'success')}>문자</button>
          <button title="일정" onClick={() => showToast(`${customer.name} 일정을 등록합니다.`, 'info')}>일정</button>
        </div>
      ),
    },
  ];

  return (
    <div className="customers-page">
      <PageHeader
        className="customers-page-header"
        titleClassName="customers-title"
        summaryClassName="customers-summary"
        title="고객관리"
        summary={<>등록 고객 {customers.length}명 · 오늘 응답 필요 {responseNeededCount}명</>}
        actions={
          <ActionButton variant="primary" size="md" onClick={() => showToast('고객 등록 폼이 열립니다.', 'info')} style={{ minHeight: 40 }}>
            + 고객 등록
          </ActionButton>
        }
      />

      <KpiCardGrid
        className="customers-kpi-grid"
        labelClassName="customers-kpi-label"
        valueClassName="customers-kpi-value"
        items={[
          {
            label: '전체 고객',
            value: customers.length,
            unit: '명',
            delta: { trend: 'up', label: `+${newConsultationCount} 신규` },
            sparkline: { data: [42, 43, 43, 44, 45, 46, 46], color: 'var(--color-domain-customers)' },
          },
          {
            label: '응답 필요',
            value: responseNeededCount,
            unit: '명',
            valueClassName: 'accent-blue',
            delta: { trend: 'flat', label: '오늘 마감' },
            sparkline: { data: [4, 5, 6, 5, 7, 6, 6], color: 'var(--color-brand)' },
          },
          {
            label: '만기 임박',
            value: expiringCustomerCount,
            unit: '명',
            valueClassName: 'accent-red',
            delta: { trend: 'up', label: `재계약 후보 ${newConsultationCount}` },
            sparkline: { data: [2, 2, 3, 3, 4, 4, 5], color: 'var(--color-danger)' },
          },
        ]}
      />

      <Card style={{ overflow: 'hidden' }}>
        <SearchToolbar
          className="customers-toolbar"
          searchBoxClassName="customers-search-box"
          filterTabsClassName="customers-filter-tabs"
          searchValue={searchKeyword}
          searchPlaceholder="고객명, 지역, 선호조건 검색"
          onSearchChange={setSearchKeyword}
          onSearchClear={() => setSearchKeyword('')}
          filterOptions={customerTypes}
          activeFilter={selectedType}
          onFilterChange={setFilterAndSave}
          filterAriaLabel="거래유형 필터"
        />

        <DataTable
          columns={columns}
          rows={filteredCustomers}
          rowKey={(customer) => customer.id}
          onRowClick={(customer) => navigate(customer.id.toString())}
          compactTemplate={CUSTOMER_COMPACT_TEMPLATE}
          compactColumns="1fr auto"
          minDesktopWidth={820}
          emptyState={
            <EmptyResult
              title="조건에 맞는 고객이 없습니다"
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

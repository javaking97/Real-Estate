import React from 'react';
import { realEstateMockData } from '@/lib/mock-data';
import { Badge } from '@/components/ui/Badge';
import { ActionButton } from '@/components/ui/ActionButton';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { DetailModal, type DetailModalPayload } from '@/components/modals/DetailModal';
import { showToast } from '@/components/ui/toast';
import { KpiCardGrid } from '@/components/ui/KpiCardGrid';
import { PageHeader } from '@/components/ui/PageHeader';
import { SearchToolbar } from '@/components/ui/SearchToolbar';

const customerTypes = ['전체', '전세', '매매', '월세'] as const;

const statusColorMap: Record<string, string> = {
  진행중: '#10B981',
  신상담: '#F59E0B',
  '만기 임박': '#EF4444',
  대기: '#9CA3AF',
  '계약 임박': '#8B5CF6',
};

const customerTypeColorMap: Record<string, string> = {
  전세: '#2563EB',
  매매: '#10B981',
  월세: '#F59E0B',
};

export function CustomersPage() {
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<(typeof customerTypes)[number]>(() => {
    try {
      const savedFilter = sessionStorage.getItem('cust_filter');
      if (savedFilter && customerTypes.includes(savedFilter as (typeof customerTypes)[number])) {
        return savedFilter as (typeof customerTypes)[number];
      }
      return '전체';
    } catch {
      return '전체';
    }
  });
  const [modal, setModal] = React.useState<DetailModalPayload | null>(null);
  const customers = realEstateMockData.customers;
  const responseNeededCount = customers.filter((customer) => customer.status === '진행중' || customer.status === '만기 임박' || customer.status === '계약 임박').length;
  const expiringCustomerCount = customers.filter((customer) => customer.status === '만기 임박').length;
  const newConsultationCount = customers.filter((customer) => customer.status === '신상담').length;

  const setFilterAndSave = (filterType: (typeof customerTypes)[number]) => {
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

  const openCustomerModal = (customer: (typeof customers)[number]) => setModal({ type: 'customer', data: customer });

  return (
    <div className="customers-page">
      <PageHeader
        className="customers-page-header"
        titleClassName="customers-title"
        summaryClassName="customers-summary"
        title="고객관리"
        summary={<>등록 고객 {customers.length}명 · 오늘 응답 필요 {responseNeededCount}명</>}
        actions={<ActionButton variant="primary" size="md" onClick={() => showToast('고객 등록 폼이 열립니다.', 'info')} style={{ minHeight: 40 }}>+ 고객 등록</ActionButton>}
      />

      <KpiCardGrid
        className="customers-kpi-grid"
        labelClassName="customers-kpi-label"
        valueClassName="customers-kpi-value"
        items={[
          { label: '전체 고객', value: customers.length, unit: '명' },
          { label: '응답 필요', value: responseNeededCount, unit: '명', valueClassName: 'accent-blue' },
          {
            label: '만기 임박 / 신상담',
            children: <div className="customers-kpi-value accent-red">{expiringCustomerCount}<span>명</span><em>{newConsultationCount}명 신규</em></div>,
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

        <div className="customers-table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                {['고객', '조건', '최근/다음 액션', '상태', '빠른 실행'].map((headerLabel) => (
                  <th key={headerLabel}>{headerLabel}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} onClick={() => openCustomerModal(customer)}>
                  <td>
                    <div className="customers-name-cell">
                      <Avatar initials={`${customer.name[0]}○`} size={34} color={statusColorMap[customer.status] || '#6B7280'} />
                      <div>
                        <strong>{customer.name}</strong>
                        <span>{customer.region}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="customers-condition-cell">
                      <div><Badge color={customerTypeColorMap[customer.type] || '#6B7280'}>{customer.type}</Badge><strong>{customer.budget}</strong></div>
                      <span>{customer.interest}</span>
                    </div>
                  </td>
                  <td>
                    <div className="customers-action-cell">
                      <span>{customer.lastContact}</span>
                      <strong>{customer.nextAction}</strong>
                    </div>
                  </td>
                  <td><Badge color={statusColorMap[customer.status] || '#6B7280'} dot>{customer.status}</Badge></td>
                  <td>
                    <div className="customers-row-actions" onClick={(event) => event.stopPropagation()}>
                      <button title="전화" onClick={() => showToast(`${customer.name}에게 전화를 연결합니다.`, 'info')}>전화</button>
                      <button title="문자" onClick={() => showToast(`${customer.name} 문자 초안을 작성합니다.`, 'success')}>문자</button>
                      <button title="일정" onClick={() => showToast(`${customer.name} 일정을 등록합니다.`, 'info')}>일정</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr><td colSpan={5} className="customers-empty-cell">검색 결과가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="customers-card-list">
          {filteredCustomers.map((customer) => (
            <button key={customer.id} type="button" className="customers-mobile-card" onClick={() => openCustomerModal(customer)}>
              <div className="customers-card-header">
                <div className="customers-name-cell">
                  <Avatar initials={`${customer.name[0]}○`} size={34} color={statusColorMap[customer.status] || '#6B7280'} />
                  <div>
                    <strong>{customer.name}</strong>
                    <span>{customer.region}</span>
                  </div>
                </div>
                <Badge color={statusColorMap[customer.status] || '#6B7280'} dot>{customer.status}</Badge>
              </div>
              <div className="customers-card-condition">
                <span>{customer.type}</span>
                <strong>{customer.budget}</strong>
                <span>{customer.interest}</span>
              </div>
              <div className="customers-card-next">
                <span>{customer.lastContact}</span>
                <strong>{customer.nextAction}</strong>
              </div>
              <div className="customers-card-actions" onClick={(event) => event.stopPropagation()}>
                <button onClick={() => showToast(`${customer.name}에게 전화를 연결합니다.`, 'info')}>전화</button>
                <button onClick={() => showToast(`${customer.name} 문자 초안을 작성합니다.`, 'success')}>문자</button>
                <button onClick={() => showToast(`${customer.name} 일정을 등록합니다.`, 'info')}>일정</button>
              </div>
            </button>
          ))}
        </div>
      </Card>
      <DetailModal modal={modal} onClose={() => setModal(null)} />
    </div>
  );
}

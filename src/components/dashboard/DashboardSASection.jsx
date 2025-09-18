import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PieChartCard from "../charts/PieChartCard";
import SAMetricTableCard from "../tables/SAMetricTableCard";
import { dashboardService } from "../../services/dashboard.service";

export default function DashboardSASection() {
  const SECTION_GAP = 16;
  const currentMonth = new Date().getMonth() + 1; // 1-12

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const generateAvailableMonths = () => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months.slice(0, currentMonth).map((month, index) => ({
      label: month,
      value: index + 1,
    }));
  };

  const availableMonths = generateAvailableMonths();

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  // Fetch SA metrics
  const { data: saMetricsData } = useQuery({
    queryKey: ['sa-metrics', selectedMonth],
    queryFn: () => dashboardService.getServiceAdvisorMetrics({ month: selectedMonth }),
  });

  // Transformations
  const transformSAForPie = (apiData) => {
    const list = apiData?.data || [];
    if (!Array.isArray(list) || list.length === 0) return [];

    // Sort by total desc and take top 5
    const top = [...list]
      .map((item) => ({
        serviceAdvisor: item.serviceAdvisor || item.name || '-',
        total: parseInt(item.total ?? item.value ?? 0),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return top.map((item, index) => ({
      id: item.serviceAdvisor,
      name: item.serviceAdvisor.length > 12 ? item.serviceAdvisor.slice(0,12) + '...' : item.serviceAdvisor,
      label: item.serviceAdvisor,
      value: item.total,
      // Use a color scheme similar to Top 5 Sales
      color: `hsl(${200 + index * 40}, 70%, 50%)`,
    }));
  };

  const transformSAForTable = (apiData) => {
    const list = apiData?.data || [];
    if (!Array.isArray(list) || list.length === 0) return [];
    return list
      .map((item, index) => ({
        no: index + 1,
        namaSA: item.serviceAdvisor || item.name || '-',
        jumlah: parseInt(item.total ?? item.value ?? 0),
      }));
  };

  const totalSA = (saMetricsData?.data || []).reduce((sum, item) => sum + parseInt(item.total ?? 0), 0);

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      <div style={{ display: 'flex', gap: SECTION_GAP, height: 340 }}>
        {/* Left: Pie Chart */}
        <div style={{ width: 400, flexShrink: 0 }}>
          <PieChartCard
            title="Top 5 SA"
            data={transformSAForPie(saMetricsData)}
            total={totalSA}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            centerLabel="Total"
          />
        </div>

        {/* Right: Table */}
        <div style={{ flex: '1 1 0%' }}>
          <SAMetricTableCard
            title="Tabel Metrik SA"
            data={transformSAForTable(saMetricsData)}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>
    </section>
  );
}

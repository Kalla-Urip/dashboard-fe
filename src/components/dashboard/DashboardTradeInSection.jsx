import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PieChartCard from "../charts/PieChartCard";
import TradeInLevelTableCard from "../tables/TradeInLevelTableCard";
import { dashboardService } from "../../services/dashboard.service";

export default function DashboardTradeInSection() {
  const SECTION_GAP = 16;
  const currentMonth = new Date().getMonth() + 1; // Current month (1-12)
  
  // State for selected month (default to current month)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Generate available months from January to current month
  const generateAvailableMonths = () => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months.slice(0, currentMonth).map((month, index) => ({
      label: month,
      value: index + 1
    }));
  };

  const availableMonths = generateAvailableMonths();

  // Handler for month selection change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  // Fetch Trust Data by Status (for pie chart)
  const { data: trustDataByStatus } = useQuery({
    queryKey: ['trust-data-by-status', selectedMonth],
    queryFn: () => dashboardService.getTrustDataByStatus({ month: selectedMonth }),
  });

  // Fetch Trust Name Data by Status (for table)
  const { data: trustNameDataByStatus } = useQuery({
    queryKey: ['trust-name-data-by-status', selectedMonth],
    queryFn: () => dashboardService.getTrustNameDataByStatus({ month: selectedMonth }),
  });

  // Transform Trust Data by Status for pie chart
  const transformTrustDataByStatus = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      return []; // Return empty array for no data case
    }
    
    const statusColors = {
      'Deal': '#00CA52',
      'Taksasi': '#02BFD8', 
      'Medium': '#8B5CF6',
      'Tidak Deal': '#FF6C64'
    };
    
    return apiData.data.map((item) => ({
      id: item.status,
      name: item.status,
      label: item.status,
      value: parseInt(item.total),
      color: statusColors[item.status] || '#DFE3E8'
    }));
  };

  // Transform Trust Name Data by Status for table
  const transformTrustNameDataByStatus = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      return []; // Return empty array for no data case
    }
    
    return apiData.data
      .filter(item => item.sales !== 'trust') // Remove header row
      .map((item, index) => ({
        no: index + 1,
        namaTrust: item.sales && item.sales.length > 10 ? item.sales.substring(0, 10) + '...' : item.sales || '',
        deal: item.deal || 0,
        taksasi: item.taksasi || 0,
        medium: item.medium || 0,
        tidakDeal: item.tidak_deal || 0
      }));
  };

  // Calculate total from API data - no fallback to dummy
  const totalTradeInMetrics = trustDataByStatus?.data?.reduce((sum, item) => sum + parseInt(item.total), 0) || 0;

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        gap: SECTION_GAP, 
        height: 340 // Fixed height sama seperti DashboardAnalyticsSection
      }}>
        {/* Left Card - Trade In Metrics Pie Chart */}
        <div style={{ width: 400, flexShrink: 0 }}> {/* Fixed width same as revenue card above */}
          <PieChartCard 
            title="Metrik Trade In"
            data={transformTrustDataByStatus(trustDataByStatus)}
            total={totalTradeInMetrics}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            centerLabel="Total"
          />
        </div>
        
        {/* Right Card - Trade In Level Table */}
        <div style={{ flex: '1 1 0%' }}> {/* Takes remaining space */}
          <TradeInLevelTableCard 
            title="Level Trade In By UA"
            data={transformTrustNameDataByStatus(trustNameDataByStatus)}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>
    </section>
  );
}

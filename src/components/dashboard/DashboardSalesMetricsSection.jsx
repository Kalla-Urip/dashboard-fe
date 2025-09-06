import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PieChartCard from "../charts/PieChartCard";
import SalesLevelTableCard from "../tables/SalesLevelTableCard";
import { dashboardService } from "../../services/dashboard.service";

export default function DashboardSalesMetricsSection() {
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

  // Fetch Sales Data by Status (for pie chart)
  const { data: salesDataByStatus } = useQuery({
    queryKey: ['sales-data-by-status', selectedMonth],
    queryFn: () => dashboardService.getSalesDataByStatus({ month: selectedMonth }),
  });

  // Fetch Sales Name Data by Status (for table)
  const { data: salesNameDataByStatus } = useQuery({
    queryKey: ['sales-name-data-by-status', selectedMonth],
    queryFn: () => dashboardService.getSalesNameDataByStatus({ month: selectedMonth }),
  });

  // Transform Sales Data by Status for pie chart
  const transformSalesDataByStatus = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      return []; // Return empty array for no data case
    }
    
    const statusColors = {
      'Deal': '#00CA52',
      'Hot': '#02BFD8', 
      'Medium': '#8B5CF6',
      'Low': '#FBB040',
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

  // Transform Sales Name Data by Status for table
  const transformSalesNameDataByStatus = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      return []; // Return empty array for no data case
    }
    
    return apiData.data
      .filter(item => item.sales !== 'sales') // Remove header row
      .map((item, index) => ({
        no: index + 1,
        namaSales: item.sales.length > 10 ? item.sales.substring(0, 10) + '...' : item.sales,
        deal: item.deal || 0,
        hot: item.hot || 0,
        medium: item.medium || 0,
        low: 0, // API doesn't have 'low', using 0
        tidakDeal: item.tidak_deal || 0
      }));
  };

  // Calculate total from API data - no fallback to dummy
  const totalSalesMetrics = salesDataByStatus?.data?.reduce((sum, item) => sum + parseInt(item.total), 0) || 0;

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        gap: SECTION_GAP, 
        height: 340 // Fixed height sama seperti DashboardAnalyticsSection
      }}>
        {/* Left Card - Sales Level Table */}
        <div style={{ flex: '1 1 0%' }}> {/* Takes remaining space */}
          <SalesLevelTableCard 
            title="Level Penjualan By Sales"
            data={transformSalesNameDataByStatus(salesNameDataByStatus)}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
        
        {/* Right Card - Sales Metrics Pie Chart */}
        <div style={{ width: 400, flexShrink: 0 }}> {/* Fixed width same as revenue card above */}
          <PieChartCard 
            title="Metrik Penjualan"
            data={transformSalesDataByStatus(salesDataByStatus)}
            total={totalSalesMetrics}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            centerLabel="Total"
          />
        </div>
      </div>
    </section>
  );
}

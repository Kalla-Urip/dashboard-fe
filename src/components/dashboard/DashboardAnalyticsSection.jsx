import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PieChartCard from "../charts/PieChartCard";
import RevenueTableCard from "../tables/RevenueTableCard";
import { dashboardService } from "../../services/dashboard.service";

export default function DashboardAnalyticsSection() {
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

  // Fetch Top 5 Sales
  const { data: top5SalesData } = useQuery({
    queryKey: ['top-5-sales', selectedMonth],
    queryFn: () => dashboardService.getTop5Sales({ month: selectedMonth }),
  });

  // Fetch Top 5 Model
  const { data: top5ModelData } = useQuery({
    queryKey: ['top-5-model', selectedMonth],
    queryFn: () => dashboardService.getTop5Model({ month: selectedMonth }),
  });

  // Fetch Top Revenue by Sales
  const { data: topRevenueData } = useQuery({
    queryKey: ['top-revenue-by-sales', selectedMonth],
    queryFn: () => dashboardService.getTopRevenueBySales({ month: selectedMonth }),
  });

  // Transform API data to match component expectations
  const transformTop5Sales = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      // Return empty array for no data case
      return [];
    }
    
    const transformed = apiData.data.map((item, index) => ({
      id: item.name,
      name: item.name.length > 10 ? item.name.substring(0, 10) + '...' : item.name, // Limit to 10 chars
      label: item.name,
      value: item.totalSales,
      color: `hsl(${200 + index * 40}, 70%, 50%)`
    }));
    
    return transformed;
  };

  const transformTop5Model = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      // Return empty array for no data case
      return [];
    }
    
    const transformed = apiData.data.map((item, index) => ({
      id: item.model,
      name: item.model.length > 10 ? item.model.substring(0, 10) + '...' : item.model, // Limit to 10 chars
      label: item.model,
      value: item.totalSales,
      color: `hsl(${150 + index * 40}, 70%, 50%)`
    }));
    
    return transformed;
  };

  const transformRevenueBySales = (apiData) => {
    if (!apiData?.data || apiData.data.length === 0) {
      // Return empty array for no data case
      return [];
    }
    
    return apiData.data.map((item, index) => ({
      no: index + 1,
      name: item.name.length > 10 ? item.name.substring(0, 15) + '...' : item.name, // Limit to 10 chars
      revenue: item.revenue
    }));
  };

  // Calculate totals - only from API data, no fallback to dummy
  const totalSalesCount = top5SalesData?.data?.reduce((sum, item) => sum + item.totalSales, 0) || 0;
  const totalModelCount = top5ModelData?.data?.reduce((sum, item) => sum + item.totalSales, 0) || 0;

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        gap: SECTION_GAP, 
        height: 340 
      }}>
        {/* Top 5 Model - Pie Chart */}
        <div style={{ flex: 1 }}>
          <PieChartCard 
            title="Top 5 Model"
            data={transformTop5Model(top5ModelData)}
            total={totalModelCount}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            centerLabel="Total"
          />
        </div>
        
        {/* Top 5 Sales - Pie Chart */}
        <div style={{ flex: 1 }}>
          <PieChartCard 
            title="Top 5 Sales"
            data={transformTop5Sales(top5SalesData)}
            total={totalSalesCount}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            centerLabel="Total"
          />
        </div>
        
        {/* Revenue By Sales - Table */}
        <div style={{ flex: 1 }}>
          <RevenueTableCard 
            title="Revenue By Sales"
            data={transformRevenueBySales(topRevenueData)}
            availableOptions={availableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>
    </section>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import StatisticsGrid from "./StatisticsGrid";
import RevenueChart from "../charts/RevenueChart";

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

export default function DashboardOverviewSection({ data }) {
  const ROW_HEIGHT = 320;
  const SECTION_GAP = 16;

  const [selectedMonth] = useState(currentMonth);
  const [selectedYear] = useState(currentYear);

  // API call untuk statistic card
  const { data: statisticData } = useQuery({
    queryKey: ['statisticCard', selectedYear, selectedMonth],
    queryFn: () => dashboardService.getStatisticCard({ year: selectedYear, month: selectedMonth }),
    select: ({ data }) => data
  });

  // API call untuk monthly sales per year
  const { data: monthlySalesData } = useQuery({
    queryKey: ['monthlySalesPerYear', selectedYear],
    queryFn: () => dashboardService.getMonthlySalesPerYear({ year: selectedYear }),
    select: ({ data }) => data
  });

  // Transform data untuk StatisticsGrid
  const transformedStatisticData = statisticData ? {
    totalRevenue: statisticData.totalRevenue,
    revenueThisMonth: statisticData.totalRevenueCurrentMonth,
    revenueLastMonth: statisticData.totalRevenuePrevMonth,
    totalSales: statisticData.totalSales,
    totalTrust: statisticData.totalTrust
  } : data;

  // Transform data untuk RevenueChart
  const transformedChartData = monthlySalesData?.result ? 
    monthlySalesData.result.map(item => ({
      month: item.formattedMonth.substring(0, 3).toUpperCase(),
      value: item.totalSales
    })) : data?.revenueByMonth || [];

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        gap: SECTION_GAP, 
        height: ROW_HEIGHT 
      }}>
        {/* Statistics Grid - 35% width */}
        <StatisticsGrid data={transformedStatisticData} />
        
        {/* Revenue Chart - remaining width */}
        <RevenueChart 
          data={transformedChartData} 
          availableYears={data?.availableYears || [currentYear]} 
        />
      </div>
    </section>
  );
}

import StatisticsGrid from "./StatisticsGrid";
import RevenueChart from "../charts/RevenueChart";

export default function DashboardOverviewSection({ data }) {
  const ROW_HEIGHT = 320;
  const SECTION_GAP = 16;

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      <div style={{ 
        display: 'flex', 
        gap: SECTION_GAP, 
        height: ROW_HEIGHT 
      }}>
        {/* Statistics Grid - 35% width */}
        <StatisticsGrid data={data} />
        
        {/* Revenue Chart - remaining width */}
        <RevenueChart 
          data={data.revenueByMonth} 
          availableYears={data.availableYears} 
        />
      </div>
    </section>
  );
}

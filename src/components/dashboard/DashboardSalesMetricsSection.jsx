import PieChartCard from "../charts/PieChartCard";
import SalesLevelTableCard from "../tables/SalesLevelTableCard";

export default function DashboardSalesMetricsSection({ data }) {
  const SECTION_GAP = 16;

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
            data={data.salesLevelData}
            availableOptions={data.availableMonths}
          />
        </div>
        
        {/* Right Card - Sales Metrics Pie Chart */}
        <div style={{ width: 400, flexShrink: 0 }}> {/* Fixed width same as revenue card above */}
          <PieChartCard 
            title="Metrik Penjualan"
            data={data.salesMetrics}
            total={data.totalSalesMetrics}
            availableOptions={data.availableMonths}
            centerLabel="Total"
          />
        </div>
      </div>
    </section>
  );
}

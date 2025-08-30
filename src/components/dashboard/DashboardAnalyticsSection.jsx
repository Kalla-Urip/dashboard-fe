import PieChartCard from "../charts/PieChartCard";
import RevenueTableCard from "../tables/RevenueTableCard";

export default function DashboardAnalyticsSection({ data }) {
  const SECTION_GAP = 16;

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
            data={data.top5Model}
            total={data.totalModel}
            availableOptions={data.availableMonths}
            centerLabel="Total"
          />
        </div>
        
        {/* Top 5 Sales - Pie Chart */}
        <div style={{ flex: 1 }}>
          <PieChartCard 
            title="Top 5 Sales"
            data={data.top5Sales}
            total={data.totalSalesCount}
            availableOptions={data.availableMonths}
            centerLabel="Total"
          />
        </div>
        
        {/* Revenue By Sales - Table */}
        <div style={{ flex: 1 }}>
          <RevenueTableCard 
            title="Revenue By Sales"
            data={data.revenueBySales}
            availableOptions={data.availableMonths}
          />
        </div>
      </div>
    </section>
  );
}

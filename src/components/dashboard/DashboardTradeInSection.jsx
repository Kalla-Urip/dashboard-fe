import PieChartCard from "../charts/PieChartCard";
import TradeInLevelTableCard from "../tables/TradeInLevelTableCard";

export default function DashboardTradeInSection({ data }) {
  const SECTION_GAP = 16;

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
            data={data.tradeInMetrics}
            total={data.totalTradeInMetrics}
            availableOptions={data.availableMonths}
            centerLabel="Total"
          />
        </div>
        
        {/* Right Card - Trade In Level Table */}
        <div style={{ flex: '1 1 0%' }}> {/* Takes remaining space */}
          <TradeInLevelTableCard 
            title="Level Trade In By UA"
            data={data.tradeInLevelData}
            availableOptions={data.availableMonths}
          />
        </div>
      </div>
    </section>
  );
}

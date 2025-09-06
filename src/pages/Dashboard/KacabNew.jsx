import DashboardOverviewSection from "../../components/dashboard/DashboardOverviewSection";
import DashboardAnalyticsSection from "../../components/dashboard/DashboardAnalyticsSection";
import DashboardSalesMetricsSection from "../../components/dashboard/DashboardSalesMetricsSection";
import DashboardTradeInSection from "../../components/dashboard/DashboardTradeInSection";
import WorkshopMetricsSection from "../../components/dashboard/WorkshopMetricsSection";
import { dashboardDummyData } from "../../data/DashboardDummyData";

export default function KacabNewUI() {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <DashboardOverviewSection />
      <DashboardAnalyticsSection />
      <DashboardSalesMetricsSection data={dashboardDummyData} />
      <DashboardTradeInSection data={dashboardDummyData} />
      <WorkshopMetricsSection />
    </div>
  );
}

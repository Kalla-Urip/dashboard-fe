import DashboardOverviewSection from "../../components/dashboard/DashboardOverviewSection";
import DashboardAnalyticsSection from "../../components/dashboard/DashboardAnalyticsSection";
import { dashboardDummyData } from "../../data/DashboardDummyData";

export default function KacabNewUI() {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <DashboardOverviewSection data={dashboardDummyData} />
      <DashboardAnalyticsSection data={dashboardDummyData} />
    </div>
  );
}

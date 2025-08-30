import DashboardOverviewSection from "../../components/dashboard/DashboardOverviewSection";
import { dashboardDummyData } from "../../data/DashboardDummyData";

export default function KacabNewUI() {
  return (
    <div style={{ width: '100%', margin: 0, padding: 0 }}>
      <DashboardOverviewSection data={dashboardDummyData} />
    </div>
  );
}

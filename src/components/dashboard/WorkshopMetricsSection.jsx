import { Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";

const cardRadius = 6;

export default function WorkshopMetricsSection() {
  const { data: todayData } = useQuery({
    queryKey: ['todayData'],
    queryFn: () => dashboardService.getTodaySummary(),
    select: ({ data }) => data
  });

  const metrics = [
    { title: "Total Service", value: todayData?.totalService },
    { title: "Total CS Ban", value: todayData?.tireTotal },
    { title: "Total CS Batterai", value: todayData?.batteraiTotal },
    { title: "Total CS Body Repair", value: todayData?.bodyRepairTotal },
  ];

  return (
    <section style={{ width: '100%', margin: 0, padding: 0, marginBottom: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Typography.Title level={5} style={{ margin: 0, fontFamily: 'Lato', fontWeight: 600, fontSize: 18 }}>
          Metrik Bengkel Hari Ini
        </Typography.Title>
      </div>
      
      {/* Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: 16 
      }}>
        {metrics.map((metric, index) => (
          <div key={index} style={{ 
            background: '#fff', 
            borderRadius: cardRadius, 
            boxShadow: '0 2px 8px 0 rgba(99,115,129,0.08)', 
            padding: 18,
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 100
          }}>
            <Typography.Text style={{ 
              fontFamily: 'Lato', 
              fontSize: 14, 
              fontWeight: 400, 
              color: '#637381',
              textAlign: 'center',
              marginBottom: 8
            }}>
              {metric.title}
            </Typography.Text>
            <Typography.Text style={{ 
              fontFamily: 'Lato', 
              fontSize: 24, 
              fontWeight: 600, 
              color: '#000'
            }}>
              {metric.value || 0}
            </Typography.Text>
          </div>
        ))}
      </div>
    </section>
  );
}

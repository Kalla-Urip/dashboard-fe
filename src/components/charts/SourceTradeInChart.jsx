import { ResponsivePie } from "@nivo/pie";

export default function SourceTradeInChart({ data }){
  return (
    <div style={{ height: '100%' }} >
      <ResponsivePie
        colors={({ data }) => data.color }
        innerRadius={0.5}
        margin={{ bottom: 30 }}
        padAngle={2}
        cornerRadius={4}
        // activeOuterRadiusOffset={8}
        arcLinkLabel={'label'}
        enableArcLinkLabels={false}
        legends={[
            {
                anchor: 'left',
                direction: 'column',
                itemWidth: 100,
                itemHeight: 25,
                symbolShape: 'circle'
            }
        ]}
        data={[
          {
            id: 'Customer',
            label: "Customer",
            value: data?.groupSource?.customer || 0,
            color: '#2E7D32'
          },
          {
            id: 'Service',
            label: "Service",
            value: data?.groupSource?.service || 0,
            color: '#FFA726'
          },
        ]}
      />
    </div>
  )
}
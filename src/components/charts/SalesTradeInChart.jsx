import { ResponsivePie } from "@nivo/pie";

export default function SalesTradeInChart({ data }){
  return (
    <div style={{ height: '100%' }} >
      <ResponsivePie
        colors={({ data }) => data.color }
        innerRadius={0.5}
        margin={{ bottom: 30, left: 40 }}
        padAngle={2}
        cornerRadius={4}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={false}
        arcLabelsTextColor={'#fff'}
        legends={[
            {
                anchor: 'left',
                direction: 'column',
                itemWidth: 100,
                itemHeight: 25,
                translateX: -40,
                symbolShape: 'circle'
            }
        ]}
        data={[
          {
            id: 'Belum Dikerjakan',
            label: "Belum Dikerjakan",
            value: data?.salesStatus?.belumDikerjakan || 0,
            color: '#B2DFDB'
          },
          {
            id: 'Deal',
            label: "Deal",
            value: data?.salesStatus?.deal || 0,
            color: '#2E7D32'
          },
          {
            id: 'Tidak Deal',
            label: "Tidak Deal",
            value: data?.salesStatus?.tidakDeal || 0,
            color: '#EF5350'
          },
          {
            id: 'Low',
            label: "Low",
            value: data?.salesStatus?.low || 0,
            color: '#FFA726'
          },
          {
            id: 'Medium',
            label: "Medium",
            value: data?.salesStatus?.medium || 0,
            color: '#42A5F5'
          },
          {
            id: 'Hot',
            label: "Hot",
            value: data?.salesStatus?.hot || 0,
            color: '#AB47BC'
          },
        ].map((e,i) => ({ ...e, color: `hsl(${150 + i * 40}, 70%, 50%)` }))}
      />
    </div>
  )
}
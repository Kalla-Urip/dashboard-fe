import { ResponsivePie } from "@nivo/pie";

export default function UATradeInChart({ data }){
  return (
    <div style={{ height: '100%' }} >
      <ResponsivePie
        colors={({ data }) => data.color }
        innerRadius={0.5}
        margin={{ left: 40, bottom: 30 }}
        padAngle={2}
        cornerRadius={4}
        arcLabelsTextColor={'#fff'}
        activeOuterRadiusOffset={8}
        arcLinkLabel={'label'}
        enableArcLinkLabels={false}
        sortByValue={true}
        legends={[
            {
              anchor: 'left',
              direction: 'column',
              itemWidth: 100,
              translateX: -40,
              itemHeight: 25,
              symbolShape: 'circle'
            }
        ]}
        data={[
          {
            id: 'Belum Dikerjakan',
            label: "Belum Dikerjakan",
            value: data?.trustStatus?.belumDikerjakan || 0,
            color: '#B2DFDB'
          },
          {
            id: 'Deal',
            label: "Deal",
            value: data?.trustStatus?.deal || 0,
            color: '#2E7D32'
          },
          {
            id: 'Tidak Deal',
            label: "Tidak Deal",
            value: data?.trustStatus?.tidakDeal || 0,
            color: '#EF5350'
          },
          {
            id: 'Low',
            label: "Low",
            value: data?.trustStatus?.low || 0,
            color: '#FFA726'
          },
          {
            id: 'Medium',
            label: "Medium",
            value: data?.trustStatus?.medium || 0,
            color: '#42A5F5'
          },
          {
            id: 'Hot',
            label: "Hot",
            value: data?.trustStatus?.hot || 0,
            color: '#AB47BC'
          },
          {
            id: 'Taksasi',
            label: "Taksasi",
            value: data?.trustStatus?.hot || 0,
            color: '#7CDAFD'
          },
        ].map((e,i) => ({ ...e, color: `hsl(${150 + i * 40}, 70%, 50%)` }))}
      />
    </div>
  )
}
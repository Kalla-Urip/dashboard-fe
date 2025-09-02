import { Typography } from "antd";
import { ResponsiveBar } from '@nivo/bar';
import pallete from "../../utils/pallete";

const cardRadius = 6;

export default function RevenueChart({ data }) {
  const currentYear = new Date().getFullYear();
  
  // Generate years from current year to 2024 (descending order)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 2024; year--) {
      years.push({
        label: year.toString(),
        value: year,
      });
    }
    return years;
  };

  const yearOptions = generateYearOptions();  return (
    <div style={{ 
      flex: 1, 
      background: '#fff', 
      borderRadius: cardRadius, 
      boxShadow: '0 2px 8px 0 rgba(99,115,129,0.08)', 
      paddingTop: 18, 
      paddingRight: 18, 
      paddingBottom: 0, 
      paddingLeft: 18, 
      display: 'flex', 
      flexDirection: 'column',
      minWidth: 0, 
      height: '100%' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={5} style={{ margin: 0, fontFamily: 'Lato', fontWeight: 600, fontSize: 18 }}>
          Metrik Revenue
        </Typography.Title>
        <div style={{ marginLeft: 'auto' }}>
          <select 
            style={{ borderRadius: 8, padding: '4px 12px', fontSize: 16, border: '1px solid #DFE3E8' }}
            defaultValue={currentYear}
          >
            {yearOptions.map((year) => (
              <option key={year.value} value={year.value}>{year.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveBar
          data={data}
          keys={['value']}
          indexBy="month"
          margin={{ top: 10, right: 10, bottom: 50, left: 40 }}
          colors={[pallete.primary[700]]}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
            format: v => v,
            style: { fontFamily: 'Lato', fontWeight: 400, fontSize: 14, fill: '#212B36' },
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: 5, // Membatasi jumlah tick menjadi maksimal 5
            legend: '',
            legendOffset: -32,
            style: { fontFamily: 'Lato', fontWeight: 400, fontSize: 14, fill: '#212B36' },
          }}
          enableLabel={false}
          borderRadius={6}
          theme={{
            axis: {
              ticks: {
                text: { fill: '#212B36', fontSize: 14 },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

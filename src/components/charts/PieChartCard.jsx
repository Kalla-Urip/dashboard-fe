import { Typography } from "antd";
import { ResponsivePie } from '@nivo/pie';

const cardRadius = 6;

export default function PieChartCard({ 
  title, 
  data, 
  total, 
  availableOptions, 
  selectedMonth, 
  onMonthChange, 
  centerLabel = "Total" 
}) {
  const handleSelectChange = (e) => {
    if (onMonthChange) {
      onMonthChange(parseInt(e.target.value));
    }
  };

  return (
    <div style={{ 
      background: '#fff', 
      borderRadius: cardRadius, 
      boxShadow: '0 2px 8px 0 rgba(99,115,129,0.08)', 
      padding: 18,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Title level={5} style={{ margin: 0, fontFamily: 'Lato', fontWeight: 600, fontSize: 18 }}>
          {title}
        </Typography.Title>
        <div style={{ marginLeft: 'auto' }}>
          <select 
            style={{ borderRadius: 8, padding: '4px 12px', fontSize: 16, border: '1px solid #DFE3E8' }}
            value={selectedMonth || availableOptions[0]?.value}
            onChange={handleSelectChange}
          >
            {availableOptions.map((option, index) => (
              <option key={index} value={option.value || option}>{option.label || option}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Chart Container - Centered Layout */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
      }}>
        {data && data.length > 0 ? (
          <>
            <div style={{ height: 180, width: 180, position: 'relative', marginBottom: 20 }}>
              <ResponsivePie
                data={data}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                innerRadius={0.6}
                padAngle={2}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ datum: 'data.color' }}
                enableArcLinkLabels={false}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                  from: 'color',
                  modifiers: [['darker', 2]]
                }}
                arcLabelsComponent={({ datum, style }) => (
                  <text
                    transform={style.transform}
                    textAnchor={style.textAnchor}
                    dominantBaseline="central"
                    style={{
                      ...style,
                      fontSize: 14,
                      fontWeight: 600,
                      fill: '#fff'
                    }}
                  >
                    {datum.value}
                  </text>
                )}
              />
              
              {/* Center Text */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'Lato', fontSize: 12, fontWeight: 400, color: '#000', marginBottom: 2 }}>
                  {centerLabel}
                </div>
                <div style={{ fontFamily: 'Lato', fontSize: 18, fontWeight: 600, color: '#000' }}>
                  {total}
                </div>
              </div>
            </div>
            
            {/* Horizontal Legend */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              maxWidth: '100%'
            }}>
              {data.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0
                  }} />
                  <span style={{
                    fontFamily: 'Lato',
                    fontSize: 12,
                    fontWeight: 400,
                    color: '#637381',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* No Data State */
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 48,
              color: '#DFE3E8',
              marginBottom: 16
            }}>
              📊
            </div>
            <Typography.Text style={{
              fontFamily: 'Lato',
              fontSize: 16,
              fontWeight: 400,
              color: '#637381'
            }}>
              Data tidak tersedia
            </Typography.Text>
            <Typography.Text style={{
              fontFamily: 'Lato',
              fontSize: 14,
              fontWeight: 400,
              color: '#919EAB',
              marginTop: 8
            }}>
              Silakan pilih bulan lain
            </Typography.Text>
          </div>
        )}
      </div>
    </div>
  );
}

import { Card, Flex, Typography } from "antd";
import pallete from "../../utils/pallete";

const cardRadius = 6;
const cardStyle = {
  borderRadius: cardRadius,
  boxShadow: '0 2px 8px 0 rgba(99,115,129,0.08)',
  border: 'none',
};

export function StatCard({ icon, value, subtitle, bg, color, subtitleColor, style, size }) {
  const isSmall = size === 'small';
  const iconSize = isSmall ? 32 : 40;
  const valueFontSize = isSmall ? 18 : 20;
  const subtitleFontSize = isSmall ? 14 : 16;
  const gap = isSmall ? 4 : 8;

  return (
    <Card style={{ ...cardStyle, background: bg, ...style }}>
      <Flex vertical align="start" gap={gap} style={{ flex: 1, width: '100%' }}>
        {icon && (
          <img src={icon} alt="icon" style={{ width: iconSize, height: iconSize, objectFit: 'contain', display: 'block' }} />
        )}
        <Typography.Text style={{ color: color, fontFamily: 'Lato', fontWeight: 600, fontSize: valueFontSize }}>
          {value}
        </Typography.Text>
        <Typography.Text style={{ color: subtitleColor || '#fff', fontFamily: 'Lato', fontWeight: 400, fontSize: subtitleFontSize }}>
          {subtitle}
        </Typography.Text>
      </Flex>
    </Card>
  );
}

export function MiniStatCard({ value, subtitle, subtitleColor, style }) {
  return (
    <Card
      style={{ ...cardStyle, background: '#fff', ...style }}
      styles={{
        body: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '10px 18px',
        },
      }}
    >
      <Typography.Text style={{ color: pallete.primary[700], fontFamily: 'Lato', fontWeight: 600, fontSize: 18 }}>
        {value}
      </Typography.Text>
      <Typography.Text style={{ color: subtitleColor, fontFamily: 'Lato', fontWeight: 400, fontSize: 16 }}>
        {subtitle}
      </Typography.Text>
    </Card>
  );
}

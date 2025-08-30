import { StatCard, MiniStatCard } from "../common/StatCard";
import pallete from "../../utils/pallete";
import icTotalRevenue from '../../../public/ic_total_revenue.svg';
import icTotalSales from '../../../public/ic_total_sales.svg';
import icProcessTrust from '../../../public/ic_process_trust.svg';

export default function StatisticsGrid({ data }) {
  const CARD_GAP = 16;

  return (
    <div style={{ 
      flex: '0 0 35%', 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gridTemplateRows: 'auto auto', 
      gap: CARD_GAP, 
      alignItems: 'stretch' 
    }}>
      {/* Kiri atas: Total Revenue */}
      <div style={{ gridRow: '1 / 2', gridColumn: '1 / 2' }}>
        <StatCard
          size="small"
          icon={icTotalRevenue}
          value={`Rp ${data.totalRevenue.toLocaleString('id-ID')}`}
          subtitle="Total Revenue"
          bg={pallete.primary[700]}
          color="#fff"
          subtitleColor="#fff"
          style={{ height: '100%' }}
        />
      </div>
      
      {/* Kanan atas: 2 mini card stack */}
      <div style={{ 
        gridRow: '1 / 2', 
        gridColumn: '2 / 3', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: CARD_GAP 
      }}>
        <MiniStatCard
          value={`Rp ${data.revenueThisMonth.toLocaleString('id-ID')}`}
          subtitle="Revenue Bulan Ini"
          subtitleColor={pallete.primary[700]}
        />
        <MiniStatCard
          value={`Rp ${data.revenueLastMonth.toLocaleString('id-ID')}`}
          subtitle="Revenue Bulan Lalu"
          subtitleColor={pallete.secondary[400]}
        />
      </div>
      
      {/* Kiri bawah: Total Penjualan Sales */}
      <div style={{ gridRow: '2 / 3', gridColumn: '1 / 2' }}>
        <StatCard
          size="small"
          icon={icTotalSales}
          value={data.totalSales.toLocaleString('id-ID')}
          subtitle="Total Penjualan Sales"
          bg="#fff"
          color="#000000"
          subtitleColor={pallete.grey[600]}
          style={{ height: '100%' }}
        />
      </div>
      
      {/* Kanan bawah: Total Proses Trust */}
      <div style={{ gridRow: '2 / 3', gridColumn: '2 / 3' }}>
        <StatCard
          size="small"
          icon={icProcessTrust}
          value={data.totalTrust.toLocaleString('id-ID')}
          subtitle="Total Proses Trust"
          bg="#fff"
          color="#000000"
          subtitleColor={pallete.grey[600]}
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
}

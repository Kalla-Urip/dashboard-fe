import { Card, Col, Flex, Row, Select, Typography } from "antd";
import DashboardCard from "../../components/common/DashboardCard";

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'July',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
]

export default function KacabUI(){
 return (
  <>
    <Card>
      <Flex align="center" gap={20} style={{ marginBottom: 20 }} >
        <Typography.Title level={5} style={{ margin: 0 }} >
          Metrik Kinerja Bulanan
        </Typography.Title>
        <Select
          style={{ width: 120, marginLeft: 'auto' }}
          options={months.map((e,i) => ({ label: e, value: i }))}
          placeholder="Bulan"
        />
        <Select
          style={{ width: 120 }}
          options={[2021, 2022, 2023, 2024, 2025].map((e,i) => ({ label: e, value: i }))}
          placeholder="Tahun"
        />
      </Flex>
      <Row gutter={[16, 16]} >
        <Col span={24} >
          <DashboardCard
            backgroundPrimary
            icon="hugeicons:chart-up"
            title="Total Revenue"
            value={`Rp ${(25000000).toLocaleString()}`}
          />
        </Col>
        <Col span={8} >
          <DashboardCard
            title="Total Penjualan"
            value="128"
            icon="hugeicons:car-05"
          />
        </Col>
        <Col span={8} >
          <DashboardCard
          title="Total Trust"
          value="32"
          icon="hugeicons:arrow-data-transfer-horizontal"
          />
        </Col>
        <Col span={8} >
          <DashboardCard
            icon="hugeicons:repair"
            title="Total Service"
            value="72"
          />
        </Col>
      </Row>
    </Card>
    <Card style={{ marginTop: 20 }} >
      <Typography.Title level={5} style={{ margin: 0, marginBottom: 20 }} >
        Metrik Bengkel Hari Ini
      </Typography.Title>
      <Row gutter={[16]} >
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total Service"
            value="12"
          />
        </Col>
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total CS Ban"
            value="12"
          />
        </Col>
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total CS Batterai"
            value="12"
          />
        </Col>
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total CS Body Repair"
            value="12"
          />
        </Col>
      </Row>
    </Card>
  </>
 )
}
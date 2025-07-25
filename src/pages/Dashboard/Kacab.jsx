import { Card, Col, Flex, Row, Select, Space, Typography } from "antd";
import DashboardCard from "../../components/common/DashboardCard";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import { ResponsiveLine } from "@nivo/line";
import pallete from "../../utils/pallete";
import RenderIf from "../../components/RenderIf";

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

const months = [
  { label: 'Januari', value: 1 },
  { label: 'Februari', value: 2 },
  { label: 'Maret', value: 3 },
  { label: 'April', value: 4 },
  { label: 'Mei', value: 5 },
  { label: 'Juni', value: 6 },
  { label: 'Juli', value: 7 },
  { label: 'Agustus', value: 8 },
  { label: 'September', value: 9 },
  { label: 'Oktober', value: 10 },
  { label: 'November', value: 11 },
  { label: 'Desember', value: 12 }
];

const yearOptions = Array.from({ length: 5 }, (_, i) => {
  const year = currentYear - i;
  return { label: year, value: year };
});

const TopSalesCard = ({ name, count, }) => (
  <Card 
    style={{ 
      border: 0,
      backgroundColor: pallete.grey[100]
    }} 
    styles={{
      body: {
        padding: '18px 22px'
      }
    }}
  >
    <Flex justify="space-between" align="center" >
      <Typography.Text style={{ display: 'inline-block' }} >
        {name}
      </Typography.Text>
      <Typography.Text style={{ display: 'inline-block', fontWeight: 600 }} >
        {count} Unit
      </Typography.Text>
    </Flex>
  </Card>
)

export default function KacabUI(){

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedMonthSales, setSelectedMonthSales] = useState(currentMonth);

  const { data: monthlyData } = useQuery({
    queryKey: ['monthlyData', selectedMonth, selectedYear],
    queryFn: () => dashboardService.getMonthlySummary({ year: selectedYear, month: selectedMonth }),
    select: ({ data }) => data
  })

  const { data: todayData } = useQuery({
    queryKey: ['todayData'],
    queryFn: () => dashboardService.getTodaySummary(),
    select: ({ data }) => data
  })

  const { data: topSales } = useQuery({
    queryKey: ['topSales', selectedMonthSales],
    queryFn: () => dashboardService.getTopSales({ month: selectedMonthSales }),
    select: ({ data }) => data
  })

 return (
  <>
    <Card>
      <Flex align="center" gap={20} style={{ marginBottom: 20 }} >
        <Typography.Title level={5} style={{ margin: 0 }} >
          Metrik Kinerja Bulanan
        </Typography.Title>
        <Select
          style={{ width: 120, marginLeft: 'auto' }}
          options={months}
          value={selectedMonth}
          placeholder="Bulan"
          onChange={e => setSelectedMonth(e)}
        />
        <Select
          style={{ width: 120 }}
          options={yearOptions}
          value={selectedYear}
          placeholder="Tahun"
          onChange={e => setSelectedYear(e)}
        />
      </Flex>
      <Row gutter={[16, 16]} >
        <Col span={24} >
          <DashboardCard
            backgroundPrimary
            icon="hugeicons:chart-up"
            title="Total Revenue"
            value={`Rp ${(monthlyData?.totalRevenue ?? 0).toLocaleString()}`}
          />
        </Col>
        <Col span={8} >
          <DashboardCard
            title="Total Penjualan"
            value={monthlyData?.totalSales}
            icon="hugeicons:car-05"
          />
        </Col>
        <Col span={8} >
          <DashboardCard
            title="Total Trust"
            value={monthlyData?.totalTrust}
            icon="hugeicons:arrow-data-transfer-horizontal"
            />
        </Col>
        <Col span={8} >
          <DashboardCard
            icon="hugeicons:repair"
            title="Total Service"
            value={monthlyData?.totalService}
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
            value={todayData?.totalService}
          />
        </Col>
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total CS Ban"
            value={todayData?.tireTotal}
          />
        </Col>
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total CS Batterai"
            value={todayData?.batteraiTotal}
          />
        </Col>
        <Col span={6} >
          <DashboardCard
            showIcon={false}
            title="Total CS Body Repair"
            value={todayData?.bodyRepairTotal}
          />
        </Col>
      </Row>
    </Card>
    {/* <Card styles={{ body: { height: 400 } }} >
    </Card> */}
    <Row gutter={[20]} style={{ height: 450, marginTop: 20 }} >
      <Col span={16} style={{ height: '100%' }} >
        <Card 
          style={{ height: '100%' }} 
          styles={{ body: { height: '100%', padding: 20 } }} 
        >
          <Flex style={{ marginBottom: 10 }} align="center" >
            <Typography.Title level={5} style={{ margin: 0 }} >
              Perbandingan Trust & Penjualan
            </Typography.Title>
            <Select
              style={{ width: 120, marginLeft: 'auto' }}
              options={months}
              value={selectedMonth}
              placeholder="Bulan"
              onChange={e => setSelectedMonth(e)}
            />
          </Flex>
          <ResponsiveLine
            data={[
              {
                "id": "Trust",
                "data": [
                  {
                    "x": "Jan",
                    "y": 120
                  },
                  {
                    "x": "Feb",
                    "y": 202
                  },
                  {
                    "x": "Mar",
                    "y": 154
                  },
                  {
                    "x": "Apr",
                    "y": 50
                  },
                  {
                    "x": "Mei",
                    "y": 244
                  },
                  {
                    "x": "Jun",
                    "y": 154
                  },
                  {
                    "x": "Jul",
                    "y": 280
                  },
                  {
                    "x": "Aug",
                    "y": 139
                  },
                  {
                    "x": "Sep",
                    "y": 253
                  },
                  {
                    "x": "Okt",
                    "y": 221
                  },
                  {
                    "x": "Nov",
                    "y": 186
                  },
                  {
                    "x": "Des",
                    "y": 216
                  }
                ]
              },
              {
                "id": "Penjualan",
                "data": [
                  {
                    "x": "Jan",
                    "y": 62
                  },
                  {
                    "x": "Feb",
                    "y": 116
                  },
                  {
                    "x": "Mar",
                    "y": 237
                  },
                  {
                    "x": "Apr",
                    "y": 227
                  },
                  {
                    "x": "Mei",
                    "y": 283
                  },
                  {
                    "x": "Jun",
                    "y": 24
                  },
                  {
                    "x": "Jul",
                    "y": 63
                  },
                  {
                    "x": "Aug",
                    "y": 158
                  },
                  {
                    "x": "Sep",
                    "y": 62
                  },
                  {
                    "x": "Okt",
                    "y": 222
                  },
                  {
                    "x": "Nov",
                    "y": 77
                  },
                  {
                    "x": "Des",
                    "y": 250
                  }
                ]
              },
            ]}
            colors={({ id }) => {
              console.log(id)
              if (id === 'Penjualan') return pallete.secondary.main
              if (id === 'Trust') return pallete.primary.main
              return '#ccc' // default color
            }}
            margin={{ top: 10, right: 10, bottom: 100, left: 30 }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'seriesColor' }}
            pointLabelYOffset={-12}
            enableTouchCrosshair={true}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateX: 20,
                translateY: 55,
                itemWidth: 90,
                itemHeight: 20,
                itemsSpacing: 4,
                symbolSize: 15,
                symbolShape: 'circle',
                itemTextColor: '#777',
              }
            ]}
          />
        </Card>
      </Col>
      <Col span={8} style={{ height: '100%' }} >
        <Card
          style={{ height: '100%' }}
        >
          <Flex style={{ marginBottom: 20 }} align="center" >
            <Typography.Title level={5} style={{ margin: 0 }} >
              Top 5 Sales
            </Typography.Title>
            <Select
              style={{ width: 120, marginLeft: 'auto' }}
              options={months}
              value={selectedMonthSales}
              placeholder="Bulan"
              onChange={e => setSelectedMonthSales(e)}
            />
          </Flex>
          <Space size={14} direction="vertical" style={{ width: '100%' }} >
            <RenderIf when={topSales?.length > 0} >
              {
                topSales?.map((e,i) => (
                  <TopSalesCard
                    name={`${i+1}. ${e.sales.name}`}
                    count={e.sales_total}
                  />
                ))
              }
            </RenderIf>
          </Space>
        </Card>
      </Col>
    </Row>
  </>
 )
}
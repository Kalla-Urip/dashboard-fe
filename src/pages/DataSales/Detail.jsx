import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Flex, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { salesService } from "../../services/sales.service";

export default function DataSalesDetail(){

  const navigate = useNavigate()

  const { id } = useParams()

  const { data } = useQuery({
    queryKey: ['detail'],
    queryFn: () => salesService.getById(id),
    enabled: !!id,
    select: data => data.data
  })

  return (
    <>
      <Card>
        <Typography.Title level={5} >
          Identitas
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          // styles={descStyle}
          column={2}
          items={[
            {
              label: 'Nama',
              children: data?.name
            },
            {
              label: 'Tanggal Lahir',
              children: data?.birthDate ?? '-'
            },
            {
              label: 'No Whatsapp',
              children: data?.phone ?? '-'
            },
            {
              label: 'Profesi',
              children: data?.profession ?? '-',
            },
            {
              label: 'Range Pendapatan',
              children: data?.salaryRange ?? '-'
            },
            {
              label: 'Alamat',
              children: data?.address ?? '-'
            },
          ]}
        />
      </Card>
      <Card style={{ margin: '15px 0' }} >
        <Typography.Title level={5} >
          Data Penjualan
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          // styles={descStyle}
          column={2}
          items={[
            {
              label: 'SPK',
              children: data?.spk ?? '-',
              span: 2
            },
            {
              label: 'Sumber Prospek',
              children: data?.prospectSource ?? '-'
            },
            {
              label: 'Jenis Kustomer',
              children: data?.customerType ?? '-'
            },
            {
              label: 'Leasing',
              children: data?.leasing ?? '-'
            },
            {
              label: 'Metode Bayar',
              children: data?.type ?? '-'
            },
            {
              label: 'Harga Mobil',
              children: `Rp ${(data?.price ?? "0").toLocaleString()}`
            },
            {
              label: 'Diskon',
              children: `Rp ${(data?.discount ?? "0").toLocaleString()}`
            },
            {
              label: 'Receive Amount',
              children: `Rp ${(data?.receiveAmount ?? "0").toLocaleString()}`
            },
            {
              label: 'Receivable',
              children: `Rp ${(data?.receivable ?? "0").toLocaleString()}`
            },
          ]}
        />
      </Card>
      <Card >
        <Typography.Title level={5} >
          Data Kendaraan
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          // styles={descStyle}
          column={2}
          items={[
            {
              label: 'Tanggal Pembelian',
              children: data?.date,
            },
            {
              label: 'Tipe Kendaraan',
              children: data?.vehicleType
            },
            {
              label: 'Tahun',
              children: data?.year
            },
            {
              label: 'Nomor Rangka',
              children: data?.chassisNumber
            },
            {
              label: 'Nomor Plat',
              children: data?.plateNumber
            },
          ]}
        />
      </Card>
      <Flex justify="flex-end" style={{ marginTop: 10 }} >
        <Button onClick={() => navigate('/data-sales')} variant="outlined" color="primary" >
          Kembali
        </Button>
      </Flex>
    </>
  )
}
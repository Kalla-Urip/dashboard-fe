import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Typography } from "antd";
import { useParams } from "react-router";
import { salesService } from "../../services/sales.service";

export default function DataSalesDetail(){

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
              children: data?.birthDate
            },
            {
              label: 'No Whatsapp',
              children: data?.phone
            },
            {
              label: 'Profesi',
              children: data?.profession,
            },
            {
              label: 'Range Pendapatan',
              children: data?.salaryRange
            },
            {
              label: 'Alamat',
              children: data?.address
            },
          ]}
        />
      </Card>
      <Card style={{ marginTop: 15 }} >
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
              children: data?.type
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
    </>
  )
}
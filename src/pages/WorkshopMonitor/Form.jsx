import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Flex, Tag, Typography } from "antd";
import { useParams } from "react-router";
import { serviceDataService } from "../../services/serviceData.service";
import pallete from "../../utils/pallete";

const ColoredText = ({ text }) => {
  let color

  if(['Hijau', 'Normal'].includes(text)) color = pallete.primary[700]
  if(['Kuning', 'Lecet'].includes(text)) color = pallete.secondary[400]
  if(['Merah', 'Penyok'].includes(text)) color = 'red'

  return <Typography.Text style={{ color }} >{text}</Typography.Text>

}

const createIdentityData = (data) => {
  const obj = [
    { label: 'Nama', dataIndex: 'owner' },
    { label: 'Tanggal Lahir', dataIndex: 'birthDate' },
    { label: 'Nomor Whatsapp', dataIndex: 'phone' },
    { label: 'Nomor Plat', dataIndex: 'plateNumber' },
    { label: 'Tipe Kendaraan', dataIndex: 'type' },
    { label: 'Tahun', dataIndex: 'year' },
    { label: 'Asuransi', dataIndex: 'insurance' },
    { label: 'Alamat', dataIndex: 'address' },
    { label: 'Download M Toyota', dataIndex: 'mToyota', render: (val) => val ? <Tag color="green" >Sudah</Tag> : <Tag color="red" >Belum</Tag> },
  ]

  return obj.map(e => ({
    label: e.label,
    children: e.render ? e.render(data[e.dataIndex]) : (data[e.dataIndex] ?? '-')
  }))

}

const createCarpetConditionData = (data) => {
  return [
    { label: 'Karpet Dasar', children: data.carpetCondition.base, },
    { label: 'Karpet Pengemudi', children: data.carpetCondition.driver, },
  ]
}

const createTireConditionData = (data) => {

  return Object.entries(data).map(e => {
    return {
      label: e[0].replaceAll('_', ' ').toUpperCase(),
      children: <ColoredText text={e[1]} />
    }
  })
}

const createBodyConditionData = (data) => {

  return Object.entries(data).map(e => {
    return {
      label: e[0].replaceAll('_', ' ').toUpperCase(),
      children: <ColoredText text={e[1]} />
    }
  })
}

export default function WorkshopMonitorDetail(){
  
  const { id } = useParams()

  const descStyle = {
    label: {
      width: 240
    },
    content: {
      width: 315
    }
  }

  const { data } = useQuery({
    queryKey: ['detail'],
    queryFn: () => serviceDataService.getById(id),
    enabled: !!id,
    select: data => data.data
  })

  return (
    <Flex vertical gap={10} >
      <Card>
        <Typography.Title level={5} >
          Transfer Sales
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          items={[
            {
              label: 'Transfer Sales',
              children: 'sf'
            }
          ]}
        />
      </Card>
      <Card>
        <Typography.Title level={5} >
          Identitas
        </Typography.Title>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={data && createIdentityData(data)}
        />
      </Card>
      <Card>
        <Typography.Title level={5} >
          Kondisi Mobil
        </Typography.Title>
        <Typography.Text style={{ display: 'inline-block', margin: '10px 0 10px 0' }} >
          Kondisi Ruang Mesin
        </Typography.Text>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={[{ label: 'Ruang Mesin', children: data?.engineRoomCondition }]}
        />
        <Typography.Text style={{ display: 'inline-block', margin: '15px 0 10px 0' }} >
          Kondisi Karpet
        </Typography.Text>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={data && createCarpetConditionData(data)}
        />
        <Typography.Text style={{ display: 'inline-block', margin: '15px 0 10px 0' }} >
          Kondisi Ketebalan Ban
        </Typography.Text>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={data && createTireConditionData(data?.tireThicknessCondtion)}
        />
        <Typography.Text style={{ display: 'inline-block', margin: '15px 0 10px 0' }} >
          Kondisi Baterai
        </Typography.Text>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={[{ label: 'Kondisi Baterai', children: data?.batteraiCondition }]}
        />
        <Typography.Text style={{ display: 'inline-block', margin: '15px 0 10px 0' }} >
          BBM & Kilometer
        </Typography.Text>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={[
            { label: 'Total BBM (Persentase)', children: data?.fuelTotal },
            { label: 'Kilometer', children: data?.kilometer },
          ]}
        />
        <Typography.Text style={{ display: 'inline-block', margin: '15px 0 10px 0' }} >
          Kondis Body
        </Typography.Text>
        <Descriptions
          bordered
          size="small"
          styles={descStyle}
          column={2}
          items={data && createBodyConditionData(data.bodyCondition)}
        />
      </Card>
    </Flex>
  )
}
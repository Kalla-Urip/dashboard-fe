import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Flex, Tag, Typography } from "antd";
import { useParams } from "react-router";
import { vehicleService } from "../../services/vehicle.service";
import pallete from "../../utils/pallete";

const ColoredText = ({ text }) => {
  let color

  if(['Hijau', 'Normal'].includes(text)) color = pallete.primary[700]
  if(['Kuning', 'Lecet'].includes(text)) color = pallete.secondary[400]
  if(['Merah', 'Penyok'].includes(text)) color = 'red'

  return <Typography.Text style={{ color }} >{text}</Typography.Text>

}

const createCarpetConditionData = (data) => {
  return [
    { label: 'Karpet Dasar', children: data?.carpetCondition?.base, },
    { label: 'Karpet Pengemudi', children: data?.carpetCondition?.driver, },
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

export default function VehicleDataService(){

  const { id } = useParams()

  console.log(id)

  const { data } = useQuery({
    queryKey: ['detail'],
    queryFn: () => vehicleService.getServiceDetail(id),
    select: data => data.data
  })

  console.log(data)

  const descStyle = {
    label: {
      width: 240
    },
    content: {
      width: 315
    }
  }

  return (
    <>
      <Flex vertical gap={10} >
        <Card>
          <Typography.Title level={5} >
            Asuransi
          </Typography.Title>
          <Descriptions
            bordered
            size="small"
            styles={descStyle}
            column={2}
            items={[
              {
                label: 'Asuransi',
                children: data?.Vehicle.insurance,
              },
            ]}
          />
        </Card>
        <Card>
          <Typography.Title level={5} >
            Catatan & Lainnya
          </Typography.Title>
          <Descriptions
            bordered
            size="small"
            styles={descStyle}
            column={2}
            items={[
              {
                label: 'Jenis Service',
                children: data?.serviceType,
                span: 2
              },
              {
                label: 'Catatan',
                children: data?.note,
                span: 2
              },
              {
                label: 'Petugas Bengkel',
                children: data?.mechanic.name,
              },
              {
                label: 'Stall',
                children: data?.Stall.name,
              },
              {
                label: 'Trade In',
                children: data?.tradeIn ? 'Ya' : 'Tidak',
              }
            ]}
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
            Kondisi Body
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
    </>
  )
}
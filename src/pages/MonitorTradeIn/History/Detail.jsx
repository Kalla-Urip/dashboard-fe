import { useQuery } from "@tanstack/react-query";
import { Button, Card, Descriptions, Flex, Tag, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { tradeInService } from "../../../services/tradeIn.service";
import pallete from "../../../utils/pallete";
import { useAuth } from "../../../hooks/useAuth";
import RenderIf from "../../../components/RenderIf";

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

// const createNoteData = (data) => {
//   const obj = [
//     { label: 'Nama', dataIndex: 'owner' },
//     { label: 'Tanggal Lahir', dataIndex: 'birthDate' },
//     { label: 'Nomor Whatsapp', dataIndex: 'phone' },
//     { label: 'Nomor Plat', dataIndex: 'plateNumber' },
//     { label: 'Tipe Kendaraan', dataIndex: 'type' },
//     { label: 'Tahun', dataIndex: 'year' },
//     { label: 'Asuransi', dataIndex: 'insurance' },
//     { label: 'Alamat', dataIndex: 'address' },
//     { label: 'Download M Toyota', dataIndex: 'mToyota', render: (val) => val ? <Tag color="green" >Sudah</Tag> : <Tag color="red" >Belum</Tag> },
//   ]

//   return obj.map(e => ({
//     label: e.label,
//     children: e.render ? e.render(data[e.dataIndex]) : (data[e.dataIndex] ?? '-')
//   }))

// }

// const createCarpetConditionData = (data) => {
//   return [
//     { label: 'Karpet Dasar', children: data.carpetCondition.base, },
//     { label: 'Karpet Pengemudi', children: data.carpetCondition.driver, },
//   ]
// }

// const createTireConditionData = (data) => {

//   return Object.entries(data).map(e => {
//     return {
//       label: e[0].replaceAll('_', ' ').toUpperCase(),
//       children: <ColoredText text={e[1]} />
//     }
//   })
// }

// const createBodyConditionData = (data) => {

//   return Object.entries(data).map(e => {
//     return {
//       label: e[0].replaceAll('_', ' ').toUpperCase(),
//       children: <ColoredText text={e[1]} />
//     }
//   })
// }

export default function MonitorTradeInFinishDetail(){

  const { id } = useParams()
  const { user } = useAuth()

  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['detail'],
    queryFn: () => tradeInService.getFinishDataById(id),
    enabled: !!id,
    select: data => data.data
  })

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
            Status
          </Typography.Title>
          <Descriptions
            bordered
            size="small"
            styles={descStyle}
            column={2}
            items={[
              { label: 'Tanggal Diajukan', children: data?.createdAt, span: 2 },
              { 
                label: user.user.employeeType == 'SPV Trust' ? 'Status Trust' : 'Status Sales',  
                children: (
                  <>
                    <Typography.Text style={{ fontWeight: 600, display: 'block' }} >
                      { user.user.employeeType == 'SPV Trust' && data?.trustName}
                      { user.user.employeeType == 'SPV Sales' && data?.salesName}
                    </Typography.Text>
                    <RenderIf when={user.user.employeeType == 'SPV Sales'} >
                      <Tag color={data?.salesStatus == 'Berhasil' ? 'green' : 'error'} >
                        {data?.salesStatus}
                      </Tag>
                    </RenderIf>
                    <RenderIf when={user.user.employeeType == 'SPV Trust'} >
                      <Tag color={data?.trustStatus == 'Berhasil' ? 'green' : 'error'} >
                        {data?.trustStatus}
                      </Tag>
                    </RenderIf>
                  </>
                )
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
            Tam Check
          </Typography.Title>
          <Descriptions
            bordered
            size="small"
            styles={descStyle}
            column={2}
            items={[
              { label: 'Tam Check', children: 'tam.xlsx', span: 2 },
              { label: 'Quality Level', children: data?.qualityLevel },
              { label: 'Harga Beli', children: 'Rp ' + data?.price?.toLocaleString() },
            ]}
          />
        </Card>
        {/* <Card>
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
        </Card> */}
      </Flex>   
      <Flex justify="end" style={{ marginTop: 20 }}  >
        <Button onClick={() => navigate('/monitor-tradein/history')} style={{ backgroundColor: 'transparent' }} variant="outlined" color="primary" >
          Kembali
        </Button>
      </Flex>
    </>
  )
}
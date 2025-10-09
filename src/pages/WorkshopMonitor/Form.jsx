import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Col, Descriptions, Flex, Form, Input, message, Row, Select, Tag, Typography } from "antd";
import { useParams } from "react-router";
import { serviceDataService } from "../../services/serviceData.service";
import { useEffect } from "react";
import { customerService } from "../../services/customer.service";
import { vehicleTypeService } from "../../services/vehicleType.service";

const ColoredText = ({ text }) => {
  
  const textSplit = text.split(',')
  
  return textSplit.map(e => {
    let color
    if(['Hijau', 'Normal', 'Good'].includes(e.trim())) color = 'green'
    if(['Kuning', 'Lecet', 'Recharger', 'Replace'].includes(e.trim())) color = 'orange'
    if(['Merah', 'Penyok', 'Bad Cell'].includes(e.trim())) color = 'red'
    return <Tag color={color} >{e}</Tag>
  })


}

// const createIdentityData = (data) => {
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

  const queryClient = useQueryClient()

  const [form] = Form.useForm()

  const [messageApi, messageHolder] = message.useMessage()

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
  
  const { data: vehicleType } = useQuery({
    queryKey: ['types'],
    queryFn: () => vehicleTypeService.fetchWithoutPaginate(),
    enabled: !!id,
    select: data => data.data
  })

  const updateCustomerMutation = useMutation({
    mutationFn: val => customerService.updateFromWAC(val),
    onSuccess: () => {
      messageApi.success("Data berhasil diubah")
      queryClient.invalidateQueries(['detail'])
    },
    onError: () => {
      messageApi.error("Terjadi Kesalahan")
    }
  })

  useEffect(() => {
    if(data && id){
      form.setFieldsValue(data)
    }
  }, [data])

  const handleUpdateOwner = (values) => {
    updateCustomerMutation.mutate({
      vehicleId: data.vehicleId,
      id: data.ownerId,
      name: values.owner,
      birthDay: values.birthDay,
      phone: values.phone,
      mToyota: values.mToyota,
      insurance: values.insurance,
      plateNumber: values.plateNumber,
      typeId: values.typeId,
    })
  }

  return (
    <>
      {messageHolder}
      <Flex vertical gap={10} >
        {/* <Card>
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
        </Card> */}
        <Card>
          <Typography.Title level={5} >
            Identitas
          </Typography.Title>
          {/* <Descriptions
            bordered
            size="small"
            styles={descStyle}
            column={2}
            items={data && createIdentityData(data)}
          /> */}
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateOwner}
          >
            <Row gutter={[15]} >
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="Nama" name={'owner'} >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label='Tanggal Lahir' name={'birthDate'} >
                  <Input type="date" />
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="No Telepon" name={'phone'} >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="Nomor Plat" name={'plateNumber'} >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="Tipe Mobil" name={'typeId'} >
                  <Select
                    options={vehicleType?.map(e => ({ label: e.name, value: e.id }))}
                    optionFilterProp="label"
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="Tahun" name={'year'} >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="Asuransi" name={'insurance'} >
                  <Input/>
                </Form.Item>
              </Col>
              <Col span={12} >
                <Form.Item rules={[{ required: true }]} label="M Toyota" name={'mToyota'} >
                  <Select
                    options={[{ value: false, label: 'Belum' }, { value: true, label: 'Sudah' }]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Flex justify="end" >
              <Button onClick={form.submit} variant="solid" color="primary" >
                Simpan
              </Button>
            </Flex>
          </Form>
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
            items={[{ label: 'Kondisi Baterai', children: data?.batteraiCondition && <ColoredText text={data?.batteraiCondition} /> }]}
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
          <Typography.Text style={{ display: 'inline-block', margin: '15px 0 10px 0' }} >
            Grade Mobil
          </Typography.Text>
          <Descriptions
            bordered
            size="small"
            styles={descStyle}
            column={2}
            items={data && [
              {
                label: 'Grade',
                children: data.grade?.grade
              },
              {
                label: 'Alasan',
                children: data.grade?.reason
              },
              {
                label: 'Penjelasan',
                children: data.grade?.narrative
              },
            ]}
          />
        </Card>
      </Flex>
    </>
  )
}
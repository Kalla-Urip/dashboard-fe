import { Card, Col, Flex, Form, Input, message, Row, Select } from "antd"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import { useEffect } from "react"
import { breadcrumbStore } from "../../store/breadcrumbStore"
import { customerService } from "../../services/customer.service"
import { afterRequestHandler } from "../../utils/afterRequestHandler"
import CardFooter from "../../components/CardFooter"

export default function CustomerDataForm(){

  const navigate = useNavigate()

  const { id } = useParams()

  const { setTitle, setItems } = breadcrumbStore()

  const [form] = Form.useForm()
  const [messageApi] = message.useMessage();

  const { data } = useQuery({
    queryKey: ['detail-customer', id],
    queryFn: () => customerService.getById(id),
    enabled: !!id
  })

  useEffect(() => {
    setTitle("Data Kustomer")
    setItems([
      {
        title: 'Data Kustomer'
      },
      {
        title: 'Detail'
      },
    ])
  }, [])

  useEffect(() => {
    if(data?.data){
      form.setFieldsValue(data?.data)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const submitMutation = useMutation({
    mutationFn: val => id
    ? customerService.update({...val, id})
    : customerService.store(val),
    ...afterRequestHandler(
      id,
      messageApi,
      () => navigate('/customer-data')
    )
  })

  return (
    <>
      <Card
        actions={[
          <CardFooter
            onSubmit={form.submit}
            onCancel={() => navigate('/customer-data')}
          />
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitMutation.mutate}
        >
          <Row gutter={[20]} >
            <Col span={24} >
              <Form.Item rules={[{ required: true }]} name={'name'} label="Nama" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={24} >
              <Form.Item rules={[{ required: true }]} name={'address'} label="Alamat" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'birthDate'} label="Tanggal Lahir" >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'city'} label="Kota" >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'phone'} label="No Telepon" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item name={'company'} label="Perusahaan" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'profession'} label="Profesi" >
                <Select
                  options={['PNS', 'TNI/POLRI', 'Pelajar/Mahasiswa', 'Ibu Rumah Tangga', 'Lainnya'].map(e => ({ value: e, label: e }))}
                />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'salaryRange'} label="Rentang Gaji" >
                <Select
                  options={['< Rp 10.000.000', 'Rp 15.000.000 - Rp 20.000.000', 'Rp 20.000.000 - Rp 30.000.000', '> Rp 30.000.000'].map(e => ({ value: e, label: e }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  )
}
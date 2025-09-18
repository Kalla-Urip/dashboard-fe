import { Card, Col, Flex, Form, Input, message, Row, Select } from "antd"
import CardFooter from "../../../components/CardFooter"
import { useMutation, useQuery } from "@tanstack/react-query"
import { userService } from "../../../services/user.service"
import { useNavigate, useParams } from "react-router"
import { useEffect } from "react"
import { afterRequestHandler } from "../../../utils/afterRequestHandler"
import { breadcrumbStore } from "../../../store/breadcrumbStore"

const employeeType = [
  'SPV Sales',
  'Sales',
  'SPV Trust',
  'Trust',
  'Admin Bengkel',
  'Bengkel',
  'SA'
]

export default function UserRoleForm(){

  const navigate = useNavigate()

  const { id } = useParams()

  const { setTitle, setItems } = breadcrumbStore()

  const [form] = Form.useForm()
  const [messageApi] = message.useMessage();

  const { data } = useQuery({
    queryKey: ['detail-user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id
  })

  useEffect(() => {
    setTitle("User Role")
    setItems([
      {
        title: 'Master Data'
      },
      {
        title: 'User Role'
      },
      {
        title: 'Form'
      },
    ])
  }, [])

  useEffect(() => {
    if(data?.data){
      form.setFieldsValue({
        name: data?.data.name,
        nik: data?.data.nik,
        email: data?.data.email,
        phone: data?.data.phone,
        employeeType: data?.data.employeeType,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const submitMutation = useMutation({
    mutationFn: val => id
    ? userService.update({...val, id})
    : userService.store(val),
    ...afterRequestHandler(
      id,
      messageApi,
      () => navigate('/master-data/user-role')
    )
  })

  return (
    <>
      <Card
        actions={[
          <CardFooter
            onSubmit={form.submit}
            onCancel={() => navigate('/master-data/user-role')}
          />
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={submitMutation.mutate}
        >
          <Row gutter={[20]} >
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'employeeType'} label="Tipe Pegawai" >
                <Select
                  options={employeeType.map(e => ({  label: e, value: e }))}
                />
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'nik'} label="NIK Pegawai" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'name'} label="Nama Lengkap" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'email'} label="Email" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: true }]} name={'phone'} label="No Telepon" >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12} >
              <Form.Item rules={[{ required: !id }]} name={id ? 'newPassword' : 'password'} label={"Password " + (id ? "Baru" : "")  } >
                <Input/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  )
}
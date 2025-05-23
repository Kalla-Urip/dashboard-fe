import { Button, Card, Col, Flex, Form, Image, Input, Layout, message, Row, Typography } from "antd";
import pallete from "../utils/pallete";
import { authService } from "../services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";

export default function Login(){

  const { login: setLogin } = useAuth();

  const [messageApi, contextHolder] = message.useMessage();

  const loginMutation = useMutation({
    mutationFn: (data) => authService.login(data),
    onSuccess: ({ data }) => {
      setLogin(data);
      window.location.href = '/';
    },
    onError: (err) => {
      if (err.status == 401) {
        messageApi.error("Username atau Password salah");
        return;
      }
      messageApi.error("Terjadi Kesalahan");
    }
  });

  return (
    <Layout style={{ height: '100vh' }} >
      {contextHolder}
      <Row style={{ height: '100%' }} >
        <Col flex={1} style={{ height: '100%', backgroundImage: "url('./login_bg.svg')", backgroundPosition: 'center', backgroundSize: 'cover', position: 'relative' }} >
          <Flex vertical align="center" justify="flex-end" style={{ height: '100%' }} >
            <Image
              src="./login_bg_footer.svg"
              preview={false}
              width={320}
              style={{ marginBottom: 30 }}
            />
          </Flex>
        </Col>
        <Col span={9} style={{ height: '100%', backgroundColor: '#fff', position: 'relative' }} >
          <Flex style={{ height: '100%', padding: '0 55px' }} >
            <Flex vertical style={{ margin: 'auto', width: '100%' }} >
              <Typography.Title level={5} style={{ color: '#FA9B25', marginBottom: 10 }} >
                Selamat Datang
              </Typography.Title>
              <Typography.Title level={4} style={{ margin: 0 }} >
                Login
              </Typography.Title>
              <Typography.Text style={{ marginBottom: 25, fontWeight: 300 }} >
                Silahkan masukan username dan password Anda.
              </Typography.Text>
              <Form
                layout="vertical"
                onFinish={loginMutation.mutate}
              >
                <Form.Item rules={[{ required: true }]} name={'nik'} label="Username" >
                  <Input size="large" />
                </Form.Item>
                <Form.Item rules={[{ required: true }]} name={'password'} label="Password" >
                  <Input.Password size="large" />
                </Form.Item>
                <Form.Item style={{ marginTop: 30 }} >
                  <Button htmlType="submit" size="large" block type="primary" >
                    Login
                  </Button>
                </Form.Item>
              </Form>
            </Flex>
          </Flex>
          <Typography.Text style={{ position: 'absolute', bottom: 20, textAlign: 'center', right: 0, left: 0, color: pallete.grey[600], fontWeight: 300 }} >
            @2025. KallaToyotaUrip - All Rights Reserved.
          </Typography.Text>
        </Col>
      </Row>
    </Layout>
  )
}
import { Avatar, Card, Col, Flex, Row, Typography } from "antd";
import pallete from "../../utils/pallete";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MechanicDashboard(){
  return (
    <>
      <Card
        styles={{
          body: {
            padding: 20
          }
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: 18 }} >
          Service Hari Ini
        </Typography.Title>
        <Card 
          styles={{
            body: {
              padding: '18px 21px'
            }
          }}
          style={{ background: pallete.primary.main }} 
        >
          <Flex gap={4} vertical >
            <Avatar size={48} style={{ backgroundColor: '#fff' }} >
              <Icon
                icon={'hugeicons:repair'}
                color={pallete.primary.main}
                width={26}
                style={{ marginBottom: -5 }}
              />
            </Avatar>
            <Typography.Text style={{ color: '#fff', fontSize: 18, marginTop: 8 }} >
              Total Service
            </Typography.Text>
            <Typography.Text style={{ color: '#FBB040', fontSize: 24, fontWeight: 600 }} >
              72
            </Typography.Text>
          </Flex>
        </Card> 
      </Card>
      <Card 
        style={{ marginTop: 20 }} 
        styles={{
          body: {
            padding: 20
          }
        }}
      >
        <Typography.Title level={4} style={{ marginBottom: 18 }} >
          Cross Selling Hari Ini
        </Typography.Title>
        <Row gutter={[20]} >
          <Col span={8} >
            <Card 
              styles={{
                body: {
                  padding: '18px 21px'
                }
              }}
              style={{ background: pallete.grey[100], border: 'none' }} 
            >
              <Flex gap={4} vertical >
                <Avatar size={48} style={{ backgroundColor: pallete.primary.main }} >
                  <Icon
                    icon={'hugeicons:tire'}
                    width={30}
                    style={{ marginBottom: -7 }}
                  />
                </Avatar>
                <Typography.Text style={{ fontSize: 18, marginTop: 8 }} >
                  Ban
                </Typography.Text>
                <Typography.Text style={{ fontSize: 21, fontWeight: 600 }} >
                  72
                </Typography.Text>
              </Flex>
            </Card> 
          </Col>
          <Col span={8} >
            <Card 
              styles={{
                body: {
                  padding: '18px 21px'
                }
              }}
              style={{ background: pallete.grey[100], border: 'none' }} 
            >
              <Flex gap={4} vertical >
                <Avatar size={48} style={{ backgroundColor: pallete.primary.main }} >
                  <Icon
                    icon={'hugeicons:automotive-battery-01'}
                    width={30}
                    style={{ marginBottom: -7 }}
                  />
                </Avatar>
                <Typography.Text style={{ fontSize: 18, marginTop: 8 }} >
                  Baterai
                </Typography.Text>
                <Typography.Text style={{ fontSize: 21, fontWeight: 600 }} >
                  72
                </Typography.Text>
              </Flex>
            </Card> 
          </Col>
          <Col span={8} >
            <Card 
              styles={{
                body: {
                  padding: '18px 21px'
                }
              }}
              style={{ background: pallete.grey[100], border: 'none' }} 
            >
              <Flex gap={4} vertical >
                <Avatar size={48} style={{ backgroundColor: pallete.primary.main }} >
                  <Icon
                    icon={'hugeicons:car-03'}
                    width={30}
                    style={{ marginBottom: -7 }}
                  />
                </Avatar>
                <Typography.Text style={{ fontSize: 18, marginTop: 8 }} >
                  Body Repair
                </Typography.Text>
                <Typography.Text style={{ fontSize: 21, fontWeight: 600 }} >
                  72
                </Typography.Text>
              </Flex>
            </Card> 
          </Col>
        </Row>
      </Card>
    </>
  )
}
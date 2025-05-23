import { Avatar, Card, Flex, Typography } from "antd";
import pallete from "../../utils/pallete";
import { Icon } from "@iconify/react/dist/iconify.js";
import RenderIf from "../RenderIf";

export default function DashboardCard({ 
  backgroundPrimary = false, 
  showIcon = true,
  title = '-',
  value = '',
  icon = 'hugeicons:image-03'
}){
  return (
    <Card
      styles={{
        body: {
          padding: '18px 21px'
        }
      }}
      style={{ background: backgroundPrimary ? pallete.primary.main : pallete.grey[100], border: !backgroundPrimary && 'none' }} 
    >
      <Flex gap={4} vertical >
        <RenderIf  when={showIcon}>
          <Avatar size={48} style={{ backgroundColor: backgroundPrimary ? '#fff' : pallete.primary.main }} >
            <Icon
              icon={icon}
              color={backgroundPrimary && pallete.primary.main }
              width={26}
              style={{ marginBottom: -5 }}
            />
          </Avatar>
        </RenderIf>
        <Typography.Text style={{ color: backgroundPrimary && '#fff', fontSize: 16, marginTop: 8 }} >
          {title}
        </Typography.Text>
        <Typography.Text style={{ color: backgroundPrimary && '#FBB040', fontSize: 21, fontWeight: 600 }} >
          {value}
        </Typography.Text>
      </Flex>
    </Card> 
  )
}
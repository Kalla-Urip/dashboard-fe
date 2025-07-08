import { Layout, Typography } from "antd";
import pallete from "../utils/pallete";

export default function Footer(){
  return (
    <Layout.Footer
      style={{ backgroundColor: '#fff', padding: '12px 25px' }}
    >
      <Typography.Text style={{ fontSize: 12, color: pallete.grey[600], fontWeight: 400 }} >
        ©2025. Kalla Toyota Urip - All Rights Reserved.
      </Typography.Text>
    </Layout.Footer>
  )
}
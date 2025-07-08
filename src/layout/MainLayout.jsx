import { Breadcrumb, Flex, Layout, Typography } from "antd";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import Footer from "../components/Footer";
import { breadcrumbStore } from "../store/breadcrumbStore";
// import { breadcrumbStore } from "../store/breadcrumbStore";

export default function MainLayout(){

  const { items, title } = breadcrumbStore()
 
  return (
    <Layout style={{ height: '100vh' }} >
      <Sidebar/>
      <Layout style={{ height: '100%' }} >
        <Flex vertical style={{ height: '100%' }} >
          <Header/>
          <Layout.Content style={{ padding: 24, flex: 1, overflow: 'auto' }} >
            <Breadcrumb
              items={items}
              style={{ marginBottom: 8 }}
            />
            <Typography.Title level={4} style={{ marginBottom: 21 }} >
              {title}
            </Typography.Title>
            <Outlet/>
          </Layout.Content>
          <Footer/>
        </Flex>
      </Layout>
    </Layout>
  )
}
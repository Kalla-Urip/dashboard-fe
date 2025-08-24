import { Breadcrumb, Flex, Layout, Typography } from "antd";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router";
import Footer from "../components/Footer";
import { breadcrumbStore } from "../store/breadcrumbStore";
import RenderIf from "../components/RenderIf";
// import { breadcrumbStore } from "../store/breadcrumbStore";

export default function MainLayout(){

  const { items, title } = breadcrumbStore()

  const location = useLocation();
  
  const isUCarePage = location.pathname.includes('/u-care');
 
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
            <RenderIf when={!isUCarePage} >
              <Typography.Title level={4} style={{ marginBottom: 21 }} >
                {title}
              </Typography.Title>
            </RenderIf>
            <Outlet/>
          </Layout.Content>
          <Footer/>
        </Flex>
      </Layout>
    </Layout>
  )
}
import { Icon } from "@iconify/react";
import { Drawer, Flex, Grid, Image, Layout, Menu } from "antd";
import { Link } from "react-router";
import pallete from "../utils/pallete";
import { useAuth } from "../hooks/useAuth";
import { sidebarStore } from "../store/sidebarStore";

const mechanicMenu = () =>  [
  {
    key: "workshop-monitor",
    label: <Link to={'/workshop-monitor'} >Monitor Bengkel</Link>,
    icon: (
      <Icon
        icon="hugeicons:repair"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
]

const branchManagerMenu = collapse => [
  {
    key: "workshop-monitor",
    allowedRoles: ['Super Admin', 'SPV Trust', 'SPV Sales', 'Admin Bengkel'],
    label: <Link to={'/workshop-monitor'} >Monitor Bengkel</Link>,
    icon: (
      <Icon
        icon="hugeicons:repair"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
  {
    key: "cross-selling",
    label: "Cross Selling",
    permission: 'Monitor Trade In',
    allowedRoles: ['Super Admin', 'SPV Trust', 'SPV Sales', 'Admin Bengkel'],
    icon: (
      <Icon
        icon="hugeicons:tire"
        style={{ marginBottom: -1, marginLeft: -5, transform: 'rotate(90deg)' }}
        width="20"
        height="20"
      />
    ),
    children: [
      {
        key: "cross-selling/tire",
        label: <Link to={"cross-selling/tire"}>Ban</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "cross-selling/batterai",
        label: <Link to={"cross-selling/batterai"}>Batterai</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "cross-selling/body-repair",
        label: <Link to={"cross-selling/body-repair"}>Body Repair</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
    ],
  },
  {
    key: "monitor-tradein",
    label: "Monitor Trade In",
    permission: 'Monitor Trade In',
    allowedRoles: ['Super Admin', 'SPV Trust', 'SPV Sales'],
    icon: (
      <Icon
        icon="hugeicons:arrow-up-down"
        style={{ marginBottom: -1, marginLeft: -5, transform: 'rotate(90deg)' }}
        width="20"
        height="20"
      />
    ),
    children: [
      {
        key: "monitor-tradein/assign",
        label: <Link to={"monitor-tradein/assign"}>Assign Trade In</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "monitor-tradein/progress",
        label: <Link to={"monitor-tradein/progress"}>Progress Trade In</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "monitor-tradein/history",
        label: <Link to={"monitor-tradein/history"}>History Trade In</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
    ],
  },
  {
    key: "monitor-cr",
    label: "Monitor CR",
    permission: 'Monitor CR',
    allowedRoles: ['Super Admin'],
    icon: (
      <Icon
        icon="hugeicons:user-group"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
    children: [
      {
        key: "monitor-cr/birthday",
        label: <Link to={"monitor-cr/birthday"}>Ulang Tahun</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "monitor-cr/periodic-service",
        label: <Link to={"monitor-cr/periodic-service"}>Service Berkala</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "monitor-cr/maturity",
        label: <Link to={"monitor-cr/maturity"}>Jatuh Tempo Angsuran</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
    ],
  },
  {
    key: "test-drive",
    allowedRoles: ['Super Admin', 'SPV Sales'],
    label: 'Test Drive',
    icon: (
      <Icon
        icon="hugeicons:car-time"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
    children: [
      {
        key: "test-drive/appoinment",
        label: <Link to={"test-drive/appoinment"}>Daftar Permintaan</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "test-drive/vehicle-type",
        label: <Link to={"test-drive/vehicle-type"}>Daftar Mobil</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "test-drive/history",
        label: <Link to={"test-drive/history"}>Riwayat Test Drive</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
    ],
  },
  {
    key: "data-sales",
    allowedRoles: ['Super Admin', 'SPV Sales'],
    label: <Link to={'/data-sales'} >Data Sales</Link>,
    icon: (
      <Icon
        icon="hugeicons:car-parking-02"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
  {
    key: "data-trust",
    allowedRoles: ['Super Admin', 'SPV Trust'],
    label: <Link to={'/data-trust'} >Data Trust</Link>,
    icon: (
      <Icon
        icon="hugeicons:car-parking-01"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
  {
    key: "customer-rating",
    allowedRoles: ['Super Admin'],
    label: <Link to={'/customer-rating'} >Penilaian Customer</Link>,
    icon: (
      <Icon
        icon="hugeicons:user-star-01"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
  {
    key: "customer-data",
    allowedRoles: ['Super Admin', 'SPV Sales'],
    label: <Link to={'/customer-data'} >Data Kustomer</Link>,
    icon: (
      <Icon
        icon="hugeicons:user-multiple"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
  {
    key: "vehicle-database",
    allowedRoles: ['Super Admin', 'SPV Trust'],
    label: <Link to={'/vehicle-data'} >Database Kendaraan</Link>,
    icon: (
      <Icon
        icon="hugeicons:car-05"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
  },
  {
    key: "master-data",
    label: "Master Data",
    permission: 'Master Data',
    allowedRoles: ['Super Admin'],
    icon: (
      <Icon
        icon="hugeicons:database"
        style={{ marginBottom: -1, marginLeft: -5 }}
        width="20"
        height="20"
      />
    ),
    children: [
      {
        key: "master-data/user-role",
        label: <Link to={"master-data/user-role"}>User Role</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "master-data/vehicle-type",
        label: <Link to={"master-data/vehicle-type"}>Tipe Mobil</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
      {
        key: "master-data/stall",
        label: <Link to={"master-data/stall"}>Stall</Link>,
        icon: <SubmenuIcon collapse={collapse} />
      },
    ],
  },
]

function SubmenuIcon({ collapse }) {
  return (
    <Icon
      icon="pepicons-pencil:circle"
      style={
        collapse
        ? { marginBottom: -9, marginLeft: -10, marginRight: 0 }
        : { marginBottom: -1, marginLeft: -26, marginRight: 11 }
      }
      width="12"
      height="12"
    />
  )
}

export default function Sidebar() {

  const breakpoint = Grid.useBreakpoint()

  const { user } = useAuth()

  const { collapse, drawerCollapse, toggleDrawer } = sidebarStore(state => state)

  const showMenuItems = role => {
    if(role == 'Admin Bengkel'){
      return mechanicMenu()
    }
    return branchManagerMenu(collapse).filter(e => e.allowedRoles.includes(role))
  }

  return (
    <>
      {
        breakpoint.md
        &&
        <Layout.Sider
          style={{
            paddingTop: 20,
            backgroundColor: "#fff",
            paddingLeft: 4,
            paddingRight: 4,
            borderRight: "1px solid " + pallete.grey[200],
            height: '100%',
          }}
          width={240}
          collapsed={collapse}
        >
          <Flex vertical style={{ height: '100%' }} >
            <Flex justify="center" >
              <Image src={'/logo.svg'} style={{ marginBottom: 20 }} width={ !collapse ? 160 : 50} preview={false} />
            </Flex>
            <Menu
              items={[
                {
                  key: "dashboard",
                  label: <Link to={"/"}>Dashboard</Link>,
                  icon: (
                    <Icon
                      icon="hugeicons:dashboard-square-02"
                      style={{ marginBottom: -1, marginLeft: -5 }}
                      width="22"
                      height="22"
                    />
                  ),
                },
                ...showMenuItems(user?.user?.employeeType)
              ]}
              style={{ borderRight: "none", fontWeight: 400, overflowY: 'auto', flex: 1 }}
              mode="inline"
            />
          </Flex>
        </Layout.Sider>
      }
      <Drawer
        open={drawerCollapse}
        placement="left"
        closable={false}
        width={280}
        styles={{
          body: {
            padding: '14px 6px'
          }
        }}
        onClose={toggleDrawer}
      >
        <Flex vertical style={{ height: '100%' }} >
          <Flex justify="center" >
            <Image src={'/logo.svg'} style={{ marginBottom: 20 }} width={ !collapse ? 60 : 45} preview={false} />
          </Flex>
          <Menu
            items={showMenuItems(user?.user?.employeeType)}
            style={{ borderRight: "none", fontWeight: 400, overflowY: 'auto', flex: 1 }}
            // defaultSelectedKeys={getSelectedKey()}
            // defaultOpenKeys={getOpenKey()}
            mode="inline"
            onClick={toggleDrawer}
          />
        </Flex>
      </Drawer>
    </>
  );
}
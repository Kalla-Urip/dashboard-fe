import { Avatar, Button, Dropdown, Flex, Grid, Layout, Typography } from "antd";
import pallete from "../utils/pallete";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/useAuth";
import { sidebarStore } from "../store/sidebarStore";
import RenderIf from "./RenderIf";
import { useNavigate } from "react-router";

export default function Header(){

	const navigate = useNavigate()

	const { user, logout } = useAuth()
	const { toggleCollapse, collapse, toggleDrawer } = sidebarStore(state => state)

	const breakpoint = Grid.useBreakpoint()

  return (
    <Layout.Header
			style={{ 
				borderBottom: '1px solid ' + pallete.grey[200],
				paddingRight: 24,
				paddingLeft: 24,
        backgroundColor: '#fff'
			}}
		>
			<Flex align="center" style={{ height: '100%' }} >
				<RenderIf when={breakpoint.md} >
					<Button
						style={{ marginRight: 18 }}
						icon={
							<Icon
								icon={`solar:double-alt-arrow-${!collapse ? 'left' : 'right'}-line-duotone`}
								height={18}
								width={18}
								style={{ marginBottom: -2 }}
							/>
						}
						onClick={toggleCollapse}
					/>
				</RenderIf>
				<RenderIf when={!breakpoint.md} >
					<Button
						style={{ marginRight: 18 }}
						icon={
							<Icon
								icon={`solar:hamburger-menu-line-duotone`}
								height={18}
								width={18}
								style={{ marginBottom: -2 }}
							/>
						}
						onClick={toggleDrawer}
					/>
				</RenderIf>
				<Dropdown
					menu={{
						items: [
							{
								key: 'profile',
								label: 'Profile',
								icon: <Icon icon="bx:bx-user" style={{ color: pallete.grey[600] }} />,
								onClick: () => navigate('/profile')
							},
							{
								type: 'divider'
							},
							{
								key: 'logout',
								label: 'Logout',
								icon: <Icon icon="hugeicons:login-02" width="18" height="18" />,
								danger: true,
								onClick: logout
							}
						],
					}}
				>
					<Flex align="center" gap={8} style={{ cursor: 'pointer', marginLeft: 'auto', }} >
						<Avatar shape="square" style={{ backgroundColor: pallete.primary.main, color: '#fff'}} >
							{user?.user?.name[0]}
						</Avatar>
						{
							breakpoint.md
							&&
							<Flex vertical >
								<Typography.Text style={{ fontSize: 12, fontWeight: 700 }} >
									{user?.user?.name}
								</Typography.Text>
								<Typography.Text style={{ fontSize: 11, fontWeight: 500, color: pallete.grey[600] }} >
									{user?.user?.employeeType}
								</Typography.Text>
							</Flex>
						}
					</Flex>
				</Dropdown>
			</Flex>
		</Layout.Header>
  )
}
import React, { useState, useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import axiosClient from '../axios-client'
import ProtectedLink from './ProtectedLink'
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const ProtectedMenuItem = ({ to, requiredAccess, icon, label, ...props }) => {
    const { user } = useStateContext();
  
    // Always display if no access is required
    const hasAccess = !requiredAccess || (user && user.accesses && user.accesses.some(access => access.akses === requiredAccess));
  
    if (!hasAccess) {
      return null;
    }
  
    return (
      <Menu.Item key={props.key} icon={icon} onClick={() => props.onClick({ key: props.key })}>
        <Link to={to}>{label}</Link>
      </Menu.Item>
    );
  };

const DefaultLayout2 = () => {
    const { user, token, notification, setUser, setToken, setNotification } = useStateContext()
    if (!token) {
        return <Navigate to="/login" />
    }
    const navigate = useNavigate();

    const onLogout = (e) => {
        e.preventDefault()

        axiosClient.post('/logout')
            .then(() => {
                setUser({})
                setToken(null)
            })
    }

    const onClick = (e) => {
        const item = menus.find(item => item.key === e.key);
        setBreadcrumMenu(item.label)
        if (item) {
            navigate(item.path)
        }
    }

    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data)
            })
    }, [])

    const menus = [
        {
          key: '1',
          label: 'Dashboard',
          icon: <PieChartOutlined />,
          path: '/dashboard',
          access: null  // No access required for this item
        },
        {
          key: '2',
          label: 'Users',
          icon: <DesktopOutlined />,
          path: '/users',
          access: 'userManagement'  // Specify the required access for this menu item
        }
      ];
    const [collapsed, setCollapsed] = useState(false);
    const [breadcrumMenu, setBreadcrumMenu] = useState([]);
    const [breadcrumMenuItem, setBreadcrumMenuItem] = useState([]);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={onClick}>
          {menus.map(menu => (
            <ProtectedMenuItem
              key={menu.key}
              to={menu.path}
              requiredAccess={menu.access}
              icon={menu.icon}
              label={menu.label}
              onClick={onClick}
            />
          ))}
        </Menu>
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <div> {user ? user.name : ""}  &nbsp; &nbsp;
                        <a onClick={onLogout} className="btn-logout" href="#">Logout</a> </div>
                </Header>
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        items={[
                            {
                                href: '/dashboard',
                                title: <FileOutlined />,
                            },
                            {
                                href: '',
                                title: (
                                    <>
                                        <span>{breadcrumMenu}</span>
                                    </>
                                ),
                            },
                            {
                                title: 'Application',
                            },
                        ]}
                    />
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default DefaultLayout2;
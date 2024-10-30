import React, { useState, useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';
import {
    DesktopOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    NotificationOutlined,
    SettingOutlined,
    ApartmentOutlined,
    AuditOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Layout, Menu, theme, Row, Col, Button, Dropdown, Skeleton, Flex } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const ProtectedMenuItem = ({ key, to, requiredAccess, icon, label, children, style }) => {
    const { user } = useStateContext();

    const hasAccess = !requiredAccess || (user && user.accesses && user.accesses.some(access => access.role === requiredAccess));

    if (!hasAccess) {
        return null;
    }

    return {
        key,
        icon,
        label: to ? <Link to={to}>{label}</Link> : label,
        children,
        style,
    };
};

const DefaultLayout2 = () => {
    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axiosClient.get('/user')
                .then(({ data }) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    setToken(null);
                    navigate('/landing');
                });
        } else {
            navigate('/landing');
            setToken(null);
            setLoading(false);
        }
    }, [token]);

    const onLogout = () => {
        axiosClient.post('/logout')
            .then(() => {
                setUser(null);
                setToken(null);
                navigate('/landing');
            })
            .catch(error => {
                console.error("Logout error:", error);
            });
    };

    const onClick = (e) => {
        const item = findMenuItem(menus, e.key);
        if (item) {
            navigate(item.path);
        }
    };

    const findMenuItem = (menus, key) => {
        for (const menu of menus) {
            if (menu.key === key) {
                return menu;
            }
            if (menu.children) {
                const found = findMenuItem(menu.children, key);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    const menus = [
        {
            key: '0',
            access: null,
            style: {
                height: '60px', marginBottom: '30px', backgroundColor: '#001529'
            }
        },
        {
            key: '1',
            label: 'Dashboard',
            icon: <PieChartOutlined />,
            path: '/dashboard',
            access: null,
            style: {}
        },
        {
            key: '2',
            label: 'Pilih Loket',
            icon: <DesktopOutlined />,
            path: '/loket',
            access: 'Petugas Loket'
        },
        {
            key: '3',
            label: 'Antrian',
            icon: <NotificationOutlined />,
            path: '/antrian',
            access: 'Petugas Loket'
        },
        {
            key: '4',
            label: 'Setting',
            icon: <SettingOutlined />,
            access: 'Admin',
            children: [
                {
                    key: '4-1',
                    label: 'Setting Layanan',
                    icon: <ApartmentOutlined />,
                    path: '/setting/layanan',
                    access: 'Admin'
                },
                {
                    key: '4-2',
                    label: 'Setting Loket',
                    icon: <AuditOutlined />,
                    path: '/setting/loket',
                    access: 'Admin'
                },
                {
                    key: '4-3',
                    label: 'Setting User',
                    icon: <TeamOutlined />,
                    path: '/setting/user',
                    access: 'Admin'
                }
            ]
        },
        {
            key: '5',
            label: 'Riwayat Antrian',
            icon: <HistoryOutlined />,
            path: '/riwayat'
        },
        {
            key: 'sub1',
            label: 'Team',
            icon: <TeamOutlined />,
            access: 'userManagement',
            children: [
                {
                    key: 'sub1-1',
                    label: 'Team 1',
                    path: '/team1',
                    access: 'userManagement'
                },
                {
                    key: 'sub1-2',
                    label: 'Team 2',
                    path: '/team2',
                    access: 'userManagement'
                }
            ]
        }
    ];

    const protectedMenus = menus.map(menu => ProtectedMenuItem({
        key: menu.key,
        to: menu.path,
        requiredAccess: menu.access,
        icon: menu.icon,
        label: menu.label,
        style: menu.style,
        children: menu.children ? menu.children.map(subMenu => ProtectedMenuItem({
            key: subMenu.key,
            to: subMenu.path,
            requiredAccess: subMenu.access,
            icon: subMenu.icon,
            label: subMenu.label,
        })) : undefined
    })).filter(menu => menu !== null);

    const items = [
        {
            label: 'Profile',
            key: '1',
            onClick: () => navigate('/profile')
        },
        {
            label: 'Logout',
            key: '2',
            onClick: onLogout
        }
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    if (loading) {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: 16,
                            background: colorBgContainer,
                        }}
                    >
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <Flex justify="end" align="center">
                                    <Button type="primary" icon={<UserOutlined />} size="large" />
                                </Flex>
                            </Col>
                        </Row>
                    </Header>
                    <Content
                        style={{
                            margin: '0 16px',
                        }}
                    >
                        <Skeleton active />
                    </Content>
                    <Footer style={{ textAlign: 'center', backgroundColor: '#D9D9D9', padding: '15px 50px' }}>
                        &nbsp;
                    </Footer>
                </Layout>
            </Layout>
        );
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={[menus.find(menu => menu.path === location.pathname)?.key]}
                    mode="inline"
                    items={protectedMenus}
                    onClick={onClick}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 16,
                        background: colorBgContainer,
                    }}
                >
                    <Row>
                        <Col span={12}></Col>
                        <Col span={12}>
                            <Flex justify="end" align="center">
                                <Dropdown
                                    menu={{
                                        items,
                                    }}
                                    trigger={['click']}
                                >
                                    <Button type="primary" icon={<UserOutlined />} size="large" />
                                </Dropdown>
                            </Flex>
                        </Col>
                    </Row>
                </Header>
                <Content
                    style={{
                        margin: '30px 16px',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            minHeight: 500,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', backgroundColor: '#D9D9D9', padding: '15px 50px' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout2;

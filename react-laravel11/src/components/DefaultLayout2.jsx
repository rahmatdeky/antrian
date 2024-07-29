import React, { useState, useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';
import {
    DesktopOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Row, Col, Button, Dropdown, Skeleton, Flex } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

const ProtectedMenuItem = ({ key, to, requiredAccess, icon, label, children }) => {
    const { user } = useStateContext();

    const hasAccess = !requiredAccess || (user && user.accesses && user.accesses.some(access => access.akses === requiredAccess));

    if (!hasAccess) {
        return null;
    }

    return {
        key,
        icon,
        label: to ? <Link to={to}>{label}</Link> : label,
        children,
    };
};

const DefaultLayout2 = () => {
    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
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
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const onLogout = () => {
        axiosClient.post('/logout')
            .then(() => {
                setUser(null);
                setToken(null);
                navigate('/login');
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
            key: '1',
            label: 'Dashboard',
            icon: <PieChartOutlined />,
            path: '/dashboard',
            access: null
        },
        {
            key: '2',
            label: 'Users',
            icon: <DesktopOutlined />,
            path: '/users',
            access: 'userManagement'
        },
        {
            key: 'sub1',
            label: 'Team',
            icon: <TeamOutlined />,
            access: 'userManagement',
            children: [
                {
                    key: '3',
                    label: 'Team 1',
                    path: '/team1',
                    access: 'userManagement'
                },
                {
                    key: '4',
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
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©{new Date().getFullYear()} Created by Ant UED
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
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};

export default DefaultLayout2;

import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout as AntLayout, Menu } from 'antd';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

export const Layout = (props: { children: React.ReactElement }) => {

    const [auth, setAuth] = useContext(AuthContext);
    const [api, setApi] = useState(localStorage.getItem('api') || 'rest');
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
    const { Header, Content, Sider } = AntLayout;

    const handleChangeApi = (value: string) => {
        setApi(value);
        localStorage.setItem('api', value);
        location.replace('/');
    };

    const handleChangeLanguage = (value: string) => {
        setLanguage(value);
        localStorage.setItem('language', value);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        setAuth({
            upn: '',
            groups: []
        });
    };

    const getUserLinks = () => {
        if (auth.upn) {
            return [
                {
                    key: 'logout',
                    label: <span onClick={handleLogout}>Logout</span>
                }
            ];
        } else {
            return [
                {
                    key: 'login',
                    label: <Link to="/login">Login</Link>
                },
                {
                    key: 'register',
                    label: <Link to="/register">Register</Link>
                }
            ]
        }
    }

    const sideItems: MenuProps['items'] = [
        {
            key: 'user',
            icon: React.createElement(UserOutlined),
            label: auth.upn || 'Guest',
            children: getUserLinks()
        }
    ];

    const topItems: MenuProps['items'] = [
        {
            label: 'Settings',
            key: 'settings',
            icon: <SettingOutlined/>,
            children: [
                {
                    type: 'group',
                    label: 'API',
                    children: [
                        {
                            label: 'REST',
                            key: 'rest',
                            onClick: () => handleChangeApi('rest')
                        },
                        {
                            label: 'GraphQL',
                            key: 'graphql',
                            onClick: () => handleChangeApi('graphql')
                        },
                        {
                            label: 'gRPC',
                            key: 'grpc',
                            onClick: () => handleChangeApi('grpc')
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: 'group',
                    label: 'Language',
                    children: [
                        {
                            label: 'EN',
                            key: 'en',
                            onClick: () => handleChangeLanguage('en')
                        },
                        {
                            label: 'PL',
                            key: 'pl',
                            onClick: () => handleChangeLanguage('pl')
                        }
                    ]
                }
            ]
        }
    ];

    return (
        <AntLayout style={{minHeight: '100vh'}}>
            <Header className="header">
                <Link to="/" className="logo">API Comparison</Link>
                <Menu theme="dark" mode="horizontal" selectedKeys={[api, language]} items={topItems} disabledOverflow/>
            </Header>
            <AntLayout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{height: '100%', borderRight: 0}}
                        items={sideItems}
                    />
                </Sider>
                <AntLayout style={{padding: '0 24px 24px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {props.children}
                    </Content>
                </AntLayout>
            </AntLayout>
        </AntLayout>
    );
};

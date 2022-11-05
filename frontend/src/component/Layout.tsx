import { SettingOutlined, UserOutlined } from '@ant-design/icons';
import { AccessLevel, AccessLevelContext } from '@context/AccessLevelContext';
import { Api, ApiContext } from '@context/ApiContext';
import { AuthContext } from '@context/AuthContext';
import type { MenuProps } from 'antd';
import { Layout as AntLayout, Menu } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import Cookies from 'js-cookie';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = AntLayout;

export const Layout = (props: { children: React.ReactElement }) => {

    const navigate = useNavigate();
    const [auth, setAuth] = useContext(AuthContext);
    const [accessLevel, setAccessLevel] = useContext(AccessLevelContext);
    const [api, setApi] = useContext(ApiContext);

    const handleChangeAccessLevel = (value: AccessLevel) => {
        setAccessLevel(value);
        navigate('/', {replace: true});
    };

    const handleChangeApi = (value: Api) => {
        localStorage.setItem('api', value);
        setApi(value);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        setAuth({
            upn: '',
            groups: [],
            iat: 0,
            exp: 0
        });
        navigate('/', {replace: true});
    };

    const getUserItems = (): ItemType[] => {
        if (auth.upn) {
            const logout = {
                key: 'logout',
                label: <span onClick={handleLogout}>Logout</span>
            };
            if (accessLevel === 'admin') {
                return [
                    {
                        key: 'addAccount',
                        label: <Link to="/addAccount">Add account</Link>
                    },
                    {
                        key: 'listAccounts',
                        label: <Link to="/accounts">List accounts</Link>
                    },
                    logout
                ];
            } else {
                return [
                    logout
                ];
            }
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
    };

    const getSideItems = (): MenuProps['items'] => {
        const user = {
            key: 'user',
            icon: React.createElement(UserOutlined),
            label: auth.upn || 'Guest',
            children: getUserItems(),
        };

        if (auth.groups.length > 1) {
            return [
                user,
                {
                    label: accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1),
                    key: 'accessLevel',
                    children: [
                        {
                            type: 'group',
                            label: 'Access level',
                            children: [
                                {
                                    label: 'Admin',
                                    key: 'Admin',
                                    onClick: () => handleChangeAccessLevel('admin')
                                },
                                {
                                    label: 'Client',
                                    key: 'Client',
                                    onClick: () => handleChangeAccessLevel('client')
                                }
                            ]
                        }
                    ]
                }
            ]
        } else {
            return [user];
        }
    }

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
                }
            ]
        }
    ];

    return (
        <AntLayout style={{minHeight: '100vh'}}>
            <Header className="header">
                <Link to="/" className="logo">
                    <img src="src/image/favicon.svg" alt="logo" width="48px" height="48px"/>
                    <span>API Comparison</span>
                </Link>
                <Menu theme="dark" mode="horizontal" items={topItems} selectedKeys={[api]} disabledOverflow/>
            </Header>
            <AntLayout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultOpenKeys={['user']}
                        style={{height: '100%', borderRight: 0}}
                        items={getSideItems()}
                        selectedKeys={[accessLevel]}
                    />
                </Sider>
                <AntLayout style={{padding: '0 24px 24px'}}>
                    {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
                    {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}
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

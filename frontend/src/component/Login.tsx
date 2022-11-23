import { AccessLevel, AccessLevelContext } from '@context/AccessLevelContext';
import { AuthContext, Token } from '@context/AuthContext';
import { LoginDto } from '@dto/LoginDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message, PageHeader } from 'antd';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { Fragment, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

    const navigate = useNavigate();
    const [, setAuth] = useContext(AuthContext);
    const [, setAccessLevel] = useContext(AccessLevelContext);
    const [loginDto, setLoginDto] = useState<LoginDto>(new LoginDto());
    const accountService = AccountServiceFactory.getAccountService();

    const onFinish = async () => {
        const [data, error] = await accountService.login(loginDto);
        if (data) {
            message.success('Login successful');
            const decoded = jwt_decode(data) as Token;
            Cookies.set('token', data, {expires: (decoded.exp - decoded.iat)/86400});
            decoded.groups.sort((a, b) => a.localeCompare(b));
            setAuth(decoded);
            setAccessLevel(decoded.groups[0] as AccessLevel);
            navigate('/', {replace: true});
        }
        if (error) {
            message.error(error);
        }
    };

    return (
        <Fragment>
            <PageHeader
                className="site-page-header"
                title="Login"
            />
            <Form
                name="login"
                autoComplete="off"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                colon={false}
                requiredMark={false}
                validateMessages={{
                    required: '${label} is required',
                    whitespace: '${label} cannot be empty'
                }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true}, {whitespace: true}]}
                >
                    <Input autoFocus
                           value={loginDto.username}
                           onChange={event => setLoginDto({...loginDto, username: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true}, {whitespace: true}]}
                >
                    <Input.Password value={loginDto.password}
                                    onChange={event => setLoginDto({...loginDto, password: event.target.value})}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Fragment>
    );
};

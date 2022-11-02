import React, { useContext, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { LoginDto } from '@dto/LoginDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { AuthContext } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {

    const navigate = useNavigate();
    const [, setAuth] = useContext(AuthContext);
    const [loginDto, setLoginDto] = useState(new LoginDto());
    const accountService = AccountServiceFactory.getAccountService();

    const onFinish = async () => {
        const [data, error] = await accountService.login(loginDto);
        if (data) {
            message.success('Action completed successfully');
            Cookies.set('token', data);
            setAuth(jwt_decode(data));
            navigate('/', {replace: true});
        }
        if (error) {
            message.error(error);
            // Modal.error({content: error});
        }
    };

    const onFinishFailed = () => {
        console.log('failed');
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input type='text' value={loginDto.username}
                       onChange={event => setLoginDto({...loginDto, username: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password type='text' value={loginDto.password}
                                onChange={event => setLoginDto({...loginDto, password: event.target.value})}/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

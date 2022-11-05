import { RegisterDto } from '@dto/RegisterDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {

    const navigate = useNavigate();
    const [registerDto, setRegisterDto] = useState(new RegisterDto());
    const accountService = AccountServiceFactory.getAccountService();

    const onFinish = async () => {
        const [data, error] = await accountService.register(registerDto);
        if (data) {
            message.success('Action completed successfully');
            navigate('/', {replace: true});
        }
        if (error) {
            message.error(error);
        }
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input type='text' value={registerDto.username}
                       onChange={event => setRegisterDto({...registerDto, username: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password type='text' value={registerDto.password}
                                onChange={event => setRegisterDto({...registerDto, password: event.target.value})}/>
            </Form.Item>

            <Form.Item
                label="Confirm password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Please input your password confirmation!' }]}
            >
                <Input.Password type='text' value={registerDto.confirmPassword}
                                onChange={event => setRegisterDto({...registerDto, confirmPassword: event.target.value})}/>
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input type='text' value={registerDto.email}
                       onChange={event => setRegisterDto({...registerDto, email: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="First name"
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
            >
                <Input type='text' value={registerDto.firstName}
                       onChange={event => setRegisterDto({...registerDto, firstName: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="Last name"
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
            >
                <Input type='text' value={registerDto.lastName}
                       onChange={event => setRegisterDto({...registerDto, lastName: event.target.value})}
                />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

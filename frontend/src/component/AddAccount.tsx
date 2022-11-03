import { AddAccountDto } from '@dto/AddAccountDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddAccount = () => {

    const navigate = useNavigate();
    const [addAccountDto, setAddAccountDto] = useState(new AddAccountDto());
    const accountService = AccountServiceFactory.getAccountService();

    const onFinish = async () => {
        const [data, error] = await accountService.addAccount(addAccountDto);
        if (data) {
            message.success('Action completed successfully');
            navigate('/', {replace: true});
        }
        if (error) {
            message.error(error);
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
                <Input type='text' value={addAccountDto.username}
                       onChange={event => setAddAccountDto({...addAccountDto, username: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password type='text' value={addAccountDto.password}
                                onChange={event => setAddAccountDto({...addAccountDto, password: event.target.value})}/>
            </Form.Item>

            <Form.Item
                label="Confirm password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Please input your password confirmation!' }]}
            >
                <Input.Password type='text' value={addAccountDto.confirmPassword}
                                onChange={event => setAddAccountDto({...addAccountDto, confirmPassword: event.target.value})}/>
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input type='text' value={addAccountDto.email}
                       onChange={event => setAddAccountDto({...addAccountDto, email: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="First name"
                name="firstName"
                rules={[{ required: true, message: 'Please input your first name!' }]}
            >
                <Input type='text' value={addAccountDto.firstName}
                       onChange={event => setAddAccountDto({...addAccountDto, firstName: event.target.value})}
                />
            </Form.Item>

            <Form.Item
                label="Last name"
                name="lastName"
                rules={[{ required: true, message: 'Please input your last name!' }]}
            >
                <Input type='text' value={addAccountDto.lastName}
                       onChange={event => setAddAccountDto({...addAccountDto, lastName: event.target.value})}
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

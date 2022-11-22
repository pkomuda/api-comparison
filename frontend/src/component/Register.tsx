import { RegisterDto } from '@dto/RegisterDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message, PageHeader } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Register = () => {

    const navigate = useNavigate();
    const [registerDto, setRegisterDto] = useState<RegisterDto>(new RegisterDto());
    const accountService = AccountServiceFactory.getAccountService();

    const onFinish = async () => {
        const [data, error] = await accountService.register(registerDto);
        if (data) {
            message.success('Registered successfully');
            navigate('/', {replace: true});
        }
        if (error) {
            message.error(error);
        }
    };

    return (
        <React.Fragment>
            <PageHeader
                className="site-page-header"
                title="Register"
            />
            <Form
                name="register"
                autoComplete="off"
                onFinish={onFinish}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 10 }}
                colon={false}
                requiredMark={false}
                validateMessages={{
                    required: '${label} is required',
                    whitespace: '${label} cannot be empty',
                    string: {
                        min: '${label} must be at least ${min} characters',
                        max: '${label} cannot be longer than ${max} characters'
                    },
                    types: {
                        email: '${label} is not a valid email'
                    }
                }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input autoFocus
                           value={registerDto.username}
                           onChange={event => setRegisterDto({...registerDto, username: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true}, {whitespace: true}, {min: 8}, {max: 32}]}
                >
                    <Input.Password value={registerDto.password}
                                    onChange={event => setRegisterDto({...registerDto, password: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Password confirmation"
                    name="confirmPassword"
                    rules={[
                        {required: true}, {whitespace: true}, {min: 8}, {max: 32},
                        ({getFieldValue}) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Passwords must be matching'));
                            }
                        })
                    ]}
                >
                    <Input.Password value={registerDto.confirmPassword}
                                    onChange={event => setRegisterDto({...registerDto, confirmPassword: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true}, {whitespace: true}, {max: 32}, {type: 'email'}]}
                >
                    <Input value={registerDto.email}
                           onChange={event => setRegisterDto({...registerDto, email: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input value={registerDto.firstName}
                           onChange={event => setRegisterDto({...registerDto, firstName: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input value={registerDto.lastName}
                           onChange={event => setRegisterDto({...registerDto, lastName: event.target.value})}/>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

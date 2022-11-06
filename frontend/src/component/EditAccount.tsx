import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message, PageHeader, Select, SelectProps, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditAccount = () => {

    const navigate = useNavigate();
    const { username } = useParams();
    const [form] = useForm();
    const [accountDetailsDto, setAccountDetailsDto] = useState<AccountDetailsDto>(new AccountDetailsDto());
    const accountService = AccountServiceFactory.getAccountService()

    const getAccount = useCallback(async () => {
        const [data, ] = await accountService.getAccount(username);
        setAccountDetailsDto(data);
        form.setFieldsValue(data)
    }, []);

    useEffect(() => {
        getAccount().then(() => {});
    }, [getAccount]);

    const onFinish = async () => {
        const [data, error] = await accountService.editAccount(username, accountDetailsDto);
        if (data) {
            message.success('Account edited successfully');
            navigate('/accounts', {replace: true});
        }
        if (error) {
            message.error(error);
        }
    };

    const accessLevels: SelectProps['options'] = [
        {
            label: 'Admin',
            value: 'admin'
        },
        {
            label: 'Client',
            value: 'client'
        }
    ];

    return (
        <React.Fragment>
            <PageHeader
                className="site-page-header"
                title="Edit account"
            />
            <Form
                name="editAccount"
                autoComplete="off"
                form={form}
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
                    }
                }}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input disabled={true}
                           value={accountDetailsDto.username}
                           onChange={event => setAccountDetailsDto({...accountDetailsDto, username: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true}, {whitespace: true}, {max: 32}, {type: 'email'}]}
                >
                    <Input disabled={true}
                           value={accountDetailsDto.email}
                           onChange={event => setAccountDetailsDto({...accountDetailsDto, email: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input autoFocus
                           value={accountDetailsDto.firstName}
                           onChange={event => setAccountDetailsDto({...accountDetailsDto, firstName: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input value={accountDetailsDto.lastName}
                           onChange={event => setAccountDetailsDto({...accountDetailsDto, lastName: event.target.value})}/>
                </Form.Item>

                <Form.Item
                    label="Access levels"
                    name="accessLevels"
                    rules={[{required: true, message: 'At least one access level is required'}]}
                >
                    <Select
                        showArrow
                        mode="multiple"
                        options={accessLevels}
                        value={accountDetailsDto.accessLevels}
                        onChange={value => setAccountDetailsDto({...accountDetailsDto, accessLevels: value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Active"
                    name="active"
                    rules={[{required: true}]}
                >
                    <Switch checked={accountDetailsDto.active}
                            onChange={value => setAccountDetailsDto({...accountDetailsDto, active: value})}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

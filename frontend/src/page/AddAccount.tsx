import { AddAccountDto } from '@dto/AddAccountDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message, PageHeader, Select, SelectProps, Switch } from 'antd';
import { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AddAccount = () => {

    const navigate = useNavigate();
    const [addAccountDto, setAddAccountDto] = useState<AddAccountDto>(() => {
        const dto = new AddAccountDto();
        dto.active = true;
        dto.accessLevels = ['client'];
        return dto;
    });
    const accountService = AccountServiceFactory.getAccountService()

    const onFinish = async () => {
        const [data, error] = await accountService.addAccount(addAccountDto);
        if (data) {
            message.success('Account added successfully');
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
        <Fragment>
            <PageHeader
                className="site-page-header"
                title="Add account"
            />
            <Form
                name="addAccount"
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
                           value={addAccountDto.username}
                           onChange={event => setAddAccountDto({...addAccountDto, username: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true}, {whitespace: true}, {min: 8}, {max: 32}]}
                >
                    <Input.Password value={addAccountDto.password}
                                    onChange={event => setAddAccountDto({...addAccountDto, password: event.target.value})}
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
                    <Input.Password value={addAccountDto.confirmPassword}
                                    onChange={event => setAddAccountDto({...addAccountDto, confirmPassword: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{required: true}, {whitespace: true}, {max: 32}, {type: 'email'}]}
                >
                    <Input value={addAccountDto.email}
                           onChange={event => setAddAccountDto({...addAccountDto, email: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="First name"
                    name="firstName"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input value={addAccountDto.firstName}
                           onChange={event => setAddAccountDto({...addAccountDto, firstName: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Last name"
                    name="lastName"
                    rules={[{required: true}, {whitespace: true}, {max: 32}]}
                >
                    <Input value={addAccountDto.lastName}
                           onChange={event => setAddAccountDto({...addAccountDto, lastName: event.target.value})}/>
                </Form.Item>

                <Form.Item
                    label="Access levels"
                    name="accessLevels"
                    initialValue={addAccountDto.accessLevels}
                    rules={[{required: true, message: 'At least one access level is required'}]}
                >
                    <Select
                        showArrow
                        mode="multiple"
                        options={accessLevels}
                        value={addAccountDto.accessLevels}
                        onChange={value => setAddAccountDto({...addAccountDto, accessLevels: value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Active"
                    name="active"
                    initialValue={addAccountDto.active}
                    rules={[{required: true}]}
                >
                    <Switch checked={addAccountDto.active}
                            onChange={value => setAddAccountDto({...addAccountDto, active: value})}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Fragment>
    );
};

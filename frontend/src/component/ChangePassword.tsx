import { AuthContext } from "@context/AuthContext";
import { AddAccountDto } from "@dto/AddAccountDto";
import { ChangePasswordDto } from "@dto/ChangePasswordDto";
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Form, Input, message, PageHeader } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ChangePassword = () => {

    const navigate = useNavigate();
    const [auth, ] = useContext(AuthContext);
    const [changePasswordDto, setChangePasswordDto] = useState<ChangePasswordDto>(() => {
        const dto = new ChangePasswordDto();
        dto.username = auth.upn;
        return dto;
    });
    const accountService = AccountServiceFactory.getAccountService();

    const onFinish = async () => {
        const [data, error] = await accountService.changePassword(changePasswordDto);
        if (data) {
            message.success('Password changed successfully');
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
                title="Change password"
            />
            <Form
                name="changePassword"
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
                    }
                }}
            >
                <Form.Item
                    label="Previous password"
                    name="previousPassword"
                    rules={[{required: true}, {whitespace: true}]}
                >
                    <Input.Password autoFocus
                                    value={changePasswordDto.previousPassword}
                                    onChange={event => setChangePasswordDto({...changePasswordDto, previousPassword: event.target.value})}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{required: true}, {whitespace: true}, {min: 8}, {max: 32}]}
                >
                    <Input.Password value={changePasswordDto.password}
                                    onChange={event => setChangePasswordDto({...changePasswordDto, password: event.target.value})}
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
                    <Input.Password value={changePasswordDto.confirmPassword}
                                    onChange={event => setChangePasswordDto({...changePasswordDto, confirmPassword: event.target.value})}
                    />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 10 }}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

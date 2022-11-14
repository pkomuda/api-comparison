import { LoadingOutlined } from '@ant-design/icons';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { message, Spin } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

export const ConfirmAccount = () => {

    const { token } = useParams();
    const navigate = useNavigate();
    const accountService = AccountServiceFactory.getAccountService()

    const confirmAccount = useCallback(async () => {
        const [data, error] = await accountService.confirmAccount(token);
        if (data) {
            message.success('Account confirmed successfully');
        }
        if (error) {
            message.error(error);
        }
        navigate('/', {replace: true});
    }, []);

    useEffect(() => {
        confirmAccount().then(() => {});
    }, [confirmAccount]);

    return (
        <Spin indicator={<LoadingOutlined style={{fontSize: 24}} spin/>}/>
    );
};

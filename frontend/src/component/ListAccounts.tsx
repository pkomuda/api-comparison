import { SearchOutlined } from '@ant-design/icons';
import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Input, PageHeader, Table, TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ListAccounts = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [accountPagesDto, setAccountPagesDto] = useState<AccountPagesDto>(new AccountPagesDto());
    const [query, setQuery] = useState<string>(searchParams.get('query') || '');
    const [sort, setSort] = useState<string>(searchParams.get('sort') || '');
    const [dir, setDir] = useState<'asc' | 'desc'>(searchParams.get('dir') as ('asc' | 'desc') || 'asc');
    const [page, setPage] = useState<number>(parseInt(searchParams.get('page')) || 1);
    const [size, setSize] = useState<number>(parseInt(searchParams.get('size')) || 3);
    const accountService = AccountServiceFactory.getAccountService()

    const getAccounts = useCallback(async () => {
        const [data, ] = await accountService.getAccounts(query, sort, dir, page - 1, size);
        if (data) {
            data.content.forEach((account, index) => {
                account.key = size * (page - 1) + index + 1;
            });
            setAccountPagesDto(data);
        }
    }, [query, sort, dir, page, size]);

    useEffect(() => {
        getAccounts().then(() => {});
    }, []);

    useEffect(() => {
        getAccounts().then(() => {});
    }, [getAccounts]);

    const handleChangeQuery = (value: string) => {
        setQuery(value);
        const params = searchParams;
        params.set('query', value);
        setSearchParams(params);
    };

    const handleChangeSort = (value: string) => {
        setSort(value);
        const params = searchParams;
        params.set('sort', value);
        setSearchParams(params);
    };

    const handleChangeDir = (value: 'asc' | 'desc') => {
        setDir(value);
        const params = searchParams;
        params.set('dir', value);
        setSearchParams(params);
    };

    const handleChangeTable = (pagination: TablePaginationConfig,
                               filters: Record<string, FilterValue>,
                               sorter: SorterResult<AccountDetailsDto> | SorterResult<AccountDetailsDto>[]) => {
        console.log(sorter);
        setPage(pagination.current);
        setSize(pagination.pageSize);
        const params = searchParams;
        params.set('page', pagination.current.toString());
        params.set('size', pagination.pageSize.toString());
        setSearchParams(params);
    };

    const columns: ColumnsType<AccountDetailsDto> = [
        {
            title: '#',
            dataIndex: 'key',
            key: 'key'
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true
        },
        {
            title: 'First name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: true
        },
        {
            title: 'Last name',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: true
        },
        {
            title: 'Access levels',
            dataIndex: 'accessLevels',
            key: 'accessLevels',
            render: accessLevels => accessLevels.map((accessLevel: string) => accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)).join(', ')
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active'
        },
        {
            title: 'Confirmed',
            dataIndex: 'confirmed',
            key: 'confirmed'
        }
    ];

    return (
        <React.Fragment>
            <PageHeader
                className="site-page-header"
                title="Accounts"
            />
            <Input autoFocus
                   value={query}
                   addonBefore={React.createElement(SearchOutlined)}
                   onChange={event => handleChangeQuery(event.target.value)}
            />
            <Table
                columns={columns}
                dataSource={accountPagesDto.content}
                onChange={handleChangeTable}
                pagination={{
                    current: page,
                    pageSize: size,
                    total: accountPagesDto.totalSize,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    pageSizeOptions: [3, 6, 9, 12]
                }}
            />
            <button onClick={() => {
                console.log(accountPagesDto);
                console.log(query);
                console.log(sort);
                console.log(dir);
                console.log(page);
                console.log(size);
            }}>log</button>
        </React.Fragment>
    );
};

import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Checkbox, Input, PageHeader, Popover, Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FilterValue, SorterResult, SortOrder } from 'antd/es/table/interface';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const ListAccounts = () => {

    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [accountPagesDto, setAccountPagesDto] = useState<AccountPagesDto>(new AccountPagesDto());
    const [query, setQuery] = useState<string>(searchParams.get('query') || '');
    const [sort, setSort] = useState<string>(searchParams.get('sort') || '');
    const [dir, setDir] = useState<string>(searchParams.get('dir') || 'asc');
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
    }, [getAccounts]);

    const handleChangeQuery = (value: string) => {
        setQuery(value);
        const params = searchParams;
        params.set('query', value);
        setSearchParams(params);
    };

    const handleChangeTable = (pagination: TablePaginationConfig,
                               filters: Record<string, FilterValue>,
                               sorter: SorterResult<AccountDetailsDto> | SorterResult<AccountDetailsDto>[]) => {
        const sortValue = (sorter as SorterResult<AccountDetailsDto>).field?.toString() || '';
        const dirValue = (sorter as SorterResult<AccountDetailsDto>).order?.slice(0, -3) || '';
        setSort(sortValue);
        setDir(dirValue);
        setPage(pagination.current);
        setSize(pagination.pageSize);
        const params = searchParams;
        params.set('sort', sortValue);
        params.set('dir', dirValue);
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
            sorter: true,
            sortOrder: sort === 'username' ? (dir + 'end') as SortOrder : null
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
            sortOrder: sort === 'email' ? (dir + 'end') as SortOrder : null
        },
        {
            title: 'First name',
            dataIndex: 'firstName',
            key: 'firstName',
            sorter: true,
            sortOrder: sort === 'firstName' ? (dir + 'end') as SortOrder : null
        },
        {
            title: 'Last name',
            dataIndex: 'lastName',
            key: 'lastName',
            sorter: true,
            sortOrder: sort === 'lastName' ? (dir + 'end') as SortOrder : null
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
            key: 'active',
            render: active => <Checkbox checked={active}/>
        },
        {
            title: 'Confirmed',
            dataIndex: 'confirmed',
            key: 'confirmed',
            render: confirmed => <Checkbox checked={confirmed}/>
        },
        {
            render: () => (
                <Popover
                    trigger="click"
                    placement="bottom"
                    content={
                        <div>
                            <Button type="link" onClick={() => {}}>Edit</Button>
                            <br/>
                            <Button type="link" onClick={() => {}}>Delete</Button>
                        </div>
                    }
                >
                    <Button shape="circle" icon={<MoreOutlined/>}/>
                </Popover>
            )
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
        </React.Fragment>
    );
};
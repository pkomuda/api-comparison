import { MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AccountServiceFactory } from '@service/AccountServiceFactory';
import { Button, Checkbox, Input, message, PageHeader, Popover, Table, TablePaginationConfig } from 'antd';
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
    const [size, setSize] = useState<number>(parseInt(searchParams.get('size')) || 10);
    const accountService = AccountServiceFactory.getAccountService()

    const getAccounts = useCallback(async () => {
        const [data, ] = await accountService.getAccounts(query, sort, dir, page - 1, size);
        if (data) {
            const accounts = data.content.map((account, index) => ({
                ...account,
                key: size * (page - 1) + index + 1
            }));
            setAccountPagesDto({content: accounts, totalSize: data.totalSize});
        }
    }, [query, sort, dir, page, size]);

    useEffect(() => {
        getAccounts().then(() => {});
    }, [getAccounts]);

    const handleChangeQuery = (value: string) => {
        setQuery(value);
        setPage(1);
        const params = searchParams;
        params.set('query', value);
        params.set('page', '1');
        setSearchParams(params);
    };

    const handleChangeTable = (pagination: TablePaginationConfig,
                               filters: Record<string, FilterValue>,
                               sorter: SorterResult<AccountDetailsDto> | SorterResult<AccountDetailsDto>[]) => {
        const sortValue = (sorter as SorterResult<AccountDetailsDto>).column?.key.toString() || '';
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
            render: (_, row) => (
                <Popover
                    trigger="click"
                    placement="bottom"
                    content={
                        <div>
                            <Button type="link" onClick={() => {
                                navigate(`/account/${row.username}`, {replace: true})
                            }}>
                                Edit
                            </Button>
                            <br/>
                            <Button type="link" onClick={async () => {
                                await accountService.deleteAccount(row.username);
                                await getAccounts();
                                message.success('Account deleted successfully');
                            }}>
                                Delete
                            </Button>
                        </div>
                    }
                >
                    <Button shape="circle" size="small" icon={<MoreOutlined/>}/>
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
                    showQuickJumper: true
                }}
            />
        </React.Fragment>
    );
};

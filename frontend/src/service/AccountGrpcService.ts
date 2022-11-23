import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { ChangePasswordDto } from '@dto/ChangePasswordDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';
import { account } from '@grpc/account';
import { google as empty } from '@grpc/google/protobuf/empty';
import { google as wrappers } from '@grpc/google/protobuf/wrappers';
import { AccountService } from '@service/AccountService';
import Cookies from 'js-cookie';
import AccountClient = account.AccountClient;
import AccountDetails = account.AccountDetails;
import AddAccountRequest = account.AddAccountRequest;
import ChangePasswordRequest = account.ChangePasswordRequest;
import GetAccountsRequest = account.GetAccountsRequest;
import LoginRequest = account.LoginRequest;
import RegisterRequest = account.RegisterRequest;
import Empty = empty.protobuf.Empty;
import StringValue = wrappers.protobuf.StringValue;

export class AccountGrpcService implements AccountService {

    private static instance: AccountGrpcService;
    private accountClient: AccountClient;

    private constructor() {
        this.accountClient = new AccountClient('http://localhost:8000');
    }

    static getInstance(): AccountGrpcService {
        return this.instance ? this.instance : new AccountGrpcService();
    }

    private metadata(): any {
        const token = Cookies.get('token');
        if (token) {
            return {
                'Authorization': `Bearer ${token}`
            };
        } else {
            return {};
        }
    }

    login(loginDto: LoginDto): Promise<[string, string]> {
        return new Promise(resolve => {
            this.accountClient.Login(new LoginRequest(loginDto), this.metadata(), (error, response) => {
                response ? resolve([response.value, null]) : resolve([null, error.message]);
            })
        });
    }

    register(registerDto: RegisterDto): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.Register(new RegisterRequest(registerDto), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    addAccount(addAccountDto: AddAccountDto): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.AddAccount(new AddAccountRequest(addAccountDto), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    getAccount(username: string): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.GetAccount(new StringValue({value: username}), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    getOwnAccount(): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.GetOwnAccount(new Empty(), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]> {
        const request = new GetAccountsRequest();
        request.query = query;
        request.sort = sort;
        request.dir = dir;
        request.page = page;
        request.size = size;
        return new Promise(resolve => {
            this.accountClient.GetAccounts(request, this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountPagesDto, null]) : resolve([null, error.message]);
            });
        });
    }

    editAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.EditAccount(new AccountDetails(accountDetailsDto), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    editOwnAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.EditOwnAccount(new AccountDetails(accountDetailsDto), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    changePassword(changePasswordDto: ChangePasswordDto): Promise<[AccountDetailsDto, string]> {
        return new Promise(resolve => {
            this.accountClient.ChangePassword(new ChangePasswordRequest(changePasswordDto), this.metadata(), (error, response) => {
                response ? resolve([response.toObject() as AccountDetailsDto, null]) : resolve([null, error.message]);
            })
        });
    }

    deleteAccount(username: string): Promise<[string, string]> {
        return new Promise(resolve => {
            this.accountClient.DeleteAccount(new StringValue({value: username}), this.metadata(), (error, response) => {
                response ? resolve([response.value, null]) : resolve([null, error.message]);
            })
        });
    }
}

import { AccountDetailsDto } from "@dto/AccountDetailsDto";
import { AccountPagesDto } from "@dto/AccountPagesDto";
import { AddAccountDto } from "@dto/AddAccountDto";
import { ChangePasswordDto } from "@dto/ChangePasswordDto";
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from "@dto/RegisterDto";
import { account } from "@grpc/account";
import { AccountService } from '@service/AccountService';
import AccountClient = account.AccountClient;
import GetAccountsRequest = account.GetAccountsRequest;
import LoginRequest = account.LoginRequest;

export class AccountGrpcService implements AccountService {

    private static instance: AccountGrpcService;
    private accountClient: AccountClient;

    private constructor() {
        this.accountClient = new AccountClient('http://localhost:8000');
    }

    static getInstance(): AccountGrpcService {
        return this.instance ? this.instance : new AccountGrpcService();
    }

    async login(loginDto: LoginDto): Promise<[string, string]> {
        return new Promise(resolve => {
            this.accountClient.Login(new LoginRequest(loginDto), null, (error, response) => {
                response ? resolve([response.value, null]) : resolve([null, error.message]);
            })
        });
    }

    addAccount(addAccountDto: AddAccountDto): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }

    changePassword(changePasswordDto: ChangePasswordDto): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }

    confirmAccount(token: string): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }

    deleteAccount(username: string): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }

    editAccount(username: string, accountDetailsDto: AccountDetailsDto): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }

    getAccount(username: string): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, ""]);
    }

    getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]> {
        const request = new GetAccountsRequest();
        request.query = query;
        request.sort = sort;
        request.dir = dir;
        request.page = page;
        request.size = size;
        return new Promise(resolve => {
            this.accountClient.GetAccounts(request, null, (error, response) => {
                response ? resolve([{content: response.content, totalSize: response.totalSize}, null]) : resolve([null, error.message]);
            });
        });
    }

    register(registerDto: RegisterDto): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }
}

import { AccountDetailsDto } from "@dto/AccountDetailsDto";
import { AccountPagesDto } from "@dto/AccountPagesDto";
import { AddAccountDto } from "@dto/AddAccountDto";
import { ChangePasswordDto } from "@dto/ChangePasswordDto";
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from "@dto/RegisterDto";
import { account } from "@grpc/account";
import { AccountService } from '@service/AccountService';
import AccountClient = account.AccountClient;
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
        console.log('grpc login');
        const request = new LoginRequest(loginDto);
        this.accountClient.Login(request, null, (error, response) => {console.log(response.value)});
        return null;
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
        return Promise.resolve([undefined, ""]);
    }

    register(registerDto: RegisterDto): Promise<[boolean, string]> {
        return Promise.resolve([false, ""]);
    }
}

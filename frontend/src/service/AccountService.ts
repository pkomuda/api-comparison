import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';

export interface AccountService {

    login(loginDto: LoginDto): Promise<[string, string]>;
    register(registerDto: RegisterDto): Promise<[any, string]>;
    addAccount(addAccountDto: AddAccountDto): Promise<[any, string]>;
    getAccount(username: string): Promise<[AccountDetailsDto, string]>;
    getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]>;
}

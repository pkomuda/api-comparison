import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { ChangePasswordDto } from '@dto/ChangePasswordDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';

export interface AccountService {

    login(loginDto: LoginDto): Promise<[string, string]>;
    register(registerDto: RegisterDto): Promise<[boolean, string]>;
    addAccount(addAccountDto: AddAccountDto): Promise<[boolean, string]>;
    getAccount(username: string): Promise<[AccountDetailsDto, string]>;
    getOwnAccount(): Promise<[AccountDetailsDto, string]>;
    getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]>;
    editAccount(username: string, accountDetailsDto: AccountDetailsDto): Promise<[boolean, string]>;
    editOwnAccount(accountDetailsDto: AccountDetailsDto): Promise<[boolean, string]>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<[boolean, string]>;
    deleteAccount(username: string): Promise<[boolean, string]>;
}

import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { ChangePasswordDto } from '@dto/ChangePasswordDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';

export interface AccountService {

    login(loginDto: LoginDto): Promise<[string, string]>;
    register(registerDto: RegisterDto): Promise<[AccountDetailsDto, string]>;
    addAccount(addAccountDto: AddAccountDto): Promise<[AccountDetailsDto, string]>;
    getAccount(username: string): Promise<[AccountDetailsDto, string]>;
    getOwnAccount(): Promise<[AccountDetailsDto, string]>;
    getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]>;
    editAccount(username: string, accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]>;
    editOwnAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<[AccountDetailsDto, string]>;
    deleteAccount(username: string): Promise<[string, string]>;
}

import { LoginDto } from '../dto/LoginDto';
import { AddAccountDto } from '../dto/AddAccountDto';
import { RegisterDto } from '../dto/RegisterDto';

export interface AccountService {

    login(loginDto: LoginDto): Promise<[string, string]>;
    register(registerDto: RegisterDto): Promise<[any, string]>;
    addAccount(addAccountDto: AddAccountDto): any;
}

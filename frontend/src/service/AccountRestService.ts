import { AddAccountDto } from '../dto/AddAccountDto';
import { LoginDto } from '../dto/LoginDto';
import { AccountService } from './AccountService';
import { RegisterDto } from '../dto/RegisterDto';

export class AccountRestService implements AccountService {

    private static instance: AccountRestService;

    private constructor() {
    }

    static getInstance(): AccountRestService {
        return this.instance ? this.instance : new AccountRestService();
    }

    async login(loginDto: LoginDto): Promise<[string, string]> {
        console.log("rest login");
        const response = await fetch('http://localhost:8080/rest/login', {method: 'POST', body: JSON.stringify(loginDto), headers: {'Content-Type': 'application/json'}});
        if (response.ok) {
            return [await response.text(), null];
        } else {
            return [null, await response.text()];
        }
    }

    async register(registerDto: RegisterDto): Promise<[any, string]> {
        const response = await fetch('http://localhost:8080/rest/register', {method: 'POST', body: JSON.stringify(registerDto), headers: {'Content-Type': 'application/json'}});
        if (response.ok) {
            return [await response.json(), null];
        } else {
            return [null, await response.text()];
        }
    }

    async addAccount(addAccountDto: AddAccountDto) {
        // Cookies.get('token');
        const response = await fetch('http://localhost:8080/rest/account', {method: 'POST', body: JSON.stringify(addAccountDto)});
        const data = await response.json();
    }

    async getAccount(username: string): Promise<[LoginDto, string]> {
        const response = await fetch(`http://localhost:8080/rest/account/${username}`, {method: 'GET', headers: {'Content-Type': 'application/json'}});
        if (response.ok) {
            return [await response.json() as LoginDto, null];
        } else {
            return [null, await response.text()];
        }
    }

    async getAccounts(): Promise<LoginDto[]> {
        return await (await fetch(`http://localhost:8080/rest/accounts`, {method: 'GET', headers: {'Content-Type': 'application/json'}})).json() as LoginDto[];
    }
}

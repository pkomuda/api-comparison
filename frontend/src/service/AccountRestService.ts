import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';
import { AccountService } from '@service/AccountService';
import Cookies from 'js-cookie';

export class AccountRestService implements AccountService {

    private static instance: AccountRestService;
    private baseUrl = 'http://localhost:8080/rest';

    private constructor() {
    }

    static getInstance(): AccountRestService {
        return this.instance ? this.instance : new AccountRestService();
    }

    private headers(): any {
        const token = Cookies.get('token');
        if (token) {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        } else {
            return {
                'Content-Type': 'application/json',
            }
        }
    }

    private post(url: string, dto: any): Promise<Response> {
        return fetch(this.baseUrl + url, {
            method: 'POST',
            body: JSON.stringify(dto),
            headers: this.headers()
        });
    }

    private get(url: string): Promise<Response> {
        return fetch(this.baseUrl + url, {
            method: 'GET',
            headers: this.headers()
        });
    }

    async login(loginDto: LoginDto): Promise<[string, string]> {
        const response = await this.post('/login', loginDto);
        return response.ok ? [await response.text(), null] : [null, await response.text()];
    }

    async register(registerDto: RegisterDto): Promise<[any, string]> {
        const response = await this.post('/register', registerDto);
        return response.ok ? [await response.json(), null] : [null, await response.text()];
    }

    async addAccount(addAccountDto: AddAccountDto): Promise<[any, string]> {
        const response = await this.post('/account', addAccountDto);
        return response.ok ? [await response.json(), null] : [null, await response.text()];
    }

    async getAccount(username: string): Promise<[AccountDetailsDto, string]> {
        const response = await this.get(`/account/${username}`);
        return response.ok ? [await response.json() as AccountDetailsDto, null] : [null, await response.text()];
    }
}

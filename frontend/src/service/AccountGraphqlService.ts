import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { ChangePasswordDto } from '@dto/ChangePasswordDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';
import { AccountService } from '@service/AccountService';
import Cookies from 'js-cookie';

export class AccountGraphqlService implements AccountService {

    private static instance: AccountGraphqlService;
    private client: ApolloClient<any>;

    private constructor() {
        this.client = new ApolloClient({
            cache: new InMemoryCache(),
            uri: 'http://localhost:8080/graphql'
        });
    }

    static getInstance(): AccountGraphqlService {
        return this.instance ? this.instance : new AccountGraphqlService();
    }

    private context(): any {
        const token = Cookies.get('token');
        if (token) {
            return {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
        } else {
            return {};
        }
    }

    async login(loginDto: LoginDto): Promise<[string, string]> {
        try {
            const response = await this.client.query({
                query: gql`query login($loginDto: LoginDtoInput) {
                    login(loginDto: $loginDto)
                }`,
                variables: {loginDto: loginDto},
                context: this.context()
            });
            return [response.data.login as string, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async register(registerDto: RegisterDto): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.mutate({
                mutation: gql`mutation register($registerDto: RegisterDtoInput) {
                    register(registerDto: $registerDto) {
                        username
                        email
                        firstName
                        lastName
                    }
                }`,
                variables: {registerDto: registerDto},
                context: this.context()
            });
            return [response.data.register as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async addAccount(addAccountDto: AddAccountDto): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.mutate({
                mutation: gql`mutation addAccount($addAccountDto: AddAccountDtoInput) {
                    addAccount(addAccountDto: $addAccountDto) {
                        username
                        email
                        firstName
                        lastName
                        active
                        accessLevels
                    }
                }`,
                variables: {addAccountDto: addAccountDto},
                context: this.context()
            });
            return [response.data.addAccount as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async getAccount(username: string): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.query({
                query: gql`query account($username: String) {
                    account(username: $username) {
                        username
                        email
                        firstName
                        lastName
                        active
                        accessLevels
                    }
                }`,
                variables: {username: username},
                context: this.context()
            });
            return [response.data.account as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async getOwnAccount(): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.query({
                query: gql`query ownAccount {
                    ownAccount {
                        username
                        email
                        firstName
                        lastName
                    }
                }`,
                context: this.context()
            });
            return [response.data.ownAccount as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    async editAccount(username: string, accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    async editOwnAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    async deleteAccount(username: string): Promise<[string, string]> {
        return Promise.resolve(['', '']);
    }
}

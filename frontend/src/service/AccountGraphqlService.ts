import { ApolloClient, gql, InMemoryCache } from '@apollo/client';
import { AccountDetailsDto } from '@dto/AccountDetailsDto';
import { AccountPagesDto } from '@dto/AccountPagesDto';
import { AddAccountDto } from '@dto/AddAccountDto';
import { ChangePasswordDto } from '@dto/ChangePasswordDto';
import { LoginDto } from '@dto/LoginDto';
import { RegisterDto } from '@dto/RegisterDto';
import { AccountService } from '@service/AccountService';

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

    async login(loginDto: LoginDto): Promise<[string, string]> {
        try {
            const response = await this.client.query({
                query: gql`query login($loginDto: LoginDtoInput) {
                    login(loginDto: $loginDto)
                }`,
                variables: {loginDto: loginDto}
            });
            return [response.data.login, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    register(registerDto: RegisterDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    addAccount(addAccountDto: AddAccountDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    getAccount(username: string): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    getOwnAccount(): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    getAccounts(query: string, sort: string, dir: string, page: number, size: number): Promise<[AccountPagesDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    editAccount(username: string, accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    editOwnAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    changePassword(changePasswordDto: ChangePasswordDto): Promise<[AccountDetailsDto, string]> {
        return Promise.resolve([undefined, '']);
    }

    deleteAccount(username: string): Promise<[string, string]> {
        return Promise.resolve(['', '']);
    }
}

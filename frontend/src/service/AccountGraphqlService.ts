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
            cache: new InMemoryCache({
                addTypename: false
            }),
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
                        username email firstName lastName
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
                        username email firstName lastName active accessLevels
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
                        username email firstName lastName active accessLevels
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
                        username email firstName lastName
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
        try {
            const response = await this.client.query({
                query: gql`query accounts($query: String, $sort: String, $dir: String, $page: Int!, $size: Int!) {
                    accounts(query: $query, sort: $sort, dir: $dir, page: $page, size: $size) {
                        content {
                            username email firstName lastName active accessLevels
                        }
                        totalSize
                    }
                }`,
                variables: {query: query, sort: sort, dir: dir, page: page, size: size},
                context: this.context(),
                fetchPolicy: 'no-cache'
            });
            return [response.data.accounts as AccountPagesDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async editAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.mutate({
                mutation: gql`mutation editAccount($accountDetailsDto: AccountDetailsDtoInput) {
                    editAccount(accountDetailsDto: $accountDetailsDto) {
                        username email firstName lastName active accessLevels
                    }
                }`,
                variables: {accountDetailsDto: accountDetailsDto},
                context: this.context()
            });
            return [response.data.editAccount as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async editOwnAccount(accountDetailsDto: AccountDetailsDto): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.mutate({
                mutation: gql`mutation editOwnAccount($accountDetailsDto: AccountDetailsDtoInput) {
                    editOwnAccount(accountDetailsDto: $accountDetailsDto) {
                        username email firstName lastName
                    }
                }`,
                variables: {accountDetailsDto: accountDetailsDto},
                context: this.context()
            });
            return [response.data.editOwnAccount as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<[AccountDetailsDto, string]> {
        try {
            const response = await this.client.mutate({
                mutation: gql`mutation changePassword($changePasswordDto: ChangePasswordDtoInput) {
                    changePassword(changePasswordDto: $changePasswordDto) {
                        username email firstName lastName
                    }
                }`,
                variables: {changePasswordDto: changePasswordDto},
                context: this.context()
            });
            return [response.data.changePassword as AccountDetailsDto, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }

    async deleteAccount(username: string): Promise<[string, string]> {
        try {
            const response = await this.client.mutate({
                mutation: gql`mutation deleteAccount($username: String) {
                    deleteAccount(username: $username)
                }`,
                variables: {username: username},
                context: this.context()
            });
            return [response.data.deleteAccount as string, null];
        } catch (error) {
            return [null, (error as Error).message];
        }
    }
}

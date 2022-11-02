// import { AddAccountDto } from '../dto/AddAccountDto';
// import { LoginDto } from '../dto/LoginDto';
// import { AccountService } from './AccountService';
//
// export class AccountGrpcService implements AccountService {
//
//     private static instance: AccountGrpcService;
//
//     private constructor() {
//     }
//
//     static getInstance(): AccountGrpcService {
//         return this.instance ? this.instance : new AccountGrpcService();
//     }
//
//     async login(loginDto: LoginDto): Promise<string[]> {
//         console.log("grpc login");
//         return Promise.resolve(['grpc token']);
//     }
//
//     async addAccount(addAccountDto: AddAccountDto) {
//     }
// }

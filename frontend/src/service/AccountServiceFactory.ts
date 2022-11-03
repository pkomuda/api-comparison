import { AccountRestService } from '@service/AccountRestService';
// import { AccountGrpcService } from './AccountGrpcService';
import { AccountService } from '@service/AccountService';

export class AccountServiceFactory {

    static getAccountService(): AccountService {
        switch (localStorage.getItem('api')) {
            case 'rest':
                return AccountRestService.getInstance();
            // case 'grpc':
            //     return AccountGrpcService.getInstance();
            default:
                return AccountRestService.getInstance();
        }
    }
}

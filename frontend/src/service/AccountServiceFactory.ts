import { AccountRestService } from './AccountRestService';
// import { AccountGrpcService } from './AccountGrpcService';
import { AccountService } from './AccountService';

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

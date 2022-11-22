import { AccountGraphqlService } from '@service/AccountGraphqlService';
import { AccountGrpcService } from '@service/AccountGrpcService';
import { AccountRestService } from '@service/AccountRestService';
import { AccountService } from '@service/AccountService';

export class AccountServiceFactory {

    static getAccountService(): AccountService {
        switch (localStorage.getItem('api')) {
            case 'rest':
                return AccountRestService.getInstance();
            case 'graphql':
                return AccountGraphqlService.getInstance();
            case 'grpc':
                return AccountGrpcService.getInstance();
            default:
                return AccountRestService.getInstance();
        }
    }
}

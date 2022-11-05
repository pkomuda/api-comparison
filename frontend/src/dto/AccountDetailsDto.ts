export class AccountDetailsDto {

    key?: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    confirmed: boolean;
    accessLevels: string[];
}

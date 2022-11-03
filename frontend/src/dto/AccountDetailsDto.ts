import { IsEmail, IsNotEmpty } from 'class-validator';

export class AccountDetailsDto {

    @IsNotEmpty()
    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    active: boolean;

    confirmed: boolean;

    accessLevels: string[];
}

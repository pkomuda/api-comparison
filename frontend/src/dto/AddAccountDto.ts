import { ArrayNotEmpty, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AddAccountDto {

    @IsNotEmpty()
    username: string;

    @MinLength(8)
    password: string;

    @MinLength(8)
    confirmPassword: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    active: boolean;

    @ArrayNotEmpty()
    accessLevels: string[];
}

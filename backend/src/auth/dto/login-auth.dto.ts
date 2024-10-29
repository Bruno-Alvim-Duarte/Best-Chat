import { IsEmail, IsString } from "class-validator";
import { UserResponseDto } from "user/dto/user.dto";

export class LoginAuthDto {
    @IsEmail()
    email: string;
    
    @IsString()
    password: string;
}

export class LoginAuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: UserResponseDto
}


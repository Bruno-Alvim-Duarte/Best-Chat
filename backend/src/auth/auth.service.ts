import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LoginAuthDto, LoginAuthResponseDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from 'user/dto/user.dto';
import { UserService } from 'user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {
    }

    private checkPassword (password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }

    private createAccessToken (user: UserResponseDto): string {
        return this.jwtService.sign(user, { expiresIn: '1d', secret: process.env.JWT_SECRET });
    }

    private createRefreshToken (user: UserResponseDto): string {
        return this.jwtService.sign(user, { expiresIn: '60d', secret: process.env.JWT_REFRESH_SECRET });
    }

    async login(credentials: LoginAuthDto): Promise<LoginAuthResponseDto> {
        const user = await this.prismaService.user.findUnique({ where: { email: credentials.email }})
        const userWithoutPass = UserService.removePassword(user);
        console.log('user', user);
        console.log('checkPassword', await this.checkPassword(credentials.password, user.password));
        if (!user || !(await this.checkPassword(credentials.password, user.password))) {
            throw new Error('Invalid credentials');
        }

        if (!user.active) {
            throw new Error('User is not active');
        }

        return {
            accessToken: this.createAccessToken(userWithoutPass),
            refreshToken: this.createRefreshToken(userWithoutPass),
            user: userWithoutPass,
        }
    }

    async refresh(token: string): Promise<LoginAuthResponseDto> {
        try {
            const decoded = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            const user = await this.prismaService.user.findUnique({ where: { id: decoded.id }});
            return {
                accessToken: this.createAccessToken(UserService.removePassword(user)),
                refreshToken: token,
                user: UserService.removePassword(user),
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

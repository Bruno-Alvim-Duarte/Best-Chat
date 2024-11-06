import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginAuthDto, LoginAuthResponseDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserResponseDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {
    }

    checkPassword (password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }

    async createAccessToken (user: UserResponseDto): Promise<string> {
        return this.jwtService.sign(user, { expiresIn: '1d', secret: process.env.JWT_SECRET });
    }

    async createRefreshToken (user: UserResponseDto): Promise<string> {
        return this.jwtService.sign(user, { expiresIn: '60d', secret: process.env.JWT_REFRESH_SECRET });
    }

    async login(credentials: LoginAuthDto): Promise<LoginAuthResponseDto> {
        const user = await this.prismaService.user.findUnique({ where: { email: credentials.email }})
        const userWithoutPass = UserService.removePassword(user);
        if (!user || !(await this.checkPassword(credentials.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.active) {
            throw new UnauthorizedException('User is not active');
        }

        return {
            accessToken: await this.createAccessToken(userWithoutPass),
            refreshToken: await this.createRefreshToken(userWithoutPass),
            user: userWithoutPass,
        }
    }

    async refresh(token: string): Promise<LoginAuthResponseDto> {
        try {
            const decoded = await this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            const user = await this.prismaService.user.findUnique({ where: { id: decoded.id }});
            return {
                accessToken: await this.createAccessToken(UserService.removePassword(user)),
                refreshToken: token,
                user: UserService.removePassword(user),
            }
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}

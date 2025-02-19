import { Body, Controller, Delete, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { LoginAuthDto, LoginAuthResponseDto } from './dto/login-auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    login(@Body() credentials: LoginAuthDto): Promise<LoginAuthResponseDto> {
        return this.authService.login(credentials);
    }


    @Post('refresh')
    refresh(@Req() req: Request): Promise<LoginAuthResponseDto> {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
        throw new UnauthorizedException('Token not found');
        }

        const [type, rawToken] = authHeader.split(' ');
        if (type !== 'Bearer' || !rawToken) {
        throw new UnauthorizedException('Invalid token format (missing Bearer)');
        }
        return this.authService.refresh(rawToken);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        res.cookie('jwt', '');
        res.send();
      }

}

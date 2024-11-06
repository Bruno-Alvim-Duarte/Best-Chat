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
        const { jwt } = req.cookies;
        if (!jwt) throw new UnauthorizedException('JWT token is missing');
        return this.authService.refresh(jwt);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        res.cookie('jwt', '');
        res.send();
      }

}

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserResponseDto } from 'user/dto/user.dto';

interface CustomRequest extends Request {
  user?: UserResponseDto;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token not found');
    }
    const [type, rawToken] = authHeader.split(' ');
    if (type !== 'Bearer' || !rawToken) {
      throw new UnauthorizedException('Invalid token format (missing Bearer)');
    }


    try {
      const payload = this.jwtService.verify(rawToken, {secret: process.env.JWT_SECRET});
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}

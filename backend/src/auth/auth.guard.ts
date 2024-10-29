// src/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    const token = request.cookies.jwt;

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    console.log(request.cookies);

    try {
      const payload = this.jwtService.verify(token, {secret: process.env.JWT_SECRET});
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}

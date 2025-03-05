import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService, JwtAuthGuard],
  exports: [JwtService, JwtAuthGuard]
})
export class AuthModule {}

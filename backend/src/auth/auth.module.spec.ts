import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('UserModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
  });

  it('should have UserService defined', () => {
    const userService = module.get<AuthService>(AuthService);
    expect(userService).toBeDefined();
  });

  it('should have UserController defined', () => {
    const userController = module.get<AuthController>(AuthController);
    expect(userController).toBeDefined();
  });

  it('should have PrismaService defined', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });
  
  it('should have JwtService defined', () => {
    const prismaService = module.get<JwtService>(JwtService);
    expect(prismaService).toBeDefined();
  });
});

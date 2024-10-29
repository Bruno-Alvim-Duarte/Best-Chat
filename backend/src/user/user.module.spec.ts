import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('UserModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
  });

  it('should have UserService defined', () => {
    const userService = module.get<UserService>(UserService);
    expect(userService).toBeDefined();
  });

  it('should have UserController defined', () => {
    const userController = module.get<UserController>(UserController);
    expect(userController).toBeDefined();
  });

  it('should have PrismaService defined', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
  });
});

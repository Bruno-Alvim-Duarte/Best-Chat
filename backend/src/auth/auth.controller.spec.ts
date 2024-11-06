import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAuthResponseDto } from './dto/login-auth.dto';
import { UserResponseDto } from 'user/dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const accessToken = 'accessToken';
  const refreshToken = 'refreshToken';
  const userMock: UserResponseDto = {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    active: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    const credentials = {
      email: 'jonhdoe@gmail.com',
      password: 'password',
    };
    const result: LoginAuthResponseDto = {
      accessToken,
      refreshToken,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        active: true,
      },
    };
    service.login = jest.fn().mockResolvedValue(result);

    expect(await controller.login(credentials)).toBe(result);
    expect(service.login).toHaveBeenCalled();
  });

  it('should refresh', async () => {
    const req = {
      cookies: {
        jwt: refreshToken,
      }
    } as any;
    const result: LoginAuthResponseDto = {
      accessToken,
      refreshToken,
      user: userMock,
    };
    service.refresh = jest.fn().mockResolvedValue(result);

    expect(await controller.refresh(req)).toBe(result);
    expect(service.refresh).toHaveBeenCalled();
  });

  it('should throw an error when refresh token is missing', async () => {
    const req = {
      cookies: {
        jwt: '',
      }
    } as any;
    try {
      await controller.refresh(req);
    } catch (e) {
      expect(e.message).toBe('JWT token is missing');
    }
  });

  it('should logout', async () => {
    const req = {
      cookies: {
        jwt: refreshToken,
      }
    } as any;
    const res = {
      cookie: jest.fn(),
      send: jest.fn(),
    } as any;

    await controller.logout(req, res);
    expect(res.cookie).toHaveBeenCalledWith('jwt', '');
    expect(res.send).toHaveBeenCalled();
  });
});

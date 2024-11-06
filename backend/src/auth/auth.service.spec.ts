import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const userMock: User = {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '$2b$10$dfWScu3J4TyfedMRSYd5J.GaGsijhX3n9T8TTooyAhKqA6tFHt6MG',
    active: true,
} 

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should in login return token when pass correct credentials', () => {
    expect(service).toBeDefined();
    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);
  service.checkPassword = jest.fn().mockResolvedValue(true);
  const jwtToReturn: string = 'jwtToken';
  const jwtRefreshToReturn: string = 'jwtRefresh';
  jwtService.sign = jest.fn().mockResolvedValueOnce(jwtToReturn).mockResolvedValueOnce(jwtRefreshToReturn);

  const response = service.login({ email: 'johndoe@gmail.com', password: 'admin' });
  expect(response).resolves.toEqual({
    accessToken: jwtToReturn,
    refreshToken: jwtRefreshToReturn,
    user: {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      active: true,
      }
    });
  });

  it ('should in login return error when pass incorrect credentials', () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);
    service.checkPassword = jest.fn().mockResolvedValue(false);
    expect(service.login({ email: 'johndoe@gmail.com', password: 'admin' })).rejects.toThrowError('Invalid credentials');
  });

  it ('should in login return error when user is not active', () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({ ...userMock, active: false });
    service.checkPassword = jest.fn().mockResolvedValue(true);
    expect(service.login({ email: 'johndoe@gmail.com', password: 'admin' })).rejects.toThrowError('User is not active');
  });

  it ('should in refresh return token when pass correct refresh token', () => {
    const jwtToReturn: string = 'jwtToken';
    jwtService.verify = jest.fn().mockResolvedValue({ id: 1 });
    prisma.user.findUnique = jest.fn().mockResolvedValue(userMock);
    jwtService.sign = jest.fn().mockResolvedValue(jwtToReturn);

    const response = service.refresh('refreshToken');
    expect(response).resolves.toEqual({
      accessToken: jwtToReturn,
      refreshToken: 'refreshToken',
      user: {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        active: true,
      }
    });
  });

  it('should return an error when passing an incorrect refresh token', async () => { 
    jwtService.verify = jest.fn().mockRejectedValue('Invalid Token');
    await expect(service.refresh('refreshToken')).rejects.toThrow(UnauthorizedException);
});


  it ('should in refresh return error when user does not exist', () => {
    jwtService.verify = jest.fn().mockResolvedValue({ id: 1 });
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);
    expect(service.refresh('refreshToken')).rejects.toThrowError('Invalid token');
  });

  it ('should in createAccessToken return a jwt token', () => {
    const jwtToReturn = 'jwtToken';
    jwtService.sign = jest.fn().mockResolvedValue(jwtToReturn);
    const user = { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', active: true };
    expect(service.createAccessToken(user)).resolves.toBe(jwtToReturn);
  });

  it ('should in createRefreshToken return a jwt token', () => {
    const jwt = 'jwtToken';
    jwtService.sign = jest.fn().mockResolvedValue(jwt);
    const user = { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', active: true };
    expect(service.createRefreshToken(user)).resolves.toBe(jwt);
  });

  it('should return true if the password matches the hashed password', async () => {
    const password = 'plainPassword';
    const hashedPassword = await bcrypt.hash(password, 10);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

    const result = await service.checkPassword(password, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(true);
  });

  it('should return false if the password does not match the hashed password', async () => {
    const password = 'plainPassword';
    const hashedPassword = await bcrypt.hash('differentPassword', 10);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    const result = await service.checkPassword(password, hashedPassword);

    expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(false);
  });

});
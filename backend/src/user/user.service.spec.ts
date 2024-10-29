import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UserResponseDto } from './dto/user.dto';

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('should return an array of users', async () => {
    const mockUsers: UserResponseDto[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'jonhDoe@gmail.com',
        active: true,
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@hotmail.com',
        active: true,
      },
      {
        id: 3,
        name: 'Bruno Roe',
        email: 'bruno@roe.com',
        active: true,
      }
    ];
    prisma.user.findMany = jest.fn().mockResolvedValue(mockUsers);

    const users = await service.index();
    expect(users).toHaveLength(3);
    expect(users[1]).toEqual(mockUsers[1]);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it ('should return a user by id', async () => {
    const mockUser: UserResponseDto = {
      id: 1,
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      active: true,
    }
    prisma.user.findUnique = jest.fn().mockResolvedValue(mockUser);

    const user = await service.show(1);
    expect(user).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalled();
  });

  it ('should return a error when trying to find a user by id that does not exist', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);

    await expect(service.show(1)).rejects.toThrow();
    expect(prisma.user.findUnique).toHaveBeenCalled();
  });

  it ('should create a user', async () => {
    const mockUser: CreateUserDto = {
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      password: '123456',
    }
    const mockUserCreated: User = {
      id: 1,
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      password: '123456',
      active: true,
    }
    const mockUserResponse: UserResponseDto = {
      id: 1,
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      active: true,
    }
    prisma.user.create = jest.fn().mockResolvedValue(mockUserCreated);

    const user = await service.store(mockUser);
    expect(user).toEqual(mockUserResponse);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it ('should update a user', async () => {
    const mockUser: UpdateUserDto = {
      name: 'John',
      email: 'jhonny@gmail.com',
    };
    const mockUpdatedUser: User = {
      id: 1,
      name: 'John',
      email: 'jhonny@gmail.com',
      password: '123456',
      active: true,
    }
    const mockUserResponse: UserResponseDto = {
      id: 1,
      name: 'John',
      email: 'jhonny@gmail.com',
      active: true,
    }
    prisma.user.update = jest.fn().mockResolvedValue(mockUpdatedUser);

    const user = await service.update(1, mockUser);
    expect(user).toEqual(mockUserResponse);
    expect(prisma.user.update).toHaveBeenCalled();
  });

  it('should inactivate a user', async () => {
    prisma.user.update = jest.fn();

    await service.remove(1);
    expect(prisma.user.update).toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { active: false } });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserResponseDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it ('should return an array of users', async () => {
    const result: UserResponseDto[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        active: true,
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@hotmail.com',
        active: true,
      }
    ]
    service.index = jest.fn().mockResolvedValue(result);

    expect(await controller.index()).toBe(result);
    expect(service.index).toHaveBeenCalled();
  });

  it ('should return a user by id', async () => {
    const mockUser: UserResponseDto = {
      id: 1,
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      active: true,
    }
    service.show = jest.fn().mockResolvedValue(mockUser);

    const user = await controller.show('1');
    expect(user).toEqual(mockUser);
    expect(service.show).toHaveBeenCalled();
  });

  it ('should create a user', async () => {
    const mockUser: CreateUserDto = {
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      password: '123456',
    }
    const mockUserCreated: UserResponseDto = {
      id: 1,
      name: 'John Doe',
      email: 'jonhDoe@gmail.com',
      active: true,
    }
    service.store = jest.fn().mockResolvedValue(mockUserCreated);

    const user = await controller.store(mockUser);
    expect(user).toEqual(mockUserCreated);
    expect(service.store).toHaveBeenCalled();
  });

  it ('should update a user', async () => {
    const mockUser: UpdateUserDto = {
      name: 'John',
      email: 'jhonny@gmail.com',
    };
    const mockUpdatedUser: UserResponseDto = {
      id: 1,
      name: 'John',
      email: 'jhonny@gmail.com',
      active: true,
    }
    service.update = jest.fn().mockResolvedValue(mockUpdatedUser);

    const user = await controller.update('1', mockUser);
    expect(user).toEqual(mockUpdatedUser);
    expect(service.update).toHaveBeenCalled();
  });

  it('should inactivate a user', async () => {
    service.remove = jest.fn();

    await controller.remove('1');
    expect(service.remove).toHaveBeenCalled();
  });
});

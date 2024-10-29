import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {

    }
    
    private removePassword(user: User): UserResponseDto {
        const {password: _pass, ...userWithoutPass} = user;
        return userWithoutPass;
    }

    async index(): Promise<UserResponseDto[]> {
        const users = await this.prisma.user.findMany();
        return users.map(user => this.removePassword(user));
    }

    async store(user: CreateUserDto): Promise<UserResponseDto> {
        const userCreated = await this.prisma.user.create({ data: user });
        return this.removePassword(userCreated);
    }

    async show(id: number): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return this.removePassword(user);
    }

    async update(id: number, updateUser: UpdateUserDto): Promise<UserResponseDto> {
        const userUpdated = await this.prisma.user.update({ where: { id }, data: updateUser });
        return this.removePassword(userUpdated);
    }

    async remove(id: number): Promise<void> {
        this.prisma.user.update({ where: { id }, data: { active: false } });
    }
}

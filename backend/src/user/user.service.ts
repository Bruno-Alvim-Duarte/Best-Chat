import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {

    }

    private async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }
    
    static removePassword(user: User): UserResponseDto {
        const {password: _pass, ...userWithoutPass} = user;
        return userWithoutPass;
    }

    async index(): Promise<UserResponseDto[]> {
        const users = await this.prisma.user.findMany();
        return users.map(user => UserService.removePassword(user));
    }

    async store(user: CreateUserDto): Promise<UserResponseDto> {
        const hashedPassword = await this.hashPassword(user.password);
        const userCreated = await this.prisma.user.create({ data: { ...user, password: hashedPassword} });
        return UserService.removePassword(userCreated);
    }

    async show(id: number): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return UserService.removePassword(user);
    }

    async update(id: number, updateUser: UpdateUserDto): Promise<UserResponseDto> {
        const userUpdated = await this.prisma.user.update({ where: { id }, data: updateUser });
        return UserService.removePassword(userUpdated);
    }

    async remove(id: number): Promise<void> {
        this.prisma.user.update({ where: { id }, data: { active: false } });
    }
}

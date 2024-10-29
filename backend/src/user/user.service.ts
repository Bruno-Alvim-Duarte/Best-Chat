import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {

    }

    async index() {
        return this.prisma.user.findMany();
    }

    async store(user: CreateUserDto): Promise<User> {
        return this.prisma.user.create({ data: user });
    }

    async show(id: number) {
        const user = this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException(`User with id ${id} not found`);
        return user;
    }

    async update(id: number, updateUser: UpdateUserDto) {
        return this.prisma.user.update({ where: { id }, data: updateUser });
    }

    async remove(id: number) {
        return this.prisma.user.update({ where: { id }, data: { active: false } });
    }
}

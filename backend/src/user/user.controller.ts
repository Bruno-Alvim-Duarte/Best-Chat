import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {

    }    
    @Get()
    index() {
        return this.userService.index();; 
    }

    @Get(':id')
    show() {
        return 'This action returns a user';
    }

    @Post()
    store() {
        return 'This action adds a new user';
    }

    @Put(':id')
    update() {
        return 'This action updates a user';
    }

    @Delete(':id')
    remove() {
        return 'This action removes a user';
    }
}

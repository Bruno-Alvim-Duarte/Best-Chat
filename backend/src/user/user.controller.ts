import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {

    }    
    @Get()
    index() {
        return this.userService.index();; 
    }

    @Get(':id')
    show(@Param('id') id: string) {
        return this.userService.show(+id);
    }

    @Post()
    store(@Body() user: CreateUserDto) {
        return this.userService.store(user);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
        return this.userService.update(+id, updateUser);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(+id);
    }
}

import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('internal/users')
export class UsersController {
    constructor(private users: UsersService) {}
    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.users.create(dto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.users.findById(id);
    }

    @Get()
    findByEmail(@Query('email') email: string) {
        console.log('findByEmail called with:', email); 
        return this.users.findCredentialsByEmail(email);
    }

    @Get(':id/permissions')
    permissions(@Param('id') id: string) {
        return this.users.getPermissions(id);
    }

    @Get('credentials')
    credentials(@Query('email') email: string){
        return this.users.findByEmailInternal(email);
    }
}

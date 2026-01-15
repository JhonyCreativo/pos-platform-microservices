import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersProxy } from './users.proxy';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../security/jwt.guard'; 

@ApiTags('Users')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersProxy: UsersProxy) { }

    @Post()
    @ApiOperation({ summary: 'Crear usuario' })
    @ApiResponse({ status: 201 })
    create(@Body() dto: CreateUserDto) {
        return this.usersProxy.create(dto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener usuario por ID' })
    @ApiResponse({ status: 200 })
    getById(@Param('id') id: string) {
        return this.usersProxy.getById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Buscar usuario por email' })
    @ApiResponse({ status: 200 })
    getByEmail(@Query('email') email: string) {
        return this.usersProxy.getByEmail(email);
    }
}

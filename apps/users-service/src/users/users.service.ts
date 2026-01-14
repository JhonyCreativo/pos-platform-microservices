import { Injectable,ConflictException,NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    //Methods
    async create(dto: CreateUserDto) {
        const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (exists) throw new ConflictException('Email already exists');

        const passwordHash = await bcrypt.hash(dto.password, 10);

        return this.prisma.user.create({
            data: { 
                email: dto.email, 
                password: passwordHash, 
                name: dto.name,
                phone: dto.phone
            },
            select: { id: true, email: true, name: true, phone: true, active: true, createdAt: true },
        });
    }
    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true, active: true, createdAt: true },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async getPermissions(userId: string) {
        const roles = await this.prisma.userRole.findMany({
        where: { userId },
        include: {
            role: { include: { permissions: { include: { permission: true } } } },
        },
        });

        const perms = new Set<string>();
        for (const ur of roles) {
            for (const rp of ur.role.permissions) perms.add(rp.permission.key);
        }
        return Array.from(perms);
    }

    async findByEmailInternal(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findCredentialsByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, password: true, active: true },
        });
    }
}

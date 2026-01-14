import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const usersUrl = this.config.get<string>('USERS_SERVICE_URL');

    // Este endpoint debe devolver password para uso interno
    const { data: user } = await firstValueFrom(
      this.http.get(`${usersUrl}/internal/users`, { params: { email } }),
    );

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const { data: permissions } = await firstValueFrom(
      this.http.get(`${usersUrl}/internal/users/${user.id}/permissions`),
    );

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      permissions,
    });

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES', '7d') as any,
      },
    );

    return { accessToken, refreshToken };
  }
}
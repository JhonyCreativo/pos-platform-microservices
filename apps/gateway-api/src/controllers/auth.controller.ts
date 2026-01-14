import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthProxy } from '../proxy/auth.proxy';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthProxy) {}

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const data = await this.auth.login(body); // { accessToken, refreshToken }

    // Guardamos access token en cookie HttpOnly
    res.cookie('access_token', data.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // true en https/producción
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // (Opcional) guardar refresh también
    res.cookie('refresh_token', data.refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // No devolvemos tokens al frontend (más seguro)
    return { ok: true };
  }
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { ok: true };
  }
}
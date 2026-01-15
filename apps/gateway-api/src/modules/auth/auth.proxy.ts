import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AuthProxy {
  constructor(private http: HttpService, private config: ConfigService) {}

  async login(body: any) {
    const base = this.config.get<string>('AUTH_SERVICE_URL');
    try {
      const { data } = await firstValueFrom(this.http.post(`${base}/auth/login`, body));
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          error.response?.data || 'Upstream error',
          error.response?.status || 502,
        );
      }
      throw error;
    }
  }
}
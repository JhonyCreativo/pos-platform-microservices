import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthProxy {
  constructor(private http: HttpService, private config: ConfigService) {}

  async login(body: any) {
    const base = this.config.get<string>('AUTH_SERVICE_URL');
    const { data } = await firstValueFrom(this.http.post(`${base}/auth/login`, body));
    return data;
  }
}
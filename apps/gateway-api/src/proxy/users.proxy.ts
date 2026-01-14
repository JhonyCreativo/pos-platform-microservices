import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersProxy {
  constructor(private http: HttpService, private config: ConfigService) {}

  async getById(id: string) {
    const base = this.config.get<string>('USERS_SERVICE_URL');
    const { data } = await firstValueFrom(this.http.get(`${base}/internal/users/${id}`));
    return data;
  }

  async getPermissions(id: string) {
    const base = this.config.get<string>('USERS_SERVICE_URL');
    const { data } = await firstValueFrom(this.http.get(`${base}/internal/users/${id}/permissions`));
    return data;
  }
}
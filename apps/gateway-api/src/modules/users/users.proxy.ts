import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class UsersProxy {
  constructor(private http: HttpService, private config: ConfigService) {}

  private base() {
    return this.config.get<string>('USERS_SERVICE_URL');
  }

  private handleError(error: any) {
    if (error instanceof AxiosError) {
        throw new HttpException(
          error.response?.data || 'Upstream error',
          error.response?.status || 502,
        );
      }
      throw error;
  }

  async getById(id: string) {
    try {
        const { data } = await firstValueFrom(
            this.http.get(`${this.base()}/internal/users/${id}`),
        );
        return data;
    } catch (error) {
        this.handleError(error);
    }
  }

  async getPermissions(id: string) {
    try {
        const { data } = await firstValueFrom(
            this.http.get(`${this.base()}/internal/users/${id}/permissions`),
        );
        return data;
    } catch (error) {
        this.handleError(error);
    }
  }

  async create(payload: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) {
    try {
        const { data } = await firstValueFrom(
            this.http.post(`${this.base()}/internal/users`, payload),
        );
        return data;
    } catch (error) {
        this.handleError(error);
    }
  }

  async getByEmail(email: string) {
    try {
        const { data } = await firstValueFrom(
            this.http.get(`${this.base()}/internal/users`, { params: { email } }),
        );
        return data;
    } catch (error) {
        this.handleError(error);
    }
  }
}
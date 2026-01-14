import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { MeController } from './controllers/me.controller';
import { AuthProxy } from './proxy/auth.proxy';
import { UsersProxy } from './proxy/users.proxy';
import { JwtStrategy } from './security/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    PassportModule,
  ],
  controllers: [AppController, AuthController, MeController],
  providers: [AppService, AuthProxy, UsersProxy, JwtStrategy],
})
export class AppModule {}

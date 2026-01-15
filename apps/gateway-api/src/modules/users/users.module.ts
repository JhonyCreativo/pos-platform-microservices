import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UsersController } from './users.controller';
import { UsersProxy } from './users.proxy';

@Module({
  imports: [HttpModule],
  controllers: [UsersController],
  providers: [UsersProxy],
  exports: [UsersProxy],
})
export class UsersModule {}
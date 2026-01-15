import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // usa UsersProxy vía export
  controllers: [MeController],
})
export class MeModule {}
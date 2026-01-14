import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../security/jwt.guard';
import { UsersProxy } from '../proxy/users.proxy';

@Controller('me')
export class MeController {
  constructor(private users: UsersProxy) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async me(@Req() req: any) {
    const userId = req.user.sub;
    const user = await this.users.getById(userId);
    const permissions = await this.users.getPermissions(userId);
    return { user, permissions };
  }
}
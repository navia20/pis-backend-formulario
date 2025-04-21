import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.create(userData);
  }
}
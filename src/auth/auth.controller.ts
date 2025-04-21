import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

@Controller('auth') // Asegúrate de que este decorador esté configurado
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login') // Define el endpoint POST /auth/login
  async login(@Body() loginDto: { rut: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.rut,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register') // Define el endpoint POST /auth/register
  async register(@Body() userData: Partial<User>): Promise<User> {
    return this.authService.register(userData);
  }
}
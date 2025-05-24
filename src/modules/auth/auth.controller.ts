import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { rut: string; password: string; tipo: 'alumno' | 'docente' }) {
    const user = await this.authService.validateUser(
      loginDto.rut,
      loginDto.password,
      loginDto.tipo
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() userData: any): Promise<any> {
    if (!userData.tipo) {
      throw new BadRequestException('El campo tipo es obligatorio ("alumno" o "docente")');
    }
    if (userData.tipo === 'alumno') {
      return this.authService.registerAlumno(userData);
    } else if (userData.tipo === 'docente') {
      return this.authService.registerDocente(userData);
    } else {
      throw new BadRequestException('Tipo de usuario no válido');
    }
  }
}
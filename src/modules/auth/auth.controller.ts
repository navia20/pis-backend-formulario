import { Controller, Post, Body, UnauthorizedException, BadRequestException, Get, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { rut: string; password: string; tipo: 'alumno' | 'docente' | 'admin' }) {
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
      throw new BadRequestException('El campo tipo es obligatorio ("alumno", "docente" o "admin")');
    }
    if (userData.tipo === 'alumno') {
      return this.authService.registerAlumno(userData);
    } else if (userData.tipo === 'docente') {
      return this.authService.registerDocente(userData);
    } else if (userData.tipo === 'admin') {
      return this.authService.registerAdmin(userData);
    } else {
      throw new BadRequestException('Tipo de usuario no válido');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log('Profile request - req.user:', req.user);
    console.log('Profile request - RUT:', req.user.rut);
    const user = await this.authService.getProfile(req.user.rut);
    if (!user) {
      console.log('Usuario no encontrado para RUT:', req.user.rut);
      throw new UnauthorizedException('Usuario no encontrado');
    }
    return user;
  }
}
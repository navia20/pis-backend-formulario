import { Body, Controller, Post, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecuperarPasswordService } from './recuperar-password.service';

@Controller('auth')
export class RecuperarPasswordController {
  constructor(private readonly recuperarPasswordService: RecuperarPasswordService) {}

  @Post('solicitar-recuperacion')
  async solicitarRecuperacion(@Body() { email }: { email: string }) {
    try {
      const resultado = await this.recuperarPasswordService.solicitarCodigo(email);
      return {
        success: true,
        message: 'Código enviado exitosamente',
        ...resultado
      };
    } catch (error) {
      if (error.message === 'Usuario no encontrado') {
        throw new HttpException('No se encontró una cuenta con este email', HttpStatus.NOT_FOUND);
      }
      if (error.message === 'Demasiados intentos') {
        throw new HttpException('Demasiados intentos. Intente más tarde', HttpStatus.TOO_MANY_REQUESTS);
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verificar-codigo')
  async verificarCodigo(@Body() { email, codigo }: { email: string; codigo: string }) {
    try {
      const resultado = await this.recuperarPasswordService.verificarCodigo(email, codigo);
      return {
        success: true,
        message: 'Código verificado exitosamente',
        resetToken: resultado.resetToken
      };
    } catch (error) {
      if (error.message === 'Código incorrecto') {
        throw new HttpException('Código incorrecto', HttpStatus.BAD_REQUEST);
      }
      if (error.message === 'Código expirado') {
        throw new HttpException('El código ha expirado', HttpStatus.GONE);
      }
      if (error.message === 'Usuario no encontrado') {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('cambiar-password')
  async cambiarPassword(@Body() { email, token, nuevaPassword }: { 
    email: string; 
    token: string; 
    nuevaPassword: string; 
  }) {
    try {
      await this.recuperarPasswordService.cambiarPassword(email, token, nuevaPassword);
      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      if (error.message === 'Token inválido o expirado') {
        throw new HttpException('Token inválido o expirado', HttpStatus.BAD_REQUEST);
      }
      if (error.message === 'Usuario no encontrado') {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cambiar-password-perfil')
  async cambiarPasswordPerfil(@Body() { 
    usuarioId, 
    tipoUsuario, 
    passwordActual, 
    passwordNueva 
  }: { 
    usuarioId: string; 
    tipoUsuario: 'admin' | 'docente' | 'alumno';
    passwordActual: string; 
    passwordNueva: string; 
  }) {
    try {
      console.log('📨 Solicitud de cambio de contraseña recibida:');
      console.log('- Usuario ID:', usuarioId);
      console.log('- Tipo Usuario:', tipoUsuario);
      console.log('- Password actual presente:', !!passwordActual);
      console.log('- Password nueva presente:', !!passwordNueva);
      
      await this.recuperarPasswordService.cambiarPasswordPerfil(
        usuarioId, 
        tipoUsuario, 
        passwordActual, 
        passwordNueva
      );
      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };
    } catch (error) {
      console.error('❌ Error en controlador:', error.message);
      
      if (error.message === 'Contraseña actual incorrecta') {
        throw new HttpException('Contraseña actual incorrecta', HttpStatus.UNAUTHORIZED);
      }
      if (error.message === 'Usuario no encontrado') {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

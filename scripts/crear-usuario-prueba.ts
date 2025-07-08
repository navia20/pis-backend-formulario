import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Crear un usuario de prueba para testing de recuperación
    const usuarioPrueba = {
      rut: '11.111.111-1',
      nombres: 'Usuario',
      apellidos: 'Prueba',
      email: 'test@universidad.cl',
      contraseña: 'password123',
      id_carrera: '507f1f77bcf86cd799439011', // ID de carrera dummy
      año_ingreso: 2023
    };

    console.log('🔧 Creando usuario de prueba para testing...');
    
    // Crear como alumno
    const alumno = await authService.registerAlumno(usuarioPrueba);
    
    console.log('✅ Usuario de prueba creado exitosamente:', {
      id: alumno.id,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      email: alumno.email,
      rut: alumno.rut,
      tipo: 'alumno'
    });

    console.log('📧 Puedes usar este email para probar: test@universidad.cl');

  } catch (error) {
    if (error.message?.includes('E11000')) {
      console.log('ℹ️ El usuario de prueba ya existe: test@universidad.cl');
    } else {
      console.error('❌ Error creando usuario de prueba:', error);
    }
  } finally {
    await app.close();
  }
}

bootstrap();

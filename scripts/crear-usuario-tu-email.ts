import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Crear un usuario con tu email específico
    const usuarioTuEmail = {
      rut: '22.222.222-2',
      nombres: 'Matías',
      apellidos: 'Navia',
      email: 'maty.naviaaa@gmail.com',
      contraseña: 'password123',
      id_carrera: '507f1f77bcf86cd799439011', // ID de carrera dummy
      año_ingreso: 2023
    };

    console.log('🔧 Creando usuario con tu email...');
    
    // Crear como alumno
    const alumno = await authService.registerAlumno(usuarioTuEmail);
    
    console.log('✅ Usuario creado exitosamente:', {
      id: alumno.id,
      nombres: alumno.nombres,
      apellidos: alumno.apellidos,
      email: alumno.email,
      rut: alumno.rut,
      tipo: 'alumno'
    });

    console.log('📧 Ahora puedes usar: maty.naviaaa@gmail.com para probar');

  } catch (error) {
    if (error.message?.includes('E11000')) {
      console.log('ℹ️ El usuario ya existe: maty.naviaaa@gmail.com');
      console.log('✅ Puedes proceder con las pruebas');
    } else {
      console.error('❌ Error creando usuario:', error);
    }
  } finally {
    await app.close();
  }
}

bootstrap();

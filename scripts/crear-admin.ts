import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/modules/auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Datos del administrador
    const adminData = {
      rut: '12.345.678-9',
      nombres: 'Administrador',
      apellidos: 'Sistema',
      email: 'admin@universidad.cl',
      contraseña: 'admin123',
      rol: 'Administrador Principal'
    };

    console.log('🔧 Creando administrador...');
    
    // Crear el administrador
    const admin = await authService.registerAdmin(adminData);
    
    console.log('✅ Administrador creado exitosamente:', {
      id: admin.id,
      nombres: admin.nombres,
      apellidos: admin.apellidos,
      email: admin.email,
      rut: admin.rut,
      rol: admin.rol
    });

  } catch (error) {
    console.error('❌ Error creando administrador:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

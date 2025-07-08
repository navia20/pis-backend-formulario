import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EmailService } from '../src/modules/auth/email.service';

async function testEmailConfiguration() {
  console.log('🔧 Verificando configuración de email...');
  
  try {
    const app = await NestFactory.create(AppModule);
    const emailService = app.get(EmailService);
    
    // Verificar conexión
    const isConnected = await emailService.verificarConexion();
    
    if (isConnected) {
      console.log('✅ Configuración de email verificada exitosamente');
      console.log('📧 El sistema está listo para enviar emails reales');
      
      // Opcional: enviar email de prueba si se especifica un email
      const emailPrueba = process.argv[2];
      if (emailPrueba) {
        console.log(`📮 Enviando email de prueba a: ${emailPrueba}`);
        await emailService.enviarCodigoRecuperacion(emailPrueba, '123456');
        console.log('✅ Email de prueba enviado exitosamente');
      }
    } else {
      console.log('❌ Error en la configuración de email');
      console.log('💡 Verifica las variables EMAIL_USER y EMAIL_PASSWORD en el archivo .env');
    }
    
    await app.close();
  } catch (error) {
    console.error('❌ Error al verificar configuración:', error.message);
    console.log('\n📋 Pasos para configurar Gmail:');
    console.log('1. Activar verificación en dos pasos en tu cuenta Gmail');
    console.log('2. Crear una "Contraseña de aplicación" específica');
    console.log('3. Usar esa contraseña en EMAIL_PASSWORD (no tu contraseña normal)');
    console.log('4. Configurar EMAIL_USER con tu dirección de Gmail');
  }
}

testEmailConfiguration();

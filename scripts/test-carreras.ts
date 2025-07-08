import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { CarreraService } from '../src/modules/carrera/carrera.service';

async function testCarreras() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const carreraService = app.get(CarreraService);

  try {
    console.log('🚀 Probando carreras...\n');

    // 1. Crear algunas carreras de prueba si no existen
    console.log('1. Verificando carreras existentes...');
    const carrerasExistentes = await carreraService.findAll();
    console.log(`Carreras encontradas: ${carrerasExistentes.length}`);
    
    if (carrerasExistentes.length === 0) {
      console.log('2. Creando carreras de prueba...');
      
      const carrera1 = await carreraService.create({
        nombre: 'Ingeniería Civil Informática'
      });
      
      const carrera2 = await carreraService.create({
        nombre: 'Ingeniería Civil Industrial'
      });
      
      const carrera3 = await carreraService.create({
        nombre: 'Ingeniería en Software'
      });
      
      console.log(`✅ Carreras creadas:`);
      console.log(`   - ${carrera1.nombre} (ID: ${carrera1.id})`);
      console.log(`   - ${carrera2.nombre} (ID: ${carrera2.id})`);
      console.log(`   - ${carrera3.nombre} (ID: ${carrera3.id})`);
    } else {
      console.log('✅ Carreras existentes:');
      carrerasExistentes.forEach(carrera => {
        console.log(`   - ${carrera.nombre} (ID: ${carrera.id})`);
      });
    }

    // 3. Verificar estructura final
    console.log('\n3. Verificando estructura final...');
    const todasCarreras = await carreraService.findAll();
    console.log('📊 Total de carreras:', todasCarreras.length);
    console.log('🔍 Estructura de datos:');
    console.log(JSON.stringify(todasCarreras, null, 2));

    console.log('\n🎉 ¡Prueba de carreras completada!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar las pruebas
testCarreras();

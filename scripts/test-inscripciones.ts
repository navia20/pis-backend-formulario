import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AlumnoService } from '../src/modules/alumno/alumno.service';
import { AsignaturaService } from '../src/modules/asignatura/asignatura.service';
import { InscripcionService } from '../src/modules/inscripcion/inscripcion.service';

async function testInscripciones() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const alumnoService = app.get(AlumnoService);
  const asignaturaService = app.get(AsignaturaService);
  const inscripcionService = app.get(InscripcionService);

  try {
    console.log('🚀 Iniciando pruebas de inscripciones...\n');

    // 1. Crear algunos estudiantes de prueba
    console.log('1. Creando estudiantes de prueba...');
    const estudiante1 = await alumnoService.create({
      nombres: 'Juan Carlos',
      apellidos: 'Pérez González',
      rut: '12.345.678-9',
      email: 'juan.perez@test.cl',
      contraseña: '123456',
      id_carrera: 'ING-SOFT',
      año_ingreso: 2023
    });

    const estudiante2 = await alumnoService.create({
      nombres: 'María Elena',
      apellidos: 'García López',
      rut: '98.765.432-1',
      email: 'maria.garcia@test.cl',
      contraseña: '123456',
      id_carrera: 'ING-CIVIL',
      año_ingreso: 2022
    });

    console.log(`✅ Estudiantes creados: ${estudiante1.nombres} y ${estudiante2.nombres}\n`);

    // 2. Crear algunas asignaturas de prueba
    console.log('2. Creando asignaturas de prueba...');
    const asignatura1 = await asignaturaService.create({
      nombre: 'Programación Avanzada',
      id_carrera: 'ING-SOFT',
      id_docentes: []
    });

    const asignatura2 = await asignaturaService.create({
      nombre: 'Matemáticas Aplicadas',
      id_carrera: 'ING-CIVIL',
      id_docentes: []
    });

    console.log(`✅ Asignaturas creadas: ${asignatura1.nombre} y ${asignatura2.nombre}\n`);

    // 3. Probar inscripciones individuales
    console.log('3. Probando inscripciones individuales...');
    const inscripcion1 = await inscripcionService.create({
      id_alumno: estudiante1.id,
      id_asignatura: asignatura1.id
    });

    console.log(`✅ Inscripción creada: ${estudiante1.nombres} en ${asignatura1.nombre}\n`);

    // 4. Probar inscripciones múltiples
    console.log('4. Probando inscripciones múltiples...');
    const inscripcionesMultiples = await inscripcionService.inscribirMultiples(
      asignatura2.id,
      [estudiante1.id, estudiante2.id]
    );

    console.log(`✅ ${inscripcionesMultiples.length} inscripciones múltiples creadas\n`);

    // 5. Verificar todas las inscripciones
    console.log('5. Verificando todas las inscripciones...');
    const todasInscripciones = await inscripcionService.findAll();
    console.log(`📊 Total de inscripciones: ${todasInscripciones.length}`);
    
    todasInscripciones.forEach((insc, index) => {
      console.log(`   ${index + 1}. Alumno: ${insc.id_alumno} -> Asignatura: ${insc.id_asignatura} (${insc.estado})`);
    });

    // 6. Probar consultas por alumno
    console.log('\n6. Consultando inscripciones por alumno...');
    const inscripcionesEstudiante1 = await inscripcionService.findByAlumno(estudiante1.id);
    console.log(`📚 ${estudiante1.nombres} tiene ${inscripcionesEstudiante1.length} inscripciones`);

    // 7. Probar consultas por asignatura
    console.log('\n7. Consultando inscripciones por asignatura...');
    const inscripcionesAsignatura2 = await inscripcionService.findByAsignatura(asignatura2.id);
    console.log(`👥 ${asignatura2.nombre} tiene ${inscripcionesAsignatura2.length} estudiantes inscritos`);

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar las pruebas
testInscripciones();

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { EncuestaService } from '../src/modules/encuesta/encuesta.service';
import { CarreraService } from '../src/modules/carrera/carrera.service';
import { AsignaturaService } from '../src/modules/asignatura/asignatura.service';

async function testEncuestas() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const encuestaService = app.get(EncuestaService);
  const carreraService = app.get(CarreraService);
  const asignaturaService = app.get(AsignaturaService);

  try {
    console.log('🚀 Iniciando pruebas de encuestas...\n');

    // 1. Crear carrera si no existe
    console.log('1. Verificando carreras...');
    let carreras = await carreraService.findAll();
    if (carreras.length === 0) {
      await carreraService.create({ nombre: 'Ingeniería en Software' });
      await carreraService.create({ nombre: 'Ingeniería Civil' });
      carreras = await carreraService.findAll();
    }
    console.log(`✅ Carreras disponibles: ${carreras.length}\n`);

    // 2. Crear asignatura si no existe
    console.log('2. Verificando asignaturas...');
    let asignaturas = await asignaturaService.findAll();
    if (asignaturas.length === 0) {
      await asignaturaService.create({
        nombre: 'Programación Avanzada',
        id_carrera: carreras[0].id,
        id_docentes: []
      });
      asignaturas = await asignaturaService.findAll();
    }
    console.log(`✅ Asignaturas disponibles: ${asignaturas.length}\n`);

    // 3. Crear encuesta con preguntas
    console.log('3. Creando encuesta con preguntas...');
    const nuevaEncuesta = await encuestaService.create({
      titulo: 'Evaluación de Programación Avanzada',
      descripcion: 'Encuesta para evaluar la calidad de la asignatura',
      id_asignatura: asignaturas[0].id,
      fecha_termino: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      preguntas: [
        {
          texto: '¿Cómo calificarías la dificultad del curso?',
          respuestas: ['Muy fácil', 'Fácil', 'Intermedio', 'Difícil', 'Muy difícil'],
          respuestaCorrecta: 2
        },
        {
          texto: '¿Recomendarías esta asignatura a otros estudiantes?',
          respuestas: ['Definitivamente sí', 'Probablemente sí', 'No estoy seguro', 'Probablemente no', 'Definitivamente no'],
          respuestaCorrecta: 0
        },
        {
          texto: '¿Qué aspecto del curso te gustó más?',
          respuestas: ['Las clases teóricas', 'Los laboratorios prácticos', 'Los proyectos', 'El material de estudio'],
          respuestaCorrecta: 1
        }
      ]
    });

    console.log(`✅ Encuesta creada con ID: ${nuevaEncuesta.id}`);
    console.log(`   Título: ${nuevaEncuesta.titulo}`);
    console.log(`   Preguntas: ${nuevaEncuesta.preguntas.length}`);
    console.log(`   Asignatura: ${nuevaEncuesta.id_asignatura}`);
    console.log(`   Fecha límite: ${nuevaEncuesta.fecha_termino}\n`);

    // 4. Verificar que se pueden obtener todas las encuestas
    console.log('4. Verificando listado de encuestas...');
    const todasEncuestas = await encuestaService.findAll();
    console.log(`📊 Total de encuestas activas: ${todasEncuestas.length}`);
    
    todasEncuestas.forEach((enc, index) => {
      console.log(`   ${index + 1}. ${enc.titulo} (${enc.preguntas.length} preguntas)`);
    });

    // 5. Verificar obtener encuesta por ID
    console.log('\n5. Obteniendo encuesta por ID...');
    const encuestaObtenida = await encuestaService.findById(nuevaEncuesta.id);
    if (encuestaObtenida) {
      console.log(`✅ Encuesta obtenida: ${encuestaObtenida.titulo}`);
      console.log(`   Preguntas completas: ${encuestaObtenida.preguntas.length}`);
      encuestaObtenida.preguntas.forEach((p, i) => {
        console.log(`   Pregunta ${i + 1}: ${p.texto}`);
        console.log(`   Respuestas: ${p.respuestas.length}, Correcta: ${p.respuestaCorrecta}`);
      });
    }

    console.log('\n🎉 ¡Todas las pruebas de encuestas completadas exitosamente!');

    // 6. Probar publicación de encuesta
    console.log('\n6. Probando publicación de encuesta...');
    const encuestaPublicada = await encuestaService.publicarEncuesta(nuevaEncuesta.id);
    if (encuestaPublicada) {
      console.log(`✅ Encuesta publicada: ${encuestaPublicada.titulo}`);
      console.log(`   Estado publicado: ${encuestaPublicada.publicado}`);
      console.log(`   Estado enviado: ${encuestaPublicada.enviado}`);
    }

    // 7. Verificar encuestas publicadas
    console.log('\n7. Verificando encuestas publicadas...');
    const encuestasPublicadas = await encuestaService.findPublicadas();
    console.log(`📢 Total de encuestas publicadas: ${encuestasPublicadas.length}`);

    // 8. Despublicar encuesta
    console.log('\n8. Despublicando encuesta...');
    const encuestaDespublicada = await encuestaService.despublicarEncuesta(nuevaEncuesta.id);
    if (encuestaDespublicada) {
      console.log(`✅ Encuesta despublicada: ${encuestaDespublicada.titulo}`);
      console.log(`   Estado publicado: ${encuestaDespublicada.publicado}`);
    }

    console.log('\n🎉 ¡Todas las pruebas completadas exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar las pruebas
testEncuestas();

// Script para crear una encuesta de prueba
import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/pis_db';

async function crearEncuestaPrueba() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('pis_db');
    
    // Crear una encuesta de prueba
    const encuestaPrueba = {
      id: 'encuesta-001',
      titulo: 'Evaluación de Matemáticas - Álgebra Básica',
      descripcion: 'Evaluación sobre conceptos básicos de álgebra',
      id_asignatura: 'MAT101',
      fecha_creacion: new Date(),
      fecha_termino: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
      preguntas: [
        {
          id: 'pregunta-1',
          texto: '¿Cuál es el resultado de 2x + 3 = 7?',
          respuestas: ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
          respuestaCorrecta: 1 // x = 2
        },
        {
          id: 'pregunta-2',
          texto: 'Si y = 3x + 1 y x = 2, ¿cuál es el valor de y?',
          respuestas: ['y = 5', 'y = 7', 'y = 9', 'y = 11'],
          respuestaCorrecta: 1 // y = 7
        },
        {
          id: 'pregunta-3',
          texto: '¿Cuál es la forma factorizada de x² - 4?',
          respuestas: ['(x-2)(x+2)', '(x-4)(x+4)', '(x-1)(x+4)', '(x-3)(x+1)'],
          respuestaCorrecta: 0 // (x-2)(x+2)
        }
      ],
      activo: true,
      publicado: true,
      enviado: false
    };
    
    // Verificar si ya existe
    const existe = await db.collection('encuestas').findOne({ id: encuestaPrueba.id });
    if (existe) {
      console.log('La encuesta de prueba ya existe');
      return;
    }
    
    // Insertar la encuesta
    const resultado = await db.collection('encuestas').insertOne(encuestaPrueba);
    console.log('Encuesta de prueba creada:', resultado.insertedId);
    
    // Verificar que se creó correctamente
    const encuestaCreada = await db.collection('encuestas').findOne({ _id: resultado.insertedId });
    if (encuestaCreada) {
      console.log('Encuesta verificada:', {
        titulo: encuestaCreada.titulo,
        activo: encuestaCreada.activo,
        publicado: encuestaCreada.publicado,
        preguntas: encuestaCreada.preguntas.length
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

crearEncuestaPrueba();

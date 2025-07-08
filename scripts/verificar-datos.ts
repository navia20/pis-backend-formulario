// Script para verificar datos de alumnos y carreras
import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/pis_db';

async function verificarDatos() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('pis_db');
    
    // Verificar alumnos
    console.log('\n=== ALUMNOS ===');
    const alumnos = await db.collection('alumnos').find().toArray();
    console.log(`Total de alumnos: ${alumnos.length}`);
    
    alumnos.forEach((alumno, index) => {
      console.log(`\nAlumno ${index + 1}:`);
      console.log(`- Nombres: ${alumno.nombres}`);
      console.log(`- Apellidos: ${alumno.apellidos}`);
      console.log(`- RUT: ${alumno.rut}`);
      console.log(`- ID Carrera: ${alumno.id_carrera}`);
      console.log(`- Tipo de id_carrera: ${typeof alumno.id_carrera}`);
      console.log(`- Año ingreso: ${alumno.año_ingreso}`);
    });
    
    // Verificar carreras
    console.log('\n=== CARRERAS ===');
    const carreras = await db.collection('carreras').find().toArray();
    console.log(`Total de carreras: ${carreras.length}`);
    
    carreras.forEach((carrera, index) => {
      console.log(`\nCarrera ${index + 1}:`);
      console.log(`- ID: ${carrera._id}`);
      console.log(`- Nombre: ${carrera.nombre}`);
      console.log(`- Código: ${carrera.codigo}`);
    });
    
    // Verificar coincidencias
    console.log('\n=== VERIFICACIÓN DE COINCIDENCIAS ===');
    for (const alumno of alumnos) {
      if (alumno.id_carrera) {
        const carreraEncontrada = carreras.find(c => c._id.toString() === alumno.id_carrera.toString());
        console.log(`\nAlumno ${alumno.nombres} ${alumno.apellidos}:`);
        console.log(`- ID Carrera: ${alumno.id_carrera}`);
        console.log(`- Carrera encontrada: ${carreraEncontrada ? carreraEncontrada.nombre : 'NO ENCONTRADA'}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

verificarDatos();

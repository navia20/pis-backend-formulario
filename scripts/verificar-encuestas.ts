// Script para verificar encuestas en la base de datos
import { MongoClient } from 'mongodb';

const MONGO_URL = 'mongodb://localhost:27017/pis_db';

async function verificarEncuestas() {
  const client = new MongoClient(MONGO_URL);
  
  try {
    await client.connect();
    console.log('Conectado a MongoDB');
    
    const db = client.db('pis_db');
    
    // Verificar encuestas
    console.log('\n=== ENCUESTAS ===');
    const encuestas = await db.collection('encuestas').find().toArray();
    console.log(`Total de encuestas: ${encuestas.length}`);
    
    encuestas.forEach((encuesta, index) => {
      console.log(`\nEncuesta ${index + 1}:`);
      console.log(`- ID: ${encuesta._id}`);
      console.log(`- Título: ${encuesta.titulo}`);
      console.log(`- ID Asignatura: ${encuesta.id_asignatura}`);
      console.log(`- Publicado: ${encuesta.publicado}`);
      console.log(`- Activo: ${encuesta.activo}`);
      console.log(`- Enviado: ${encuesta.enviado}`);
      console.log(`- Fecha creación: ${encuesta.fecha_creacion}`);
      console.log(`- Fecha término: ${encuesta.fecha_termino}`);
      console.log(`- Preguntas: ${encuesta.preguntas ? encuesta.preguntas.length : 0}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

verificarEncuestas();

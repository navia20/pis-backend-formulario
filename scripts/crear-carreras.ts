import { connect, Model } from 'mongoose';
import { Carrera, CarreraSchema } from '../src/modules/carrera/carrera.schema';
import { model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const carreras = [
  { nombre: 'Ingeniería en Sistemas' },
  { nombre: 'Ingeniería Industrial' },
  { nombre: 'Ingeniería Civil' },
  { nombre: 'Ingeniería Comercial' },
  { nombre: 'Ingeniería en Informática' },
  { nombre: 'Ingeniería Eléctrica' },
  { nombre: 'Ingeniería Mecánica' },
  { nombre: 'Administración de Empresas' },
  { nombre: 'Contabilidad y Auditoría' },
  { nombre: 'Psicología' },
  { nombre: 'Derecho' },
  { nombre: 'Medicina' },
  { nombre: 'Enfermería' },
  { nombre: 'Arquitectura' },
];

async function crearCarreras() {
  try {
    await connect('mongodb://localhost:27017/pis-backend');
    console.log('✅ Conectado a MongoDB');

    const CarreraModel = model('Carrera', CarreraSchema);

    console.log('🎓 Creando carreras...');

    for (const carreraData of carreras) {
      // Verificar si ya existe
      const carreraExistente = await CarreraModel.findOne({ nombre: carreraData.nombre });
      
      if (!carreraExistente) {
        const nuevaCarrera = new CarreraModel({
          id: uuidv4(),
          nombre: carreraData.nombre
        });
        
        await nuevaCarrera.save();
        console.log(`✅ Carrera creada: ${carreraData.nombre}`);
      } else {
        console.log(`⚠️ Carrera ya existe: ${carreraData.nombre}`);
      }
    }

    console.log('\n🎓 Carreras disponibles:');
    const todasLasCarreras = await CarreraModel.find();
    todasLasCarreras.forEach(carrera => {
      console.log(`- ${carrera.nombre} (ID: ${carrera.id})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

crearCarreras();
import { connect, model } from 'mongoose';
import { AdminSchema } from '../src/modules/admin/admin.schema';
import { AlumnoSchema } from '../src/modules/alumno/alumno.schema';
import * as bcrypt from 'bcrypt';

async function crearUsuariosDirectos() {
  try {
    await connect('mongodb://localhost:27017/pis-backend');
    console.log('✅ Conectado a MongoDB');

    // Crear modelos
    const AdminModel = model('Admin', AdminSchema);
    const AlumnoModel = model('Alumno', AlumnoSchema);

    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Crear usuario admin
    console.log('🔧 Creando usuario admin...');
    const adminData = {
      rut: '12.345.678-9',
      nombres: 'Admin',
      apellidos: 'Sistema',
      email: 'admin@test.com',
      contraseña: hashedPassword,
      tipo: 'admin',
      rol: 'administrador'
    };

    try {
      const admin = new AdminModel(adminData);
      await admin.save();
      console.log('✅ Admin creado:', {
        _id: admin._id,
        id: admin.id,
        email: admin.email,
        nombres: admin.nombres
      });
    } catch (error: any) {
      if (error.code === 11000) {
        console.log('ℹ️ Admin ya existe');
      } else {
        console.error('❌ Error creando admin:', error);
      }
    }

    // Crear usuario alumno
    console.log('🔧 Creando usuario alumno...');
    const alumnoData = {
      rut: '11.111.111-1',
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan.perez@example.com',
      contraseña: hashedPassword,
      tipo: 'alumno',
      id_carrera: '507f1f77bcf86cd799439011',
      año_ingreso: '2023'
    };

    try {
      const alumno = new AlumnoModel(alumnoData);
      await alumno.save();
      console.log('✅ Alumno creado:', {
        _id: alumno._id,
        id: alumno.id,
        email: alumno.email,
        nombres: alumno.nombres
      });
    } catch (error: any) {
      if (error.code === 11000) {
        console.log('ℹ️ Alumno ya existe');
      } else {
        console.error('❌ Error creando alumno:', error);
      }
    }

    console.log('\n✅ Proceso completado');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

crearUsuariosDirectos();

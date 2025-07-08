import { connect, Model } from 'mongoose';
import { Admin, AdminSchema } from '../src/modules/admin/admin.schema';
import { Docente, DocenteSchema } from '../src/modules/docente/docente.schema';
import { Alumno, AlumnoSchema } from '../src/modules/alumno/alumno.schema';
import { model } from 'mongoose';

async function verificarUsuarios() {
  try {
    await connect('mongodb://localhost:27017/pis-backend');
    console.log('✅ Conectado a MongoDB');

    // Crear modelos
    const AdminModel = model('Admin', AdminSchema);
    const DocenteModel = model('Docente', DocenteSchema);
    const AlumnoModel = model('Alumno', AlumnoSchema);

    console.log('\n📋 USUARIOS EN LA BASE DE DATOS:');
    
    // Contar documentos en cada colección
    const adminCount = await AdminModel.countDocuments();
    const docenteCount = await DocenteModel.countDocuments();
    const alumnoCount = await AlumnoModel.countDocuments();
    
    console.log(`👨‍💼 ADMINS: ${adminCount} documentos`);
    console.log(`👨‍🏫 DOCENTES: ${docenteCount} documentos`);
    console.log(`👨‍🎓 ALUMNOS: ${alumnoCount} documentos`);

    // Verificar admins
    const admins = await AdminModel.find().limit(3);
    console.log('\n👨‍💼 ADMINS:');
    if (admins.length === 0) {
      console.log('  No hay administradores');
    }
    admins.forEach(admin => {
      console.log(`  - _ID: ${admin._id}`);
      console.log(`  - ID: ${admin.id}`);
      console.log(`  - Email: ${admin.email}`);
      console.log(`  - Nombres: ${admin.nombres}`);
      console.log(`  - Has Contraseña: ${!!(admin as any).contraseña}`);
      console.log('  ---');
    });

    // Verificar docentes
    const docentes = await DocenteModel.find().limit(3);
    console.log('\n👨‍🏫 DOCENTES:');
    if (docentes.length === 0) {
      console.log('  No hay docentes');
    }
    docentes.forEach(docente => {
      console.log(`  - _ID: ${docente._id}`);
      console.log(`  - ID: ${docente.id}`);
      console.log(`  - Email: ${docente.email}`);
      console.log(`  - Nombres: ${docente.nombres}`);
      console.log(`  - Has Contraseña: ${!!(docente as any).contraseña}`);
      console.log('  ---');
    });

    // Verificar alumnos
    const alumnos = await AlumnoModel.find().limit(3);
    console.log('\n👨‍🎓 ALUMNOS:');
    if (alumnos.length === 0) {
      console.log('  No hay alumnos');
    }
    alumnos.forEach(alumno => {
      console.log(`  - _ID: ${alumno._id}`);
      console.log(`  - ID: ${alumno.id}`);
      console.log(`  - Email: ${alumno.email}`);
      console.log(`  - Nombres: ${alumno.nombres}`);
      console.log(`  - Has Contraseña: ${!!(alumno as any).contraseña}`);
      console.log('  ---');
    });

    // Buscar el usuario de prueba específico
    console.log('\n🔍 BUSCANDO USUARIO DE PRUEBA:');
    
    // Buscar por admin@test.com
    let usuarioPrueba = await AdminModel.findOne({ email: 'admin@test.com' });
    if (usuarioPrueba) {
      console.log('✅ Usuario admin de prueba encontrado:');
      console.log(`  - _ID: ${usuarioPrueba._id}`);
      console.log(`  - ID: ${usuarioPrueba.id}`);
      console.log(`  - Email: ${usuarioPrueba.email}`);
      console.log(`  - Nombres: ${usuarioPrueba.nombres}`);
      console.log(`  - Tipo: admin`);
      console.log(`  - Has Contraseña: ${!!(usuarioPrueba as any).contraseña}`);
    }
    
    // Buscar por test@universidad.cl (alumno)
    const alumnoPrueba = await AlumnoModel.findOne({ email: 'test@universidad.cl' });
    if (alumnoPrueba) {
      console.log('✅ Usuario alumno de prueba encontrado:');
      console.log(`  - _ID: ${alumnoPrueba._id}`);
      console.log(`  - ID: ${alumnoPrueba.id}`);
      console.log(`  - Email: ${alumnoPrueba.email}`);
      console.log(`  - Nombres: ${alumnoPrueba.nombres}`);
      console.log(`  - Tipo: alumno`);
      console.log(`  - Has Contraseña: ${!!(alumnoPrueba as any).contraseña}`);
    }
    
    if (!usuarioPrueba && !alumnoPrueba) {
      console.log('❌ No se encontraron usuarios de prueba');
      
      // Verificar todas las colecciones disponibles
      console.log('\n🔍 Listando todas las colecciones:');
      const db = AdminModel.db;
      const collections = await db.listCollections();
      console.log('Collections:', collections);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

verificarUsuarios();

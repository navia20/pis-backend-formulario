const XLSX = require('xlsx');
const path = require('path');

// Datos de ejemplo para alumnos
const datosAlumnos = [
  {
    nombres: 'Juan Carlos',
    apellidos: 'García Martínez', 
    rut: '12345678-9',
    email: 'juan.garcia@estudiante.cl',
    nombre_carrera: 'Ingeniería en Sistemas',
    año_ingreso: 2024
  },
  {
    nombres: 'María Elena',
    apellidos: 'Rodríguez López',
    rut: '23456789-0', 
    email: 'maria.rodriguez@estudiante.cl',
    nombre_carrera: 'Ingeniería Industrial',
    año_ingreso: 2024
  },
  {
    nombres: 'Pedro Antonio',
    apellidos: 'Fernández Silva',
    rut: '34567890-1',
    email: 'pedro.fernandez@estudiante.cl', 
    nombre_carrera: 'Ingeniería Civil',
    año_ingreso: 2023
  },
  {
    nombres: 'Ana Sofía',
    apellidos: 'Morales Díaz',
    rut: '45678901-2',
    email: 'ana.morales@estudiante.cl',
    nombre_carrera: 'Ingeniería en Sistemas',
    año_ingreso: 2024
  },
  {
    nombres: 'Luis Fernando',
    apellidos: 'Vargas Castillo',
    rut: '56789012-3',
    email: 'luis.vargas@estudiante.cl',
    nombre_carrera: 'Ingeniería Comercial',
    año_ingreso: 2023
  }
];

// Datos de ejemplo para docentes
const datosDocentes = [
  {
    nombres: 'Dr. Roberto',
    apellidos: 'Mendoza Herrera',
    rut: '11111111-1',
    email: 'roberto.mendoza@universidad.cl'
  },
  {
    nombres: 'Dra. Carmen',
    apellidos: 'Valenzuela Reyes',
    rut: '22222222-2', 
    email: 'carmen.valenzuela@universidad.cl'
  },
  {
    nombres: 'Mg. Fernando',
    apellidos: 'Espinoza Torres',
    rut: '33333333-3',
    email: 'fernando.espinoza@universidad.cl'
  }
];

// Datos de ejemplo para administradores
const datosAdmins = [
  {
    nombres: 'Carlos',
    apellidos: 'Administrador Principal',
    rut: '77777777-7',
    email: 'carlos.admin@universidad.cl',
    rol: 'Administrador de Sistema'
  },
  {
    nombres: 'Patricia',
    apellidos: 'Coordinadora Académica',
    rut: '88888888-8',
    email: 'patricia.coord@universidad.cl', 
    rol: 'Coordinadora Académica'
  }
];

function crearArchivosEjemplo() {
  console.log('📁 Creando archivos de ejemplo para carga masiva...');

  // Crear archivo para alumnos
  const workbookAlumnos = XLSX.utils.book_new();
  const worksheetAlumnos = XLSX.utils.json_to_sheet(datosAlumnos);
  
  // Ajustar ancho de columnas para alumnos
  worksheetAlumnos['!cols'] = [
    { wch: 15 }, // nombres
    { wch: 20 }, // apellidos
    { wch: 12 }, // rut
    { wch: 30 }, // email
    { wch: 25 }, // nombre_carrera
    { wch: 12 }, // año_ingreso
  ];
  
  XLSX.utils.book_append_sheet(workbookAlumnos, worksheetAlumnos, 'Alumnos');
  XLSX.writeFile(workbookAlumnos, path.join(__dirname, '../ejemplo_alumnos.xlsx'));
  console.log('✅ Archivo ejemplo_alumnos.xlsx creado');

  // Crear archivo para docentes
  const workbookDocentes = XLSX.utils.book_new();
  const worksheetDocentes = XLSX.utils.json_to_sheet(datosDocentes);
  
  worksheetDocentes['!cols'] = [
    { wch: 15 }, // nombres
    { wch: 20 }, // apellidos
    { wch: 12 }, // rut
    { wch: 30 }, // email
  ];
  
  XLSX.utils.book_append_sheet(workbookDocentes, worksheetDocentes, 'Docentes');
  XLSX.writeFile(workbookDocentes, path.join(__dirname, '../ejemplo_docentes.xlsx'));
  console.log('✅ Archivo ejemplo_docentes.xlsx creado');

  // Crear archivo para administradores
  const workbookAdmins = XLSX.utils.book_new();
  const worksheetAdmins = XLSX.utils.json_to_sheet(datosAdmins);
  
  worksheetAdmins['!cols'] = [
    { wch: 15 }, // nombres
    { wch: 25 }, // apellidos
    { wch: 12 }, // rut
    { wch: 30 }, // email
    { wch: 25 }, // rol
  ];
  
  XLSX.utils.book_append_sheet(workbookAdmins, worksheetAdmins, 'Administradores');
  XLSX.writeFile(workbookAdmins, path.join(__dirname, '../ejemplo_administradores.xlsx'));
  console.log('✅ Archivo ejemplo_administradores.xlsx creado');

  console.log('\n📊 Archivos de ejemplo creados en la carpeta pis-backend:');
  console.log('- ejemplo_alumnos.xlsx (5 alumnos)');
  console.log('- ejemplo_docentes.xlsx (3 docentes)');
  console.log('- ejemplo_administradores.xlsx (2 administradores)');
  console.log('\n💡 Estos archivos pueden usarse para probar la funcionalidad de carga masiva.');
}

crearArchivosEjemplo();

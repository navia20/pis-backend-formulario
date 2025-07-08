// Inicialización de MongoDB para Docker
// Este script se ejecuta cuando MongoDB se inicia por primera vez

// Crear usuario para la aplicación
db = db.getSiblingDB('pis_db');

db.createUser({
  user: 'pis_user',
  pwd: 'pis_password',
  roles: [
    {
      role: 'readWrite',
      db: 'pis_db'
    }
  ]
});

// Crear colecciones básicas (opcional)
db.createCollection('admins');
db.createCollection('alumnos');
db.createCollection('docentes');
db.createCollection('carreras');
db.createCollection('asignaturas');
db.createCollection('encuestas');
db.createCollection('respuestas');
db.createCollection('inscripcions');

// Insertar datos de prueba (opcional)
print('Base de datos PIS inicializada correctamente');

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { Admin, AdminDocument } from '../admin/admin.schema';
import { Docente, DocenteDocument } from '../docente/docente.schema';
import { Alumno, AlumnoDocument } from '../alumno/alumno.schema';
import { Carrera, CarreraDocument } from '../carrera/carrera.schema';

interface UsuarioExcel {
  nombres: string;
  apellidos: string;
  rut: string;
  email: string;
  contraseña?: string;
  // Campos específicos por tipo
  rol?: string; // Para admin
  id_carrera?: string; // Para alumno
  nombre_carrera?: string; // Para alumno
  año_ingreso?: string; // Para alumno
}

interface ResultadoProcesamiento {
  usuariosCreados: number;
  usuariosConError: number;
  errores: Array<{
    fila: number;
    usuario: any;
    error: string;
  }>;
  detalles: Array<{
    fila: number;
    usuario: string;
    status: 'creado' | 'error';
    mensaje: string;
  }>;
}

@Injectable()
export class CargaMasivaService {
  constructor(
    @InjectModel('Admin') private adminModel: Model<AdminDocument>,
    @InjectModel('Docente') private docenteModel: Model<DocenteDocument>,
    @InjectModel('Alumno') private alumnoModel: Model<AlumnoDocument>,
    @InjectModel('Carrera') private carreraModel: Model<CarreraDocument>,
  ) {}

  async procesarArchivoExcel(
    archivoBuffer: Buffer, 
    tipoUsuario: 'admin' | 'docente' | 'alumno'
  ): Promise<ResultadoProcesamiento> {
    try {
      console.log('📊 Procesando archivo Excel...');
      
      // Leer el archivo Excel
      const workbook = XLSX.read(archivoBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`📋 ${data.length} filas encontradas en el Excel`);
      
      if (data.length === 0) {
        throw new HttpException('El archivo Excel está vacío', HttpStatus.BAD_REQUEST);
      }

      const resultado: ResultadoProcesamiento = {
        usuariosCreados: 0,
        usuariosConError: 0,
        errores: [],
        detalles: []
      };

      // Procesar cada fila
      for (let i = 0; i < data.length; i++) {
        const fila = i + 2; // +2 porque empezamos en fila 2 (después del header)
        const usuario = data[i];
        
        try {
          console.log(`\n🔄 Procesando fila ${fila}:`, usuario);
          
          // Validar datos requeridos
          const erroresValidacion = this.validarDatosUsuario(usuario, tipoUsuario);
          if (erroresValidacion.length > 0) {
            throw new Error(erroresValidacion.join(', '));
          }

          // Crear el usuario
          const usuarioCreado = await this.crearUsuario(usuario, tipoUsuario);
          
          resultado.usuariosCreados++;
          resultado.detalles.push({
            fila,
            usuario: `${usuario.nombres} ${usuario.apellidos}`,
            status: 'creado',
            mensaje: 'Usuario creado exitosamente'
          });
          
          console.log(`✅ Usuario creado: ${usuario.nombres} ${usuario.apellidos}`);
          
        } catch (error) {
          console.error(`❌ Error en fila ${fila}:`, error.message);
          
          resultado.usuariosConError++;
          resultado.errores.push({
            fila,
            usuario,
            error: error.message
          });
          resultado.detalles.push({
            fila,
            usuario: `${usuario.nombres || 'N/A'} ${usuario.apellidos || 'N/A'}`,
            status: 'error',
            mensaje: error.message
          });
        }
      }

      console.log('\n📊 Resultado final:');
      console.log(`✅ Usuarios creados: ${resultado.usuariosCreados}`);
      console.log(`❌ Usuarios con error: ${resultado.usuariosConError}`);

      return resultado;
      
    } catch (error) {
      console.error('❌ Error al procesar archivo Excel:', error);
      throw new HttpException(
        `Error al procesar el archivo: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private validarDatosUsuario(usuario: any, tipoUsuario: string): string[] {
    const errores: string[] = [];

    // Validaciones comunes
    if (!usuario.nombres || usuario.nombres.toString().trim() === '') {
      errores.push('Nombres es requerido');
    }
    if (!usuario.apellidos || usuario.apellidos.toString().trim() === '') {
      errores.push('Apellidos es requerido');
    }
    if (!usuario.rut || usuario.rut.toString().trim() === '') {
      errores.push('RUT es requerido');
    }
    if (!usuario.email || usuario.email.toString().trim() === '') {
      errores.push('Email es requerido');
    }

    // Validar formato de email
    if (usuario.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(usuario.email.toString().trim())) {
        errores.push('Email tiene formato inválido');
      }
    }

    // Validaciones específicas por tipo
    if (tipoUsuario === 'admin' && (!usuario.rol || usuario.rol.toString().trim() === '')) {
      errores.push('Rol es requerido para administradores');
    }

    if (tipoUsuario === 'alumno') {
      if (!usuario.nombre_carrera || usuario.nombre_carrera.toString().trim() === '') {
        errores.push('Nombre de carrera es requerido para alumnos');
      }
      if (!usuario.año_ingreso || usuario.año_ingreso.toString().trim() === '') {
        errores.push('Año de ingreso es requerido para alumnos');
      }
    }

    return errores;
  }

  private async crearUsuario(usuario: UsuarioExcel, tipoUsuario: 'admin' | 'docente' | 'alumno') {
    // Generar contraseña si no se proporciona
    const contraseñaTemp = usuario.contraseña || this.generarContraseñaTemporal();
    const salt = await bcrypt.genSalt(10);
    const contraseñaHash = await bcrypt.hash(contraseñaTemp, salt);

    const datosComunes = {
      id: uuidv4(),
      nombres: usuario.nombres.toString().trim(),
      apellidos: usuario.apellidos.toString().trim(),
      rut: usuario.rut.toString().trim(),
      email: usuario.email.toString().trim().toLowerCase(),
      contraseña: contraseñaHash,
      tipo: tipoUsuario,
      fechaCreacion: new Date()
    };

    let usuarioCreado;

    switch (tipoUsuario) {
      case 'admin':
        usuarioCreado = new this.adminModel({
          ...datosComunes,
          rol: usuario.rol?.toString().trim() || ''
        });
        break;

      case 'docente':
        usuarioCreado = new this.docenteModel({
          ...datosComunes,
          asignaturas: [],
          estudiantes_total: 0
        });
        break;

      case 'alumno':
        // Buscar carrera por nombre
        const carrera = await this.carreraModel.findOne({ 
          nombre: usuario.nombre_carrera?.toString().trim() 
        });
        
        if (!carrera) {
          throw new Error(`No se encontró la carrera: ${usuario.nombre_carrera}`);
        }

        usuarioCreado = new this.alumnoModel({
          ...datosComunes,
          id_carrera: carrera.id,
          año_ingreso: parseInt(usuario.año_ingreso?.toString().trim() || '0'),
          asignaturas: []
        });
        break;

      default:
        throw new Error(`Tipo de usuario no válido: ${tipoUsuario}`);
    }

    // Verificar si el usuario ya existe
    const existeEmail = await this.verificarEmailExistente(usuario.email.toString().trim().toLowerCase());
    if (existeEmail) {
      throw new Error(`Ya existe un usuario con el email: ${usuario.email}`);
    }

    const existeRut = await this.verificarRutExistente(usuario.rut.toString().trim());
    if (existeRut) {
      throw new Error(`Ya existe un usuario con el RUT: ${usuario.rut}`);
    }

    // Guardar usuario
    await usuarioCreado.save();

    // Log de contraseña temporal (solo en desarrollo)
    if (!usuario.contraseña) {
      console.log(`🔑 Contraseña temporal para ${usuario.email}: ${contraseñaTemp}`);
    }

    return usuarioCreado;
  }

  private async verificarEmailExistente(email: string): Promise<boolean> {
    const adminExiste = await this.adminModel.findOne({ email });
    const docenteExiste = await this.docenteModel.findOne({ email });
    const alumnoExiste = await this.alumnoModel.findOne({ email });
    
    return !!(adminExiste || docenteExiste || alumnoExiste);
  }

  private async verificarRutExistente(rut: string): Promise<boolean> {
    const adminExiste = await this.adminModel.findOne({ rut });
    const docenteExiste = await this.docenteModel.findOne({ rut });
    const alumnoExiste = await this.alumnoModel.findOne({ rut });
    
    return !!(adminExiste || docenteExiste || alumnoExiste);
  }

  private generarContraseñaTemporal(): string {
    // Generar contraseña de 8 caracteres
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let contraseña = '';
    for (let i = 0; i < 8; i++) {
      contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return contraseña;
  }

  async generarPlantillaExcel(tipoUsuario: 'admin' | 'docente' | 'alumno'): Promise<Buffer> {
    const datos: any[] = [];
    
    // Crear datos de ejemplo según el tipo de usuario
    switch (tipoUsuario) {
      case 'admin':
        datos.push({
          nombres: 'Juan',
          apellidos: 'Pérez',
          rut: '12345678-9',
          email: 'juan.perez@universidad.cl',
          contraseña: '(opcional - se genera automáticamente)',
          rol: 'Administrador General'
        });
        break;

      case 'docente':
        datos.push({
          nombres: 'María',
          apellidos: 'González',
          rut: '98765432-1',
          email: 'maria.gonzalez@universidad.cl',
          contraseña: '(opcional - se genera automáticamente)'
        });
        break;

      case 'alumno':
        datos.push({
          nombres: 'Carlos',
          apellidos: 'Rodríguez',
          rut: '11111111-1',
          email: 'carlos.rodriguez@estudiante.cl',
          contraseña: '(opcional - se genera automáticamente)',
          nombre_carrera: 'Ingeniería en Sistemas',
          año_ingreso: 2024
        });
        // Agregar más ejemplos con diferentes carreras
        datos.push({
          nombres: 'Ana',
          apellidos: 'Martínez',
          rut: '22222222-2',
          email: 'ana.martinez@estudiante.cl',
          contraseña: '(opcional - se genera automáticamente)',
          nombre_carrera: 'Ingeniería Industrial',
          año_ingreso: 2023
        });
        break;
    }

    // Crear workbook y worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datos);
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // nombres
      { wch: 15 }, // apellidos
      { wch: 12 }, // rut
      { wch: 30 }, // email
      { wch: 35 }, // contraseña
    ];

    if (tipoUsuario === 'admin') {
      colWidths.push({ wch: 20 }); // rol
    } else if (tipoUsuario === 'alumno') {
      colWidths.push({ wch: 25 }); // nombre_carrera
      colWidths.push({ wch: 12 }); // año_ingreso
    }

    worksheet['!cols'] = colWidths;

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, `Plantilla_${tipoUsuario}`);

    // Convertir a buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return buffer;
  }
}

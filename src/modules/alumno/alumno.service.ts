import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Alumno, AlumnoDocument } from './alumno.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AlumnoService {
  constructor(
    @InjectModel(Alumno.name) private readonly alumnoModel: Model<AlumnoDocument>,
  ) {}

  async create(alumno: Partial<Alumno>): Promise<Alumno> {
    if (alumno.contraseña) {
      const salt = await bcrypt.genSalt();
      alumno.contraseña = await bcrypt.hash(alumno.contraseña, salt);
    }
    const createdAlumno = new this.alumnoModel(alumno);
    return createdAlumno.save();
  }

  async findAll(): Promise<Alumno[]> {
    return this.alumnoModel.find({ activo: true }).exec();
  }

  async findByRut(rut: string) {
    return this.alumnoModel.findOne({ rut }).exec();
  }

  async findById(id: string): Promise<Alumno | null> {
    console.log('Service: Buscando alumno con ID:', id);
    try {
      // Primero intentamos buscar por el campo 'id' personalizado
      let alumno = await this.alumnoModel.findOne({ id }).exec();
      console.log('Service: Búsqueda por campo id personalizado:', alumno ? 'Encontrado' : 'No encontrado');
      
      // Si no lo encontramos y el ID parece ser un ObjectId de MongoDB, intentamos buscar por _id
      if (!alumno && id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log('Service: Intentando búsqueda por _id de MongoDB');
        alumno = await this.alumnoModel.findById(id).exec();
        console.log('Service: Búsqueda por _id:', alumno ? 'Encontrado' : 'No encontrado');
      }
      
      return alumno;
    } catch (error) {
      console.error('Service: Error al buscar alumno:', error);
      throw error;
    }
  }

  async softDelete(id: string): Promise<Alumno | null> {
    return this.alumnoModel.findOneAndUpdate({ id }, { activo: false }, { new: true }).exec();
  }
}

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

  async softDelete(id: string): Promise<Alumno | null> {
    return this.alumnoModel.findOneAndUpdate({ id }, { activo: false }, { new: true }).exec();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inscripcion, InscripcionDocument } from './inscripcion.schema';
import { CreateInscripcionDto, UpdateInscripcionDto } from './dto/create-inscripcion.dto';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectModel(Inscripcion.name) private inscripcionModel: Model<InscripcionDocument>,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    const inscripcion = new this.inscripcionModel(createInscripcionDto);
    return inscripcion.save();
  }

  async findAll(): Promise<Inscripcion[]> {
    return this.inscripcionModel.find({ activo: true }).exec();
  }

  async findByAlumno(id_alumno: string): Promise<Inscripcion[]> {
    return this.inscripcionModel.find({ id_alumno, activo: true }).exec();
  }

  async findByAsignatura(id_asignatura: string): Promise<Inscripcion[]> {
    return this.inscripcionModel.find({ id_asignatura, activo: true }).exec();
  }

  async findById(id: string): Promise<Inscripcion | null> {
    return this.inscripcionModel.findOne({ id, activo: true }).exec();
  }

  async update(id: string, updateInscripcionDto: UpdateInscripcionDto): Promise<Inscripcion | null> {
    return this.inscripcionModel.findOneAndUpdate(
      { id },
      updateInscripcionDto,
      { new: true }
    ).exec();
  }

  async remove(id: string): Promise<Inscripcion | null> {
    return this.inscripcionModel.findOneAndUpdate(
      { id },
      { activo: false },
      { new: true }
    ).exec();
  }

  async removeByAlumnoAsignatura(id_alumno: string, id_asignatura: string): Promise<Inscripcion | null> {
    return this.inscripcionModel.findOneAndUpdate(
      { id_alumno, id_asignatura },
      { activo: false },
      { new: true }
    ).exec();
  }

  async inscribirMultiples(id_asignatura: string, ids_alumnos: string[]): Promise<Inscripcion[]> {
    const inscripciones = [] as Inscripcion[];
    
    for (const id_alumno of ids_alumnos) {
      try {
        // Verificar si ya existe una inscripción activa
        const existente = await this.inscripcionModel.findOne({ 
          id_alumno, 
          id_asignatura, 
          activo: true 
        }).exec();
        
        if (!existente) {
          const inscripcion = await this.create({ id_alumno, id_asignatura } as CreateInscripcionDto);
          inscripciones.push(inscripcion);
        }
      } catch (error) {
        console.error(`Error inscribiendo alumno ${id_alumno}:`, error);
      }
    }
    
    return inscripciones;
  }
}

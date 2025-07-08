import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Respuesta, RespuestaDocument } from './respuesta.schema';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';

@Injectable()
export class RespuestaService {
  constructor(@InjectModel(Respuesta.name) private respuestaModel: Model<RespuestaDocument>) {}

  async create(createRespuestaDto: CreateRespuestaDto, rutAlumno: string, idAlumno: string): Promise<Respuesta> {
    // Verificar si el alumno ya respondió esta encuesta
    const respuestaExistente = await this.respuestaModel.findOne({
      id_encuesta: createRespuestaDto.id_encuesta,
      rut_alumno: rutAlumno
    }).exec();

    if (respuestaExistente) {
      throw new Error('Ya has respondido esta encuesta');
    }

    const nuevaRespuesta = new this.respuestaModel({
      ...createRespuestaDto,
      id_alumno: idAlumno,
      rut_alumno: rutAlumno,
      fecha_envio: new Date()
    });

    return nuevaRespuesta.save();
  }

  async findByAlumno(rutAlumno: string): Promise<Respuesta[]> {
    return this.respuestaModel.find({ rut_alumno: rutAlumno }).exec();
  }

  async findByEncuesta(idEncuesta: string): Promise<Respuesta[]> {
    return this.respuestaModel.find({ id_encuesta: idEncuesta }).exec();
  }

  async findByAlumnoAndEncuesta(rutAlumno: string, idEncuesta: string): Promise<Respuesta | null> {
    return this.respuestaModel.findOne({ 
      rut_alumno: rutAlumno, 
      id_encuesta: idEncuesta 
    }).exec();
  }

  async findAll(): Promise<Respuesta[]> {
    return this.respuestaModel.find().exec();
  }

  async delete(id: string): Promise<Respuesta | null> {
    return this.respuestaModel.findByIdAndDelete(id).exec();
  }
}

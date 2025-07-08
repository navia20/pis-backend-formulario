import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Encuesta, EncuestaDocument } from './encuesta.schema';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class EncuestaService {
  constructor(
    @InjectModel(Encuesta.name) private readonly encuestaModel: Model<EncuestaDocument>,
  ) {}

  async create(createEncuestaDto: CreateEncuestaDto): Promise<Encuesta> {
    const encuestaData = {
      ...createEncuestaDto,
      fecha_creacion: new Date(),
      fecha_termino: new Date(createEncuestaDto.fecha_termino),
      activo: true,
      preguntas: createEncuestaDto.preguntas.map(pregunta => ({
        ...pregunta,
        id: uuidv4(),
      }))
    };
    
    const createdEncuesta = new this.encuestaModel(encuestaData);
    return createdEncuesta.save();
  }

  async findAll(): Promise<Encuesta[]> {
    return this.encuestaModel.find({ activo: true }).exec();
  }

  async findById(id: string): Promise<Encuesta | null> {
    return this.encuestaModel.findOne({ id, activo: true }).exec();
  }

  async update(id: string, updateData: Partial<Encuesta>): Promise<Encuesta | null> {
    return this.encuestaModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  async softDelete(id: string): Promise<Encuesta | null> {
    return this.encuestaModel.findOneAndUpdate({ id }, { activo: false }, { new: true }).exec();
  }

  async publicarEncuesta(id: string): Promise<Encuesta | null> {
    return this.encuestaModel.findOneAndUpdate(
      { id, activo: true }, 
      { publicado: true, enviado: true }, 
      { new: true }
    ).exec();
  }

  async despublicarEncuesta(id: string): Promise<Encuesta | null> {
    return this.encuestaModel.findOneAndUpdate(
      { id, activo: true }, 
      { publicado: false, enviado: false }, 
      { new: true }
    ).exec();
  }

  async findPublicadas(): Promise<Encuesta[]> {
    return this.encuestaModel.find({ activo: true, publicado: true }).exec();
  }
}

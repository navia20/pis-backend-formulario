import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Encuesta, EncuestaDocument } from './encuesta.schema';

@Injectable()
export class EncuestaService {
  constructor(
    @InjectModel(Encuesta.name) private readonly encuestaModel: Model<EncuestaDocument>,
  ) {}

  async create(encuesta: Partial<Encuesta>): Promise<Encuesta> {
    const createdEncuesta = new this.encuestaModel(encuesta);
    return createdEncuesta.save();
  }

  async findAll(): Promise<Encuesta[]> {
    return this.encuestaModel.find().exec();
  }

  async findById(id: string): Promise<Encuesta | null> {
    return this.encuestaModel.findOne({ id }).exec();
  }

  async update(id: string, updateData: Partial<Encuesta>): Promise<Encuesta | null> {
    return this.encuestaModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }
}

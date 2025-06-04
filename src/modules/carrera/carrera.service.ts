import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Carrera, CarreraDocument } from './carrera.schema';

@Injectable()
export class CarreraService {
  constructor(
    @InjectModel(Carrera.name) private readonly carreraModel: Model<CarreraDocument>,
  ) {}

  async create(carrera: Partial<Carrera>): Promise<Carrera> {
    const createdCarrera = new this.carreraModel(carrera);
    return createdCarrera.save();
  }
  async findAll(): Promise<Carrera[]> {
    return this.carreraModel.find().exec();
  }

  async findById(id: string): Promise<Carrera | null> {
    return this.carreraModel.findOne({ id }).exec();
  }

  async update(id: string, updateData: Partial<Carrera>): Promise<Carrera | null> {
    return this.carreraModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }
  async softDelete(id: string): Promise<Carrera | null> {
    // Soft delete ya no aplica, solo retorna null o podrías lanzar un error si quieres
    return null;
  }

  async delete(id: string): Promise<{ deleted: boolean }> {
    const result = await this.carreraModel.deleteOne({ id }).exec();
    return { deleted: result.deletedCount === 1 };
  }
}

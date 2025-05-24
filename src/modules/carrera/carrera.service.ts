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
}

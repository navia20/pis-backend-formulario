import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asignatura, AsignaturaDocument } from './asignatura.schema';

@Injectable()
export class AsignaturaService {
  constructor(
    @InjectModel(Asignatura.name) private readonly asignaturaModel: Model<AsignaturaDocument>,
  ) {}

  async create(asignatura: Partial<Asignatura>): Promise<Asignatura> {
    const createdAsignatura = new this.asignaturaModel(asignatura);
    return createdAsignatura.save();
  }

  async findAll(): Promise<Asignatura[]> {
    return this.asignaturaModel.find().exec();
  }

  async findById(id: string): Promise<Asignatura | null> {
    return this.asignaturaModel.findOne({ id }).exec();
  }

  async update(id: string, updateData: Partial<Asignatura>): Promise<Asignatura | null> {
    return this.asignaturaModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }
}

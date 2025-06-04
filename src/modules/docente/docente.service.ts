import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Docente, DocenteDocument } from './docente.schema';

@Injectable()
export class DocenteService {
  constructor(
    @InjectModel(Docente.name) private readonly docenteModel: Model<DocenteDocument>,
  ) {}

  async create(docente: Partial<Docente>): Promise<Docente> {
    const createdDocente = new this.docenteModel(docente);
    return createdDocente.save();
  }

  async findAll(): Promise<Docente[]> {
    return this.docenteModel.find({ activo: true }).exec();
  }

  async findByRut(rut: string) {
    return this.docenteModel.findOne({ rut }).exec();
  }
}

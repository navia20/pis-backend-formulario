import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { Alumno, AlumnoDocument } from '../alumno/alumno.schema';
import { Docente, DocenteDocument } from '../docente/docente.schema';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Alumno.name) private alumnoModel: Model<AlumnoDocument>,
    @InjectModel(Docente.name) private docenteModel: Model<DocenteDocument>
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    // Hash de la contraseña antes de guardar
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createAdminDto.contraseña, saltRounds);
    
    const createdAdmin = new this.adminModel({
      ...createAdminDto,
      contraseña: hashedPassword,
    });
    return createdAdmin.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findByRut(rut: string): Promise<Admin | null> {
    return this.adminModel.findOne({ rut }).exec();
  }

  async findById(id: string): Promise<Admin | null> {
    return this.adminModel.findById(id).exec();
  }

  async update(id: string, updateData: Partial<CreateAdminDto>): Promise<Admin | null> {
    if (updateData.contraseña) {
      const saltRounds = 10;
      updateData.contraseña = await bcrypt.hash(updateData.contraseña, saltRounds);
    }
    return this.adminModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<Admin | null> {
    return this.adminModel.findByIdAndDelete(id).exec();
  }

  async getEstadisticas(): Promise<any> {
    const alumnosCount = await this.alumnoModel.countDocuments().exec();
    const docentesCount = await this.docenteModel.countDocuments().exec();
    const adminsCount = await this.adminModel.countDocuments().exec();
    
    return {
      total_usuarios: alumnosCount + docentesCount + adminsCount,
      total_alumnos: alumnosCount,
      total_docentes: docentesCount,
      total_admins: adminsCount
    };
  }
}

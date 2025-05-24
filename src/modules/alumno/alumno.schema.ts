import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AlumnoDocument = Alumno & Document;

@Schema({ collection: 'alumnos', strict: true })
export class Alumno {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop({ required: true, unique: true })
  rut: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  id_carrera: string;

  @Prop({ required: true })
  año_ingreso: number;
}

export const AlumnoSchema = SchemaFactory.createForClass(Alumno);

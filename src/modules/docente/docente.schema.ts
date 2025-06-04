import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type DocenteDocument = Docente & Document;

@Schema({ collection: 'docentes', strict: true })
export class Docente {
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

  @Prop({ default: true })
  activo: boolean;
}

export const DocenteSchema = SchemaFactory.createForClass(Docente);

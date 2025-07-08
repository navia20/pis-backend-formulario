import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true, unique: true })
  rut: string;

  @Prop({ required: true })
  nombres: string;

  @Prop({ required: true })
  apellidos: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop({ default: 'admin' })
  tipo: string;

  @Prop({ required: true })
  rol: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

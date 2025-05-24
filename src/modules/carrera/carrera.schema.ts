import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type CarreraDocument = Carrera & Document;

@Schema({ collection: 'carreras', strict: true })
export class Carrera {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true, unique: true })
  nombre: string;
}

export const CarreraSchema = SchemaFactory.createForClass(Carrera);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AsignaturaDocument = Asignatura & Document;

@Schema({ collection: 'asignaturas', strict: true })
export class Asignatura {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  id_carrera: string;

  @Prop({ type: [String], required: true })
  id_docentes: string[]; // Relación N:M, una asignatura puede tener varios docentes
}

export const AsignaturaSchema = SchemaFactory.createForClass(Asignatura);

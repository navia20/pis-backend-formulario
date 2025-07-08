import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type InscripcionDocument = Inscripcion & Document;

@Schema({ collection: 'inscripciones', strict: true })
export class Inscripcion {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  id_alumno: string;

  @Prop({ required: true })
  id_asignatura: string;

  @Prop({ default: Date.now })
  fecha_inscripcion: Date;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ default: 'inscrito' })
  estado: string; // inscrito, retirado, completado
}

export const InscripcionSchema = SchemaFactory.createForClass(Inscripcion);

// Índice compuesto para evitar inscripciones duplicadas
InscripcionSchema.index({ id_alumno: 1, id_asignatura: 1 }, { unique: true });

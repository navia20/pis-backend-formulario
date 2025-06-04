import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type EncuestaDocument = Encuesta & Document;

@Schema({ collection: 'encuestas', strict: true })
export class Encuesta {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  id_asignatura: string;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_termino: Date;
}

export const EncuestaSchema = SchemaFactory.createForClass(Encuesta);

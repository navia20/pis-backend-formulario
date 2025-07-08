import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type RespuestaDocument = Respuesta & Document;

@Schema({ collection: 'respuestas', strict: true })
export class Respuesta {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  id_encuesta: string;

  @Prop({ required: true })
  id_alumno: string;

  @Prop({ required: true })
  rut_alumno: string;

  @Prop({ required: true, type: Object })
  respuestas: { [idPregunta: string]: string };

  @Prop({ required: true, default: Date.now })
  fecha_envio: Date;

  @Prop({ default: false })
  calificado: boolean;

  @Prop({ type: Number })
  puntuacion?: number;
}

export const RespuestaSchema = SchemaFactory.createForClass(Respuesta);

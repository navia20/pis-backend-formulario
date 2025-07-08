import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Esquema para las preguntas dentro de la encuesta
@Schema({ _id: false })
export class Pregunta {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  texto: string;

  @Prop({ required: true, type: [String] })
  respuestas: string[];

  @Prop({ required: true })
  respuestaCorrecta: number;
}

export const PreguntaSchema = SchemaFactory.createForClass(Pregunta);

export type EncuestaDocument = Encuesta & Document;

@Schema({ collection: 'encuestas', strict: true })
export class Encuesta {
  @Prop({ default: uuidv4 })
  id: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: false })
  descripcion: string;

  @Prop({ required: true })
  id_asignatura: string;

  @Prop({ required: true })
  fecha_creacion: Date;

  @Prop({ required: true })
  fecha_termino: Date;

  @Prop({ type: [PreguntaSchema], default: [] })
  preguntas: Pregunta[];

  @Prop({ default: false })
  activo: boolean;

  @Prop({ default: false })
  publicado: boolean;

  @Prop({ default: false })
  enviado: boolean;
}

export const EncuestaSchema = SchemaFactory.createForClass(Encuesta);

import { IsString, IsNotEmpty, IsDateString, IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePreguntaDto {
  @IsString()
  @IsNotEmpty()
  texto: string;

  @IsArray()
  @IsString({ each: true })
  respuestas: string[];

  @IsNumber()
  respuestaCorrecta: number;
}

export class CreateEncuestaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  id_asignatura: string;

  @IsDateString()
  fecha_termino: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreguntaDto)
  preguntas: CreatePreguntaDto[];
}

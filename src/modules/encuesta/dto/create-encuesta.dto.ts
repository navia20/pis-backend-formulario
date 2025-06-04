import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateEncuestaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  id_asignatura: string;

  @IsDateString()
  fecha_creacion: string;

  @IsDateString()
  fecha_termino: string;
}

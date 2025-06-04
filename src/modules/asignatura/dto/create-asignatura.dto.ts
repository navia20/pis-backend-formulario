import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateAsignaturaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  id_carrera: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  id_docentes: string[];
}

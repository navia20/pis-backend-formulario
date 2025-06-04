import { IsString, IsNotEmpty, IsEmail, IsUUID, IsNumber } from 'class-validator';

export class CreateAlumnoDto {
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  rut: string;

  @IsString()
  @IsNotEmpty()
  contraseña: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  id_carrera: string;

  @IsNumber()
  año_ingreso: number;
}

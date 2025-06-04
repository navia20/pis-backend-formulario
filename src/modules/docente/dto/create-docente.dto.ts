import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateDocenteDto {
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
}

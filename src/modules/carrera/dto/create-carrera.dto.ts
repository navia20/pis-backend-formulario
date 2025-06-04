import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}

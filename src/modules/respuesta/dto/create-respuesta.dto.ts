import { IsString, IsObject, IsNotEmpty } from 'class-validator';

export class CreateRespuestaDto {
  @IsString()
  @IsNotEmpty()
  id_encuesta: string;

  @IsObject()
  @IsNotEmpty()
  respuestas: { [idPregunta: string]: string };
}

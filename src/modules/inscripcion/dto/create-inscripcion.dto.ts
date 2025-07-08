export class CreateInscripcionDto {
  id_alumno: string;
  id_asignatura: string;
  estado?: string;
}

export class UpdateInscripcionDto {
  estado?: string;
  activo?: boolean;
}

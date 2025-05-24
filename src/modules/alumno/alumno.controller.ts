import { Controller, Post, Body, Get } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { Alumno } from './alumno.schema';

@Controller('alumnos')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  async create(@Body() alumno: Partial<Alumno>) {
    return this.alumnoService.create(alumno);
  }

  @Get()
  async findAll() {
    return this.alumnoService.findAll();
  }
}

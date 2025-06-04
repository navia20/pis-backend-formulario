import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { Alumno } from './alumno.schema';
import { CreateAlumnoDto } from './dto/create-alumno.dto';

@Controller('alumnos')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  async create(@Body() alumno: CreateAlumnoDto) {
    return this.alumnoService.create(alumno);
  }

  @Get()
  async findAll() {
    return this.alumnoService.findAll();
  }

  @Get('rut/:rut')
  async findByRut(@Param('rut') rut: string) {
    return this.alumnoService.findByRut(rut);
  }
}

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

  @Get(':id')
  async findById(@Param('id') id: string) {
    console.log('Controller: Buscando alumno con ID:', id);
    try {
      const alumno = await this.alumnoService.findById(id);
      console.log('Controller: Alumno encontrado:', alumno ? 'Sí' : 'No');
      return alumno;
    } catch (error) {
      console.error('Controller: Error al buscar alumno:', error);
      throw error;
    }
  }
}

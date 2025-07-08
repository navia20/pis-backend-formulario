import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto, UpdateInscripcionDto } from './dto/create-inscripcion.dto';

@Controller('inscripciones')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  async create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.create(createInscripcionDto);
  }

  @Get()
  async findAll() {
    return this.inscripcionService.findAll();
  }

  @Get('alumno/:id_alumno')
  async findByAlumno(@Param('id_alumno') id_alumno: string) {
    return this.inscripcionService.findByAlumno(id_alumno);
  }

  @Get('asignatura/:id_asignatura')
  async findByAsignatura(@Param('id_asignatura') id_asignatura: string) {
    return this.inscripcionService.findByAsignatura(id_asignatura);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.inscripcionService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInscripcionDto: UpdateInscripcionDto) {
    return this.inscripcionService.update(id, updateInscripcionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.inscripcionService.remove(id);
  }

  @Delete('alumno/:id_alumno/asignatura/:id_asignatura')
  async removeByAlumnoAsignatura(
    @Param('id_alumno') id_alumno: string,
    @Param('id_asignatura') id_asignatura: string
  ) {
    return this.inscripcionService.removeByAlumnoAsignatura(id_alumno, id_asignatura);
  }

  @Post('inscribir-multiples')
  async inscribirMultiples(
    @Body() body: { id_asignatura: string; ids_alumnos: string[] }
  ) {
    return this.inscripcionService.inscribirMultiples(body.id_asignatura, body.ids_alumnos);
  }
}

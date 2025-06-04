import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { AsignaturaService } from './asignatura.service';
import { Asignatura } from './asignatura.schema';
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';

@Controller('asignaturas')
export class AsignaturaController {
  constructor(private readonly asignaturaService: AsignaturaService) {}

  @Post()
  async create(@Body() asignatura: CreateAsignaturaDto) {
    return this.asignaturaService.create(asignatura);
  }

  @Get()
  async findAll() {
    return this.asignaturaService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.asignaturaService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Asignatura>) {
    return this.asignaturaService.update(id, updateData);
  }

  @Patch(':id/docentes')
  async updateDocentes(
    @Param('id') id: string,
    @Body('id_docentes') id_docentes: string[]
  ) {
    return this.asignaturaService.update(id, { id_docentes });
  }

  @Patch(':id/add-docente')
  async addDocente(
    @Param('id') id: string,
    @Body('docenteId') docenteId: string
  ) {
    const asignatura = await this.asignaturaService.findById(id);
    if (!asignatura) return null;
    if (!asignatura.id_docentes.includes(docenteId)) {
      asignatura.id_docentes.push(docenteId);
      return this.asignaturaService.update(id, { id_docentes: asignatura.id_docentes });
    }
    return asignatura;
  }

  @Patch(':id/remove-docente')
  async removeDocente(
    @Param('id') id: string,
    @Body('docenteId') docenteId: string
  ) {
    const asignatura = await this.asignaturaService.findById(id);
    if (!asignatura) return null;
    asignatura.id_docentes = asignatura.id_docentes.filter(d => d !== docenteId);
    return this.asignaturaService.update(id, { id_docentes: asignatura.id_docentes });
  }
}

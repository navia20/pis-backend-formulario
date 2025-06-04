import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { Docente } from './docente.schema';
import { CreateDocenteDto } from './dto/create-docente.dto';

@Controller('docentes')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Post()
  async create(@Body() docente: CreateDocenteDto) {
    return this.docenteService.create(docente);
  }

  @Get()
  async findAll() {
    return this.docenteService.findAll();
  }

  @Get('rut/:rut')
  async findByRut(@Param('rut') rut: string) {
    return this.docenteService.findByRut(rut);
  }
}

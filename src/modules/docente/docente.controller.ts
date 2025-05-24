import { Controller, Post, Body, Get } from '@nestjs/common';
import { DocenteService } from './docente.service';
import { Docente } from './docente.schema';

@Controller('docentes')
export class DocenteController {
  constructor(private readonly docenteService: DocenteService) {}

  @Post()
  async create(@Body() docente: Partial<Docente>) {
    return this.docenteService.create(docente);
  }

  @Get()
  async findAll() {
    return this.docenteService.findAll();
  }
}

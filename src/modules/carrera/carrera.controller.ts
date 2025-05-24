import { Controller, Post, Body, Get } from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { Carrera } from './carrera.schema';

@Controller('carreras')
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}

  @Post()
  async create(@Body() carrera: Partial<Carrera>) {
    return this.carreraService.create(carrera);
  }

  @Get()
  async findAll() {
    return this.carreraService.findAll();
  }
}

import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { CarreraService } from './carrera.service';
import { Carrera } from './carrera.schema';
import { CreateCarreraDto } from './dto/create-carrera.dto';

@Controller('carreras')
export class CarreraController {
  constructor(private readonly carreraService: CarreraService) {}

  @Post()
  async create(@Body() carrera: CreateCarreraDto) {
    return this.carreraService.create(carrera);
  }

  @Get()
  async findAll() {
    return this.carreraService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.carreraService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Carrera>) {
    return this.carreraService.update(id, updateData);
  }

  @Patch('soft-delete/:id')
  async softDelete(@Param('id') id: string) {
    return this.carreraService.softDelete(id);
  }
}

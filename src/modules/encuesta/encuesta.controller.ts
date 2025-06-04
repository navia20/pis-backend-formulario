import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { EncuestaService } from './encuesta.service';
import { Encuesta } from './encuesta.schema';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';

@Controller('encuestas')
export class EncuestaController {
  constructor(private readonly encuestaService: EncuestaService) {}

  @Post()
  async create(@Body() encuesta: CreateEncuestaDto) {
    return this.encuestaService.create(encuesta);
  }

  @Get()
  async findAll() {
    return this.encuestaService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.encuestaService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Encuesta>) {
    return this.encuestaService.update(id, updateData);
  }
}

import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { EncuestaService } from './encuesta.service';
import { Encuesta } from './encuesta.schema';
import { CreateEncuestaDto } from './dto/create-encuesta.dto';

@Controller('encuestas')
export class EncuestaController {
  constructor(private readonly encuestaService: EncuestaService) {}

  @Post()
  async create(@Body() createEncuestaDto: CreateEncuestaDto) {
    console.log('📝 Datos recibidos para crear encuesta:', JSON.stringify(createEncuestaDto, null, 2));
    try {
      const result = await this.encuestaService.create(createEncuestaDto);
      console.log('✅ Encuesta creada exitosamente:', result.id);
      return result;
    } catch (error) {
      console.error('❌ Error creando encuesta:', error);
      throw error;
    }
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

  @Patch(':id/publicar')
  async publicar(@Param('id') id: string) {
    return this.encuestaService.publicarEncuesta(id);
  }

  @Patch(':id/despublicar')
  async despublicar(@Param('id') id: string) {
    return this.encuestaService.despublicarEncuesta(id);
  }

  @Get('publicadas/activas')
  async findPublicadas() {
    return this.encuestaService.findPublicadas();
  }

  @Patch(':id/soft-delete')
  async softDelete(@Param('id') id: string) {
    return this.encuestaService.softDelete(id);
  }
}

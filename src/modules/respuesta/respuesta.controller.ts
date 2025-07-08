import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RespuestaService } from './respuesta.service';
import { CreateRespuestaDto } from './dto/create-respuesta.dto';
import { Respuesta } from './respuesta.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('respuestas')
@UseGuards(JwtAuthGuard)
export class RespuestaController {
  constructor(private readonly respuestaService: RespuestaService) {}

  @Post()
  async create(@Body() createRespuestaDto: CreateRespuestaDto, @Request() req): Promise<Respuesta> {
    return this.respuestaService.create(
      createRespuestaDto,
      req.user.rut,
      req.user.userId
    );
  }

  @Get()
  async findAll(): Promise<Respuesta[]> {
    return this.respuestaService.findAll();
  }

  @Get('alumno')
  async findByAlumno(@Request() req): Promise<Respuesta[]> {
    return this.respuestaService.findByAlumno(req.user.rut);
  }

  @Get('encuesta/:idEncuesta')
  async findByEncuesta(@Param('idEncuesta') idEncuesta: string): Promise<Respuesta[]> {
    return this.respuestaService.findByEncuesta(idEncuesta);
  }

  @Get('alumno/:idEncuesta')
  async findByAlumnoAndEncuesta(@Param('idEncuesta') idEncuesta: string, @Request() req): Promise<Respuesta | null> {
    return this.respuestaService.findByAlumnoAndEncuesta(req.user.rut, idEncuesta);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Respuesta | null> {
    return this.respuestaService.delete(id);
  }
}

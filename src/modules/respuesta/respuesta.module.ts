import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RespuestaService } from './respuesta.service';
import { RespuestaController } from './respuesta.controller';
import { Respuesta, RespuestaSchema } from './respuesta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Respuesta.name, schema: RespuestaSchema }])
  ],
  controllers: [RespuestaController],
  providers: [RespuestaService],
  exports: [RespuestaService]
})
export class RespuestaModule {}

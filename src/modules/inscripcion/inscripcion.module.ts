import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InscripcionController } from './inscripcion.controller';
import { InscripcionService } from './inscripcion.service';
import { Inscripcion, InscripcionSchema } from './inscripcion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inscripcion.name, schema: InscripcionSchema }])
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
  exports: [InscripcionService],
})
export class InscripcionModule {}

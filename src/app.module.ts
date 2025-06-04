import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Docente, DocenteSchema } from './modules/docente/docente.schema';
import { Alumno, AlumnoSchema } from './modules/alumno/alumno.schema';
import { Carrera, CarreraSchema } from './modules/carrera/carrera.schema';
import { Asignatura, AsignaturaSchema } from './modules/asignatura/asignatura.schema';
import { DocenteController } from './modules/docente/docente.controller';
import { AlumnoController } from './modules/alumno/alumno.controller';
import { CarreraController } from './modules/carrera/carrera.controller';
import { AsignaturaController } from './modules/asignatura/asignatura.controller';
import { DocenteService } from './modules/docente/docente.service';
import { AlumnoService } from './modules/alumno/alumno.service';
import { CarreraService } from './modules/carrera/carrera.service';
import { AsignaturaService } from './modules/asignatura/asignatura.service';
import { Encuesta, EncuestaSchema } from './modules/encuesta/encuesta.schema';
import { EncuestaController } from './modules/encuesta/encuesta.controller';
import { EncuestaService } from './modules/encuesta/encuesta.service';
import { getEnvValue } from './config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${getEnvValue('DATABASE_HOST')}:${getEnvValue('DATABASE_PORT')}/${getEnvValue('DATABASE_NAME')}`
    ),
    MongooseModule.forFeature([
      { name: Docente.name, schema: DocenteSchema },
      { name: Alumno.name, schema: AlumnoSchema },
      { name: Carrera.name, schema: CarreraSchema },
      { name: Asignatura.name, schema: AsignaturaSchema },
      { name: Encuesta.name, schema: EncuestaSchema },
    ]),
    AuthModule,
  ],
  controllers: [AppController, DocenteController, AlumnoController, CarreraController, AsignaturaController, EncuestaController],
  providers: [AppService, DocenteService, AlumnoService, CarreraService, AsignaturaService, EncuestaService],
})
export class AppModule {}

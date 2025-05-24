import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Docente, DocenteSchema } from './modules/docente/docente.schema';
import { Alumno, AlumnoSchema } from './modules/alumno/alumno.schema';
import { Carrera, CarreraSchema } from './modules/carrera/carrera.schema';
import { DocenteController } from './modules/docente/docente.controller';
import { AlumnoController } from './modules/alumno/alumno.controller';
import { CarreraController } from './modules/carrera/carrera.controller';
import { DocenteService } from './modules/docente/docente.service';
import { AlumnoService } from './modules/alumno/alumno.service';
import { CarreraService } from './modules/carrera/carrera.service';
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
    ]),
    AuthModule,
  ],
  controllers: [AppController, DocenteController, AlumnoController, CarreraController],
  providers: [AppService, DocenteService, AlumnoService, CarreraService],
})
export class AppModule {}

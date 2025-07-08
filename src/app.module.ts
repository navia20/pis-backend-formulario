import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Docente, DocenteSchema } from './modules/docente/docente.schema';
import { Alumno, AlumnoSchema } from './modules/alumno/alumno.schema';
import { Admin, AdminSchema } from './modules/admin/admin.schema';
import { Carrera, CarreraSchema } from './modules/carrera/carrera.schema';
import { Asignatura, AsignaturaSchema } from './modules/asignatura/asignatura.schema';
import { Inscripcion, InscripcionSchema } from './modules/inscripcion/inscripcion.schema';
import { DocenteController } from './modules/docente/docente.controller';
import { AlumnoController } from './modules/alumno/alumno.controller';
import { AdminController } from './modules/admin/admin.controller';
import { CarreraController } from './modules/carrera/carrera.controller';
import { AsignaturaController } from './modules/asignatura/asignatura.controller';
import { InscripcionController } from './modules/inscripcion/inscripcion.controller';
import { DocenteService } from './modules/docente/docente.service';
import { AlumnoService } from './modules/alumno/alumno.service';
import { AdminService } from './modules/admin/admin.service';
import { CarreraService } from './modules/carrera/carrera.service';
import { AsignaturaService } from './modules/asignatura/asignatura.service';
import { InscripcionService } from './modules/inscripcion/inscripcion.service';
import { Encuesta, EncuestaSchema } from './modules/encuesta/encuesta.schema';
import { EncuestaController } from './modules/encuesta/encuesta.controller';
import { EncuestaService } from './modules/encuesta/encuesta.service';
import { Respuesta, RespuestaSchema } from './modules/respuesta/respuesta.schema';
import { RespuestaController } from './modules/respuesta/respuesta.controller';
import { RespuestaService } from './modules/respuesta/respuesta.service';
import { getEnvValue } from './config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${getEnvValue('DATABASE_HOST')}:${getEnvValue('DATABASE_PORT')}/${getEnvValue('DATABASE_NAME')}`
    ),
    MongooseModule.forFeature([
      { name: Docente.name, schema: DocenteSchema },
      { name: Alumno.name, schema: AlumnoSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Carrera.name, schema: CarreraSchema },
      { name: Asignatura.name, schema: AsignaturaSchema },
      { name: Inscripcion.name, schema: InscripcionSchema },
      { name: Encuesta.name, schema: EncuestaSchema },
      { name: Respuesta.name, schema: RespuestaSchema },
    ]),
    AuthModule,
  ],
  controllers: [AppController, DocenteController, AlumnoController, AdminController, CarreraController, AsignaturaController, InscripcionController, EncuestaController, RespuestaController],
  providers: [AppService, DocenteService, AlumnoService, AdminService, CarreraService, AsignaturaService, InscripcionService, EncuestaService, RespuestaService],
})
export class AppModule {}

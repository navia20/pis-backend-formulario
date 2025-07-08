import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RecuperarPasswordController } from './recuperar-password.controller';
import { RecuperarPasswordService } from './recuperar-password.service';
import { CargaMasivaController } from './carga-masiva.controller';
import { CargaMasivaService } from './carga-masiva.service';
import { EmailService } from './email.service';
import { JwtStrategy } from './jwt.strategy';
import { AlumnoService } from '../alumno/alumno.service';
import { DocenteService } from '../docente/docente.service';
import { AdminService } from '../admin/admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Alumno, AlumnoSchema } from '../alumno/alumno.schema';
import { Docente, DocenteSchema } from '../docente/docente.schema';
import { Admin, AdminSchema } from '../admin/admin.schema';
import { Carrera, CarreraSchema } from '../carrera/carrera.schema';
import { getEnvValue } from '../../config/config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.register({
      secret: getEnvValue('JWT_SECRET'),
      signOptions: {
        expiresIn: getEnvValue('JWT_EXP'),
        algorithm: getEnvValue('JWT_ALG'),
      },
    }),
    MongooseModule.forFeature([
      { name: Alumno.name, schema: AlumnoSchema },
      { name: Docente.name, schema: DocenteSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Carrera.name, schema: CarreraSchema },
    ]),
  ],
  controllers: [AuthController, RecuperarPasswordController, CargaMasivaController],
  providers: [AuthService, RecuperarPasswordService, CargaMasivaService, EmailService, JwtStrategy, AlumnoService, DocenteService, AdminService],
  exports: [AuthService],
})
export class AuthModule {}